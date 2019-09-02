const { gql } = require("apollo-server");

module.exports = gql`
  type Query {
    allUsers: [User]
    me: User
    getUserInfo(username: String): User
    getChatroomInfo(id: String): Room
    getCountries: [Country]
    getLaunchData: Launch
  }

  type Mutation {
    createRoom(senderId: String, receiverId: String, title: String): Room
    addUser(username: String!, password: String!): User
    login(username: String!, password: String!): Token
    addFriend(id: ID!): User
    sendMessage(roomId: String, message: String): Message
    getWeatherData(capital: String): Weather
    removeMessage(id: ID): Message
  }

  type Subscription {
    newMessage: Message!
  }

  type Weather {
    value: String
  }

  type Launch {
    value: String
  }

  type Country {
    name: String
    alpha2Code: String
    capital: String
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
