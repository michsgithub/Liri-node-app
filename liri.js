require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');

var spotify = new Spotify(keys.spotify);

var command = process.argv[2];
var context = process.argv.slice(3).join(" ");


function init (){
    switch (command) {
        case "spotify-this-song":
            spotify ();
            break;
        case "concert-this":
            concert ();
            break;
        case "movie-this":  
            movie ();
            break;    
        case "do-what-it-says":
            doWhatever();
            break;
    }
}

function spotify () {
 spotify.search({ type: 'track', query: context}, function(err, data) {
  if (err) {
    return console.log('Error occurred: ' + err);
  }
console.log(data.tracks.items[0]); 


});

}

// function concert () {

// }

// function movie () {

// }

// function doWhatever () {

// }