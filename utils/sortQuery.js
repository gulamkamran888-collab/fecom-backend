const sortQuery = (query, reqQuery) => {
  if (reqQuery.sort) {
    const sortBy = reqQuery.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt"); // default latest
  }

  return query;
};
export default sortQuery;
