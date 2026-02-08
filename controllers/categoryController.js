import categoryModel from "../models/categoryModel.js";

const getcategory = async (req, res) => {
  try {
    const categories = await categoryModel.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
const createCategory = async (req, res) => {
  try {
    const { name, image } = req.body;
    if (!image) return res.status(400).json({ msg: "Image is Required" });
    const category = await categoryModel.findOne({ name });
    if (category)
      return res.status(400).json({ msg: "Category Alredy Exists" });

    const newCategory = new categoryModel({ name, image });
    await newCategory.save();

    res.json({ msg: "Category Created" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
const deleteCategory = async (req, res) => {
  try {
    await categoryModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ msg: "Category Deleted" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
const updateCategory = async (req, res) => {
  try {
    const { name, image } = req.body;
    const update = await categoryModel.findByIdAndUpdate(
      req.params.id,
      {
        name,
        image,
      },
      { new: true },
    );
    if (!update) return res.status(400).json({ msg: "can not update in db" });
    res.json({ msg: "Category Updated" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export { getcategory, createCategory, deleteCategory, updateCategory };
