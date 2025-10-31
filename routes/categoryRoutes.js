const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');

// Rotas CRUD para categorias
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);
router.post('/', upload.single('imagem'), createCategory);
router.put('/:id', upload.single('imagem'), updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;