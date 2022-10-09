const express = require("express");
const multiparty = require("multiparty");
const fs = require("fs");
const { writeFileByfs } = require("./utils/helpers");
const app = express();
const port = 4000;
function getTime() {
  return new Date().toLocaleString();
}

app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

app.get("/", (req, res) => {
  console.log("请求接口为：/");
  res.send("ok");
});

app.post("/api/upload", (req, res) => {
  console.log(getTime() + "----收到上传文件请求");

  function showReqFormData() {
    var postData = "";
    req.on("data", (chunk) => {
      postData += chunk;
    });

    req.on("end", () => {
      console.log("postData" + postData);
    });
  }

  function parse() {
    const form = new multiparty.Form();
    console.log(getTime() + "----开始解析请求");
    form.parse(req, (err, field, files) => {
      if (err) {
        console.error(getTime() + "----解析文件失败----" + err);
        res.send("Error-->" + err);
        return;
      }
      if (!fs.existsSync("./source")) {
        fs.mkdirSync("./source");
      }
      // console.log("field", field);

      // console.log("files", files);

      if (files && Object.keys(files).length === 0) {
        console.log(getTime() + "----没有上传任何文件");
        res.send("没有上传任何文件");
        return;
      }

      writeFileByfs(files)
        .then((_res) => {
          console.log("上传文件成功", _res);
          res.status(200);
          res.send("OK");
        })
        .catch((_err) => {
          console.log("上传文件失败", _err);
          res.status(500);
          res.send("Error");
        });
    });
  }

  parse();
});

// 流式上传
app.post("/api/uploadForStream",(req,res) => {
    req.on("data",(chunk) => {
      console.log("收到数据",chunk);
    })
})

app.get("/api/download", (req, res) => {
  console.log("/api/download 收到请求");
  const readable = fs.createReadStream("./source/1663319152418-invoice_02.pdf",{highWaterMark:10});
  readable.pipe(res);
  readable.on("end",() => {
    console.log("结束了")
  })

  // 返回文件流

  // 返回字符串流
  // let count = 0;
  // const str =
  //   "你好啊 你好啊你好啊 你好啊你好啊 你好啊你好啊 你好啊你好啊 你好啊你好啊 你好啊你好啊 你好啊你好啊 你好啊你好啊 你好啊你好啊 你好啊你好啊 你好啊你好啊 你好啊你好啊 你好啊你好啊 你好啊你好啊 你好啊你好啊 你好啊你好啊 你好啊你好啊 你好啊你好啊 你好啊你好啊 你好啊你好啊 你好啊你好啊 你好啊你好啊 你好啊你好啊 你好啊你好啊 你好啊你好啊 你好啊你好啊 你好啊你好啊 你好啊你好啊 你好啊你好啊 你好啊你好啊 你好啊你好啊 你好啊你好啊 你好啊你好啊 你好啊你好啊 你好啊你好啊 你好啊你好啊 你好啊你好啊 你好啊你好啊 你好啊你好啊 你好啊你好啊 你好啊你好啊 你好啊你好啊 你好啊你好啊 你好啊你好啊 你好啊你好啊 你好啊你好啊 你好啊你好啊 你好啊你好啊 你好啊你好啊 你好啊你好啊 你好啊你好啊 你好啊你好啊 你好啊你好啊 你好啊你好啊 你好啊你好啊 你好啊你好啊 你好啊你好啊 你好啊你好啊 你好啊你好啊 你好啊你好啊 你好啊你好啊 你好啊";
  // setInterval(() => {
  //   if (count > str.length - 1) {
  //     res.end();
  //     return;
  //   }
  //   res.write(str[count++]);
  // }, 1000);
});

app.get("/api/ArrayBuffer", (req, res) => {
  console.log("/api/ArrayBuffer收到请求");
  res.end(Buffer.from([12,14,39,30]));
});

app.get("/api/get", (req, res) => {
  console.log("/api/get收到请求");
  // res.writeHead(200, { "Content-Type": "application/octet-stream" });
  // res.write("你好");
  // res.end();
  res.send("Http For GetMethod is ok!!!!");
});

app.post("/api/post", (req, res) => {
  res.send("Http For PostMethod is ok!!!!");
});

app.put("/api/put", (req, res) => {
  console.log("/api/put收到请求");

  res.send("Http For PutMethod is Ok!!!!");
});

app.options("/api/options", (req, res) => {
  res.send("Http For OptionsMethod is Ok!!!!");
});

app.listen(4000, () => {
  console.log("server start sucess. Host: http://localhost:4000");
});
