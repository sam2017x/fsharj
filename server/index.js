const jwt = require("jsonwebtoken");
const { PubSub } = require("apollo-server");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

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

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true })
  .then(() => console.log("connected to MongoDB"))
  .catch(error => console.log(error.message));

const typeDefs = gql`
  type Query {
    allUsers: [User]
    me: User
    getUserInfo(username: String): User
  }

  type Mutation {
    createRoom(user1: String, user2: String, title: String): Room
    addUser(username: String!, password: String!): User
    login(username: String!, password: String!): Token
    addFriend(id: ID!): User
  }

  type User {
    username: String!
    password: String
    posts: Int
    level: Int
    rooms: [Room]!
    friends: [User]!
    id: ID!
  }

  type Message {
    message: String
    sender: User
    timestamp: String
  }

  type Room {
    users: [User]!
    messages: [String]
    title: String
    id: ID!
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
    allUsers: async (root, args) => {
      try {
        return await User.find({}).populate("friends", {
          username: 1,
          posts: 1,
          level: 1,
          id: 1
        });
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
            "friends",
            {
              username: 1,
              posts: 1,
              id: 1,
              level: 1
            }
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
    createRoom: async (root, args, context) => {
      if (!context.currentUser) throw new AuthenticationError("Unauthorized.");
      if (!args.user1 || !args.user2) throw new UserInputError("Invalid args.");

      console.log("INC ARGS", args);

      const sender = await User.findById(args.senderId);
      const receiver = await User.findById(args.receiverId);

      const receiverRoomIds = receiver.rooms.map(room => room.id);

      const existingRoom = sender.rooms.filter(room =>
        receiverRoomIds.includes(room)
      );

      console.log("EXISTING ROOM", existingRoom);

      if (existingRoom > 0) return existingRoom;

      const newRoom = new Room({
        users: [sender, receiver],
        messages: [],
        title: args.title || null
      });

      console.log("CREATED ROOM", newRoom);

      try {
        await newRoom.save();
        sender.rooms = sender.rooms.concat(newRoom._id);
        await sender.save();
        receiver.rooms = receiver.rooms.concat(newRoom._id);
        await receiver.save();
      } catch (error) {
        throw new ApolloError("Document not found.");
      }

      return newRoom;
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
      ).populate("friends", { username: 1, posts: 1, level: 1, id: 1 });
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
        "friends",
        { username: 1, id: 1, posts: 1, level: 1 }
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
        value: jwt.sign(userForToken, JWT_SECRET),
        username: args.username,
        id: user._id,
        posts: user.posts,
        level: user.level,
        friends: user.friends,
        rooms: user.rooms
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
      const currentUser = await User.findById(decodedToken.id).populate(
        "friends",
        { username: 1, posts: 1, id: 1, level: 1 }
      );
      return { currentUser };
    }
  }
});

server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`Server running at ${url}`);
  console.log(`Subscriptions active at ${subscriptionsUrl}`);
});
