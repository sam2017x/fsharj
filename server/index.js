const jwt = require("jsonwebtoken");
const { PubSub } = require("apollo-server");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const pubsub = new PubSub();
const {
  ApolloServer,
  gql,
  UserInputError,
  AuthenticationError
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
    allUsers: [User]!
    me: User
    getUserInfo(username: String): User
  }

  type Mutation {
    addUser(username: String!, password: String!): User
    login(username: String!, password: String!): Token
  }

  type User {
    username: String!
    password: String!
    posts: Int
    level: Int
    friends: [User]
    id: ID!
  }

  type Token {
    value: String!
    username: String!
    id: ID!
  }
`;

const resolvers = {
  Query: {
    allUsers: async (root, args) => {
      try {
        return await User.find({});
      } catch (error) {
        throw new Error(error.message);
      }
    },
    me: async (root, args, context) => {
      return context.currentUser;
    },
    getUserInfo: async (root, args) => {
      if (args.username) {
        try {
          return await User.findOne({ username: args.username });
        } catch (error) {
          throw new Error(error.message);
        }
      }
      return null;
    }
  },
  Mutation: {
    addUser: async (root, args) => {
      const hashedPw = await bcrypt.hash(args.password, 10);

      const newUser = new User({
        username: args.username,
        password: hashedPw
      });

      try {
        return await newUser.save();
      } catch (error) {
        throw new Error(error.message);
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
        id: user._id
      };
    }
  }
};

const server = new ApolloServer({
  cors: true,
  AuthenticationError,
  UserInputError,
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
