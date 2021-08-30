let controller = {};
let models = require("../models");
let Product = models.Product;

controller.getTrendingProducts = () => {
  return new Promise((resolve, reject) => {
    Product.findAll({
      order: [["overallReview", "DESC"]],
      limit: 8,
      include: [{ model: models.Category }],
      attributes: ["id", "name", "imagepath", "price"],
    })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => reject(new Error(err)));
  });
};
controller.getAll = () => {
  return new Promise((resolve, reject) => {
    Product.findAll({
      include: [{ model: models.Category }],
      attributes: ["id", "name", "imagepath", "price"],
    })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => reject(new Error(err)));
  });
};
// controller.getTopProduct = () => {
//   return new Promise((resolve, reject) => {
//     Product.findAll({
//       include: [{ model: models.Review}],
//       attributes: ["id", "name", "imagepath", "price"],
//     })
//       .then((data) => {
//         resolve(data);
//       })
//       .catch((err) => reject(new Error(err)));
//   });
// };
module.exports = controller;
