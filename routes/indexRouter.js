let express = require("express");
let router = express.Router();

router.get("/", (req, res, next) => {
  let categoryController = require("../controllers/categoryController");
  categoryController
    .getAll()
    .then((data) => {
      res.locals.categories = data;
      // console.log(data);
      let productController = require("../controllers/productController");
      return productController.getTrendingProducts();
    })
    .then((data) => {
      res.locals.trendingProducts = data;
      // console.log(data);
      
      res.render("index");
    })
    .catch((err) => next(err));
});
module.exports = router;
