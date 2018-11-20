require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var fs = require('fs');
var request = require('request');
var spotify = new Spotify(keys.spotify);
var moment = require('moment');

//capturing user input
var command = process.argv[2];
console.log (command);
var context = process.argv.slice(3).join(" ");
console.log (context);

//Instructions displayed when the program is run and nothing is entered
console.log("-----------------------------------------------------------------------------")   
console.log("Command line instructions:"); 
console.log("spotify-this-song + the name of a song"); 
console.log("concert-this + the name of artist or band"); 
console.log("movie-this + the name of a movie"); 
console.log("do-what-it-says + one of the above commands"); 
console.log("-----------------------------------------------------------------------------")

//main function 
    function mainFunction (){
        switch (command) {
            case "spotify-this-song":
                spotifyMySongs();
                break;
            case "concert-this":
                concertMyBands();
                break;
            case "movie-this":  
                movieMine ();
                break;    
            case "do-what-it-says":
                doWhatever();
                break;
        }
    }

    //this function will get "The Sign" by Ace of Base if no song name is entered. It also get the song that is entered for the search.
    function spotifyMySongs() {
        if (context === "") {
            context = "The Sign";
        }
        spotify.search({type: 'track', query: context}, function(err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }  
            if (context === "The Sign") {
                // search for Ace of Base
                for (i =0; i<data.tracks.items.length; i++) {
                    // console.log (data.tracks.items[i].name);
                    if (data.tracks.items[i].artists[0].name === "Ace of Base"){
                        console.log("-----------------------------------------------------------------------------")    
                        console.log("Artist name is:   " + data.tracks.items[i].artists[0].name);  
                        console.log("Name of song is:  " + data.tracks.items[i].name); 
                        console.log("Preview URL is:   " + data.tracks.items[i].preview_url); 
                        console.log("Name of album is: " + data.tracks.items[i].album.name); 
                    }
                }
            } else {
                console.log("-----------------------------------------------------------------------------")    
                console.log("Artist name is:   " + data.tracks.items[0].artists[0].name); 
                console.log("Name of song is:  " + data.tracks.items[0].name); 
                console.log("Preview URL is:   " + data.tracks.items[0].preview_url); 
                console.log("Name of album is: " + data.tracks.items[0].album.name); 
            } 
        });
    }

        //This function gets band venue, location and date by given artist or band
        function concertMyBands() {
            var artist = context;
            var queryURL= "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
            request(queryURL, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    console.log (error);
                    var result = JSON.parse(body);
                    console.log (body);
                    console.log ("Name of venue: " + result.value.name);
                    console.log ("Location:      " + result.venue.city);
                    console.log ("Date of event: " + moment(result.datetime).format("MM/DD/YYYY"));
                }
            })
        }

        // This function get Mr. nobody if no movie name is given. It will also return the movie that is searched.
        function movieMine () {
            var title = context;
            if (title === "") {
                title = "Mr. nobody";
            }
            var queryURL = "https://www.omdbapi.com/?t=" + title + "&y=&plot=short&apikey=trilogy";
            request(queryURL, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    body = JSON.parse(body);
                    dataResult = [
                    "Title of movie:         " + body.Title,
                    "Year released:          " + body.Year,
                    "IMDB rating:            " + body.imdbRating,
                    "Rotten Tomation rating: " + body.Ratings[1].Value,
                    "Language:               " + body.Language,
                    "Country:                " + body.Country,
                    "Plot:                   " + body.Plot,
                    "Actors:                 " + body.Actors + "\n"
                    ]
                    createLog();
                }
            })
        }

        //This function will get data from random.txt
        function doWhatever () {
            fs.readFile('random.txt', "utf8", function read(err, data) {
                if (err) throw err;
                console.log("-----------------------------------------------------------------------------");  
                console.log(data);
            });
            
        }

        //create and add log on each search result
        function createLog () {
            fs.appendFile ("log.txt", dataResult, function (err) {
                if (err) throw err;
                console.log (dataResult);
            });
        }

        mainFunction();