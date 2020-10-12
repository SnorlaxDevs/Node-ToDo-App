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

const listSchema = {
    name: String,
    items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

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
    const listName = req.body.list;
    console.log(item);
    const newItemDocument = new Item({
        name: item
    });
    if (listName === date.getDate()) {
        newItemDocument.save();
        res.redirect("/");
    } else {
        List.findOne({name: listName}, (err, foundList) => {
            foundList.items.push(newItemDocument);
            foundList.save();
            res.redirect("/" + listName);
        });
    }
    // if (req.body.list == "Work") {
    //     // workItems.push(item);
    //     res.redirect("/work");
    // } else {
    //     // items.push(item);
    //     newItemDocument.save();
    //     res.redirect("/");
    // }
});

app.post("/delete", (req, res) => {
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName
    console.log(listName);

    if (listName === date.getDate()) {
        Item.findByIdAndRemove(checkedItemId, (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log("Successfully Removed!");
                res.redirect("/")
            }
        });
    } else {
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, (err, foundList) => {
            if (!err) {
                res.redirect("/" + listName);
            }
        });
    }

    
});

// app.get("/work", (req, res) => {
//     res.render("list", {title: "Work List", items: workItems});
// });

app.get("/:customListName", (req, res) => {
    console.log(req.params.customListName);
    const customListName = req.params.customListName;
    
    List.findOne({name: customListName}, (err, foundList) => {
        if (err) {
            console.log(err);
        } else {
            if (!foundList) {
                const list = new List({
                    name: customListName,
                    items: defaultItems
                });
                console.log("Doesn't Exist!");
                list.save();
                res.redirect("/" + customListName);
            } else {
                console.log("Exists!");
                res.render("list", { title: foundList.name, items: foundList.items });
            }
        }
    });        
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
