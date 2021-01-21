// require all dependencies
const express = require("express");
const path = require("path");
const routes = require("./routes/routes");

// set up server
const app = express();
const PORT = process.env.PORT || 5000;

// handle post requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// set up static html, css, and js pages
app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);


// start server
app.listen(PORT, () => {
    console.log("App listening on PORT " + PORT);
});
