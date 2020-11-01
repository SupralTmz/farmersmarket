import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';

// GET /api/products
export const getProducts = asyncHandler(async (req, res, next) => {
	const products = await Product.find();

	res.json(products);
});

// GET /api/product/:id
export const getProduct = asyncHandler(async (req, res, next) => {
	const product = await Product.findById(req.params.id);
	if (product) {
		res.json(product);
	} else {
		res.status(404);
		throw new Error('Product not found');
	}
});
