const fs = require("fs");
const path = require("path");
function writeFileByfs(files) {
  var keys = Object.keys(files),
    promises = [];
  function generatePromise(file) {
      return new Promise((resolve, reject) => {
        const fileName = file[0].fieldName;
        const filePath = file[0].path;
        console.log(fileName + "文件正在写入...")
        const writable = fs.createWriteStream(
          path.resolve(__dirname, "../source/" + Date.now() + "-" + fileName)
        );
        const readable = fs.createReadStream(filePath);
        readable.pipe(writable);
        readable.on("end", () => {
          resolve(true);
        });
        // readable.on("error", () => {
        //   reject(false);
        // });
      });
  }

  for (let i = 0; i < keys.length; i++) {
    promises.push(generatePromise(files[keys[i]]));
  }

  return Promise.all(promises);
}

module.exports = {
  writeFileByfs,
};
