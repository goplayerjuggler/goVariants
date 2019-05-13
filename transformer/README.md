# Go-Variants-Transformer

This module provides tools for viewing and editing game records or game commentaries, for a Go variant. At present, the only Go variant that is handled is [Toroidal Go](http://senseis.xmp.net/?ToroidalGo). The project is mostly written in ECMAScript;  minified javascript bundles are provided which should work on modern browsers.

This module builds on existing software for viewing/editing [Go](https://en.wikipedia.org/wiki/Go_(game)) games with standard rules. It works by transforming [SGF](http://www.red-bean.com/sgf/index.html) for the Go variant into SGF that works in SGF viewers for standard Go. 

The two main parts of this module are:

-   `src/transformer.js`: Provides a function for transforming SGF for a Go variant to SGF for a standard Go viewer; also provides a function for the inverse transformation.
-   `ui/editor.js` and `ui/editor.jsx`: provide a viewer/editor by combining `transformer.js` and the Web Go Board from the [GoProject](https://github.com/IlyaKirillov/GoProject) library.

## Online samples

-   [viewer & editor](https://goplayerjuggler.github.io/goVariants/tGoEditor.html) (the source code is [here](https://github.com/goplayerjuggler/goVariants/tree/master/docs/tGoEditor.html)). 
-   Blog posts (games of toroidal Go with commentaries)

    -   [(2018-03-16) a memorable game with a few ups and downs](http://goplayerjuggler.blogspot.com/2018/03/toroidal-go-commentary-on-memorable.html)
    -   [(2017-12-22) a big fight](http://goplayerjuggler.blogspot.com/2017/12/a-big-fight-in-t-go-game-same-game-but.html)
        This blog post was made by adapting the files [viewerLocal.html](https://github.com/goplayerjuggler/goVariants/tree/master/transformer/samples/viewerLocal.html) and [blogTemplate.html](https://github.com/goplayerjuggler/goVariants/tree/master/transformer/samples/blogTemplate.html).

## Libraries used

-   SGF viewer: [Web Go Board](https://github.com/IlyaKirillov/GoProject) – special thanks to Ilya Kirillov, the developer of Web Go Board, for [building a few features](https://github.com/IlyaKirillov/GoProject/issues/28) to improve the integration with  this project.

      In earlier versions of the viewer/editor UI component, the library [WGo.js](https://github.com/waltheri/wgo.js) was used – it still could be used for in read-only mode for reviewing games without variations. 

-   For parsing and manipulating SGF data:
    [smartgame](https://github.com/neagle/smartgame) and [smartgamer](https://github.com/neagle/smartgamer)

## Usage - for HTML / Javascript developers

This section just assumes basic knowledge of HTML and javascript.

### Recommended method: via the `editor` component

The recommended way to use this library via an `editor` component, as in the [online demo](https://goplayerjuggler.github.io/goVariants/tGoEditor.html). The source code is here: [`tGoEditor.html`](https://github.com/goplayerjuggler/goVariants/tree/master/docs/tGoEditor.html).

#### Steps

1.  Three script tags should be added inside the html `head`:

    ```html
    <head>
        ...
        <script type="text/javascript" language="JavaScript" src="
        https://cdn.rawgit.com/IlyaKirillov/GoProject/c20084d83c01b394cbf2f19b92b114feebb7fb8c/WebBuilds/goboardmin.js"></script>
        <script type="text/javascript" language="JavaScript" src="https://cdn.rawgit.com/goplayerjuggler/goVariants/9ec632af7c8c2b9a03d4d853ddaca977c3135771/transformer/utils/no-react.js"></script>
        <script type="text/javascript" language="JavaScript" src="https://cdn.rawgit.com/goplayerjuggler/goVariants/<versionId>/transformer/dist/ui/editor.min.js"></script>
    </head>
    ```

    The `versionId` to use for the last script can be copied from [`tGoEditor.html`](https://github.com/goplayerjuggler/goVariants/blob/master/docs/tGoEditor.html). 

2.  In order to open the page with a game preloaded, add the following HTML to the page, inside the `body`:
    ```html
    <div id="sgfViewer" class="go-variants-editor">
        <div style="display: none" class="go-variants-data">
            ...T-Go SGF for the game to be displayed is inserted here
        </div>
    </div>
    ```
    Alternatively, in order to display the editor component without a game preloaded, just leave out the inner `div` with the class `go-variants-data`.

#### Displaying a specific game

The component can be loaded with a specific game displayed as follows. 

1. If the main `div` contains an inner `div` with `class="go-variants-data"`, the game given by the SGF inside that inner `div` is used.

1. Otherwise, if there is a HTTP GET parameter `sgf` in the URL, then that is used. “Hello world” example: [link](https://goplayerjuggler.github.io/goVariants/tGoEditor.html?sgf=(%3BFF[4]+GM[1]+SZ[4]C[hello+world])).

1. Otherwise, if there is a HTTP GET parameter `littlegolemid` in the URL, then that is used to load the game from [Little Golem](http://littlegolem.net). Example, with a real game: [Game #1873254](https://goplayerjuggler.github.io/goVariants/tGoEditor.html?littlegolemid=1873254).

#### Notes:

1.  Some parts of the editor component can be hidden by adding the CSS class `go-variants-hide-extras` to the main `div`. 

    ```html
    <div id="sgfViewer" class="go-variants-editor go-variants-hide-extras">
    ```

    The sections that are hidden when `go-variants-hide-extras` is added are:

    -   the “t-Go SGF” section 
    -   the “load from LittleGolem” section
    -   the “new game” section
    -   the “transformed SGF” section

2.  An `id` needs to be provided for the main `div`; there are no specific constraints on the value.
3.  multiple instances of the component can be used by creating several main `div`s.

    ```html
    <div id="game1" class="go-variants-editor go-variants-hide-extras">
    ...
    </div>
    <div id="game2" class="go-variants-editor go-variants-hide-extras">
    ...
    </div>
    ```

### Lower-level technique importing the transform function

Alternatively, order to just tranform t-Go SGF, the main function defined in [`src/transformer.js`](https://github.com/goplayerjuggler/goVariants/tree/master/transformer/src/transformer.js) can be used. 

This function can be loaded in an html page by adding a `script` tag in order to load the minified version `transformer.min.js` as follows (the version ID has to be set according to some git version id for the file).

```html
<script type="text/javascript" language="JavaScript" src="https://cdn.rawgit.com/goplayerjuggler/goVariants/<versionId>/transformer/dist/src/transformer.min.js"></script>
```

 If `transformer.min.js` is referenced by an HTML page, it creates a global function `go_variants_transformer`. It can (fairly easily) combined with a javascript library for viewing Go games like [WGo.js](https://github.com/waltheri/wgo.js) or [GoProject](https://github.com/IlyaKirillov/GoProject).

A simple sample using this technique, to be run locally, is [here](https://goplayerjuggler.github.io/goVariants/tree/master/transformer/samples/viewerLocal.html). 

See the API section for details or better yet, the code on github. 

## Usage, for node developers

This section is for those who are familiar or are getting familiar with node.js and related tools. As this module is built using node.js, working on a system with a recent version of node / npm is probably necessary.

### Installing Go-Variants-Transformer

Copy or clone (via git) the source files for Go-Variants. 
Then, from within the `transfomer` local sub-folder:

```shell
$ npm install
```

If you `yarn`, you can use it instead of `npm`.

```shell
$ yarn install
```

Check the installation worked by running the unit tests (assuming `gulp` is installed globally):

```shell
$ gulp test
```

In order to run the editor locally, the dependency `goboardmin.js` from the [GoProject](https://github.com/IlyaKirillov/GoProject) library has to be manually installed in the `lib` folder.

### Installation in a different project

First install `Go-Variants-Transformer` as described in the previous section. Then add it to your project's dependencies in `package.json`:

With npm:

```shell
$ npm install --save file:path/to/Go-Variants-Transformer
```

With yarn:

```shell
$ yarn add file:path/to/Go-Variants-Transformer --save 
```

### Standalone usage

A simple way to convert an SGF (t-Go) file is to run `/samples/transformOneFile.js`. Just open a command line in the `samples` folder and run the following command.

```shell
$ node transformOneFile path_to_input_sgf path_to_output_sgf 
```

## Licence

[MIT](https://spdx.org/licenses/MIT.html)

## API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

#### Table of Contents

-   [transformer](#transformer)
-   [translateCoordinates](#translatecoordinates)
-   [options](#options)
-   [inverseProjectOnFlat](#inverseprojectonflat)
-   [projectOnFlat](#projectonflat)
-   [coords2String](#coords2string)
-   [inverseTransform](#inversetransform)
-   [cleanLabels](#cleanlabels)
-   [transform](#transform)

### transformer

Provides a function for transforming SGF for a Go variant to SGF for a standard Go viewer; also provides a function for the inverse transformation.

**Parameters**

-   `options` **[object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)?** Defines various options for the output SGF. May be omitted, in which case the default options (see below) are used.
    -   `options.addComments` **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** When flagged, comments are added to each node giving the move number and the number of stones captured by Black and White. (optional, default `false`)
    -   `options.addMoveNumber` **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** When flagged, `MN[<moveNumber>]` is added to each node. (optional, default `false`)
    -   `options.moveType` **[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)** Controls how moves are represented in the transformed SGF. Examples given for black moves, so with option 2 a white move is represented by `W[point]AW[otherPoints]`. Options: -   0: `AB[points]`;

        -   1: `AB[points]B[]` (same as for `moveType===0` but with the “pass” (“B\[]”);

        -   2: `B[point]AB[otherPoints]` where `point` is the coordinates of the move in the main board (a single point), and `otherPoints` is an array of the coordinates of the move in the wraparound area.;

        -   3: `B[points]`; (optional, default `2`)
    -   `options.markLastMove` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** Gives the SGF attribute to be created to mark each move. May be left empty/null/undefined. Or else a value like `"CR"`. (optional, default `null`)
    -   `options.boardDimensions` **[array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)** May be used for rectangular t-Go. Should be ommitted for [n, n] t-Go, where n is specified in the input SGF (@param variantSgf). (optional, default `[11,11]`)
    -   `options.coordinatesType` **[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)** Options: -   0: none;

        -   1: (→↑;A|1-K|11): Western;

        -   2: (→↑;A|1-L|11): Western, no “I”;

        -   3: (→↓;1|1-11|11): Latin/Latin, top to bottom;

        -   4: (→↓;1|1-11|十一): Latin/Chinese, top to bottom; (optional, default `0`)
    -   `options.wraparoundMarkersType` **[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)** Options:-   0: none;

        -   1: Full outline, using unicode Box Drawing symbols;

        -   2: corners and middles, using unicode Box Drawing symbols;

        -   3: just corners, using unicode Box Drawing symbols;

        -   4: just middles, using unicode Box Drawing symbols; (optional, default `1`)
    -   `options.projectionSettings` **[object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)?** Further optional settings for how the (toroidal, or other sort of) board is projected to a flat grid.
        -   `options.projectionSettings.wraparound` **[number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)** Number of lines to add for the “wraparound”. (optional, default `4`)
        -   `options.projectionSettings.offset` **[array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)** Translation to apply to all moves. (optional, default `[0,0]`)
    -   `options.transformToString` **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** When set to false, the output is an object (an instance of a Smartgame). (optional, default `true`)

Returns **[object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** An object exposing functions for going back and forth between SGF for a standard viewer, and SGF for a game of toroidal Go

### translateCoordinates

Translate alpha coordinates into an array

**Parameters**

-   `alphaCoordinates`  
-   `string`  alphaCoordinates

Returns **any** array [x, y]

### options

### inverseProjectOnFlat

This is the inverse function to the function “projectOnFlat” – at least it is when “multiple” is false.

**Parameters**

-   `points` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)** The point or array of points projected onto the grid.
-   `multiple`  

Returns **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)** When the flag “multiple” is flagged, returns an array of points; otherwise returns a single point (i.e. an array of two integers).

### projectOnFlat

Projects a point on the t-Go board to the array of points on the standard grid/board.

**Parameters**

-   `p` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)** The point in the t-Go board to be projected on to the grid.

Returns **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)** 

### coords2String

converts coordinates to a string

**Parameters**

-   `coords`  

### inverseTransform

Apart from a few details, this is an inverse of the transform function.

**Parameters**

-   `wrappedGame` **(smartgame | [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String))** 
-   `smartgame` **smartgame** 

### cleanLabels

Function to:
	\- remove the “border” (unicode symbols added by the transform to indicate where the wraparound area meets the main grid).
	\- remove CM (colour map) and CT (colour table) which are nonstandard SGF added by CGoboard for background colour (could be interesting to use this feature later on).

### transform

Main function; converts SGF for a Go variant (so far, just toroidal Go or t-Go).

**Parameters**

-   `tSgf` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 
-   `tGo` **[object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** Engine for counting liberties in t-Go. An instance of go-variants-engine.
-   `smartgame` **any** 
-   `smartgamer` **any** 

Returns **([string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String) \| [object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object))** SGF that can be viewed in a standard SGF viewer. (See `options.transformToString` for the data type of the value returned.)
