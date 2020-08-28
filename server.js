// require all dependencies
const express = require("express");
const path = require("path");
const fs = require("fs");
const apidb = require("./db/db.json")
const util = require("util");

// set up server
const app = express();
const PORT = process.env.PORT || 5000;

// handle post requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// set up static html, css, and js pages
app.use(express.static(path.join(__dirname, 'public')));


const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);
// function that writes to db.json file
const writeToAPI = (arr) => {
    fs.writeFileSync("db/db.json", JSON.stringify(arr), (err) => {
        if (err)
            console.log(err);
        else {
            console.log("File written successfully!");
        }
    });
}


// handle get requests
app.get("/api/notes", (req, res) => {
    return res.json(apidb);
});

// handle post requests when someone adds a new note
app.post("/api/notes", (req, res) => {
    const newNote = req.body;
    newNote.id = Date.now();
    apidb.push(newNote);
    writeToAPI(apidb);
    res.send("notes posted");
});


// handle delete requests when someone deletes a note
app.delete("/api/notes/:id", async (req, res) => {
    const noteID = await parseInt(req.params.id);

   readFileAsync("db/db.json", "utf8").then(notes => {
        const currentNotes = JSON.parse(notes);
        const newAPI = currentNotes.filter(word => word.id !== noteID);
        writeFileAsync("db/db.json", JSON.stringify(newAPI)).then(err => {
            if (err)
                console.log(err);
            else {
                console.log("File written successfully!");
            }
        });
    });

    res.send("deleted!");

});

// anything in the url other than whats specified will take you to the home page
app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

// start server
app.listen(PORT, () => {
    console.log("App listening on PORT " + PORT);
});
