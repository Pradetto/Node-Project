import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
};

export const logout = async (req, res) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded._id;
    const user = await User.findById(userId);
    user.tokens = user.tokens.filter((tokenObj) => tokenObj.token !== token);
    await User.updateOne({ _id: user._id }, { $set: { tokens: user.tokens } });

    res.send();
  } catch (e) {
    res.status(500).send();
  }
};

export const checkAuth = async (req, res) => {
  res.json(req.user);
};
