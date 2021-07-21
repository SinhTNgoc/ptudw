let express = require("express");
let app = express();

//Set public static folder
app.use(express.static(__dirname + "/public"));
//Use view engine
let expressHbs = require("express-handlebars");
let hbs = expressHbs.create({
  extname: "hbs",
  defaultLayout: "layout",
  layoutsDir: __dirname + "/views/layouts",
  partialsDir: __dirname + "/views/partials",
});
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");

//Define your roots here
app.get("/", (req, res) => {
  res.render("index");
});
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
