require("dotenv").config();

var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var axios = require('axios');
var moment = require('moment');
var fs = require('fs')
var spotify = new Spotify(keys.spotify);
var inquirer = require("inquirer");

// Working concert-this
function concertThis(input) {
    axios.get("https://rest.bandsintown.com/artists/" + input + "/events?app_id=codingbootcamp").then(
        function (response) {
            console.log("///////")
            console.log("Venue: " + response.data[0].venue.name);
            console.log("Location: " + response.data[0].venue.city + ", " + response.data[0].venue.country)
            console.log("Date: " + moment(response.data[0].datetime).format("MMM Do YYYY"));
            console.log("\\\\\\\\\\\\\\")
        }
    );
}

// Working sptify-this-song
function spotifyThis(input) {
    spotify.search({ type: 'track', query: input }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log("///////")
        console.log("Artist: " + data.tracks.items[0].artists[0].name);
        console.log("Song: " + data.tracks.items[0].name)
        console.log("Album: " + data.tracks.items[0].album.name)
        console.log("Link to song: " + data.tracks.items[0].external_urls.spotify)
        console.log("\\\\\\\\\\\\\\")
    });
}

// Working movie-this
function movieThis(input) {
    axios.get("http://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=trilogy").then(
        function (response) {
            console.log("///////")
            console.log("Title: " + response.data.Title);
            console.log("Year: " + response.data.Year);
            console.log("Rated: " + response.data.Rated);
            console.log("Tomatoe Rating: " + response.data.Ratings[1].Value);
            console.log("Language: " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Actors: " + response.data.Actors);
            console.log("\\\\\\\\\\\\\\")
        }
    );
}

//directs commands to proper functions
function liriDirector(array) {
    if (array[0] === "concert-this") {
        concertThis(array[1])
    }
    if (array[0] === "spotify-this-song") {
        spotifyThis(array[1])
    }
    if (array[0] === "movie-this") {
        movieThis(array[1])
    }
}


//Working do-what-it-says
function whatItSays() {
    fs.readFile("random.txt", "utf8", function (error, data) {

        if (error) {
            return console.log(error);
        }

        var externalArr = data.split(",");

        liriDirector(externalArr)

    });
}


inquirer
    .prompt([
        {
            type: 'input',
            message: "\nEnter valid commands. \nconcert-this, \"artist/band name here\"\nspotify-this-song, \"song name here\"\nmovie-this, \"movie name here\"\ndo-what-it-says, liri will automatically read commands from random.txt\n",
            name: 'liriCommand'
        }
    ]).then(function (inquirerResponse) {
        var dataArr = inquirerResponse.liriCommand.split(", ")
        if (dataArr[0] === "do-what-it-says") {
            whatItSays()
        }
        else {
            liriDirector(dataArr)
        }
    })