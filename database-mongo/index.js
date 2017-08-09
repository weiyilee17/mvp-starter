var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/games');

var db = mongoose.connection;

var Schema = mongoose.Schema;

db.on('error', function() {
  console.log('mongoose connection error');
});

db.once('open', function() {
  console.log('mongoose connected successfully');
});

var gameSchema = new Schema({
  username: String,
  name: String,
  imageUrl: String,
  totalPlayedHours: Number
});

var Game = mongoose.model('Game', gameSchema);

// var selectAll = function(userName, callback) {
//   Game.find({username: userName}, function(err, games) {
//     console.log('games:', games);
//     if(err) {
//       console.log('error in data base: ', err);
//       callback(err, null);
//     } else {
//       callback(null, games);
//     }
//   });
// };

var selectAll = function(userName, callback) {
  Game.find({username: userName}).limit(7)
  .sort({totalPlayedHours: -1}).exec(callback);
  // -1: largest on the top
};

var save = function(gameInfo, callback) {
    Game.find({name: gameInfo.name}).exec(callback);
};


module.exports.selectAll = selectAll;
module.exports.save = save;
module.exports.gameSchema = gameSchema;
module.exports.Game = Game;