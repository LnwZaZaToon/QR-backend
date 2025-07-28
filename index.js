const express = require('express')
const cors = require('cors')
const app = express()
const port = 4000
const crypto = require('crypto');
app.use(cors())
app.use(express.json())


function DecryptData(encryptedHex) {
    function decrypt(encryptedHex, key, ivHex) {
        const iv = Buffer.from(ivHex, 'hex');
        const encrypted = Buffer.from(encryptedHex, 'hex');
        const decipher = crypto.createDecipheriv('aes-128-ctr', key, iv);
        const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
        return decrypted.toString('utf8');
    }

    const key1 = Buffer.from("1234567891234567"); // stage 2
    const key2 = Buffer.from("abcdef9876543210"); // stage 1
    const iv = Buffer.from("abcdef9876543210")
    console.log(encryptedHex)
    // First decrypt with key2
    const stage1 = decrypt(encryptedHex, key2, iv);
    console.log("🔓 Stage 1:", stage1);

    // Then decrypt with key1
    const final = decrypt(stage1, key1, iv);
    console.log("✅ Final Decrypted:", final);

    return final;
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
        const result1 = await DecryptData(encrypted.toString('hex'));
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