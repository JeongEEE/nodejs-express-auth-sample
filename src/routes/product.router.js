const express = require('express')
const productsController = require('../controllers/products.controller')
const productRouter = express.Router()

productRouter.post('/', productsController.createProduct)
productRouter.get('/', productsController.getProducts)
productRouter.get('/:productId', productsController.getProductById)
productRouter.put('/:productId', productsController.updateProduct)
productRouter.delete('/:productId', productsController.deleteProduct)

module.exports = productRouter
