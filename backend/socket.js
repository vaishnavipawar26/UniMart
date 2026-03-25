import mongoose from "mongoose";
import User from "./models/user.model.js";

export const socketHandler = (io) => {
  io.on("connection", (socket) => {
    socket.on("identity", async ({ userId }) => {
      console.log("Identity event received:", userId, socket.id);

      if (!userId) {
        console.log(" userId missing in identity event!");
        return;
      }

      //  Check if userId is valid
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        console.log(" Invalid userId:", userId);
        return;
      }

      try {
        //  Update socketId & isOnline
        const user = await User.findByIdAndUpdate(
          userId,
          { socketId: socket.id, isOnline: true },
          { new: true }
        );
      } catch (error) {
        console.log(" Error updating user:", error);
      }
    });

    socket.on("disconnect", async () => {

      try {
        const user = await User.findOneAndUpdate(
          { socketId: socket.id },
          { socketId: null, isOnline: false },
          { new: true }
        );
      } catch (error) {
        console.log(" Error setting user offline:", error);
      }
    });
  });
};
