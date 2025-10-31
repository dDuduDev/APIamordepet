const supabase = require('../database/config');
const { convertImageUrl } = require('../utils/convertImageUrl');

// GET - Listar todas as categorias
const getAllCategories = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select(`
        *,
        products:products(count)
      `)
      .order('id');

    if (error) {
      throw error;
    }

    // Formatar resposta para incluir total de produtos
    const categoriesWithCount = data.map(category => ({
      ...category,
      imagem_url: convertImageUrl(product.imagem_url),
      total_produtos: category.products[0]?.count || 0
    }));

    res.json({
      success: true,
      data: categoriesWithCount,
      total: categoriesWithCount.length
    });
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// GET - Buscar categoria por ID
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data: category, error: categoryError } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();

    if (categoryError) {
      return res.status(404).json({
        success: false,
        message: 'Categoria não encontrada'
      });
    }

    // Buscar produtos da categoria
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .eq('categoria_id', id);

    if (productsError) {
      throw productsError;
    }

    res.json({
      success: true,
      data: {
        ...category,
        imagem_url: convertImageUrl(category.imagem_url),
        produtos: products.map( p => ({
          ...p,
          imagem_url: convertImageUrl(p.imagem_url),
        }))
      }
    });
  } catch (error) {
    console.error('Erro ao buscar categoria:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// POST - Criar nova categoria
const createCategory = async (req, res) => {
  try {
    const { nome, descricao } = req.body;
    const imagem_url = req.file ? `/uploads/categories/${req.file.filename}` : null;

    // Validação
    if (!nome) {
      return res.status(400).json({
        success: false,
        message: 'Nome é obrigatório'
      });
    }

    const { data, error } = await supabase
      .from('categories')
      .insert([
        { 
          nome, 
          descricao, 
          imagem_url 
        }
      ])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return res.status(400).json({
          success: false,
          message: 'Já existe uma categoria com este nome'
        });
      }
      throw error;
    }

    res.status(201).json({
      success: true,
      message: 'Categoria criada com sucesso',
      data: {
        ...data,
        imagem_url: convertImageUrl(data.imagem_url)
      }
    });
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// PUT - Atualizar categoria
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, descricao } = req.body;

    // Verificar se a categoria existe
    const { data: categoryExists, error: checkError } = await supabase
      .from('categories')
      .select('id')
      .eq('id', id)
      .single();

    if (checkError) {
      return res.status(404).json({
        success: false,
        message: 'Categoria não encontrada'
      });
    }

    const updateData = {
      nome,
      descricao,
      updated_at: new Date().toISOString()
    };

    if (req.file) {
      updateData.imagem_url = `/uploads/categories/${req.file.filename}`;
    }

    const { data, error } = await supabase
      .from('categories')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      message: 'Categoria atualizada com sucesso',
      data: {
        ...data,
        imagem_url: convertImageUrl(data.imagem_url)
      }
    });
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// DELETE - Excluir categoria
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se a categoria existe
    const { data: categoryExists, error: checkError } = await supabase
      .from('categories')
      .select('id')
      .eq('id', id)
      .single();

    if (checkError) {
      return res.status(404).json({
        success: false,
        message: 'Categoria não encontrada'
      });
    }

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      message: 'Categoria excluída com sucesso'
    });
  } catch (error) {
    console.error('Erro ao excluir categoria:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};