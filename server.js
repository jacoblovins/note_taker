// require all dependencies
const express = require("express");
const path = require("path");
const fs = require("fs");
const apidb = require("./db/db.json")

// set up server
const app = express();
const PORT = process.env.PORT || 5000;

// handle post requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// set up static html, css, and js pages
app.use(express.static(path.join(__dirname, 'public')));

// function that writes to db.json file
const writeToAPI = (arr) => {
    fs.writeFile("db/db.json", JSON.stringify(arr), (err) => {
        if (err)
        console.log(err);
        else {
            console.log("File written successfully!");
        }
    });
} 

// let currentNotes;
// const readAPI = (note) => {
//     fs.readFile("db/db.json", (err, data) => {
//         if (err) throw err;
//         currentNotes = JSON.parse(data);
//         const newAPI = apidb.filter(word => word.id !== noteID);
//         writeToAPI(newAPI);
//     });
// }

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
app.delete("/api/notes/:id", (req, res) => {
    const noteID = parseInt(req.params.id);
    const newAPI = apidb.filter(word => word.id !== noteID);
    writeToAPI(newAPI);
    console.log("deleted note")
    res.send("Deleted")
});

// anything in the url other than whats specified will take you to the home page
app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

// start server
app.listen(PORT, () => {
    console.log("App listening on PORT " + PORT);
});
