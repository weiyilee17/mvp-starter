var express = require('express');
// var bodyParser = require('body-parser');


// UNCOMMENT THE DATABASE YOU'D LIKE TO USE
// var items = require('../database-mysql');
var select = require('../database-mongo').selectAll;
var save = require('../database-mongo').save;
var gameSchema = require('../database-mongo').gameSchema;
var Game = require('../database-mongo').Game;
var mongoose = require('mongoose');

var Promise = require('bluebird');

var request =  require('request');
var keys = require('../api_key');
var steam = require('steamidconvert')(keys.KEY);

var app = express();
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: false}));

// UNCOMMENT FOR REACT
app.use(express.static(__dirname + '/../react-client/dist'));

// UNCOMMENT FOR ANGULAR
// app.use(express.static(__dirname + '/../angular-client'));
// app.use(express.static(__dirname + '/../node_modules'));

// app.get('/games', function (req, res) {
//   games.selectAll(function(err, data) {
//     if(err) {
//       res.sendStatus(500);
//     } else {
//       res.json(data);
//     }
//   });
// });

var testGameData = [
  {
    username: 'weiyilee17',
    name: 'Age of Empires 2',
    imageUrl: 'http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/221380/37e9da3f1174891fe38f8fb0206acda8b6bfc729.jpg',
    totalPlayedHours: 553
  },
  {
    username: 'weiyilee17',    
    name: 'Company of Heros',
    imageUrl: 'http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/228200/87aa009e93d5aa56a55d0e9056708d018ddd6483.jpg',
    totalPlayedHours: 58
  },
  {
    username: 'weiyilee17',    
    name: 'The Binding of Isaac: Rebirth',
    imageUrl: 'http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/250900/c7a76988c53e7f3a3aa1cf224aaf4dbd067ebbf9.jpg',
    totalPlayedHours: 413
  },
  {
    username: 'weiyilee17',    
    name: 'Rome: Total War',
    imageUrl: 'http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/4760/134817933edf4f8d0665d456889c0315c416fff2.jpg',
    totalPlayedHours: 59
  },
  {
    username: 'weiyilee17',    
    name: 'Hacknet',
    imageUrl: 'http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/365450/50479f0bfe5a552132a0fc2668640b2e6a737398.jpg',
    totalPlayedHours: 20
  }
];



app.get('/games', function(req, res) {

  // res.status(200).send(testGameData);

  var gameInfo = [];

  // console.log('query', req.query);

  // falling_stance
  // bossquibble

  // convert custom steam handler to 64 bit id
  var username = req.query.username;
  console.log(username);
  
  steam.convertVanity(username, function(err, usernameIn64bit) {
    if (err) {
      console.log('Could not get convert' + username);
    }

    console.log('steam id 64 bit: ', usernameIn64bit);

    // ask data from api

    // example: http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=87373113BC74B7B008FFF1DD836CFBFD&steamid=76561198262589327&format=json

    // res.status(200).send(testGameData);

    var options = {
      url:`http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${keys.KEY}&steamid=${usernameIn64bit}&include_appinfo=1&format=json`,
      json: true,
    }

    request(options, function(error, response, body) {

      // console.log('body: ', body);

      var longest5Games = [];
      longest5Games = body.response.games.sort(function(a, b) {
        return b.playtime_forever - a.playtime_forever;
      }).slice(0, 7);

      // console.log(longest5Games);

      for (var i = 0; i < longest5Games.length; i++) {
        var gameName = longest5Games[i].name;
        var appId = longest5Games[i].appid;
        var totalPlayedHours = Math.floor(longest5Games[i].playtime_forever/60);
        var imageUrl = `http://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/${appId}/${longest5Games[i].img_logo_url}.jpg`

        var eachGameInfo = {};

        eachGameInfo["username"] = username;
        eachGameInfo["name"] = gameName;
        eachGameInfo["totalPlayedHours"] = totalPlayedHours;
        eachGameInfo["imageUrl"] = imageUrl;

        gameInfo.push(eachGameInfo);
      }
      
      var i = 0;

        gameInfo.forEach(function(game){
          
          save(game, function(err, bool) {

            if(err) {
              console.log('err in save');
              res.sendStatus(500);
            } else {
              // Game.find({key: value}) returns an array of objects that match the condition
              if (bool.length) {  // if found
                // do nothing, no need to save duplicate data
                // in the future can update so the data is dynamic

              // Game.find({key: value}) returns an empty array if not found
              } else {  // if not found
                
                console.log('outer gameinfo in else: ', game);
                var gameSave = new Game(game);
                gameSave.save()
                  .then( function() {
                    i++;
                    if (i === 6) {
                      // get data from database
                      select(username, function(err, games) {
                        if(err) {
                          console.log('error in server: ', err);
                          res.sendStatus(500);
                        } else {
                          console.log("games in select: ", games);
                          gameInfo = games;
                          res.status(200).send(gameInfo);
                        }
                      });
                      
                    }

                  }
                );
              }
            }

          });
        });

    });
    
  });

  

});

app.listen(3000, function() {
  console.log('listening on port 3000!');
});

