const express = require('express');
const router= express.Router();
const multer = require("multer");
const PhoneNumberController = require('../Controller/PhoneNumberController.js');

const storage = multer.memoryStorage(); // Store file in memory
const upload = multer({ storage: storage });

// Ensure the middleware is in the right order
router.post('/add', upload.single('file'), PhoneNumberController.addPhoneNumber);
router.get('/', PhoneNumberController.getPhoneNumber)
router.get('/:id', PhoneNumberController.getPhoneNumberById)
router.post('/count', PhoneNumberController.getPhoneNumberBySpecificCount)
router.put('/update/:id', PhoneNumberController.updatePhoneNumber);
router.delete('/delete/:id', PhoneNumberController.deletePhoneNumber);
router.delete('/deleteall', PhoneNumberController.deleteAllPhoneNumbers);



module.exports =router