const express = require("express");
const path = require("path");
const fs = require("fs");
const apidb = require("./db/db.json")



const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(express.static(path.join(__dirname, 'public')));



app.get("/api/notes", (req, res) => {
    return res.json(apidb);
});






app.post("/api/notes", (req, res) => {

    let newNote = req.body;
    fs.readFile("db/db.json", (err, data) => {
        if (err) throw err;
        const currentNotes = JSON.parse(data);
        currentNotes.push(newNote)

        fs.writeFile("db/db.json", JSON.stringify(currentNotes), (err) => {
            if (err)
                console.log(err);
            else {
                console.log("File written successfully!");
            }
        });
        
        res.json(currentNotes)
    });

});

app.delete("/api/notes/:id", (req, res) => {
    const noteID = req.params.id;


})

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});


app.listen(PORT, () => {
    console.log("App listening on PORT " + PORT);
});
