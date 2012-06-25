var BOARD_SIZE = 19;
//closures ftw
var Turner = (function () {
    var turn = "black";
    var Turner = {};
    Turner.turn = function () {
        if (turn === "black") {
            turn = "white";
        } else {
            turn = "black";
        }
    };
    Turner.get = function () {
        return turn;
    };
    return Turner;
})()

function onButtonPress(clickEvent) {
    var button = clickEvent.target;
    if (button.value !== "free") {
        return;
    }
    button.value = Turner.get();
    Turner.turn();
}

function createRow(parentDiv) {
    var i;
    var newPosition;
    for (i = 0; i < BOARD_SIZE; ++i) {
        newPosition = document.createElement("button");
        newPosition.type = "button";
        newPosition.value = "free";
        newPosition.addEventListener("click", onButtonPress);
        parentDiv.appendChild(newPosition);
    }
}

function createBoard() {
    var i;
    var newRow;
    for (i = 0; i < BOARD_SIZE; ++i) {
        newRow = document.createElement("div");
        createRow(newRow);
        document.body.appendChild(newRow);
    }
}
