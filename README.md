# Getting started with HTML5 Game Development using CreateJS

Slide and example codes for http://www.meetup.com/Berlin-HTML5-User-Group/events/134406232/

## Online demo

The slide is available online at http://abiyasa.com/lab/start-game-dev-createjs/slides/

The code demos are available online at:

* [step00-preparation](http://abiyasa.com/lab/start-game-dev-createjs/step00-preparation/)
* [step01-bouncingBall](http://abiyasa.com/lab/start-game-dev-createjs/step01-bouncingBall/)
* [step02-helloHero](http://abiyasa.com/lab/start-game-dev-createjs/step02-helloHero/)
* [step03-sprites](http://abiyasa.com/lab/start-game-dev-createjs/step03-sprites/)
* [step04-collisions](http://abiyasa.com/lab/start-game-dev-createjs/step04-collisions/)
* [step05-buildings](http://abiyasa.com/lab/start-game-dev-createjs/step05-buildings/)
* [step06-preload](http://abiyasa.com/lab/start-game-dev-createjs/step06-preload/)
* [step07-sounds](http://abiyasa.com/lab/start-game-dev-createjs/step07-sounds/)

## Installation

Make sure the following stuff are installed beforehand:

* [Node.js](http://nodejs.org/) is installed
* [Grunt][grunt] is installed. You can install it manually by `npm install -g grunt-cli`.
* [Bower][bower] is installed. You can install it manually by `npm install -g bower`.

After cloning the repository, go to the directory and do:

* `npm install`
* `bower install`.

This will automatically install all required modules including the [CreateJS][createjs] library.

## Starting

Do `grunt` and this will start a local webserver (http://localhost:9001). Available URLs:

* `http://localhost:9001/slides` : The presentation slide
* `http://localhost:9001/step00-preparation` : Code and HTML base
* `http://localhost:9001/step01-bouncingBall` : Initial CreateJS, simple bouncing circle shape, and animation
* `http://localhost:9001/step02-helloHero` : Simple rectangle shape, handle keyboard input, and movement control
* `http://localhost:9001/step03-sprites` : Load sprites for background, ball, and sprite sheet for hero's animation
* `http://localhost:9001/step04-collisions` : Simple detection between ball and the hero
* `http://localhost:9001/step05-buildings` : Use sprite sheet to generate buildings
* `http://localhost:9001/step06-preload` : Preload assets before the game starts
* `http://localhost:9001/step07-sounds` : Preload sounds assets and play sound effects

  [grunt]: http://gruntjs.com/  "Grunt.js"
  [bower]: http://bower.io/  "Bower"
  [yeoman]: http://yeoman.io  "Yeoman"
  [createjs]: createjs.com  "CreateJS"
