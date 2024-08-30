import mongoose from "mongoose";
import "dotenv/config";
import {usersService} from '../services/index.js';

const dbConnection = async () => {
  try {
    console.log(process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await usersService.seedDeleteUser();
      console.log("Seed deleteUser object operation completed successfully");
    } catch (seedError) {
      console.error("Error in seedDeleteUser operation:", seedError);
    }
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
