import Tower from "../models/TowerModel.js";
import { GenerateJwt } from "../utils/helper.js";
import bcrypt from "bcryptjs";
import Employee from "../models/EmployeModel.js";

//register employee
export const registerEmployee = async (req, res) => {
  try {
    const { name, email, password, towerNumber, mobileNumber, carNumber } =
      req.body;

    if (
      !name ||
      !email ||
      !password ||
      !towerNumber ||
      !mobileNumber ||
      !carNumber
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    if (
      [name, email, password, mobileNumber, carNumber].some(
        (field) => typeof field !== "string" || field.trim() === ""
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid input for one or more fields",
      });
    }

    // Validate towerNumber is a number
    if (typeof towerNumber !== "number") {
      return res.status(400).json({
        success: false,
        message: "TowerNumber must be a number",
      });
    }

    // Check if the email already exists
    const existedUser = await Employee.findOne({ email });
    if (existedUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // Check if the mobile number already exists
    const existMobilenumber = await Employee.findOne({ mobileNumber });
    if (existMobilenumber) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this mobile number",
      });
    }

    // Find the tower with the given tower number
    const tower = await Tower.findOne({ towerNumber });
    if (!tower) {
      return res.status(404).json({
        success: false,
        message: "Tower not found with the given tower number",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newEmployee = new Employee({
      name,
      email,
      password: hashedPassword,
      assignedTower: tower._id,
      mobileNumber,
      carNumber,
    });

    await newEmployee.save();

    // Add the employee to the tower's assignedEmployees array
    tower.assignedEmployees.push(newEmployee._id);
    await tower.save();

    // Create a new object without the password field
    const employeeWithoutPassword = newEmployee.toObject();
    delete employeeWithoutPassword.password;

    return res.status(200).json({
      success: true,
      data: employeeWithoutPassword,
      message: "Employee created successfully and assigned to tower",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message:
        "Error occurred while creating user. Check registerEmployee controller",
    });
  }
};

// login employee

export const loginEmployee = async (req, res) => {
  const { email, password, location } = req.body;

  if (!email || !password) {
    return res
      .status(200)
      .json({ success: false, message: "Please provide email and password" });
  }
  if ([email, password].some((field) => field.trim() === "")) {
    return res.status(200).json({
      success: false,
      message: "Please provide valid email and password",
    });
  }
  const check = await Employee.findOne({ email });
  if (!check) {
    return res.status(400).json({
      seccess: false,
      message: "User not found with this email",
    });
  }

  const checkPassword = bcrypt.compare(password, check.password);
  if (!checkPassword) {
    return res
      .status(200)
      .json({ success: false, message: "Password does not match" });
  }

  if (
    typeof location !== "object" ||
    location.type !== "Point" ||
    !Array.isArray(location.coordinates) ||
    typeof location.coordinates[0] !== "number" ||
    typeof location.coordinates[1] !== "number"
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Please provide a valid location with type 'Point' and coordinates [longitude, latitude]",
    });
  }

  check.location = location;

  await check.save();

  const token = GenerateJwt(check.id);
  return res.status(200).json({
    success: true,
    message: "Employee login successfully",
    token: token,
    location: location,
  });
};
