require("dotenv").config()
//store dependencies as variables.
var keys = require('./keys.js');
var twitter = require("twitter");
var spotify = require("spotify");
var request = require("request");
var fs = require('fs');
var inquirer = require("inquirer");

// require to call file where keys are stored
require("dotenv").config();

function liriBot(){
inquirer.prompt([
    {
      type: "list",
      name: "doingWhat",
      message: "What you like to do?",
      choices: ["Check my Tweets", "Song from Spotify", "Check My Favorit Movie?","Random option!"]
    },
  
  
  ]).then(function(user) {
      if (choices === "Check my Tweets" ) {
          fetchTweets();
      } else if (choices === "Song from Spotify") {
        secondCommand = "Many Men";
        spotifyMe()
      } else if (choices === "Check My Favorit Movie?") {
        aMovieForMe();
      } else if (choices === "Random option!") {
        aMovieForMe();
      } else {
          console.log("You Need to Choose and Option!")
          liriBot();
      }

  });

}

function fetchTweets(){
	console.log("Tweets headed your way!");
	//new variable for instance of twitter, load keys from imported keys.js
	var client = new twitter({
		consumer_key: keys.twitterKeys.consumer_key,
		consumer_secret: keys.twitterKeys.consumer_secret,
		access_token_key: keys.twitterKeys.access_token_key,
		access_token_secret: keys.twitterKeys.access_token_secret
	});

	//parameters for twitter function.
	var parameters = {
		screen_name: 'bit_holdings',
		count: 20
	};

	//call the get method on our client variable twitter instance
	client.get('statuses/user_timeline', parameters, function(error, tweets, response){
		if (!error) {
	        for (i=0; i<tweets.length; i++) {
	            var returnedData = ('Number: ' + (i+1) + '\n' + tweets[i].created_at + '\n' + tweets[i].text + '\n');
	            console.log(returnedData);
	            console.log("-------------------------");
	        }
	    };
	});
};//end fetchTweets;

function spotifyMe(){
	console.log("Music for DAYS!");

	//variable for search term, test if defined.

	var searchTrack;
	if(secondCommand === undefined){
		searchTrack = "What's My Age Again?";
	}else{
		searchTrack = secondCommand;
	}
	//launch spotify search
	spotify.search({type:'track', query:searchTrack}, function(err,data){
	    if(err){
	        console.log('Error occurred: ' + err);
	        return;
	    }else{
	        //tried searching for release year! Spotify doesn't return this!
	  		console.log("Artist: " + data.tracks.items[0].artists[0].name);
	        console.log("Song: " + data.tracks.items[0].name);
	        console.log("Album: " + data.tracks.items[0].album.name);
	        console.log("Preview Here: " + data.tracks.items[0].preview_url);
	    }
	});
};//end spotifyMe

function aMovieForMe(){
	console.log("Netflix and Chill?");

	//same as above, test if search term entered
	var searchMovie;
	if(secondCommand === undefined){
		searchMovie = "Dirty Dozen";
	}else{
		searchMovie = secondCommand;
	};

	var url = 'http://www.omdbapi.com/?t=' + searchMovie +'&y=&plot=long&tomatoes=true&r=json';
   	request(url, function(error, response, body){
	    if(!error && response.statusCode == 200){
	        console.log("Title: " + JSON.parse(body)["Title"]);
	        console.log("Year: " + JSON.parse(body)["Year"]);
	        console.log("IMDB Rating: " + JSON.parse(body)["imdbRating"]);
	        console.log("Country: " + JSON.parse(body)["Country"]);
	        console.log("Language: " + JSON.parse(body)["Language"]);
	        console.log("Plot: " + JSON.parse(body)["Plot"]);
	        console.log("Actors: " + JSON.parse(body)["Actors"]);
	        console.log("Rotten Tomatoes Rating: " + JSON.parse(body)["tomatoRating"]);
	        console.log("Rotten Tomatoes URL: " + JSON.parse(body)["tomatoURL"]);
	    }
    });
};//end aMovieForMe

function followTheTextbook(){
	console.log("Looking at random.txt now");
	fs.readFile("random.txt", "utf8", function(error, data) {
	    if(error){
     		console.log(error);
     	}else{

     	//split data, declare variables
     	var dataArr = data.split(',');
        userCommand = dataArr[0];
        secondCommand = dataArr[1];
        //if multi-word search term, add.
        for(i=2; i<dataArr.length; i++){
            secondCommand = secondCommand + "+" + dataArr[i];
        };
        //run action
		theGreatSwitch();
		
    	};//end else

    });//end readfile

};//end followTheTextbook

theGreatSwitch();