const express = require("express");

const router = express.Router();
const CategoryController = require("../controllers/categoryController")

router.get("/", CategoryController.category_list);

router.get("/detail/:categoryName", CategoryController.category_detail)

router.get("/new", CategoryController.AddCategory);

router.post("/new", CategoryController.AddCategoryToDatabase);

router.get("/:Name/Add", CategoryController.AddItem);

router.post("/:Name/Add", CategoryController.AddItemToDatabase);

module.exports = router;