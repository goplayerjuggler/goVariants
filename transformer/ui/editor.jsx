module.exports = (rootId) =>
    <div>

        <style type="text/css">
            {`#${rootId}
.masonry {
    -moz-column-count: 3;
    -webkit-column-count: 3;
    column-count: 3;
    column-gap: 1em;
}
.item {
    background-color: #fff;
    display: inline-block;
    margin: 0 0 1em;
    
    padding: 2px;
    border: 1px black solid;
    width: 100%;
}
}
.go-variants-extras {
display: none !important;
}`}
        </style>
        <div class="masonry">
            <div class="item go-variants-extras">
                Paste the SGF for a game of toroidal Go, aka t-Go, (e.g. from Little Golem) in the box, and then push the button to view the game!
            <br/><label for={`${rootId}_sgfIn`}>T-Go SGF:</label>
                <textarea id={`${rootId}_sgfIn`} rows="3"></textarea>
                <input type="button" id={`${rootId}_goButton`} value="show board (from t-Go SGF)" />

            </div>

            <div class="item go-variants-extras">
                <label for={`${rootId}_littleGolemId`}>LittleGolem game ID:</label>
                <input id={`${rootId}_littleGolemId`} type="text"></input>
                <input type="button" id={`${rootId}_goLgButton`} value="show board (from littleGolem game ID)" /><span id={`${rootId}_goLgMsg`} />
            </div>

            <div class="item go-variants-extras">
                <label for={`${rootId}_sizeSelect`}>Size:</label>
                <select id={`${rootId}_sizeSelect`}>
                    {/* options filled by editor.js */}
                </select>
                <input type="button" id={`${rootId}_newButton`} value="New game" />
            </div>
            <div style="display: none" id={`${rootId}_transformedSgfFs`} class="item go-variants-extras">
                <label for={`${rootId}_sgfOut`}>Transformed SGF:</label>
                <textarea id={`${rootId}_sgfOut`} rows="3"></textarea>
            </div>
            <div id={`${rootId}_viewerControls`} style="display:none" class="item">

                <table title="panning" style="float:left">
                    <tr>
                        <td colspan="2" style="text-align: center">
                            <input type="button" value="↑" />
                        </td>
                        <td rowspan="4" style="vertical-align: middle">“Panning”
                <p> Use the buttons to the left to move the “centre” of the board.</p>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <input type="button" value="←" />
                        </td>
                        <td>
                            <input type="button" value="→" />
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" style="text-align: center">
                            <input type="button" value="↓" />
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" style="text-align: center; font-size: small" id={`${rootId}_offsetTr`} >
                            panned: [0,0]
            </td>
                    </tr>
                </table>
            </div>
            <div class="item">
                <label for={`${rootId}_wraparoundSelect`}>number of wraparound lines to add:</label>
                <select id={`${rootId}_wraparoundSelect`}>
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4" selected>4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>

                </select>
                <br />
                <label for="addComments">add comments:</label>
                <input type="checkbox" id={`${rootId}_addComments`} checked />
                <br />
                <label for={`${rootId}_wraparoundBorderSelect`}>Type of border for wraparound:</label>
                <select id={`${rootId}_wraparoundBorderSelect`}>
                    <option value="0">No border</option>
                    <option value="1" selected>Full border</option>
                    <option value="2">Partial border (corners &amp; middles)</option>
                    <option value="3">Just corners</option>
                    <option value="4">Just middles</option>
                </select>
                <br />
                <label for={`${rootId}_coordinateSelect`}>Type of coordinates:</label>
                <select id={`${rootId}_coordinateSelect`}>
                    <option value="0">None</option>
                    {/* <option value="2">Chinese</option>
                <option value="3">Japanese</option> todo */}
                    <option value="1" selected>Western (A1; BL)</option>
                </select>
                <br />
                <input type="button" id={`${rootId}_updateButton`} value="update (from board)" style="display:none" />
            </div>

        </div>
        <div id={`${rootId}_playerDiv`} style="position:relative; height: 75vh;width: 100vw"></div>
    </div>