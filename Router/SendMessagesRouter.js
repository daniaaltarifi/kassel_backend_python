const express = require('express');
const router= express.Router();
const SendMessagesController = require('../Controller//SendMessagesController.js');
const multer = require("multer");
const path = require("path");
const fs = require("fs");
// Custom storage engine
const customStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images'); // Destination folder
  },
  filename: (req, file, cb) => {
    // Generate the filename
    const filename = file.originalname;
    const filePath = path.join('images', filename);

    // Check if the file already exists
    if (fs.existsSync(filePath)) {
      // If file exists, return the existing filename
      cb(null, filename);
    } else {
      // If file doesn't exist, save it with the given filename
      cb(null, filename);
    }
  }
});

// Middleware to handle file upload
const upload = multer({
  storage: customStorage,
  fileFilter: (req, file, cb) => {
    // Optionally, you can filter file types if needed
    cb(null, true);
  }
});
// const storage = multer.memoryStorage(); // Store files in memory

// const upload = multer({
//     storage: storage,
//     fileFilter: (req, file, cb) => {
//         const filetypes = /xlsx|xls/; // Accept only Excel files
//         const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//         cb(null, extname);
//     },
//     limits: { fileSize: 10 * 1024 * 1024 } // Limit file size to 10MB
// })

router.post('/add',upload.fields([{ name: 'imageFile', maxCount: 10 }]), SendMessagesController.sendMessage);

// router.post('/add',upload.fields([{ name: 'phoneFile', maxCount: 1 },{ name: 'imageFile', maxCount: 10 }]), SendMessagesController.sendMessage);



module.exports =router