const auth = require("../controllers/auth.controller");
const {
  User,
  Message,
  ChatRoom,
  Token,
  Nickname,
  Friend,
} = require("../models/schema.model");
const jwt = require("jsonwebtoken");

const userOnline = [];

function CheckToken(socket, socketIo) {
  const { id, accessToken } = socket.handshake.query;
  const refreshToken = socket.handshake.headers.cookie.includes("refreshToken")
    ? socket.handshake.headers.cookie.split("refreshToken=")[1].split(";")[0]
    : null;

  if (!refreshToken) {
    return socketIo.emit("error", {
      message: "Unauthorized",
      id,
    });
  }

  const refreshTokenInDB = Token.findOne({ token: refreshToken });

  if (!refreshTokenInDB) {
    return socketIo.emit("error", {
      message: "Unauthorized",
      id,
    });
  }

  let checkToken = false;

  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
    if (error?.name === "TokenExpiredError") {
      try {
        const checkRefreshToken = jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET
        );

        const newAccessToken = auth.generateAccessToken(checkRefreshToken.id);
        socketIo.emit("new-access-token", {
          accessToken: newAccessToken,
          id,
        });
        checkToken = true;
      } catch (error) {
        console.log("error");
        socketIo.emit("error", {
          message: "Unauthorized",
          id,
        });

        socket.disconnect();

        checkToken = false;
      }
    }

    checkToken = true;
  });

  return checkToken;
}

function SocketIo(socketIo) {
  socketIo.on("connection", (socket) => {
    if (socket && socket.handshake.query?.id !== "undefined") {
      const index = userOnline.findIndex(
        (user) => user?.userId === socket.handshake.query.id
      );

      if (index === -1) {
        userOnline.push({
          socketId: socket.id,
          userId: socket.handshake.query.id,
        });
      } else {
        userOnline[index].socketId = socket.id;
      }
    }
    socket.use((packet, next) => {
      if (packet[0] !== "online") {
        const { id, accessToken } = packet[1];
        jwt.verify(
          accessToken,
          process.env.ACCESS_TOKEN_SECRET,
          (error, decoded) => {
            if (error) {
              if (error.name === "TokenExpiredError") {
                const refreshToken = socket.handshake.headers.cookie.includes(
                  "refreshToken"
                )
                  ? socket.handshake.headers.cookie
                      .split("refreshToken=")[1]
                      .split(";")[0]
                  : null;

                try {
                  const checkRefreshToken = jwt.verify(
                    refreshToken,
                    process.env.REFRESH_TOKEN_SECRET
                  );
                  const newAccessToken = auth.generateAccessToken(
                    checkRefreshToken.id
                  );
                  socket.emit("new-access-token", {
                    accessToken: newAccessToken,
                    id,
                  });
                  next();
                } catch (error) {
                  socket.emit("error", { message: "Unauthorized", id });
                }
              } else {
                socket.emit("error", { message: "Unauthorized", id });
              }
            } else {
              next();
            }
          }
        );
      } else {
        next();
      }
    });

    socket.on("online", async (id) => {
      try {
        await User.findByIdAndUpdate(id, { online: true }, { new: true });
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("change-profile", async (data) => {
      const { phone, address, id } = data;

      const checkToken = CheckToken(socket, socketIo);

      if (!checkToken) {
        return;
      }

      try {
        const user = await User.findByIdAndUpdate(
          id,
          { phone, address },
          { new: true }
        );

        socketIo.emit("receive-change-profile", user);
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("send-message", async (data) => {
      const { message, id, id_room } = data;

      try {
        const checkToken = CheckToken(socket, socketIo);

        if (!checkToken) {
          return;
        }

        const chatRoom = await ChatRoom.findById(id_room);

        if (!chatRoom) {
          return;
        }

        const sendMessage = await Message.create({
          sender: id,
          chatRoom: id_room,
          message,
        });

        await ChatRoom.findByIdAndUpdate(id_room, {
          updatedAt: new Date(),
        });

        const newMessage = await Message.findById(sendMessage._id).populate(
          "sender",
          "username"
        );

        socketIo.emit("room-update", id_room);
        socketIo.emit("receive-message", newMessage);
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("edit-room", async (data) => {
      const { id_room, name, image } = data;
      console.log("data");
      try {
        if (!id_room) {
          return;
        }

        if (!name && !image) {
          return;
        }

        if (!name) {
          console.log("image");
          await ChatRoom.findByIdAndUpdate(id_room, { image }, { new: true });
        } else if (!image) {
          await await ChatRoom.findByIdAndUpdate(
            id_room,
            { name, updatedAt: new Date() },
            { new: true }
          );
        } else {
          await ChatRoom.findByIdAndUpdate(
            id_room,
            { name, image, updatedAt: new Date() },
            { new: true }
          );
        }

        const chatRoom = await ChatRoom.findById(id_room).populate(
          "users",
          "-password -createdAt -updatedAt"
        );

        socketIo.emit("receive-edit-room", chatRoom);
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("add-room", async (data) => {
      const { name, users, image, userCreate, isGroupChat } = data;
      try {
        const checkToken = CheckToken(socket, socketIo);

        if (!checkToken) {
          return;
        }

        if (!isGroupChat) {
          const checkRoom = await ChatRoom.findOne({
            users: { $all: Object.values(users) },
            isGroupChat: false,
          });

          if (checkRoom) {
            socketIo.emit("receive-room-exist", checkRoom);
          } else {
            const chatRoom = await ChatRoom.create({
              name: name ? name : "",
              users,
              image: image ? image : null,
              userCreate,
              isGroupChat: isGroupChat ? isGroupChat : false,
            });

            const chatRoomPopulate = await ChatRoom.findById(
              chatRoom._id
            ).populate("users", "-password -createdAt -updatedAt");

            socketIo.emit("receive-add-room", chatRoomPopulate);
          }

          return;
        }

        const chatRoom = await ChatRoom.create({
          name: name ? name : "",
          users,
          image: image ? image : null,
          userCreate,
          isGroupChat: isGroupChat ? isGroupChat : false,
        });

        const chatRoomPopulate = await ChatRoom.findById(chatRoom._id).populate(
          "users",
          "-password -createdAt -updatedAt"
        );

        socketIo.emit("receive-add-room", chatRoomPopulate);
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("leave-room", async (data) => {
      const { id_room, id_user } = data;

      try {
        const chatRoom = await ChatRoom.findById(id_room);

        if (!chatRoom) {
          return;
        }

        const user = chatRoom.users.filter((user) => user != id_user);

        if (user.length === 1 && !chatRoom.isGroupChat) {
          await ChatRoom.findByIdAndDelete(id_room);
          console.log("delete");
          socketIo.emit("receive-leave-room", id_room);
        } else {
          await ChatRoom.findByIdAndUpdate(
            id_room,
            { users: user },
            { new: true }
          );

          const update_member = await ChatRoom.findById(id_room).populate(
            "users",
            "-password -createdAt -updatedAt"
          );

          console.log(update_member);

          socketIo.emit("receive-update-member", {
            id_room,
            update_member: update_member.users,
            id_user,
          });
        }
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("add-friend", async (data) => {
      const { id_user, id_friend } = data;

      try {
        const checkToken = CheckToken(socket, socketIo);

        if (!checkToken) {
          return;
        }

        const checkFriend = await Friend.findOne({
          $or: [
            { id_user: id_user, id_friend: id_friend },
            { id_user: id_friend, id_friend: id_user },
          ],
        });

        if (checkFriend) {
          return;
        }

        await Friend.create({
          id_user,
          id_friend,
        });

        const friends = await Friend.find({
          $or: [{ id_user: id_user }, { id_friend: id_user }],
        })
          .populate("id_user", "-password -createdAt -updatedAt")
          .populate("id_friend", "-password -createdAt -updatedAt");

        const friendsList = friends.map((friend) => {
          if (friend.id_user._id == id_user) {
            return {
              ...friend.id_friend._doc,
              status: friend.status,
              id_sender: friend.id_user._id,
            };
          } else {
            return {
              ...friend.id_user._doc,
              status: friend.status,
              id_sender: friend.id_user._id,
            };
          }
        });

        socketIo.emit("receive-add-friend", friendsList);
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("set-nickname", async (data) => {
      const { id_room, id_user, nickname } = data;

      try {
        const checkNickname = await Nickname.findOne({
          id_room,
          id_user,
        });

        if (checkNickname) {
          await Nickname.findByIdAndUpdate(
            checkNickname._id,
            { nickname },
            { new: true }
          );
        } else {
          await Nickname.create({
            id_room,
            id_user,
            nickname,
          });
        }

        socketIo.emit("receive-set-nickname", data);
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("disconnect", async () => {
      const index = userOnline.findIndex((user) => user.socketId === socket.id);
      await User.findByIdAndUpdate(
        userOnline[index]?.userId,
        { online: false },
        { new: true }
      );
      await Token.findByIdAndUpdate(
        userOnline[index]?.userId,
        { token: "" },
        { new: true }
      );
      if (index !== -1) {
        userOnline.splice(index, 1);
      }
    });
  });
}

module.exports = SocketIo;
