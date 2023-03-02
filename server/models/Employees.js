import mongoose from "mongoose";

const EmployeesSchema = new mongoose.Schema({
  id: String,
  first_name: String,
  last_name: String,
  email: String,
  gender: String,
  ip_address: String,
});

const Employees = mongoose.model("Employees", EmployeesSchema);

export default Employees;
