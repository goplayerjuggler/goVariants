# Go-Variants-Engine
This module provides a Go engine for standard [Go](https://en.wikipedia.org/wiki/Go_(game)) and toroidal Go (t-Go). It may in the future handle Go on other graphs that are locally like Go like cylinders, twisted toroids, Klein surfaces, … 

At present the primary function of the module is to handle the mechanics of making a move on a board. It counts liberties, and determines which if any stones are removed as a consequence of the move. Later on [superkos](https://senseis.xmp.net/?Superko) and [scoring](https://senseis.xmp.net/?Scoring) may also be implemented. 


## Usage
This section is for those who are familiar or are getting familiar with node.js and related tools. This module is built using node.js. Working on a system with a recent version of node / npm is probably necessary.
## Installation 
Copy or clone (via git) the source files for this module to a local folder. Then, from within that folder:
```
$ npm install
```
If you have installed yarn, you can use it instead of npm.
```
$ yarn install
```
Check the installation worked by running the unit tests:

```
$ gulp test
```

Disclaimer: this installation procedure has not been tested.
## API
See the unit tests for some sample calls.

(section yet to be completed)
