const express = require("express");
const path = require("path");
const fs = require("fs");

const PORT = process.env.PORT || 3001;
const app = express();
const uuid = require("./helpers/uuid");

/* const testFilePath = require("./public/index.html"); */

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Insert code here so we can receive data

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});
// fs function

app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      res.json(JSON.parse(data));
    }
  });
});

app.post("/api/notes", (req, res) => {
  const newNote = {
    title: req.body.title,
    text: req.body.text,
    id: uuid(),
  };
  console.log(newNote);
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedNotes = JSON.parse(data);
      parsedNotes.push(newNote);
      fs.writeFile(
        "./db/db.json",
        JSON.stringify(parsedNotes, null, 4),
        (writeErr) => {
          if (writeErr) return console.error(writeErr);
          const response = {
            status: "success",
            body: newNote,
          };
          console.info("Successfully added note!");
          return res.status(201).json(response);
        }
      );
    }
  });
});

app.delete("/api/notes/:id", (req, res) => {
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      let notes = JSON.parse(data);
      for (let i = 0; i < notes.length; i++) {
        if (req.params.id === notes[i].id) {
          notes.splice(i, 1);
        }
      }

      fs.writeFile(
        "./db/db.json",
        JSON.stringify(notes, null, 4),
        (writeErr) => {
          let response;
          if (writeErr) {
            console.error(writeErr);
            response = {
              status: "error",
              message: "Failed to delete note",
            };
          } else {
            response = {
              status: "success",
              message: "Successfully deleted note",
            };
            console.info("Successfully deleted note!");
            return res.status(201).json(response);
          }
        }
      );
    }
  });
});
// ======
app.listen(PORT, () =>
  console.log(`Express server listening on port ${PORT}!`)
);
