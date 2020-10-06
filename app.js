const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
    // res.send("Hello World!");
    var today = new Date();

    if (today.getDay() == 6 || today.getDay() == 0) {
        res.send("Yay it's the weekend");
    } else {
        res.send("Boo! I have to work!");
    }
});



app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
