// 创建文件
function CreateFile() {
  const fs = require("fs");
  const path = require("path");
  const writable = fs.createWriteStream(
    path.resolve(__dirname, "./1663230501871-t1.txt")
  );

  for (let i = 0; i < 300000; i++) {
    writable.write("Hello Node!!!!!!!!\n");
  }
}

// 上传文件——Node（测试Axios的进度回调能力）
function AxiosUploadFileForNodePlatform() {
  const fs = require("fs");
  const axios = require("axios").default;
  const FormData = require("form-data");
  const path = require("path");

  var localFile = fs.createReadStream(
    path.resolve(__dirname, "./1663230501871-t1.txt")
  );

  var formData = new FormData();
  formData.append("key", "1663230501871-t1.txt");
  formData.append("file", localFile);

  var headers = formData.getHeaders(); //获取headers
  //获取form-data长度
  formData.getLength(function (err, length) {
    if (err) {
      console.log(1, err);

      return;
    }

    //设置长度，important!!!
    headers["content-length"] = length;

    axios({
      url: "http://localhost:4000/api/upload",
      data: formData,
      method: "post",

      onUploadProgress(progress) {
        console.log(Math.round((progress.loaded / progress.total) * 100) + "%");
      },
    })
      .then((res) => {
        console.log("上传成功", res.data);
      })
      .catch((err) => {
        console.log("上传失败", err);
      });
  });
}



// 下载文件（测试流式下载）
function downloadFile_stream() {
  console.log("开始请求");
  const http = require("http");
  const fs = require("fs");
  const path = require("path");

  const req = http.get("http://localhost:4000/api/download", (res) => {
    console.log(res.statusCode);
    const writable = fs.createWriteStream(
      path.resolve(__dirname, "./2.txt")
    );

    res.on("data", (chunk) => {
      console.log("客户端接收数据：", chunk);
      writable.write(chunk);
    });
    res.on("end", () => {
      console.log("end触发");
    });
    res.on("error", () => {
      console.log("error触发");
    });

    res.on("close", () => {
      console.log("close触发");
    });
    res.on("pause", () => {
      console.log("pause触发");
    });
  });
  
}



// 普通请求（测试服务端返回ArrayBuffer）
function defaultRequest(){
    const http = require("http")
    http.get("http://localhost:4000/api/ArrayBuffer",(res) => {
      res.on("readable",() => {
        let data;
        while((data = res.read()) != null){
            console.log(data);
        }
      })
    })
}

// http流式上传文件
function uploadFileForStream(){
  const http = require("http");
  const fs  = require("fs");
  const path = require("path");
  const options = {
    hostname: 'localhost',
    port: 4000,
    path: '/api/uploadForStream',
    method: 'POST',
    
  };
  const writable = http.request(options,(res) => {
    console.log("客户端成功返回");
  });
  

  fs.createReadStream(path.resolve(__dirname,"./1663230501871-t1.pdf"),{highWaterMark:20}).pipe(writable);
  

}

uploadFileForStream()

