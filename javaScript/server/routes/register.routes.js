const express = require("express");
const RegisterController = require("../controllers/Register.controller");

const router = express.Router();

router.post("/register", RegisterController);

module.exports = router;
