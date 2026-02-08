// const filterQuery = (query, queryString) => {
//   // req.params se aanewala object ka copy object
//   const queryObj = { ...queryString };

//   // object se jo db me nai bhejna hai us fields ko remove karre
//   const excludedFields = ["page", "sort", "limit"];
//   excludedFields.forEach((el) => delete queryObj[el]);

// // for search by alfabet
//   const mongoQuery = {};

//   Object.keys(queryObj).forEach(key => {
//     // handle bracket syntax: title[regex], title[options]
//     if (key.includes('[')) {
//       const [field, operator] = key.split('[');
//       const op = operator.replace(']', '');

//       if (!mongoQuery[field]) {
//         mongoQuery[field] = {};
//       }

//       mongoQuery[field][`$${op}`] = queryObj[key];
//     } else {
//       mongoQuery[key] = queryObj[key];
//     }
//   });

//   return query.find(mongoQuery);

//   // object ko string me convert {
//   //   price: { gte: "1000" }
//   // } become '{"price":{"gte":"1000"}}'

//   // let queryStr = JSON.stringify(queryObj);

//   // //Regex replace
//   // queryStr = queryStr.replace(
//   //   /\b(gte|gt|lt|lte|regex)\b/g,
//   //   match => '$' + match
//   // );

//   // // result '{"price":{"$gte":"1000"}}'
//   // //String → Object {
//   // //   price: { $gte: "1000" }
//   // // } mongo db ko ye samajhta hai- Phir MongoDB ko pass
//   // return query.find(JSON.parse(queryStr));

//   //query.find({ price: { $gte: "1000" } })
// };

// const sortQuery = (query, queryString) => {
//   if (queryString.sort) {
//     const sortBy = queryString.sort.split(",").join("");
//     return query.sort(sortBy);
//   }
//   return query.sort("-createdAt");
// };
const paginationQuery = (query, queryString) => {
  const page = queryString.page * 1 || 1;
  const limit = Math.min(queryString.limit * 1 || 9);
  const skip = (page - 1) * limit;

  return query.skip(skip).limit(limit);
};
export default paginationQuery;
