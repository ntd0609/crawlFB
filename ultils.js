const fs = require("node:fs");
function saveLog(content) {
  fs.writeFile("logs.json", JSON.stringify(content), (err) => {
    if (err) {
      console.error(err);
    } else {
      // file written successfully
    }
  });
}
module.exports = {saveLog};
