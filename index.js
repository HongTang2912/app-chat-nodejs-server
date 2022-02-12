


const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://app-chat-nodejs-client.herokuapp.com",
    methods: ["GET", "POST"],
  },
});

//tham số socket là 1 object trả về thông tin của 1 request người dùng 
// bao gồm các thông tin cơ bản như id(đã được mã hóa): 

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // hàm xử lý event join_room, tham số data là dữ liệu của tên phòng,
  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id}, joined room: ${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
    console.log(`$$$ message: ${data.message}` );
  });

  socket.on("disconnect", () => {
    console.log("***User Disconnected", socket.id);
  });
});

server.listen(process.env.NODE_ENV, () => {
  console.log("SERVER RUNNING");
  //console.log(server);
});
