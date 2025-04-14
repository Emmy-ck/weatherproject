const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");

    // res.send('Server is running');
});

app.post("/", function(req,res) {
    
    // Getting data from the API
    const query = req.body.cityName;
    const apiKey = "7b9c9864c314de5bde26c45a51e24632";
    const units = "metric";

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${apiKey}&units=${units}`;

    https.get(url, function(response) {
        console.log(response.statusCode);

        response.on("data", function(data) {

            const weatherData = JSON.parse(data); // Convert the data to a JS object
            console.log(weatherData);
            // // Shorter way of doing it
            // console.log(JSON.parse(data));

            // Converting JSON objects to simpler objects "string"

            const object = {
                name : "Emmy",
                food : "Pizza",
                location: "Mars"
            };

            console.log(JSON.stringify(object));

            // // Combining the two methods
            // console.log(JSON.stringify(JSON.parse(data)));

            // Getting a value from the data
            const weatherDescription = weatherData.weather[0].description;
            console.log(weatherDescription);

            // Getting the icon from the data
            const imageIconCode = weatherData.weather[0].icon;
            const imageURL = `https://openweathermap.org/img/wn/${imageIconCode}@2x.png`;

            // // Getting a value from the data in a simpler way
            // console.log((JSON.parse(data).weather[0].description));


            // Passing the data back to our live app
            res.set("Content-Type", "text/html");
            res.write("<h1>This is your daily weather update</h1>");
            // I have noticed that I can use backticks or double quotes and it will not affect the outcome of the html response
            // In stead of res.set, you can also use res.setHeader to get the correct html formatting in the response
            // res.setHeader("Content-Type", "text/html");

            res.write(`<p><strong>The weather in ${query}, ${weatherData.sys.country} is ${weatherDescription}</strong></p>`);
            // You can only have one res.send to avoid error
            // Wrapping the final string inside a <h1> tag formats it to h1
            // I have noted that the end tags do not need to have the back slash included for the coode to work
            res.write(`<img src=${imageURL}>`);

            res.send(); // Write this after you have written evething that you need to send
        });
    });

});

app.listen(3000, function() {
    console.log("Server running at port 3000");
});