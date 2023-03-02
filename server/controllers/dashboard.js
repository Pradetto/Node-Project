import Employees from "../models/Employees.js";

export const getEmployees = async (req, res) => {
  try {
    // throw new Error(
    //   "This is a custom error message coming from the Backened :) unblock throw new Error above"
    // );
    const user = await Employees.find();
    res.status(200).json(user);
  } catch (err) {
    // console.log(err);
    const errorMessage =
      "custom message from backend: something failed to fetch all";
    res.status(404).json({ message: err.message });
    // res.status(404).json({ message: errorMessage });
  }
};
