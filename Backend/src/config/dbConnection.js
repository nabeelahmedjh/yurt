import mongoose from "mongoose";
import "dotenv/config";

const dbConnection = async () => {
  try {
    console.log(process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.log(error);
  }

  mongoose.connection.on("connected", () => {
    console.log("Mongo has connected succesfully");
  });
  mongoose.connection.on("reconnected", () => {
    console.log("Mongo has reconnected");
  });
  mongoose.connection.on("error", (error) => {
    console.log("Mongo connection has an error", error);
    mongoose.disconnect();
  });
  mongoose.connection.on("disconnected", () => {
    console.log("Mongo connection is disconnected");
  });
};

export { dbConnection };
