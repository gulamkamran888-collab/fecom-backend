import mongoose from "mongoose";

const filterQuery = (query, reqQuery) => {
  const queryObj = { ...reqQuery };

  // ❌ remove special fields
  const exclude = ["page", "sort", "limit"];
  exclude.forEach((el) => delete queryObj[el]);

  // 🔍 SEARCH (title)
  if (queryObj.search) {
    query = query.find({
      title: { $regex: queryObj.search, $options: "i" },
    });
    delete queryObj.search;
  }

  // 📦 CATEGORY
  if (queryObj.category) {
    query = query.find({
      category: new mongoose.Types.ObjectId(queryObj.category),
    });
    delete queryObj.category;
  }

  return query;
};

export default filterQuery;
