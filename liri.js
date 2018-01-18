//Requirments for liri to work

require("dotenv").config();
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");
var keys = require("./keys.js");
var fs = require("fs");

//Liri Operators
var command = process.argv[2];
var string = process.argv;
var requestedItem = "";


// Allow multiple Arguments
for (var i = 3; i < string.length; i++) {
    requestedItem = requestedItem + " " + string[i];
}

requestedItem = requestedItem.trim();

//my-tweets function

//run liri command
if (command === "my-tweets") {
    getTweets();
}

function getTweets() {
    var input = [];
    var userName = process.argv[3];

    var client = new Twitter({
        consumer_key: keys.twitter.consumer_key,
        consumer_secret: keys.twitter.consumer_secret,
        access_token_key: keys.twitter.access_token_key,
        access_token_secret: keys.twitter.access_token_secret
    });

    var params = { screen_name: userName };
    client.get("statuses/user_timeline", params, function(err, tweets, response) {
        if (err) {
            console.log(err);
        }
        for (var i = 0; i < tweets.length; i++) {
            console.log("Tweet: " + tweets[i].text + "\n");
            input.push(tweets[i].text);
        }
        var logInput = "\n" + input + "\n"

        logInfo(command, logInput)
    });
}

//spotify-this-song function
if (command === "spotify-this-song") {
    spotifyInfo();
}

function spotifyInfo() {
    // If no song is requested default to The Sign by Ace of Base
    if (requestedItem === "") {
        requestedItem = "The Sign Ace of Base";
    }

    var client = new Spotify({
        id: keys.spotify.id,
        secret: keys.spotify.secret
    });

    client.search({ type: "track", query: requestedItem }, function(err, data) {
        if (err) {
            console.log("Error: " + err);
            return;
        }

        // Get Artist
        var artist = data.tracks.items[0].album.artists[0].name;
        console.log("\nArtist: " + artist);

        // Get Song Name
        var song = data.tracks.items[0].name;
        console.log("Song Title: " + song);

        // Get Preview Link
        var preview = data.tracks.items[0].album.artists[0].external_urls.spotify;
        console.log("Preview link: " + preview);

        // Get Album Name
        var album = data.tracks.items[0].album.name;
        console.log("Album: " + album + "\n");

        // Log Spotify Info
        var spotifyLog =  song + "\n" + artist + "\n" + preview + "\n" + album;
        logInfo(command, spotifyLog);

    });
}

//movie-this function
if (command === "movie-this") {
    movieInfo();
}

function movieInfo() {
    // If no movie is requested default to Mr. Nobody
    if (requestedItem === "") {
        requestedItem = "Mr. Nobody";
    }

    var queryURL = "http://www.omdbapi.com/?apikey=trilogy&t=" + requestedItem;

    request(queryURL, function(err, response, body) {
        if (err) {
            console.log(err);
        }

        if (!err && response.statusCode === 200) {
        	// Movie Title
        	var title = JSON.parse(body).Title;
        	console.log("\nMovie Title: " + title + "\n");

        	// Release Year
        	var release = JSON.parse(body).Year;
        	console.log("Realease Year: " + release + "\n");

        	// IMDB rating
        	var ratingIMDB = JSON.parse(body).Ratings[0].Value;
        	console.log("IMDB Rating: " + ratingIMDB + "\n");

        	// Rotten Tomatoes rating
        	var ratingTomatoes = JSON.parse(body).Ratings[1].Value;
        	console.log("Rotten Tomatoes Rating: " + ratingTomatoes + "\n");

        	// Country it was produced in
        	var country = JSON.parse(body).Country;
        	console.log("Produced in: " + country + "\n");

        	// Language of the movie
        	var lang = JSON.parse(body).Language;
        	console.log("Language(s): " + lang + "\n");

        	// Plot
        	var plot = JSON.parse(body).Plot;
        	console.log("Plot synopsis: " + plot + "\n");

        	// Actors
        	var actors = JSON.parse(body).Actors;
        	console.log("Actors: " + actors + "\n");

        	// Log Movie Data
        	var logInput = "\n" + title + "\n" + release + "\n" + ratingIMDB + "\n" + ratingTomatoes + "\n" + country + "\n" + lang + "\n" + plot + "\n" + actors;
        	logInfo(command, logInput);
        }
    });
}

//do-what-it-says function
if (command === "do-what-it-says") {
	fs.readFile("random.txt", "utf8", function(err, contents) {
		if (err) {
			console.log(err);
		}

		var randItem = contents.split(",");
		command = randItem[0];
		requestedItem = randItem[1];
	});
}

// Log everything to log.txt
function logInfo (command, input) {
	var logSection = "----------\n" + command + " : " + input + "\n----------\n";
	fs.appendFile("log.txt", logSection, function(err) {
		if (err) {
			console.log(err);
		} else {
			console.log("Log Successful")
		}
	});
}

























