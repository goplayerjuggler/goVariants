# Go Variants

Provides some tools for Go variants – games inspired by the game [Go](https://en.wikipedia.org/wiki/Go_(game)). So far only [Toroidal Go](https://senseis.xmp.net/?ToroidalGo) is handled. Support for other variants may be added later on.

The tools in this project are mostly written in ECMAScript.

## Modules

### Go-Variants-Engine
This is a Go engine implementation for standard [Go](https://en.wikipedia.org/wiki/Go_(game)) and [Toroidal Go](http://senseis.xmp.net/?ToroidalGo). It may in the future handle Go on other graphs that are locally like Go like cylinders, twisted toroids, Klein surfaces, … 

At present it handles:
* the mechanics of playing a move (counting liberties, removing chains with zero liberties…)
* [Scoring](https://senseis.xmp.net/?Scoring)

[Ko](https://senseis.xmp.net/?Ko) and [Superko](https://senseis.xmp.net/?Superko) have not been implemented. 

More details [here](https://github.com/goplayerjuggler/goVariants/tree/master/engine).

### Go-Variants-Transformer
Provides tools for viewing and editing game records or game commentaries, for a Go variant. At present, the only Go variant that is handled is [Toroidal Go](http://senseis.xmp.net/?ToroidalGo). The code is bundled into minified javascript files so as to work on most modern browsers. More details [here](https://github.com/goplayerjuggler/goVariants/tree/master/transformer). 


## Licence

[MIT](https://spdx.org/licenses/MIT.html)

