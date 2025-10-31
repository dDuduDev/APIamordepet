const supabase = require('../database/config');

// GET - Listar todos os pets
const getAllPets = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .order('id');

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      data: data,
      total: data.length
    });
  } catch (error) {
    console.error('Erro ao buscar pets:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// GET - Buscar pet por ID
const getPetById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          message: 'Pet não encontrado'
        });
      }
      throw error;
    }

    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('Erro ao buscar pet:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// POST - Criar novo pet
const createPet = async (req, res) => {
  try {
    const { nome, tipo, raca, idade } = req.body;

    // Validação básica
    if (!nome || !tipo) {
      return res.status(400).json({
        success: false,
        message: 'Nome e tipo são obrigatórios'
      });
    }

    const { data, error } = await supabase
      .from('pets')
      .insert([
        { 
          nome, 
          tipo, 
          raca, 
          idade: idade ? parseInt(idade) : null 
        }
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.status(201).json({
      success: true,
      message: 'Pet criado com sucesso',
      data: data
    });
  } catch (error) {
    console.error('Erro ao criar pet:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// PUT - Atualizar pet
const updatePet = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, tipo, raca, idade } = req.body;

    // Verificar se o pet existe
    const { data: petExists, error: checkError } = await supabase
      .from('pets')
      .select('id')
      .eq('id', id)
      .single();

    if (checkError) {
      return res.status(404).json({
        success: false,
        message: 'Pet não encontrado'
      });
    }

    const { data, error } = await supabase
      .from('pets')
      .update({
        nome,
        tipo,
        raca,
        idade: idade ? parseInt(idade) : null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      message: 'Pet atualizado com sucesso',
      data: data
    });
  } catch (error) {
    console.error('Erro ao atualizar pet:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// DELETE - Excluir pet
const deletePet = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se o pet existe
    const { data: petExists, error: checkError } = await supabase
      .from('pets')
      .select('id')
      .eq('id', id)
      .single();

    if (checkError) {
      return res.status(404).json({
        success: false,
        message: 'Pet não encontrado'
      });
    }

    const { error } = await supabase
      .from('pets')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      message: 'Pet excluído com sucesso'
    });
  } catch (error) {
    console.error('Erro ao excluir pet:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

module.exports = {
  getAllPets,
  getPetById,
  createPet,
  updatePet,
  deletePet
};