const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 5000;
const dataFilePath = path.join(__dirname, 'data.json');

app.use(cors());
app.use(bodyParser.json());

const storage = multer.diskStorage({
    destination: './posters',
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  });
  const upload = multer({ storage });
  

  app.post('/api/movies', (req, res) => {
    const movieData = req.body;
  
    fs.readFile('data.json', (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Error reading data file' });
      }
      const movies = JSON.parse(data);
      movies.push(movieData);
      fs.writeFile('data.json', JSON.stringify(movies, null, 2), (err) => {
        if (err) {
          return res.status(500).json({ error: 'Error writing data file' });
        }
        res.status(201).json({ message: 'Movie added successfully' });
      });
    });
  });
  
  app.post('/api/movies/poster', upload.single('poster'), (req, res) => {
    res.status(201).json({ message: 'Poster uploaded successfully' });
  });
  
  app.get('/api/movies', (req, res) => {
    fs.readFile('data.json', (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Error reading data file' });
      }
      res.json(JSON.parse(data));
    });
  });
  
  app.get('/api/movies/poster/:filename', (req, res) => {
    const filepath = path.join(__dirname, 'posters', req.params.filename);
    res.sendFile(filepath);
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
