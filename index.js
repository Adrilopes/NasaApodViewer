import 'dotenv/config';
import express from "express";
import axios from "axios";
import path from "path";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get('/apod', (req, res) => {
    const { date } = req.query;
    const apiUrl = date 
    ? `https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}&date=${date}` 
    : `https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}`;
 
    axios.get(apiUrl)
       .then(response => {
          const apodData = response.data;
          const apiLimit = response.headers['x-ratelimit-remaining'];
 
          apodData.apiLimit = apiLimit;
 
          res.render("index", {
            apodData: apodData,
            apiLimit: apiLimit
        });
       })

       .catch(error => {
          console.error('Error:', error.message);
          res.status(500).json({ error: 'An error occurred' });
       });
 });

app.listen(port, () => {
     console.log(`Server running on port ${port}`);
});