const { v4: uuidv4 } = require("uuid");

function GenerateUUIDService() {
  return uuidv4();
}

module.exports = GenerateUUIDService;
