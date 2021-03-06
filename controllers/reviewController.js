let controller = {};
let models = require("../models");
let Review = models.Review;

controller.getTopProduct = () => {
  return new Promise((resolve, reject) => {
    Review.findAll({
      where: { rating: 5 },
      limit: 12,
      include: [{ model: models.Product }],
    })
      .then((data) => {
        let topProducts = data.map((data) => {
          return data.Product;
        });
        resolve(topProducts);
      })
      .catch((error) => reject(new Error(error)));
  });
};
controller.add = (review) => {
  return new Promise((resolve, reject) => {
    Review.findOne({
      where: {
        userId: review.userId,
        productId: review.productId,
      },
    })
      .then((data) => {
        if (data) {
          return Review.update(review, {
            where: {
              userId: review.userId,
              productId: review.productId,
            },
          });
        } else {
          return Review.create(review);
        }
      })
      .then(() => {
        models.Product.findOne({
          where: { id: review.productId },
          include: [{ model: models.Review }],
        })
          .then((product) => {
            let overallReview = 0;
            for (let i = 0; i < product.Reviews.length; i++) {
              overallReview += product.Reviews[i].rating;
            }
            overallReview = parseFloat(
              overallReview / product.Reviews.length
            ).toFixed(2);
            return models.Product.update(
              {
                overallReview: overallReview,
                reviewCount: product.Reviews.length,
              },
              { where: { id: product.id } }
            );
          })
          .then((data) => resolve(data));
      })
      .catch((error) => reject(new Error(error)));
  });
};
controller.getUserReviewProduct = (userId, productId) => {
  return new Promise((resolve, reject) => {
    Review.findOne({
      where: { userId: userId, productId: productId },
    })
      .then((review) => resolve(review))
      .catch((error) => reject(new Error(error)));
  });
};
module.exports = controller;
