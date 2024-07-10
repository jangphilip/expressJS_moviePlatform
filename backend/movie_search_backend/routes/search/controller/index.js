const router = require("express").Router();
const { query } = require("express-validator");
const search_operation = require("./search.controller");

router.get("/",
  [
    query("category").notEmpty(), //인덱스명
    query("searchDetail").notEmpty(), //검색 필드 조건
    query("keyword").notEmpty(), //검색어,
    query("searchSize"), //검색사이즈
  ],
  search_operation
);

module.exports = router;