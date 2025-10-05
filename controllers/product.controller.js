const Product = require("../models/product.model");
const asyncHandler = require("express-async-handler");
const apiError = require("../utils/apiError");

/**
 * @desc Get all products
 * @route GET /api/v1/products
 * @METHOD GET
 * @access public
 */
const getProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find();
  res.status(200).json({ results: products.length, data: products });
});

/**
 * @desc Get specific product by id
 * @route GET /api/v1/products/:id
 * @METHOD GET
 * @access public
 */
const getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new apiError("Product not found", 404));
  }
  res.status(200).json({ data: product });
});

/**
 * @desc Create a new product
 * @route POST /api/v1/products
 * @METHOD POST
 * @access private (admin)
 */
const createProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.create(req.body);
  res.status(201).json({ data: product });
});

/**
 * @desc Update a product
 * @route PUT /api/v1/products/:id
 * @METHOD PUT
 * @access private (admin)
 */
const updateProduct = asyncHandler(
  async (req, res, next) => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return next(new apiError("Product not found", 404));
    }
    res.status(200).json({ data: product });
  }
)

/**
 * @desc Delete a product
 * @route DELETE /api/v1/products/:id
 * @METHOD DELETE
 * @access private (admin)
 */
const deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    return next(new apiError("Product not found", 404));
  }
  res.status(200).json({ message: "Product deleted successfully" });
});

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};