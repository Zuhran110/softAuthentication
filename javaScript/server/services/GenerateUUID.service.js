const { v4: UUID } = require("uuid");

function GenerateUUIDService() {
  const newID = UUID();
  return newID;
}

module.exports = GenerateUUIDService;
