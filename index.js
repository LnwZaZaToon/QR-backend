const express = require('express')
const cors = require('cors')
const app = express()
const port = 4000
const crypto = require('crypto');
const allowedOrigins = [
  "https://test-qrcode-zeta.vercel.app",
  "http://localhost:5173" 
];
const key1 = Buffer.from("1234567891234567", 'utf8');   // Key1
const iv1 = Buffer.from("s6504062636039za", 'utf8');     // IV1
const key2 = Buffer.from("1234567891234569", 'utf8');   // Key2
const iv2 = Buffer.from("s6504062636039za", 'utf8');    // IV2
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
}));
app.use(express.json())


function aesDecrypt(encryptedBase64, key, iv) {
  const decipher = crypto.createDecipheriv('aes-128-ctr', key, iv);
  let decrypted = decipher.update(encryptedBase64, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

function doubleDecrypt(encrypted) {
  const step1 = aesDecrypt(encrypted, key2, iv2);
  const step2 = aesDecrypt(step1, key1, iv1);
  return step2;
}

const MiddleWare = (req, res, next) => {
    const Header = req.headers['authorization'];
    if (!Header || Header !== "admin") {
        return res.status(401).json({ error: "Unauthorized" });
    }
    next();
};


app.post('/decrypt', MiddleWare, async (req, res) => {
    const { encrypted } = req.body;

    if (!encrypted || typeof encrypted !== 'string') {
        return res.status(400).json({ error: "Invalid or missing 'encrypted' field in body." });
    }

    try {
        console.log(encrypted)
        const result1 = await doubleDecrypt(encrypted.toString());
        console.log(result1)
        res.send({ data: JSON.parse(result1)});
    } catch (err) {
        console.error(" Decryption error:", err.message);
        res.status(500).json({ error: "Decryption failed" });
    }
});


app.get('/', (req, res) => {
    res.send('Hello World')
})

app.listen(port, () => {
    console.log("server running on prot 4000")
})