let express = require("express");
let router = express.Router();

router.get("/", (req, res, next) => {
  let categoryController = require("../controllers/categoryController");
  categoryController
    .getAll()
    .then((data) => {
      res.locals.categories = data;
      let brandController = require("../controllers/brandController");
      return brandController.getAll();
    })
    .then((data) => {
      res.locals.brands = data;
      let colorController = require("../controllers/colorController");
      return colorController.getAll();
    })
    .then((data) => {
      res.locals.colors = data;
      let productController = require("../controllers/productController");
      return productController.getAll();
    })
    .then((data) => {
      res.locals.products = data;
      // console.log(data);
      // res.render("category");
      let reviewController = require("../controllers/reviewController");
      return reviewController.getTopProduct();
    })
    .then((data) => {
      let topProducts = data.map((data) => {
        return data.Product;
      });
      // console.log(topProducts);
      res.locals.topProducts = topProducts;
      res.render("category");
      
    })

    .catch((error) => next(error));
});

router.get("/:id", (req, res, next) => {
  let productController = require("../controllers/productController");
  productController
    .getById(req.params.id)
    .then((product) => {
      res.locals.product = product;
      res.render("single-product");
    })
    .catch((error) => next(error));
});

module.exports = router;
