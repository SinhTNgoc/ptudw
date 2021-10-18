let express = require("express");
let app = express();

//Set public static folder
app.use(express.static(__dirname + "/public"));
//Use view engine
let helper = require("./controllers/helper");
let expressHbs = require("express-handlebars");
let paginateHelper = require("express-handlebars-paginate");
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
    createPagination: paginateHelper.createPagination,
  },
});
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");

// Use Body-Parser
let bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Use Cookie-Parser
let cookieParser = require("cookie-parser");
app.use(cookieParser());

//Use Session
let session = require("express-session");
app.use(
  session({
    cookie: { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 },
    secret: "S3cret",
    resave: false,
    saveUninitialized: false,
  })
);

//Use Cart Controller
let Cart = require("./controllers/cartController");
app.use((req, res, next) => {
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  req.session.cart = cart;
  res.locals.totalQuantity = cart.totalQuantity;
  next();
});
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
app.use("/cart",require("./routes/cartRouter"));

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
app.set("port", process.env.PORT || 3000);
app.listen(app.get("port"), () => {
  console.log(`Server is running on port ${app.get("port")}`);
});
