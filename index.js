let express = require("express");
let app = express();

//Set public static folder
app.use(express.static(__dirname + "/public"));
//Use view engine
let helper = require("./controllers/helper");
let expressHbs = require("express-handlebars");
let hbs = expressHbs.create({
  extname: "hbs",
  defaultLayout: "layout",
  layoutsDir: __dirname + "/views/layouts",
  partialsDir: __dirname + "/views/partials",
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
  },
  helpers: {
    createStarList: helper.createStarList,
    createStars: helper.createStars,
  },
});
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
// Create DB
app.get("/sync", (req, res) => {
  let models = require("./models");
  models.sequelize.sync().then(() => {
    res.send("Database sync completed !");
  });
});
//Define your roots here
app.use("/", require("./routes/indexRouter"));
app.use("/products", require("./routes/productRouter"));
// app.get("/", (req, res) => {
//   res.render("index");
// });

app.get("/:page", (req, res) => {
  let banners = {
    blog: "Our Blog",
    cart: "Cart",
    category: "Category",
    checkout: "Checkout",
    confirmation: "Confirmation",
    contact: "Contact",
    login: "Login/Register",
    register: "Register",
    "single-blog": "Blog Details",
    "single-product": "Shop Single",
    "tracking-order": "Order Tracking",
  };
  let page = req.params.page;
  res.render(page, { banner: banners[page] });
});

//Set server port and start server
app.set("port", process.env.PORT || 9999);
app.listen(app.get("port"), () => {
  console.log(`Server is running on port ${app.get("port")}`);
});
