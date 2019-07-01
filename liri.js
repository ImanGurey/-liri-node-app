// read and set any environment variables with the dotenv package:
require("dotenv").config();

var keys = require("./keys.js");

// 1 define a terminal global app name
// 2 define commands
// 3 extract the argument

// liri song bonjovi
// var songName = getSongName();

// send song name to spotifiy api
// display the data on the screen

    
    // Configure APIs
    
var keys = require("./keys.js");

// Twitter
var Twitter = require("twitter");
var twitter = new Twitter(keys.twitter);

// Spotify
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

// OMDB
var request = require("request");

// File System
var fs = require("fs");

// Operating System (for end-of-line)
var os = require("os");


    // Initialize
    
process.stdout.write("\033c");

// Create a log file if it does not exist
var file_log = "log.txt";

if (!fs.existsSync(file_log)) {
    fs.writeFile(file_log, "", error => {
        if (error) {
            console.log(`Error in creating "${file_log}"\n${error}\n\n\n`);
            return;
        }
    });
}

var option = process.argv[2];
var title = process.argv.slice(3).join(" ");

mainMenu(option, title);

    
    // Menu options
    
function mainMenu(option = "", title) {
    switch (option.toLowerCase()) {
        case "my-tweets":
            getTweets();
            break;

        case "spotify-this-song":
            getSong((title) ? title : "The Sign");
            break;

        case "movie-this":
            getMovie((title) ? title : "Mr. Nobody");
            break;

        case "do-what-it-says":
            doWhatItSays();
            break;

        default:
            saveOutput(`Error:\n"${option}" is a not valid command.\nPlease select "my-tweets", "spotify-this-song", "movie-this", or "do-what-it-says".\n\n\n`);

    }
}


function getTweets() {
    var parameters = {
        "count": 20,
        "screen_name": "BobBarker000000"
    };

    twitter.get("statuses/user_timeline", parameters, (error, tweets, response) => {
        if (error) {
            saveOutput(`Error in calling "Twitter"\n${error}\n\n\n`);
            return;
        }

            
            // Write to terminal and file
            
        let output = "My Tweets\n";

        output += addSeparator();

        tweets.forEach(t => {
            // Extract date information
            [, month, day, time, , year] = t.created_at.split(" ");
            [hour, minute] = time.split(":").map(x => parseInt(x, 10));

            // Format the time stamp
            var timeStamp = `${month} ${day} ${year}, ${hour % 12}:${minute} ${(hour < 12) ? "AM" : "PM"}`;

            output += `@${t.user.screen_name} · ${timeStamp}\n"${t.text}"\n\n`;
        });

        output += addSeparator() + "\n";

        saveOutput(output);
    });
}


function getSong(title) {
    var parameters = {
        "type": "track",
        "query": title,
        "limit": 1
    };

    spotify.search(parameters, (error, data) => {
        if (error) {
            saveOutput(`Error in calling "Spotify"\n${error}\n\n\n`);
            return;
        }

        // For simplicity, we assume that Spotify always finds the right song
        var song = data.tracks.items[0];

        // Display all artists
        var artists = song.artists.map(a => a.name);

            
            // Write to terminal and file
            
        let output = "Spotify This Song\n";

        output += addSeparator();

        output += `Artists      : ${artists.join(", ")}\n`;
        output += `Album        : ${song.album.name}\n`;
        output += `Track        : ${song.name}\n`;
        output += `Preview link : ${song.preview_url}\n\n`;

        output += addSeparator() + "\n";

        saveOutput(output);
    });
}


