# Go-Variants-Engine
This module provides a Go engine for standard [Go](https://en.wikipedia.org/wiki/Go_(game)) and [Toroidal Go](http://senseis.xmp.net/?ToroidalGo). It may in the future handle Go on other graphs that are locally like Go like cylinders, twisted toroids, Klein surfaces, … 

At present it handles:
* the mechanics of playing a move (counting liberties, removing chains with zero liberties…)
* [Scoring](https://senseis.xmp.net/?Scoring)

[Ko](https://senseis.xmp.net/?Ko) and [Superko](https://senseis.xmp.net/?Superko) have not been implemented. 

This project is mostly written in ECMAScript.

## Usage
This section is for those who are familiar, or are getting familiar, with node.js and related tools. This module is built using node.js. Working on a system with a recent version of node / npm is probably necessary.
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

## Scoring

0. In order for scoring to work, _marks_ (i.e. “X” marks, represented via “MA” in SGF) should be used to indicate dead stones. 
1. For each connected (maximal) component of territory, made up of one or several empty intersections and one or several dead stones:
	1. one (or more) of the dead stones should be _marked_.
	2. if no dead stones are _marked_, then the area will not be scored as territory; it will be scored as a seki.
2. If any empty point is marked, then scoring will not work.
3. If stones of both colours are marked in an inconsistent manner, then scoring will not work.
4. The scoring method used is [Territory Scoring](https://senseis.xmp.net/?TerritoryScoring). (At some point [Area Scoring](https://senseis.xmp.net/?AreaScoring) may be implemented as well.)

## Licence

[MIT](https://spdx.org/licenses/MIT.html)

## API
See the unit tests for some sample calls.

(section yet to be completed)
