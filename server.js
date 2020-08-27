const express = require("express");
const path = require("path");
const fs = require("fs");
const apidb = require("./db/db.json")


const app = express();
const PORT = process.env.PORT || 5000;


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


const writeToAPI = (arr) => {
    fs.writeFile("db/db.json", JSON.stringify(arr), (err) => {
        if (err)
        console.log(err);
        else {
            console.log("File written successfully!");
        }
    });
} 

let currentNotes;
const readAPI = (newNote) => {
    fs.readFile("db/db.json", (err, data) => {
        if (err) throw err;
        currentNotes = JSON.parse(data);
        currentNotes.push(newNote);
        writeToAPI(currentNotes);
    });
}


app.get("/api/notes", (req, res) => {
    return res.json(apidb);
});

app.post("/api/notes", (req, res) => {
    let newNote = req.body;
    newNote.id = Date.now();
    apidb.push(newNote);
    writeToAPI(apidb);
    res.send(currentNotes);
});

app.delete("/api/notes/:id", (req, res) => {
    const noteID = parseInt(req.params.id);
    const newAPI = apidb.filter(word => word.id !== noteID);
    writeToAPI(newAPI);
    res.send("Deleted")
})

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});


app.listen(PORT, () => {
    console.log("App listening on PORT " + PORT);
});
