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
    addUser(username: String!, password: String!): User
    login(username: String!, password: String!): Token
    addFriend(id: ID!): User
  }

  type User {
    username: String!
    password: String
    posts: Int
    level: Int
    friends: [User]
    id: ID!
  }

  type Token {
    value: String!
    username: String!
    id: ID!
    friends: [User]
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
      console.log("MEEE", context.currentUser);
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
      console.log("userWithFriends", userWithFriends);
      return userWithFriends;
    },
    addUser: async (root, args) => {
      const hashedPw = await bcrypt.hash(args.password, 10);

      const newUser = new User({
        username: args.username,
        password: hashedPw,
        friends: [],
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
      const user = await User.findOne({ username: args.username });

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
        friends: user.friends
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
      const currentUser = await User.findById(decodedToken.id);
      return { currentUser };
    }
  }
});

server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`Server running at ${url}`);
  console.log(`Subscriptions active at ${subscriptionsUrl}`);
});
