const express = require("express");
const RegisterController = require("../controllers/Register.controller");

const router = express.Router();

router.post("/register", RegisterController);
router.get("/register", RegisterController);

module.exports = router;
