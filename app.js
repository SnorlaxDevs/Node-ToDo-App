const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date");

const items = [];
const workItems = [];

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
    // res.send("Hello World!");
    const day = date.getDate();
    res.render("list", {title: day, items: items });
});

app.post("/", (req, res) => {
    let item = req.body.newItem;
    console.log(item);
    if (req.body.list == "Work") {
        workItems.push(item);
        res.redirect("/work");
    } else {
        items.push(item);
        res.redirect("/");
    }
   
});


app.get("/work", (req, res) => {
    res.render("list", {title: "Work List", items: workItems});
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
