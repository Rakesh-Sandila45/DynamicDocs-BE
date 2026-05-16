import { Schema, model, mongoose } from "mongoose";

const UserSchema = new Schema({
  name: { type: String },
  mobile: { type: String, unique: true },
  userType: { type: String, default: "User" },
  documents: {
    type: [String],
    default: ["SampleOfferLetter", "SampleTerminationLetter"],
  },
});

export default model("User", UserSchema);
