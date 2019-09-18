const mongoose = require("mongoose");
const express = require("express");
const server = require("./services/apolloserver");

const app = express();

app.use(express.static("./build"));

mongoose.set("useFindAndModify", false);

const MONGODB_URI = `mongodb+srv://fs:fs@cluster0-tjvic.mongodb.net/AppMashup?retryWrites=true`;
//const MONGODB_URI = `mongodb://localhost:27017/ChatApp?retryWrites=true`;

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true })
  .then(() => console.log("connected to MongoDB"))
  .catch(error => console.log(error.message));

server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`Server running at ${url}`);
  console.log(`Subscriptions active at ${subscriptionsUrl}`);
});

app.listen({ port: 3000 }, () => console.log("App operating on port 3000."));
