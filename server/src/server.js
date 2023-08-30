require('dotenv').config();
const connectDB = require('./config/db.js')
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const userRoutes = require('./routes/userRoutes.js')
const chatRoutes = require('./routes/chatRoutes.js')
const messageRoutes = require('./routes/messageRoutes.js')

const cors = require("cors");
const express = require('express');
const app = express();

connectDB();

app.use(express.json());
app.use(cors())

app.get("/", (req, res) => {
    res.status(200).send({ msg: "running..." })
})

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.use(notFound);
app.use(errorHandler);


const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, (err) => {
    if (err) console.log(err.message);
    console.log(`server is running on port ${PORT}`);
})

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: "https://happy-to-chat.netlify.app/"
    }
})

io.on("connection", (socket) => {
    console.log("connected to socket.io");

    socket.on('setup', (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
    })
    socket.on('join_chat', (room) => {
        socket.join(room);
    })

    socket.on("typing", (room, userData) => {
        socket.in(room).emit('typing', userData)
    });
    socket.on("stop_typing", (room) => socket.in(room).emit('stop_typing'));

    socket.on('new_message', (newMessage) => {
        var chat = newMessage.chat;
        if (!chat.users) return console.log("chat.users not defined");

        chat.users.forEach(user => {
            if (user._id == newMessage.sender._id) return;
            socket.in(user._id).emit("message_received", newMessage)
        })
    })
    socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    });
})