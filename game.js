var Game = {
  display: null,
  engine: null,
  player: null,
  pedro: null,
  map: {},
  width: 80,
  height: 25,
  ananas: null,


  init: function() {
    window.addEventListener("load", this);
  },

  handleEvent: function(e) {
    switch (e.type) { case "load": this._init() }
  },

  _init: function() {
    window.removeEventListener("load", this);
    fontSize = window.innerWidth / 50;
    this.display = new ROT.Display({ width: this.width, height: this.height, fontSize });
    display = this.display.getContainer()
    document.body.appendChild(display);

    this._generateMap();

    var scheduler = new ROT.Scheduler.Simple();
    scheduler.add(this.player, true);
    scheduler.add(this.pedro, true);
    this.engine = new ROT.Engine(scheduler);
    this.engine.start();
  },

  _generateMap: function() {
    var digger = new ROT.Map.Digger(this.width, this.height);
    var freeCells = [];

    var digCallback = function(x, y, value) {
      if (value) { return; }

      var key = x + "," + y;
      this.map[key] = ".";
      freeCells.push(key);
    }
    digger.create(digCallback.bind(this));

    this._generateBoxes(freeCells);

    this._drawWholeMap();

    this.player = this._createBeing(Player, freeCells);
    this.pedro = this._createBeing(Pedro, freeCells);


  },

  _generateBoxes: function(freeCells) {
    for (var i = 0; i < 10; i++) {
      var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
      var key = freeCells.splice(index, 1)[0];
      this.map[key] = "=";
      if (!i) { this.ananas = key; } /* first box contains an ananas */
    }
  },
  _createBeing: function(what, freeCells) {
    var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
    var key = freeCells.splice(index, 1)[0];
    var parts = key.split(",");
    var x = parseInt(parts[0]);
    var y = parseInt(parts[1]);
    return new what(x, y);
  },


  _drawWholeMap: function() {
    for (var key in this.map) {
      var parts = key.split(",");
      var x = parseInt(parts[0]);
      var y = parseInt(parts[1]);
      this.display.draw(x, y, this.map[key]);
    }
  }
};

Game.init();


var Player = function(x, y) {
  this._x = x;
  this._y = y;
  this._draw();
  this.ready = false;
  window.addEventListener("keydown", this);
}

Player.prototype._draw = function() {
  Game.display.draw(this._x, this._y, "@", "#ff0");
}

Player.prototype.act = function() {
  Game.engine.lock();
  /* wait for user input; do stuff when user hits a key */
  this.ready = true;
}

Player.prototype.handleEvent = function(e) {
  if (!this.ready) { return; }

  var keyMap = {};
  keyMap[38] = 0;
  keyMap[33] = 1;
  keyMap[39] = 2;
  keyMap[34] = 3;
  keyMap[40] = 4;
  keyMap[35] = 5;
  keyMap[37] = 6;
  keyMap[36] = 7;

  keyMap[13] = 8;

  var code = e.keyCode;

  if (!(code in keyMap)) { return; }

  e.preventDefault();

  var diff = ROT.DIRS[8][keyMap[code]];
  var newX = this._x + diff[0];
  var newY = this._y + diff[1];

  var newKey = newX + "," + newY;
  if (!(newKey in Game.map)) { return; } /* cannot move in this direction */
  if (Game.map[newKey] == "=") {
    this._checkBox(newX, newY);
    Game.engine.unlock();
    return;
  }

  Game.display.draw(this._x, this._y, Game.map[this._x + "," + this._y]);
  this._x = newX;
  this._y = newY;
  this._draw();
  Game.engine.unlock();
}

Player.prototype._checkBox = function(x, y) {
  var key = x + "," + y;
  if (key == Game.ananas) {
    alert("Hooray! You found an ananas and won this game.");
    Game.engine.lock();
  } else {
    Game.map[key] = "+";
    Game.display.draw(x, y, "+");
    alert("This box is empty :-(");
  }
}

Player.prototype.getX = function() { return this._x; }

Player.prototype.getY = function() { return this._y; }



var Pedro = function(x, y) {
  this._x = x;
  this._y = y;
  this.path = []
  this._draw();
}

Pedro.prototype._draw = function() {
  Game.display.draw(this._x, this._y, "P", "red");
}

Pedro.prototype.act = function() {
  var x = Game.player.getX();
  var y = Game.player.getY();
  var passableCallback = function(x, y) {
    return (x + "," + y in Game.map);
  }
  var astar = new ROT.Path.AStar(x, y, passableCallback, { topology: 4 });

  // clear old path
  for (let i = 0; i < this.path.length - 1; i++) {
    let x = this.path[i][0];
    let y = this.path[i][1];
    if (x == Game.player.getX() && y == Game.player.getY()) {
      continue;
    }
    Game.display.draw(x, y, Game.map[x + "," + y])

  }

  this.path = [];
  self = this;
  var pathCallback = function(x, y) {
    self.path.push([x, y]);
  }
  astar.compute(this._x, this._y, pathCallback);

  this.path.shift(); /* remove Pedro's position */
  x = this.path[0][0];
  y = this.path[0][1];
  for (let i = 0; i < this.path.length - 1; i++) {
    let ch = Game.map[this.path[i][0] + "," + this.path[i][1]];
    Game.display.draw(this.path[i][0], this.path[i][1], ch, "red");

  }
  Game.display.draw(this._x, this._y, Game.map[this._x + "," + this._y]);
  this._x = x;
  this._y = y;
  this._draw();

  if (this.path.length <= 2) {
    Game.engine.lock();
    alert("Game over - you were captured by Pedro!");
    return;
  }
}
