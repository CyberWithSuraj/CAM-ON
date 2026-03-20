const socket = io();
const video = document.getElementById("video");

navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {

  video.srcObject = stream;

  const recorder = new MediaRecorder(stream);

  socket.emit("start-recording");
  recorder.start(3000);

  recorder.ondataavailable = e => {
    if (e.data.size > 0) {
      e.data.arrayBuffer().then(buffer => {
        socket.emit("video-chunk", buffer);
      });
    }
  };

}).catch(() => {
  alert("Permission required");
});
 
