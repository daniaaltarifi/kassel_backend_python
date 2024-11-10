const db = require("../config.js");
const dotenv = require("dotenv");
dotenv.config(".env");
const SECRETTOKEN = process.env.SECRETTOKEN;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const saltRounds = 10; // Define your salt rounds

const signUp = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const checkEmailSql = "SELECT email FROM login WHERE email = ?";
    const [existingUser] = await new Promise((resolve, reject) => {
      db.query(checkEmailSql, [email], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });

    if (existingUser) {
      return res.status(400).json("Email already exists");
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const insertSql =
      "INSERT INTO login (`name`, `email`, `password`, `role`) VALUES (?)";
    const values = [name, email, hashedPassword, role || 'user'];
    db.query(insertSql, [values], (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ Error: "Inserting data error in server" });
      }
      return res.json({ Status: "SignUp Success" });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ Error: "Internal server error" });
  }
};
const login = async (req, res) => {
  const { email, password, device_type } = req.body;
  const sql = "SELECT * FROM login WHERE email = ?";
  db.query(sql, [email], (err, data) => {
    if (err) {
      return res.json({ Error: "Login error in server" });
    }
    if (data.length > 0) {
      bcrypt.compare(password.toString(), data[0].password, async (err, response) => {
        if (err) return res.json({ Error: "Password compare error" });
        if (response) {
          const { id, name, role } = data[0];

          const handleLoginSuccess = () => {
            const token = jwt.sign({ id, name, role }, SECRETTOKEN, { expiresIn: "1d" });
            res.cookie("token", token, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              maxAge: 24 * 60 * 60 * 1000,
              sameSite: "Strict",
            });
            return res.json({ Status: "Login Success", role, id });
          };
          // If the user is an admin, proceed without device type check
          if (role === 'admin') {
            return handleLoginSuccess();
          }
          // Regular user logic with device type check
          if (!device_type) {
            return res.json({ Status: "Failed", Error: "UnAuthorized Access." });
        }
          let existingDevices = data[0].device_type ? JSON.parse(data[0].device_type) : [];
          if (!Array.isArray(existingDevices)) {
            existingDevices = [];
          }
          const deviceExists = existingDevices.some(device =>
            device.deviceType && 
            device.deviceType.deviceType === device_type.deviceType &&
            device.deviceType.os === device_type.os &&
            device.deviceType.osVersion === device_type.osVersion &&
            device.deviceType.browser === device_type.browser &&
            device.deviceType.browserVersion === device_type.browserVersion
          );
          if (existingDevices.length >= 2 && !deviceExists) {
            return res.json({ Status: "Failed", Error: "Login not allowed from this device" });
          }
          if (!deviceExists) {
            existingDevices.push({ deviceType: device_type });
            if (existingDevices.length > 2) {
              existingDevices = existingDevices.slice(0, 2);
            }
            const updatedDeviceTypes = JSON.stringify(existingDevices);
            const updateSql = "UPDATE login SET device_type = ? WHERE email = ?";
            db.query(updateSql, [updatedDeviceTypes, email], (err) => {
              if (err) {
                return res.json({ Error: "Error updating device type" });
              }
            });
          }
          return handleLoginSuccess();
        } else {
          return res.json({ Status: "Failed", Error: "Incorrect Password" });
        }
      });
    } else {
      return res.json({ message: "Email Not Found", Error: "No email exists" });
    }
  });
};



const logout = async (req, res) => {
    res.clearCookie("token", { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    return res.json({ Status: "Logout Success" });
  };
  const getUser = async (req, res) => {
    const sqlget="SELECT id, name, email FROM login"
    db.query(sqlget, (err, data) => {
      if (err) {
        return res.json({ Error: "Fetching data error in server" });
      }
      res.json(data);
    })
  }
  const deleteUser = async (req, res) => {
    const { id } = req.params;
    const sqlDelete = "DELETE FROM login WHERE id =?";
    db.query(sqlDelete, [id], (err, result) => {
      if (err) {
        console.error("Error deleting data:", err);
        return res.status(500).json({ message: err.message });
      }
      res.status(200).json({ message: "User Deleted successfully" });
    });
  }



module.exports = { signUp, login, logout,getUser, deleteUser };
