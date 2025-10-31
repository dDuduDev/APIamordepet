const supabase = require('../database/config');
const { convertImageUrl } = require('../utils/convertImageUrl');

// GET - Listar todos os produtos
const getAllProducts = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories!inner(nome)
      `)
      .order('id');

    if (error) {
      throw error;
    }

    // Formatar resposta
    const formattedData = data.map(product => {
      return {
        ...product,
        imagem_url: convertImageUrl(product.imagem_url),
        categoria_nome: product.categories.nome
      }
    });

    res.json({
      success: true,
      data: formattedData,
      total: formattedData.length
    });
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// GET - Buscar produto por ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories!inner(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }

    // Formatar resposta
    const formattedData = {
      ...data,
      imagem_url: convertImageUrl(product.imagem_url),
      categoria_nome: data.categories.nome,
      categoria_descricao: data.categories.descricao
    };

    res.json({
      success: true,
      data: formattedData
    });
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// GET - Buscar produtos por categoria
const getProductsByCategory = async (req, res) => {
  try {
    const { categoriaId } = req.params;
    
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories!inner(nome)
      `)
      .eq('categoria_id', categoriaId)
      .order('id');

    if (error) {
      throw error;
    }

    // Formatar resposta
    const formattedData = data.map(product => ({
      ...product,
      imagem_url: convertImageUrl(product.imagem_url),
      categoria_nome: product.categories.nome
    }));

    res.json({
      success: true,
      data: formattedData,
      total: formattedData.length
    });
  } catch (error) {
    console.error('Erro ao buscar produtos por categoria:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// POST - Criar novo produto
const createProduct = async (req, res) => {
  try {
    const { nome, descricao, categoria_id } = req.body;
    const imagem_url = req.file ? `/uploads/products/${req.file.filename}` : null;

    // Validação
    if (!nome || !categoria_id) {
      return res.status(400).json({
        success: false,
        message: 'Nome e categoria são obrigatórios'
      });
    }

    // Verificar se a categoria existe
    const { data: categoryExists, error: categoryError } = await supabase
      .from('categories')
      .select('id')
      .eq('id', categoria_id)
      .single();

    if (categoryError) {
      return res.status(400).json({
        success: false,
        message: 'Categoria não encontrada'
      });
    }

    const { data, error } = await supabase
      .from('products')
      .insert([
        { 
          nome, 
          descricao, 
          imagem_url, 
          categoria_id: parseInt(categoria_id) 
        }
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.status(201).json({
      success: true,
      message: 'Produto criado com sucesso',
      data: {
        ...data,
        imagem_url: convertImageUrl(data.imagem_url)
      }
    });
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// PUT - Atualizar produto
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, descricao, categoria_id } = req.body;

    // Verificar se o produto existe
    const { data: productExists, error: checkError } = await supabase
      .from('products')
      .select('id')
      .eq('id', id)
      .single();

    if (checkError) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }

    // Verificar se a categoria existe (se foi fornecida)
    if (categoria_id) {
      const { data: categoryExists, error: categoryError } = await supabase
        .from('categories')
        .select('id')
        .eq('id', categoria_id)
        .single();

      if (categoryError) {
        return res.status(400).json({
          success: false,
          message: 'Categoria não encontrada'
        });
      }
    }

    const updateData = {
      nome,
      descricao,
      updated_at: new Date().toISOString()
    };

    if (categoria_id) {
      updateData.categoria_id = parseInt(categoria_id);
    }

    if (req.file) {
      updateData.imagem_url = `/uploads/products/${req.file.filename}`;
    }

    const { data, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      message: 'Produto atualizado com sucesso',
      data: {
        ...data,
        imagem_url: convertImageUrl(data.imagem_url)
      }
    });
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// DELETE - Excluir produto
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se o produto existe
    const { data: productExists, error: checkError } = await supabase
      .from('products')
      .select('id')
      .eq('id', id)
      .single();

    if (checkError) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      message: 'Produto excluído com sucesso'
    });
  } catch (error) {
    console.error('Erro ao excluir produto:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct
};