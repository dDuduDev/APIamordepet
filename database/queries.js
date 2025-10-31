// Scripts SQL para criar as tabelas no Supabase (executar manualmente no SQL Editor)
const createTablesSQL = `
-- Tabela de pets
CREATE TABLE IF NOT EXISTS pets (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  tipo VARCHAR(50) NOT NULL,
  raca VARCHAR(100),
  idade INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de categorias
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL UNIQUE,
  descricao TEXT,
  imagem_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de produtos
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  imagem_url VARCHAR(255),
  categoria_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT fk_categoria
    FOREIGN KEY(categoria_id) 
    REFERENCES categories(id)
    ON DELETE CASCADE
);
`;

module.exports = {
  createTablesSQL
};