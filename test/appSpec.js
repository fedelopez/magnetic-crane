import Box from "../src/box.js";
import BoxPile from "../src/box_pile.js";
import State from "../src/state.js";
import chai from "chai";
const { expect } = chai;

describe("magnetic-crane", function () {

    describe("state: nextState", function () {

        it("should return the first empty spot to get rid of the box on top", function () {
            var b1 = new Box("B1", "blue", 0, 1, 1, 1),
                g1 = new Box("G1", "green", 0, 0, 1, 1),
                r1 = new Box("R1", "red", 2, 0, 1, 1),
                o1 = new Box("O1", "orange", 3, 0, 1, 1),
                b2 = new Box("B2", "blue", 4, 0, 1, 1);
            var boxes = [b1, g1, r1, o1, b2];

            var boxPile = new BoxPile(boxes, 5, 2);
            var actual = new State(boxPile).nextState(g1, 2, 1);
            expect(actual.getBoxPile().boxAt(0, 1)).to.not.exist;
            expect(actual.getBoxPile().boxAt(1, 0).name).to.equal(b1.name);
        });

        it("should propose getting rid of the box of the top to get it out of the way", function () {
            var b1 = new Box("B1", "blue", 0, 1, 1, 1),
                g1 = new Box("G1", "green", 0, 0, 1, 1),
                r1 = new Box("R1", "red", 1, 0, 1, 1),
                o1 = new Box("O1", "orange", 2, 0, 1, 1),
                b2 = new Box("B2", "blue", 3, 1, 1, 1);
            var boxes = [b1, g1, r1, o1, b2];

            var actual = new State(new BoxPile(boxes, 4, 2)).nextState(g1, 2, 1);
            expect(actual.getBoxPile().boxAt(0, 1)).to.not.exist;
            expect(actual.getBoxPile().boxAt(1, 1).name).to.equal(b1.name);
        });

        it("should propose getting rid of the boxes of the top to get it out of the way", function () {
            var b1 = new Box("B1", "blue", 0, 0, 1, 1),
                g1 = new Box("G1", "green", 1, 0, 1, 1),
                r1 = new Box("R1", "red", 1, 1, 1, 1),
                o1 = new Box("O1", "orange", 2, 0, 1, 1),
                b2 = new Box("B2", "blue", 2, 1, 1, 1);
            var boxes = [b1, g1, r1, o1, b2];

            var actual = new State(new BoxPile(boxes, 3, 3)).nextState(g1, 2, 1);
            expect(actual.getBoxPile().boxAt(1, 1)).to.not.exist;
            expect(actual.getBoxPile().boxAt(0, 1).name).to.equal(r1.name);

            actual = actual.nextState(g1, 2, 1);
            expect(actual.getBoxPile().boxAt(2, 1)).to.not.exist;
            expect(actual.getBoxPile().boxAt(0, 2).name).to.equal(b2.name);
        });

        it("should know how to get rid of large boxes", function () {
            var b1 = new Box("B1", "blue", 0, 0, 1, 1),
                g1 = new Box("G1", "green", 1, 0, 1, 1),
                r1 = new Box("R1", "red", 1, 1, 1, 1),
                o1 = new Box("O1", "orange", 2, 0, 1, 1),
                b2 = new Box("B2", "blue", 2, 1, 1, 1);
            var boxes = [b1, g1, r1, o1, b2];

            var actual = new State(new BoxPile(boxes, 3, 3)).nextState(g1, 2, 1);
            expect(actual.getBoxPile().boxAt(1, 1)).to.not.exist;
            expect(actual.getBoxPile().boxAt(0, 1).name).to.equal(r1.name);

            actual = actual.nextState(g1, 2, 1);
            expect(actual.getBoxPile().boxAt(2, 1)).to.not.exist;
            expect(actual.getBoxPile().boxAt(0, 2).name).to.equal(b2.name);
        });

        it("should propose the next abscissa when the first option is already full of boxes", function () {
            var b1 = new Box("B1", "blue", 0, 0, 1, 1),
                b2 = new Box("B2", "blue", 0, 1, 1, 1),
                g1 = new Box("G1", "green", 1, 0, 1, 1),
                r1 = new Box("R1", "red", 1, 1, 1, 1),
                o1 = new Box("O1", "orange", 2, 0, 1, 1),
                w1 = new Box("W1", "white", 3, 0, 1, 1);
            var boxes = [b1, g1, r1, o1, b2, w1];

            var actual = new State(new BoxPile(boxes, 4, 2)).nextState(b1, 2, 1);
            expect(actual.getBoxPile().boxAt(0, 1)).to.not.exist;
            expect(actual.getBoxPile().boxAt(3, 1).name).to.equal(b2.name);
        });

        it("should propose the next abscissa when the first options are already full of boxes", function () {
            var b1 = new Box("B1", "blue", 0, 0, 1, 1),
                b2 = new Box("B2", "blue", 0, 1, 1, 1),
                g1 = new Box("G1", "green", 1, 0, 1, 1),
                g2 = new Box("G2", "green", 1, 1, 1, 1),
                o1 = new Box("O1", "orange", 2, 0, 1, 1),
                o2 = new Box("O2", "orange", 2, 1, 1, 1),
                w1 = new Box("W1", "white", 3, 0, 1, 1),
                p1 = new Box("P1", "purple", 4, 0, 1, 1);
            var boxes = [b1, g1, g2, o1, o2, b2, w1, p1];

            var actual = new State(new BoxPile(boxes, 5, 2)).nextState(b1, 2, 1);
            expect(actual.getBoxPile().boxAt(0, 1)).to.not.exist;
            expect(actual.getBoxPile().boxAt(3, 1).name).to.equal(b2.name);

            actual = actual.nextState(b1, 2, 1);
            expect(actual.getBoxPile().boxAt(2, 1)).to.not.exist;
            expect(actual.getBoxPile().boxAt(4, 1).name).to.equal(o2.name);
        })
    });

    describe("box pile suite", function () {
        var allBoxes, boxPile;

        beforeEach(function () {
            allBoxes = [
                new Box("B1", "blue", 1, 1, 1, 1),
                new Box("G1", "green", 1, 0, 1, 1),
                new Box("R1", "red", 2, 0, 2, 1),
                new Box("O1", "orange", 3, 0, 1, 1),
                new Box("B2", "blue", 4, 0, 2, 2),
                new Box("G2", "green", 6, 0, 1, 2),
                new Box("R2", "red", 8, 0, 1, 1),
                new Box("O2", "orange", 9, 0, 2, 1)
            ];
            boxPile = new BoxPile(allBoxes, 10, 3);
        });

        it("should return false when a box has no other box above", function () {
            expect(boxPile.isBoxAbove(allBoxes[0])).to.be.false;
            expect(boxPile.isBoxAbove(allBoxes[2])).to.be.false;
        });

        it("should return true when a box has another box above", function () {
            expect(boxPile.isBoxAbove(allBoxes[1])).to.be.true;
        });

        it("should return undefined when a box no topmost box above", function () {
            expect(boxPile.topmostBoxAbove(allBoxes[0])).to.not.exist;
        });

        it("should return the topmost box above a given box", function () {
            expect(boxPile.topmostBoxAbove(allBoxes[1])).to.equal(allBoxes[0]);
        });

        it("should intersect with box at (1,0)", function () {
            expect(boxPile.intersectsBoxAt(1, 0)).to.be.true;
        });

        it("should intersect with box at (1,1)", function () {
            expect(boxPile.intersectsBoxAt(1, 1)).to.be.true;
        });

        it("should intersect with box at (7,0)", function () {
            expect(boxPile.intersectsBoxAt(7, 0)).to.be.true;
        });

        it("should not intersect with box at (2,2)", function () {
            expect(boxPile.intersectsBoxAt(2, 2)).to.be.false;
        });

    });

    describe("move suite", function () {

        it("should clear the top of the source box", function () {
            var b1 = new Box("B1", "blue", 0, 1, 1, 1),
                g1 = new Box("G1", "green", 0, 0, 1, 1),
                r1 = new Box("R1", "red", 2, 0, 1, 1),
                o1 = new Box("O1", "orange", 3, 0, 1, 1),
                b2 = new Box("B2", "blue", 4, 0, 1, 1);
            var pile = new BoxPile([b1, g1, r1, o1, b2], 4, 2);

            var steps = BoxPile.moveBox(new State(pile), g1, 1, 0);
            expect(steps.length).to.equal(2);

            var step1 = steps[0];
            expect(step1.getBox().name).to.equal(b1.name);
            expect(step1.getDstX()).to.equal(2);
            expect(step1.getDstY()).to.equal(1);

            var step2 = steps[1];
            expect(step2.getBox().name).to.equal(g1.name);
            expect(step2.getDstX()).to.equal(1);
            expect(step2.getDstY()).to.equal(0);
        });

        it("should clear the top of the source and destination boxes", function () {
            var b1 = new Box("B1", "blue", 0, 0, 1, 1),
                g1 = new Box("G1", "green", 0, 1, 1, 1),
                r1 = new Box("R1", "red", 1, 0, 1, 1),
                o1 = new Box("O1", "orange", 1, 1, 1, 1),
                b2 = new Box("B2", "blue", 2, 0, 1, 1);
            var pile = new BoxPile([b1, g1, r1, o1, b2], 4, 3);

            var steps = BoxPile.moveBox(new State(pile), b1, 1, 1);
            expect(steps.length).to.equal(3);

            var step1 = steps[0];
            expect(step1.getBox().name).to.equal(g1.name);
            expect(step1.getDstX()).to.equal(3);
            expect(step1.getDstY()).to.equal(0);

            var step2 = steps[1];
            expect(step2.getBox().name).to.equal(o1.name);
            expect(step2.getDstX()).to.equal(2);
            expect(step2.getDstY()).to.equal(1);

            var step3 = steps[2];
            expect(step3.getBox().name).to.equal(b1.name);
            expect(step3.getDstX()).to.equal(1);
            expect(step3.getDstY()).to.equal(1);
        });
    });
});