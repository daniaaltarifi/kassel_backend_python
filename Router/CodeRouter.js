const express = require('express');
const router= express.Router();
const CodeController = require('../Controller/CodeController.js');


router.post('/add', CodeController.addCode);
router.post('/verifycode', CodeController.verifyCodes );
router.get('/verifyuserhascode/:user_id', CodeController.getusersCodes );
router.get('/getbyid/:id', CodeController.getCodeById)

router.get('/', CodeController.getCodes)
router.put('/update/:id', CodeController.updateCodes);
router.delete('/delete/:id', CodeController.deleteCodes);


module.exports =router