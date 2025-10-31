const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

// Rotas CRUD para produtos
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.get('/categoria/:categoriaId', getProductsByCategory);
router.post('/', upload.single('imagem'), createProduct);
router.put('/:id', upload.single('imagem'), updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;