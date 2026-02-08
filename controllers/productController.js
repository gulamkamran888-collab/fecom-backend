import productModel from "../models/productModel.js";
import filterQuery from "../utils/filterQuery.js";
import paginationQuery from "../utils/paginationQuery.js";
import sortQuery from "../utils/sortQuery.js";

const getProduct = async (req, res) => {
  try {
    let query = productModel.find().populate("category", "name");

    query = filterQuery(query, req.query);

    const total = await productModel.countDocuments(query.getQuery());

    query = sortQuery(query, req.query);
    query = paginationQuery(query, req.query);

    const data = await query;

    res.json({
      total,
      result: data.length,
      data,
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const { product_id, title, price, description, content, images, category } =
      req.body;

    if (!title || !price || !category)
      return res.status(400).json({ msg: "Please fill all fields" });

    if (!images || !images.url)
      return res.status(400).json({ msg: "Image not uploaded properly" });

    const product = await productModel.findOne({ product_id });
    if (product) return res.status(400).json({ msg: "Product already exists" });

    const newProduct = new productModel({
      product_id,
      title,
      price,
      description,
      content,
      images,
      category,
    });

    await newProduct.save();
    res.json({ msg: "Product created successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.id);
    res.json({ msg: "Product Deleted" });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { title, price, description, content, images, category } = req.body;

    if (!images) return res.status(400).json({ msg: "No image Uploaded" });
    await productModel.findByIdAndUpdate(
      { _id: req.params.id },
      {
        title: title.toLowerCase(),
        price,
        description,
        content,
        images,
        category,
      },
    );
    res.json({ msg: "Product Updated" });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await productModel
      .findById(req.params.id)
      .populate("category");

    if (!product) return res.status(404).json({ msg: "Product not found" });

    res.json(product);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export {
  getProduct,
  createProduct,
  deleteProduct,
  updateProduct,
  getProductById,
};
