import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cloudinary from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const uploadCtrl = async (req, res) => {
  try {
    if (!req.files || !req.files.file)
      return res.status(400).json({ msg: "No file uploaded" });

    const file = req.files.file;

    if (file.size > 1024 * 1024)
      return res.status(400).json({ msg: "File too large" });

    if (
      file.mimetype !== "image/jpeg" &&
      file.mimetype !== "image/png" &&
      file.mimetype !== "image/webp"
    ) {
      return res.status(400).json({ msg: "Invalid file format" });
    }

    cloudinary.v2.uploader.upload(
      file.tempFilePath,
      { folder: "products" },
      async (err, result) => {
        if (err) throw err;

        fs.unlink(file.tempFilePath, (err) => {
          if (err) console.log(err);
        });

        res.json({
          public_id: result.public_id,
          url: result.secure_url,
        });
      },
    );
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export default uploadCtrl;
