import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
  role_id: { type: String, required: true, unique: true },
  name: String,
  description: String
}, { timestamps: true });

const Role = mongoose.model("Role", roleSchema);
export default Role;
