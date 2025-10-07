import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
});

export default mongoose.model("Image", imageSchema);