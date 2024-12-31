import { WebSocketServer, WebSocket } from "ws";
const wss = new WebSocketServer({ port: 8090 });

interface User {
  socket: WebSocket;
  room: string;
}

let allsockets: User[] = [];

wss.on("connection", (socket) => {
  socket.on("message", (message) => {
    const parsedmessage = JSON.parse(message as unknown as string);
    if (parsedmessage.type === "join") {
      allsockets.push({
        socket,
        room: parsedmessage.payload.roomId,
      });
    }

    if (parsedmessage.type === "chat") {
      console.log("User wants to chat");
      let currentUserRoom = null;
      for (let i = 0; i < allsockets.length; i++) {
        if (allsockets[i].socket == socket) {
          currentUserRoom = allsockets[i].room;
        }
      }
      for (let i = 0; i < allsockets.length; i++) {
        if (allsockets[i].room == currentUserRoom) {
          allsockets[i].socket.send(parsedmessage.payload.message);
        }
      }
    }
  });
});
