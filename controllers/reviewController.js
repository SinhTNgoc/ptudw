let controller = {};
let models = require("../models");
let Review = models.Review;

controller.getTopProduct = () => {
  return new Promise((resolve, reject) => {
    Review.findAll({
      where: {rating:5},
      include: [{ model: models.Product }],
    //   attributes: ["id", "name", "imagepath"],
    })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => reject(new Error(error)));
  });
};

module.exports = controller;
