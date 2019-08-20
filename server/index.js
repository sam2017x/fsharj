const mongoose = require("mongoose");
const server = require("./services/apolloserver");

mongoose.set("useFindAndModify", false);

const MONGODB_URI = "mongodb://localhost:27017/ChatApp?retryWrites=true";

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true })
  .then(() => console.log("connected to MongoDB"))
  .catch(error => console.log(error.message));

server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`Server running at ${url}`);
  console.log(`Subscriptions active at ${subscriptionsUrl}`);
});
