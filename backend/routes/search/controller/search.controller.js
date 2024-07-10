const { validationResult } = require("express-validator");
const creatError = require("http-errors");
const dayjs = require("dayjs");
const { getSearch, getSearchResult } = require("../service/search.service");

const search_operation = async (req, res) => {
  const validationError = validationResult(req);
  if (validationError && validationError.errors > 0) {
    return next(creatError(400, "Bad Request"));
  }

  const reqParam = req.query;

  try {
    const getSearchData = await getSearch(reqParam);
    const searchResult = getSearchResult(getSearchData, reqParam);

    return res.json({
      status: 200,
      message: "OK",
      search_result: searchResult,
    });

  } catch (error) {
    console.error(error);
  }
};





module.exports = search_operation;