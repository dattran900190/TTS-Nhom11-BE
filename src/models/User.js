import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		user_id: {
			type: String,
			required: true,
			unique: true,
		},
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
		},
		password: {
			type: String,
			required: true,
			minlength: 6,
		},
		phone: {
			type: String,
			required: true,
		},
		address: {
			type: String,
			required: true,
		},
		role_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Role",
			required: true,
		},
	},
	{
		timestamps: true, // Tự động tạo createdAt và updatedAt
		versionKey: false,
	}
);

const User = mongoose.model("User", userSchema);

export default User;
