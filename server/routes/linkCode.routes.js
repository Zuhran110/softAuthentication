const express = require("express");
const LinkCodeController = require("../controllers/LinkCode.controller");

const router = express.Router();

router.post("/link-code", LinkCodeController);

module.exports = router;
