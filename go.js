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

function IntersectionCollection(seedRow, seedColumn) {
    this.data = [];
    this.add(seedRow, seedColumn);
}

IntersectionCollection.rowColumnToIndex = function (row, column) {
    return BOARD_SIZE * row + column;
};

IntersectionCollection.indexToRowColumn = function (index) {
    var column = index % BOARD_SIZE;
    var row = (index - column) / BOARD_SIZE;
    return {"row": row, "column": column};
};

IntersectionCollection.prototype.add = function (row, column) {
    var index = IntersectionCollection.rowColumnToIndex(row, column)
    this.data.push(index);
};

IntersectionCollection.prototype.isEmpty = function () {
    return this.data.length === 0;
};

IntersectionCollection.prototype.contains = function (row, column) {
    var index = IntersectionCollection.rowColumnToIndex(row, column);
    return this.data.indexOf(index) !== -1;
};

IntersectionCollection.prototype.remove = function (row, column) {
    var index = IntersectionCollection.rowColumnToIndex(row, column);
    var arrayIndex = this.data.indexOf(index);
    if (arrayIndex === -1) {
        return null;
    }
    this.data.splice(arrayIndex, 1);
    return {"row": row, "column": column};
};

function Shape(seedIntersections) {
    this.chain = seedIntersections;
    this.liberties = null;
    this.isDead = false;
}

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
