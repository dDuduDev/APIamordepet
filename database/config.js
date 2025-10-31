const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('SUPABASE_URL e SUPABASE_KEY são obrigatórios no .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const initializeDatabase = async () => {
  try {
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .limit(1);

    if (error) {
      console.log('Tabela pets não existe, criando tabelas...');
      await createTables();
    } else {
      console.log('Conectado ao Supabase com sucesso');
    }
  } catch (error) {
    console.error('Erro ao inicializar banco de dados:', error.message);
  }
};

initializeDatabase();

module.exports = supabase;