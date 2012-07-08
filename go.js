var BOARD_SIZE = 19;
//closures ftw
var Turner = (function () {
    var turn = "black";
    var Turner = {};
    Turner.turn = function () {
        var turnIndicator = document.getElementById("turn-indicator");
        if (turn === "black") {
            turn = "white";
        } else {
            turn = "black";
        }
        turnIndicator.value = turn;
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

function Shape(owner, row, column) {
    this.chain = new HashSet();
    this.liberties = new HashSet();
    this.isSuperceded = false;
    this.owner = owner;

    this.chain.add(new Intersection(row, column));
    this.generateLiberties();
}

Shape.prototype.interact = function(other) {
    other.liberties = other.liberties.complement(this.chain);
    if ((this.owner === other.owner) && (!this.liberties.intersection(other.chain).isEmpty())) {
        other.isSuperceded = true;
        this.chain = this.chain.union(other.chain);
        this.liberties = this.liberties.union(other.liberties);
    }
    this.liberties = this.liberties.complement(other.chain);
};

Shape.prototype.isDead = function () {
    return this.liberties.isEmpty();
};

function makeGenerateLiberties(BoardSize) {
    return function(intersection) {
        var row = intersection.row;
        var column = intersection.column;
        var liberties = new HashSet();
        if (row > 0) {
            liberties.add(new Intersection(row - 1, column));
        }
        if (row < (BoardSize - 1)) {
            liberties.add(new Intersection(row + 1, column));
        }
        if (column > 0) {
            liberties.add(new Intersection(row, column - 1));
        }
        if (column < (BoardSize - 1)) {
            liberties.add(new Intersection(row, column + 1));
        }
        return liberties;
    };
}

Shape.prototype.generateLiberties = function() {
    var liberties = this.chain.values().map(makeGenerateLiberties(BOARD_SIZE));
    this.liberties = liberties.reduce(function(accum, lib) {
        return accum.union(lib);
    }, new HashSet());
};

function ShapeCollection() {
    this.shapes = [];
}

ShapeCollection.prototype.add = function(owner, row, column) {
    var newShape = new Shape(owner, row, column);
    this.shapes.forEach(Shape.prototype.interact, newShape);
    this.shapes.push(newShape);
};


ShapeCollection.prototype.removeDead = function(owner) {
    var killedShapes = [];
    var keptShapes = this.shapes.filter(function (shape) {
        return !shape.isSuperceded;
    });
    keptShapes = keptShapes.filter(function (shape) {
        var toKeep = (shape.owner === owner) || !shape.isDead();
        if (!toKeep) {
            killedShapes = killedShapes.concat(shape.chain.values());
        }
        return toKeep;
    });
    recalculateLiberties(keptShapes);
    keptShapes = keptShapes.filter(function (shape) {
        var toKeep = !shape.isDead();
        if (!toKeep) {
            killedShapes = killedShapes.concat(shape.chain.values());
        }
        return toKeep;
    });
    recalculateLiberties(keptShapes);
    this.shapes = keptShapes;
    return killedShapes;
};

function recalculateLiberties(shapeArray) {
    shapeArray.forEach(function(shape) {
        shape.generateLiberties();
        shapeArray.forEach(function(other) {
            shape.interact(other);
        });
    });
}

function onButtonPress(clickEvent, row, column, shapeCollection) {
    var button = clickEvent.target;
    var owner = Turner.get();
    var toFree;
    if (button.value !== "free") {
        return;
    }
    button.value = owner;
    shapeCollection.add(owner, row, column);
    toFree = shapeCollection.removeDead(owner);
    freeButtons(toFree);
    Turner.turn();
}

function makeOnButtonPress(row, shapeCollection) {
    return function(column) {
        return function(clickEvent) {
            onButtonPress(clickEvent, row, column, shapeCollection);
        };
    };
}

function freeButtons(buttonLocations) {
    buttonLocations.forEach(function(intersection) {
        var parentDiv = document.getElementById("board");
        var row = parentDiv.children[intersection.row];
        row.children[intersection.column].value = "free";
    });
}

function createRow(parentDiv, onButtonPressFactory) {
    var i;
    var newPosition;
    for (i = 0; i < BOARD_SIZE; ++i) {
        newPosition = document.createElement("button");
        newPosition.type = "button";
        newPosition.value = "free";
        newPosition.addEventListener("click", onButtonPressFactory(i));
        parentDiv.appendChild(newPosition);
    }
}

function createBoard() {
    var i;
    var newRow;
    var shapeCollection = new ShapeCollection();
    var boardDiv = document.getElementById("board");
    for (i = 0; i < BOARD_SIZE; ++i) {
        newRow = document.createElement("div");
        onButtonPressFactory = makeOnButtonPress(i, shapeCollection);
        createRow(newRow, onButtonPressFactory);
        boardDiv.appendChild(newRow);
    }
}
