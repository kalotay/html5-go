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

function Shape(owner, row, column) {
    this.chain = new HashSet();
    this.liberties = new HashSet();
    this.isSuperceded = false;
    this.owner = owner;

    chain.add(new Intersection(row, column));
    this.generateLiberties(row, column);
}

Shape.prototype.interact = function (other) {
    other.liberties = other.liberties.complement(this.chain);
    if ((this.owner === other.owner)
        && (!this.liberties.intersect(other.chain).isEmpty())) {
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
    return function(row, column) {
        if (row > 0) {
            this.liberties.add(new Intersection(row - 1, column));
        }
        if (row < (BoardSize - 1)) {
            this.liberties.add(new Intersection(row + 1, column));
        }
        if (column > 0) {
            this.liberties.add(new Intersection(row, column - 1));
        }
        if (column < (BoardSize - 1)) {
            this.liberties.add(new Intersection(row, column + 1));
        }
    };
}

Shape.prototype.generateLiberties = makeGenerateLiberties(BOARD_SIZE);

function ShapeCollection() {
    this.shapes = [];
}

ShapeCollection.prototype.add = function(owner, row, column) {
    var newShape = new Shape(owner, row, column);
    this.shapes.forEach(Shape.prototype.interact, newShape);
    this.shapes.push(newShape);
};


ShapeCollection.prototype.removeDead = function(owner) {
    var killedShapes = []
    var newShapes = this.shapes.filter(function (shape) {
        return !shape.isSuperceded;
    });
};

//mock object to be implemented
shapeCollectionMock = {
    "add": function(owner, row, column) {},
    "removeDead": function(owner) { return [{"row": 0, "column": 0}]; }
};

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
        document.body.children[intersection.row].children[intersection.column].value = "free";
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
    var shapeCollection = shapeCollectionMock;
    for (i = 0; i < BOARD_SIZE; ++i) {
        newRow = document.createElement("div");
        onButtonPressFactory = makeOnButtonPress(i, shapeCollection);
        createRow(newRow, onButtonPressFactory);
        document.body.appendChild(newRow);
    }
}
