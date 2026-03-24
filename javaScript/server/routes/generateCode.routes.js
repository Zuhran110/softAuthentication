const express = require("express");
const GenerateCodeController = require("../controllers/GenerateCode.controller");

const router = express.Router();

router.post("/generate-code", GenerateCodeController);

module.exports = router;
