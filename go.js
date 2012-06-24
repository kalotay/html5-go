var BOARD_SIZE = 19;

function createRow(parentDiv) {
    var i;
    var newPosition;
    for (i = 0; i < BOARD_SIZE; ++i) {
        newPosition = document.createElement("img");
        newPosition.src = "intersect.png";
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
