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

function Points(seedRows, seedColumns) {
    this.rows = seedRows;
    this.columns = seedColumns;
}

function addPoint(row, column) {
    this.rows.push(row);
    this.columns.push(columns);
}

Points.prototype.add = addPoint;

function Shape(seedRow, seedColumn, otherShapes) {
    this.stones = new Points([seedRow], [seedColumn]);
    this.liberties = [];
    this.setLiberties(otherShapes);
}

function stoneInShape(row, column) {
}

Shape.prototype.isStone(row, column) = stoneInShape;

function libertyInShape(row, column) {
}

Shape.prototype.isLiberty(row, column) = libertyInShape;

function addToShape(row, column) {
}

Shape.prototype.add(row, column) = addToShape;

function setLiberties(otherShapes) {
}

Shape.prototype.setLiberties(otherShapes) = setLiberties;

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
