const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Please Provide an Email Address"],
      trim: true,
      validate: {
        validator: validator.isEmail,
        message: "Please provide a valid email address",
      },
    },
    password: {
      type: String,
      required: [true, "Please Provide a Password"],
      trim: true,
      minlength: 7,
    },
    status: {
      type: String,
      default: "unpaid",
    },
  },
  { timestamps: true }
);

//Hash User Password
UserSchema.pre("save", async function () {
  const user = this;
  if (!user.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
});

//Check if password is correct
UserSchema.methods.comparePassword = async function (userPassword) {
  const user = this;
  const isMatch = await bcrypt.compare(userPassword, user.password);

  if (!isMatch) {
    throw new Error("Invalid Credentials");
  }

  return isMatch;
};

module.exports = mongoose.model("User", UserSchema);
