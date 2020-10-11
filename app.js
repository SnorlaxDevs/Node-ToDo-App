const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date");
const mongoose = require("mongoose");

// const items = [];
// const workItems = [];

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://mongoadmin:secret@localhost:27888/todolistDB?authSource=admin");

const itemsSchema = {
    name: String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    name: "Welcome to your ToDoList!"
});

const item2 = new Item({
    name: "Hit the + button to add a new item."
});

const item3 = new Item({
    name: "<-- Hit this to delete an item."
});

// Item.insertMany([item1, item2, item3], () => {
//     if (err){
//         console.log(err);
//     } else {
//         console.log("Successfully saved default items to DB");
//     }
// });

const defaultItems = [item1, item2, item3];

app.get("/", (req, res) => {
    // res.send("Hello World!");
    const day = date.getDate();
    Item.find({}, (err, foundItems) => {
        if (foundItems.length === 0) {
            Item.insertMany(defaultItems, (err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Successfully saved the defaultItems into DB.")
                }
            });
            res.redirect("/");
        } else {
            res.render("list", {title: day, items: foundItems});
        }

    })
});

app.post("/", (req, res) => {
    let item = req.body.newItem;
    console.log(item);
    const newItemDocument = new Item({
        name: item
    });
    if (req.body.list == "Work") {
        // workItems.push(item);
        res.redirect("/work");
    } else {
        // items.push(item);
        newItemDocument.save();
        res.redirect("/");
    }
});

app.post("/delete", (req, res) => {
    console.log(req.body.checkbox);
    const checkedItemId = req.body.checkbox;
    Item.findByIdAndRemove(checkedItemId, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Successfully Removed!");
            res.redirect("/")
        }
    });
});

app.get("/work", (req, res) => {
    res.render("list", {title: "Work List", items: workItems});
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
