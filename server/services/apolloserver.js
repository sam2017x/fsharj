const jwt = require("jsonwebtoken");
const { PubSub, withFilter } = require("apollo-server");
const bcrypt = require("bcrypt");
const {
  ApolloServer,
  UserInputError,
  AuthenticationError,
  ApolloError
} = require("apollo-server-express");
const dataSource = require("../datasource");
const typeDefs = require("./typedefs");

const pubsub = new PubSub();
const User = require("../models/user");
const Room = require("../models/room");
const Message = require("../models/message");

const JWT_SECRET = "NEED_HERE_A_SECRET_KEY";

const resolvers = {
  Subscription: {
    messageAdded: {
      subscribe: withFilter(
        () => pubsub.asyncIterator("messageAdded"),
        (payload, variables) => {
          return String(payload.messageAdded.room.id) === variables.id;
        }
      )
    }
  },
  Query: {
    getLaunchData: async (root, args, { dataSources }) =>
      dataSources.spaceAPI.getLaunches(),
    getCountries: async (root, args, { dataSources }) =>
      dataSources.countriesAPI.getAllCountries(),
    getChatroomInfo: async (root, args, context) => {
      if (!args.id) throw new UserInputError("Invalid args.", args);
      if (!context.currentUser) throw new AuthenticationError("Unauthorized.");
      try {
        const room = await Room.findById(args.id)
          .populate("users")
          .populate({ path: "messages", populate: { path: "sender" } })
          .populate({ path: "messages", populate: { path: "room" } });
        if (!room.users.map(user => user.id).includes(context.currentUser._id))
          throw new AuthenticationError("Unauthorized.");

        return room;
      } catch (error) {
        return new ApolloError("Database error.");
      }
    },
    allUsers: async (root, args) => {
      try {
        return await User.find({})
          .populate("friends")
          .populate("rooms");
      } catch (error) {
        throw new ApolloError(
          `Database/server error. The userlist couldn't be loaded.`,
          "500"
        );
      }
    },
    me: async (root, args, context) => {
      return context.currentUser;
    },
    getUserInfo: async (root, args) => {
      if (args.username) {
        try {
          return await User.findOne({ username: args.username }).populate(
            "friends"
          );
        } catch (error) {
          throw new ApolloError(
            `Database/server error. The userinfo couldn't be loaded.`,
            "500"
          );
        }
      }
      return null;
    }
  },
  Mutation: {
    getWeatherData: async (root, args, { dataSources }) => {
      if (!args.capital) throw new UserInputError("Invalid args.", args);
      return dataSources.weatherAPI.getCurrentWeather(args.capital);
    },
    removeMessage: async (root, args, context) => {
      if (!context.currentUser) {
        throw new AuthenticationError("Unauthorized.");
      }
      try {
        const getMsg = await Message.findById(args.id);
        await Room.update(
          { _id: args.room },
          { $pullAll: { messages: [args.id] } }
        );
        await Message.deleteOne({ _id: args.id });
        return getMsg;
      } catch (error) {
        throw new ApolloError("error");
      }
    },
    sendMessage: async (root, args, context) => {
      if (!context.currentUser) throw new AuthenticationError("Unauthorized.");
      if (args.message.length === 0)
        throw new UserInputError("The message cannot be null.");

      const theroom = await Room.findById(args.roomId);

      const createMessage = new Message({
        message: args.message,
        sender: args.sender,
        date: new Date(),
        room: theroom._id
      });

      try {
        await createMessage.save();
        const msgToRoom = await Room.findById(args.roomId);
        msgToRoom.messages = msgToRoom.messages.concat(createMessage._id);
        await msgToRoom.save();
        const messg = await Message.findById(createMessage._id)
          .populate("sender")
          .populate("room");
        pubsub.publish("messageAdded", {
          messageAdded: {
            message: messg.message,
            id: messg._id,
            date: messg.date,
            sender: {
              id: messg.sender._id,
              username: messg.sender.username
            },
            room: {
              id: messg.room._id
            }
          }
        });
        return messg;
        //return Message.findById(createMessage._id).populate("sender");
      } catch (error) {
        throw new ApolloError("Error.");
      }
    },
    createRoom: async (root, args, context) => {
      if (!context.currentUser) throw new AuthenticationError("Unauthorized.");
      if (!args.senderId || !args.receiverId)
        throw new UserInputError("Invalid args.");

      const sender = await User.findById(args.senderId);
      const receiver = await User.findById(args.receiverId);

      const receiverRoomIds = receiver.rooms.map(room => room._id);

      const existingRoom = sender.rooms.filter(room =>
        receiverRoomIds.includes(room._id)
      );

      if (existingRoom.length > 0)
        return Room.findById(existingRoom).populate("users");

      const newRoom = new Room({
        users: [sender, receiver],
        messages: [],
        title: args.title || null
      });

      try {
        await newRoom.save();
        sender.rooms = sender.rooms.concat(newRoom._id);
        await sender.save();
        receiver.rooms = receiver.rooms.concat(newRoom._id);
        await receiver.save();
      } catch (error) {
        throw new ApolloError("Document not found.");
      }

      return Room.findById(newRoom._id).populate("users");
    },
    addFriend: async (root, args, context) => {
      if (!context.currentUser) throw new AuthenticationError(`Unauthorized.`);
      const friend = await User.findById(args.id);
      context.currentUser.friends = context.currentUser.friends.concat(
        friend._id
      );
      await context.currentUser.save();

      return User.findById(context.currentUser._id).populate("friends");
    },
    removeFriend: async (root, args, context) => {
      if (!context.currentUser) throw new AuthenticationError(`Unauthorized`);

      try {
        await User.update(
          { _id: context.currentUser._id },
          { $pullAll: { friends: [args.id] } }
        );
      } catch (error) {
        throw new ApolloError("Action could not be completed.");
      }

      return User.findById(context.currentUser._id).populate("friends");
    },
    addUser: async (root, args) => {
      const hashedPw = await bcrypt.hash(args.password, 10);

      const newUser = new User({
        username: args.username,
        password: hashedPw,
        friends: [],
        rooms: [],
        posts: 0,
        level: 0
      });

      try {
        return await newUser.save();
      } catch (error) {
        throw new ApolloError(`${error.message}`, "500");
      }
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username }).populate(
        "friends"
      );

      if (!user) {
        throw new UserInputError("Wrong crendentials");
      }

      if (!(await bcrypt.compare(args.password, user.password)))
        throw new UserInputError("Wrong credentials");

      const userForToken = {
        username: args.username,
        id: user._id
      };

      return {
        value: jwt.sign(userForToken, JWT_SECRET)
      };
    }
  }
};

module.exports = new ApolloServer({
  cors: true,
  AuthenticationError,
  UserInputError,
  ApolloError,
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.toLowerCase().startsWith("bearer ")) {
      const decodedToken = jwt.verify(auth.substring(7), JWT_SECRET);
      const currentUser = await User.findById(decodedToken.id)
        .populate("friends")
        .populate("rooms");
      return { currentUser };
    }
  },
  dataSources: () => ({
    countriesAPI: new dataSource.CountriesAPI(),
    weatherAPI: new dataSource.WeatherAPI(),
    spaceAPI: new dataSource.SpaceAPI()
  })
});
