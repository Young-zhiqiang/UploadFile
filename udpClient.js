import dgram from "dgram";
import { Buffer } from "buffer";

const message = Buffer.from("Some bytes");
const client = dgram.createSocket("udp4");
client.send(message, 25264, "53h5916947.imdo.co", (err) => {});
client.on("message", (msg) => {
  console.log("收到服务端消息", msg.toString());
});
