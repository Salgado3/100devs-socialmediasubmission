const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const connectDB = require("./config/database");
const logger = require("morgan");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const methodOverride = require("method-override");
const flash = require("express-flash");
const mainRoutes = require("./routes/main");
const postRoutes = require("./routes/posts");
const PORT = 8000;
connectDB();

const app = express();

// Passport config
require("./config/passport")(passport);

//Using Ejs for views
app.set("view engine", "ejs");

//Static Folder
app.use(express.static("public"));

//Body Parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Logging
app.use(logger("dev"));

//Use forms for put and deletes
app.use(methodOverride("_method"));

// Setup Sessions - stored in MongoDB
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use("/", mainRoutes); // this is telling the app to use the router file to respond to requests made to the site and setting the landing page to our login view file
app.use("/post", postRoutes);

//Server Running
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
