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

function makeIntersectionHashCode(BoardSize) {
    return function () {
        return BoardSize * this.row + this.column;
    };
}

function makeIntersectionEquals(BoardSize) {
    return function (other) {
        return (this.row === other.row) && (this.column === other.column);
    };
}

function Intersection(row, column) {
    this.row = row;
    this.column = column;
}

Intersection.prototype.hashCode = makeIntersectionHashCode(BOARD_SIZE);
Intersection.prototype.equals = makeIntersectionEquals(BOARD_SIZE);

function ShapeCollection(turner) {
    this.chain = [];
    this.liberties = [];
    this.owner = [];
    this.turner = turner;
}

ShapeCollection.prototype.add = function(row, column) {
    var newShape = new Intersection(row, column);
};

ShapeCollection.prototype.removeDead = function(row, column) {
};

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
        newPosition.className = i.toString(10);
        newPosition.addEventListener("click", onButtonPress);
        parentDiv.appendChild(newPosition);
    }
}

function createBoard() {
    var i;
    var newRow;
    for (i = 0; i < BOARD_SIZE; ++i) {
        newRow = document.createElement("div");
        newRow.className = i.toString(10);
        createRow(newRow);
        document.body.appendChild(newRow);
    }
}
