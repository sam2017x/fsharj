const mongoose = require("mongoose");
const express = require("express");
const http = require("http");
const server = require("./services/apolloserver");

const PORT = process.env.PORT || 4000;

const app = express();

if (process.env.NODE_ENV !== "development") {
  app.use(express.static("../client/build"));
}

server.applyMiddleware({ app });

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

mongoose.set("useFindAndModify", false);

const MONGODB_URI = `mongodb+srv://fs:fs@cluster0-tjvic.mongodb.net/AppMashup?retryWrites=true`;
//const MONGODB_URI = `mongodb://localhost:27017/ChatApp?retryWrites=true`;

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true })
  .then(() => console.log("connected to MongoDB"))
  .catch(error => console.log(error.message));

/*server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`Server running at ${url}`);
  console.log(`Subscriptions active at ${subscriptionsUrl}`);
});*/

httpServer.listen(PORT, () => {
  console.log(`Server ready at http://localhost:${PORT}${server.graphqlPath}`);
  console.log(
    `Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`
  );
});
