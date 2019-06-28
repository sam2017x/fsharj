const jwt = require("jsonwebtoken");
const { PubSub } = require("apollo-server");
const bcrypt = require("bcrypt");
const mongoose = require('mongoose')
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
  }

  type Mutation {
    addUser(username: String!, password: String!): User
    login(username: String!, password: String!): Token
  }

  type User {
    username: String!
    password: String!
    id: ID!
  }

  type Token {
    value: String!
    username: String!
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

      const pw = await bcrypt.compare(args.password, user.password);

      if (!user || !pw) {
        throw new UserInputError("wrong crendentials");
      }

      const userForToken = {
        username: args.username,
        id: user._id
      };

      return {
        value: jwt.sign(userForToken, JWT_SECRET),
        username: args.username
      };
    }
  }
};

const server = new ApolloServer({
  cors: true,
  AuthenticationError,
  UserInputError,
  typeDefs,
  resolvers
});

server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`Server running at ${url}`);
  console.log(`Subscriptions active at ${subscriptionsUrl}`);
});
