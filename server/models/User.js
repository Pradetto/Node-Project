import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import validator from "validator";

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.tokens;
        delete ret.password;
        delete ret.id;
        delete ret.createdAt;
        delete ret.updatedAt;
        return ret;
      },
    },
  }
);

// Hash the password before saving it to the database
UserSchema.pre("save", async function (next) {
  const user = this;

  // if (!this.isNew && !this.isModified()) {
  //   return next();
  // }

  if (!user.email || !user.password) {
    throw new Error("All fields must be filled");
  }

  if (!validator.isEmail(user.email)) {
    throw new Error("This is not a valid email");
  }

  // if (!validator.isStrongPassword(user.password)) {
  //   throw new Error("Password not strong enough");
  // }

  // Check if a user with the same email already exists
  const existingUser = await User.findOne({ email: user.email });
  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

// Generate a JSON Web Token for the user
UserSchema.methods.generateAuthToken = async function () {
  const user = this;

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "5m",
  });

  const maxTokens = 5;

  user.tokens = user.tokens.filter((t) => {
    try {
      const decoded = jwt.verify(t.token, process.env.JWT_SECRET);
      return true;
    } catch (e) {
      return false;
    }
  });

  if (user.tokens.length >= maxTokens) {
    user.tokens.shift();
  }

  user.tokens.push({ token });

  await User.updateOne({ _id: user._id }, { $set: { tokens: user.tokens } });
  // console.log("here are the new tokens", user.tokens);
  return token;
};

// Custom findByCredentials
UserSchema.statics.findByCredentials = async (email, password) => {
  if (!email || !password) {
    throw new Error("All fields must be filled");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User does not exist");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Password is incorrect");
  }

  return user;
};

// UserSchema.methods.updatePassword = async function (
//   currentPassword,
//   newPassword
// ) {
//   const user = this;

//   const isMatch = await bcrypt.compare(currentPassword, user.password);
//   if (!isMatch) {
//     throw new Error("Current password is incorrect");
//   }

//   user.password = await bcrypt.hash(newPassword, 8);

//   await user.save();

//   return user;
// };

// export const updatePassword = async (req, res) => {
//   const { currentPassword, newPassword } = req.body;

//   try {
//     const user = await req.user.updatePassword(currentPassword, newPassword);
//     res.send(user);
//   } catch (e) {
//     res.status(400).send({ message: e.message });
//   }
// };

const User = mongoose.model("User", UserSchema);

export default User;
