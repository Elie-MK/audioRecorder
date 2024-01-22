const express = require('express');
const multer = require('multer');
const cors = require('cors')
const path = require('path');
const app = express();
const port = 5000;

app.use(cors());



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}${path.extname(file.originalname)}`);
    },
  });

const upload = multer({ storage: storage });

app.post('/upload', upload.single('audio'), (req, res) => {
    try {
      res.status(200).json({ message: 'Audio file sent successfully.' });
    } catch (error) {
      res.status(500).json({ error: 'Error sending audio file.' });
    }
  });

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
