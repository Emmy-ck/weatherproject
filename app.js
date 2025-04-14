const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/', (req, res) => {
    console.log(req.body.cityName);
    const query = req.body.cityName;
    const apiKey = '7b9c9864c314de5bde26c45a51e24632';
    const unit = 'metric';
    const url = 'https://api.openweathermap.org/data/2.5/weather?q=' + query + '&appid=' + apiKey + '&units=' + unit;

    https.get(url, (response) => {
        console.log(response.statusCode);

        response.on('data', (data) => {
            weatherData = JSON.parse(data);
            const temperature = (weatherData.main.temp);
            const weatherDescription = (weatherData.weather[0].description);
            const iconCode = (weatherData.weather[0].icon);
            // console.log(iconCode);
            const imageURL = `https://openweathermap.org/img/wn/${iconCode}@2x.png`

            res.write(`<h1>The temperature in ${query} is ${temperature} degrees Celcius.</h1>`);
            res.write(`<h2>The weather is currently ${weatherDescription}</h2>`);
            res.write(`<img src="${imageURL}" alt="weather icon">`);
            res.send();
        });
    });

    // res.send('Thanks for posting that!');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

