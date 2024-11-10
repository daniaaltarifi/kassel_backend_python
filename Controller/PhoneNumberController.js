const db = require("../config.js");
const xlsx = require("xlsx");

const addPhoneNumber = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }
  // Read the uploaded Excel file
  const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0]; // Get the first sheet
  const sheet = workbook.Sheets[sheetName];
  // Convert the sheet to JSON
  const data = xlsx.utils.sheet_to_json(sheet);
  const sqlphone = `INSERT INTO phonenumber (name, phone, location, occu) VALUES (?, ?, ?, ?)`;
  const results = [];
  const duplicateErrors = [];

  const promises = data.map(({ name, phone, location, occu }) => {
    return new Promise((resolve) => {
      db.query(sqlphone, [name, phone, location, occu], (err, result) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            duplicateErrors.push(`Phone number ${phone} already exists`); // Collect duplicates
            return resolve(); // Resolve without error
          }
          return resolve({ error: err.message }); // Resolve with error for unexpected issues
        }
        results.push({
          message: "Phone number added successfully",
          phone_id: result.insertId,
        });
        resolve(); // Resolve for successful insertion
      });
    });
  });

  try {
    await Promise.all(promises);
    if (duplicateErrors.length > 0) {
      return res
        .status(409)
        .json({
          message: "Some phone numbers were not added due to duplicates.",
          duplicates: duplicateErrors,
          results,
        });
    }
    res.json({ message: "All phone numbers processed", results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPhoneNumber = async (req, res) => {
  const sqlphone = `SELECT * FROM phonenumber`;
  db.query(sqlphone, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};
const updatePhoneNumber = async (req, res) => {
  const { id } = req.params;
  const { name, phone, location, occu } = req.body;
  const sqlphone = `UPDATE phonenumber SET name= COALESCE(?, name), phone= COALESCE(?, phone),location= COALESCE(?, location),occu= COALESCE(?, occu) WHERE id=?`;
  db.query(sqlphone, [name, phone, location, occu, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Phone number updated successfully" });
  });
};
const deletePhoneNumber = async (req, res) => {
  const { id } = req.params;
  const sqlphone = `DELETE FROM phonenumber WHERE id=?`;
  db.query(sqlphone, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Phone number deleted successfully" });
  });
};
const getPhoneNumberById = async (req, res) => {
  const { id } = req.params;
  const sqlphone = `SELECT * FROM phonenumber WHERE id=?`;
  db.query(sqlphone, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result[0]);
  });
};
const getPhoneNumberBySpecificCount = async (req, res) => {
    const { count } = req.body;
      if (!Number.isInteger(count) || count <= 0) {
      return res.status(400).json({ error: "Please provide a valid count of phone numbers." });
    }
      const sqlphone = `SELECT phone FROM phonenumber LIMIT ${count}`;
    
    db.query(sqlphone, (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(result);
    });
  };
  const deleteAllPhoneNumbers = async (req, res) => {
    const sqlphone = `DELETE FROM phonenumber`;
    db.query(sqlphone, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "All phone numbers deleted successfully" });
    });
  }
module.exports = {
  addPhoneNumber,
  getPhoneNumber,
  updatePhoneNumber,
  deletePhoneNumber,
  getPhoneNumberById,
  getPhoneNumberBySpecificCount,
  deleteAllPhoneNumbers
};
