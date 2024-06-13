import mongoose from "mongoose";

export async function connect() {
  try {
    mongoose.connect(process.env.MONGO_URL!);
    const connection = mongoose.connection;
    connection.on("connected", () => {});
    connection.on("error", (error) => {
      console.log(error);
      process.exit();
    });
  } catch (error) {
    console.log(error);
  }
}
