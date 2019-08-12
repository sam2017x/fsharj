const jwt = require("jsonwebtoken");
const { PubSub } = require("apollo-server");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const axios = require("axios");
const dataSource = require("./datasource");

const pubsub = new PubSub();
const {
  ApolloServer,
  gql,
  UserInputError,
  AuthenticationError,
  ApolloError
} = require("apollo-server");
const User = require("./models/user");
const Room = require("./models/room");
const Message = require("./models/message");

mongoose.set("useFindAndModify", false);

const MONGODB_URI = "mongodb://localhost:27017/ChatApp?retryWrites=true";
const JWT_SECRET = "NEED_HERE_A_SECRET_KEY";

const weatherApi =
  "http://api.apixu.com/v1/current.json?key=16fe37087cea4422a8500301191903&q=";

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true })
  .then(() => console.log("connected to MongoDB"))
  .catch(error => console.log(error.message));

const typeDefs = gql`
  type Query {
    allUsers: [User]
    me: User
    getUserInfo(username: String): User
    getChatroomInfo(id: String): Room
    getCountries: [Country]
  }

  type Mutation {
    createRoom(senderId: String, receiverId: String, title: String): Room
    addUser(username: String!, password: String!): User
    login(username: String!, password: String!): Token
    addFriend(id: ID!): User
    sendMessage(roomId: String, message: String): Message
  }

  type Country {
    name: String
    alpha2Code: String
  }

  type User {
    username: String!
    password: String
    posts: Int
    level: Int
    rooms: [Room]
    friends: [User]
    id: ID!
  }

  type Room {
    users: [User]
    messages: [Message]
    title: String
    id: ID!
  }

  type Message {
    id: ID!
    message: String
    sender: User
    date: String
    room: Room
  }

  type Token {
    value: String!
    username: String!
    id: ID!
    friends: [User]!
    posts: Int
    level: Int
  }
`;

const resolvers = {
  Query: {
    getCountries: async (root, args, { dataSources }) => {
      /*const ok = await axios.get(
        "https://wft-geo-db.p.rapidapi.com/v1/geo/countries",
        {
          headers: {
            "x-rapidapi-host": "wft-geo-db.p.rapidapi.com",
            "x-rapidapi-key":
              "725dc16711mshb82b0d640fd1243p1febfbjsn804312b8f0d2"
          }
        }
      );

      console.log("geodb", ok.data);*/

      return dataSources.countriesAPI.getAllCountries();
    },
    /*getCountries: async (root, args, context) => {
      if (!context.currentUser) throw new AuthenticationError("Unauthorized.");

      try {
        const response = await axios.get(
          "https://restcountries.eu/rest/v2/all"
        );

        return response.data.map(country => {
          return {
            value: country
          };
        });
      } catch (error) {
        throw new ApolloError("Error while fetching countries.");
      }
    },
    getWeatherData: async (root, args, context) => {
      if (!args.city) throw new UserInputError("Invalid args.", args);

      if (!context.currentUser) throw new AuthenticationError("Unauthorized.");

      try {
        const response = await axios.get(`weatherApi${args.city}`);
        return { value: response.data };
      } catch (error) {
        throw new ApolloError("Error while fetching weather data.");
      }
    },*/
    getChatroomInfo: async (root, args, context) => {
      if (!args.id) throw new UserInputError("Invalid args.", args);
      if (!context.currentUser) throw new AuthenticationError("Unauthorized.");
      try {
        const room = await Room.findById(args.id)
          .populate("users")
          .populate({ path: "messages", populate: { path: "sender" } });
        if (!room.users.map(user => user.id).includes(context.currentUser._id))
          throw new AuthenticationError("Unauthorized.");

        return room;
      } catch (error) {
        return new ApolloError("Database error.");
      }
    },
    allUsers: async (root, args) => {
      console.log(
        await User.find({})
          .populate("friends")
          .populate("rooms")
      );
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
    sendMessage: async (root, args, context) => {
      if (!context.currentUser) throw new AuthenticationError("Unauthorized.");
      if (args.message.length === 0)
        throw new UserInputError("The message cannot be null.");

      console.log("SENDMSG", args);

      const theroom = await Room.findById(args.roomId);

      const createMessage = new Message({
        message: args.message,
        sender: context.currentUser._id,
        date: new Date(),
        room: theroom._id
      });

      try {
        await createMessage.save();
        const msgToRoom = await Room.findById(args.roomId);
        msgToRoom.messages = msgToRoom.messages.concat(createMessage._id);
        await msgToRoom.save();
        console.log("RETURNED MESSAGE", createMessage);
        return Message.findById(createMessage._id).populate("sender");
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
      const userWithFriends = await User.findById(
        context.currentUser._id
      ).populate("friends");
      return userWithFriends;
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

const server = new ApolloServer({
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
    countriesAPI: new dataSource.CountriesAPI()
  })
});

server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`Server running at ${url}`);
  console.log(`Subscriptions active at ${subscriptionsUrl}`);
});
