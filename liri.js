
//store dependencies as variables.
var keys = require('./keys.js');
var twitter = require("twitter");
var spotify = require("spotify");
var request = require("request");
var fs = require('fs');
// var inquirer = require("inquirer");

// require to call file where keys are stored
require("dotenv").config();

console.log(process.env.TWITTER_CONSUMER_KEY)
//process[2] choses action, process[3] as search parameter for spotify or movie.

var userInput = process.argv[2];
var userInput2 = process.argv[3];

function liriBot() {
    //capture user input, and inform user of what to type in.
    console.log("Type tweets , spotify (song name), movie (movie name) , or random");

    //action statement, switch statement to declare what action to execute.
    switch (userInput) {

        case 'tweets':
            fetchTweets();
            break;

        case 'spotify':
            spotifyMe();
            break;

        case 'movie':
            movieSearch();
            break;

        case 'random':
            randomText();
            break;

    }
    console.log("\n");
};


function fetchTweets() {
    console.log("Tweets headed your way!");
    //new variable for instance of twitter, load keys from imported keys.js
    var client = new twitter({
        consumer_key: process.keys.consumer_key,
        consumer_secret: process.keys.consumer_secret,
        access_token_key: process.keys.access_token_key,
        access_token_secret: process.keys.access_token_secret
    });

    //parameters for twitter function.
    var parameters = {
        screen_name: 'bit_holdings',
        count: 2
    };

    //call the get method on our client variable twitter instance
    client.get('statuses/user_timeline', parameters, function (error, tweets, response) {
        if (!error) {
            for (i = 0; i < tweets.length; i++) {
                var returnedData = ('Number: ' + (i + 1) + '\n' + tweets[i].created_at + '\n' + tweets[i].text + '\n');
                console.log(returnedData);
                console.log("-------------------------");
            }
        };
    });
};//end fetchTweets;

function spotifyMe() {
    console.log("Music for DAYS!");

    //variable for search term, test if defined.

    var searchTrack;
    if (userInput2 === undefined) {
        searchTrack = "many men";
    } else {
        searchTrack = userInput2;
    }
    //launch spotify search
    spotify.search({ type: 'track', query: searchTrack }, function (err, data) {
        console.log(data);
        if (err) {
            console.log('Error: ' + err);
            return;
        } else {
            //tried searching for release year! Spotify doesn't return this!
            console.log("Artist: " + data.tracks.artists.name);
            console.log("Song: " + data.tracks.name);
            console.log("Album: " + data.tracks.album.name);
            console.log("Preview Here: " + data.tracks.preview_url);
        }
    });
};//end spotifyMe

function movieSearch() {
    console.log("Netflix and Chill?\n");

    //same as above, test if search term entered
    var searchMovie;
    if (userInput2 === undefined) {
        searchMovie = "Dirty Dozen";
    } else {
        searchMovie = userInput2;
    };

    var url = 'http://www.omdbapi.com/?t=' + searchMovie + '&y=&plot=long&tomatoes=true&r=json&apikey=trilogy';
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log("\nTitle: " + JSON.parse(body).Title);
            console.log("Year: " + JSON.parse(body).Year);
            console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
            console.log("Country: " + JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);
            console.log("Rotten Tomatoes Rating: " + JSON.parse(body).tomatoRating);
            console.log("Rotten Tomatoes URL: " + JSON.parse(body).tomatoURL + '\n');
        }
    });

};//end movieSearch fucntion

function randomText() {
    console.log("Looking at random.txt now\n");
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            console.log(error);
        } else {

            //split data, declare variables
            var dataArr = data.split(',');

            console.log("\n" + dataArr + "\n");
        };//end else

    });//end readfile

};//end of randomText Fuction

liriBot();
