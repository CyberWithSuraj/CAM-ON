const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const fs = require("fs");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

if (!fs.existsSync("recordings")) {
  fs.mkdirSync("recordings");
}

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/camera.html");
});


// Recording
let writeStream;

io.on("connection", (socket) => {

  socket.on("start-recording", () => {
    const filePath = path.join(__dirname, "recordings", Date.now() + ".webm");
    writeStream = fs.createWriteStream(filePath);
  });

  socket.on("video-chunk", (data) => {
    if (writeStream) {
      writeStream.write(Buffer.from(data));
    }
  });

  socket.on("stop-recording", () => {
    if (writeStream) {
      writeStream.end();
    }
  });

});

server.listen(PORT, () => {
  console.log("Server running at http://localhost:3000");
});
 
