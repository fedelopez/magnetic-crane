import BoxPile from './box_pile.js';
import MoveCommand from './move_command.js';
import State from './state.js';
import * as d3 from 'd3';

const timeout = 1500;

const boxW = 80;
const boxH = 80;
const maxBoxH = boxH * 2;

const xLimit = 10;
const baseLineW = boxW * xLimit;
const baseLineH = 15;

const craneW = 20;
const craneH = 80;

const magnetHookW = 50;
const magnetHookH = 15;

const terrainW = baseLineW;
const terrainH = maxBoxH * 4;

const terrain = BoxPile.createTerrain(terrainW, terrainH);
const moveCommand = new MoveCommand();

function runApp() {
    const moveButton = document.getElementById("moveBtn");
    moveButton.onclick = function () {
        moveBoxClicked();
    };

    d3.select("#app").selectAll("*").remove();

    const container = d3.select("#app")
        .append("svg")
        .attr("style", "display: block;margin: auto")
        .attr("width", terrainW)
        .attr("height", terrainH);

    //BASELINE
    container.append("rect")
        .attr("x", 0)
        .attr("y", terrainH - baseLineH)
        .attr("width", baseLineW)
        .attr("height", baseLineH)
        .style("fill", "Sienna");

    //CRANE
    container.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", baseLineW)
        .attr("height", baseLineH)
        .style("fill", "DarkSlateGray");
    container.append("rect")
        .attr("id", "crane")
        .attr("x", (terrainW / 2) - craneW / 2)
        .attr("y", baseLineH)
        .attr("width", craneW)
        .attr("height", craneH)
        .style("fill", "DarkSlateGray");
    container.append("rect")
        .attr("id", "magnet")
        .attr("x", (terrainW / 2) - magnetHookW / 2)
        .attr("y", baseLineH + craneH)
        .attr("width", magnetHookW)
        .attr("height", magnetHookH)
        .style("fill", "DarkSlateGray");

    //BOXES
    container.selectAll("[id^=box]")
        .data(terrain.getBoxes())
        .enter()
        .append("rect")
        .attr("id", function (box) {
            return "box-" + box.name;
        })
        .attr("x", function (box) {
            return box.x * boxW;
        })
        .attr("y", function (box) {
            return terrainH - baseLineH - (boxH * box.height) - (boxH * box.height * box.y);
        })
        .attr("width", function (box) {
            return box.width * boxW;
        })
        .attr("height", function (box) {
            return box.height * boxH;
        })
        .style("cursor", "pointer")
        .style("stroke", "lightgrey")
        .style("fill", "none")
        .style("stroke-width", 1)
        .style("fill", function (box) {
            return box.color;
        })
        .on("click", function (event, box) {
            const boxElement = document.getElementById("box-" + box.name);
            const [x, y] = d3.pointer(event);
            console.log("Box " + box.name + " clicked." + x + "," + y);

            moveCommand.setBox(box);
            const onTop = (y < (Number(boxElement.getAttribute("y")) + Number(boxElement.getAttribute("height") / 2)));
            if (onTop) {
                moveCommand.setWhere("on top of");
            } else {
                moveCommand.setWhere("below");
            }
            d3.select("#command").text(moveCommand.getText());
        });
}

function attachCrane(steps, dstX, dstY, callback) {
    const targetBox = steps[0].getBox();
    const boxElement = document.getElementById("box-" + targetBox.name);
    d3.select("#crane")
        .transition()
        .duration(timeout)
        .ease(d3.easeLinear)
        .attr("x", Number(boxElement.getAttribute("x")) + (boxW * targetBox.width) / 2 - craneW / 2)
        .on("end", function () {
            console.log("Crane engaged");
        })
        .transition()
        .duration(timeout)
        .ease(d3.easeLinear)
        .attr("height", terrainH - baseLineH - (boxH * targetBox.height) - (boxH * targetBox.y) - magnetHookH)
        .on("end", function () {
            console.log("Crane dropped");
        });
    d3.select("#magnet")
        .transition()
        .duration(timeout)
        .ease(d3.easeLinear)
        .attr("x", Number(boxElement.getAttribute("x")) + (boxW * targetBox.width) / 2 - magnetHookW / 2)
        .on("end", function () {
            console.log("Magnet engaged");
        })
        .transition()
        .duration(timeout)
        .ease(d3.easeLinear)
        .attr("y", terrainH - baseLineH - (boxH * targetBox.height) - (boxH * targetBox.y) - magnetHookH)
        .on("end", function () {
            console.log("Magnet attached");
            liftCrane(steps, dstX, dstY, callback);
        });
}

function liftCrane(steps, dstX, dstY, callback) {
    const targetBox = steps[0].getBox();
    console.log("About to lift " + targetBox.name);
    d3.select("#crane")
        .transition()
        .duration(timeout)
        .ease(d3.easeLinear)
        .attr("height", craneH)
        .on("end", function () {
            console.log("Crane lifted");
        });
    d3.select("#magnet")
        .transition()
        .duration(timeout)
        .ease(d3.easeLinear)
        .attr("y", baseLineH + craneH)
        .on("end", function () {
            console.log("Magnet lifted");
        });
    d3.select("#box-" + targetBox.name)
        .transition()
        .duration(timeout)
        .ease(d3.easeLinear)
        .attr("y", baseLineH + craneH + magnetHookH)
        .on("end", function () {
            console.log("Box lifted");
            dropPayload(steps, dstX, dstY, callback);
        });
}

function dropPayload(steps, dstX, dstY, callback) {
    const targetBox = steps[0].getBox();
    d3.select("#crane")
        .transition()
        .duration(timeout)
        .ease(d3.easeLinear)
        .attr("x", (steps[0].getDstX() * boxW) + ((boxW * targetBox.width) / 2) - (craneW / 2))
        .on("end", function () {
            console.log("Crane engaged");
        })
        .transition()
        .duration(timeout)
        .ease(d3.easeLinear)
        .attr("height", terrainH - baseLineH - (boxH * steps[0].getDstY()) - (boxH * targetBox.height) - magnetHookH)
        .on("end", function () {
            console.log("Crane dropped");
        });

    d3.select("#magnet")
        .transition()
        .duration(timeout)
        .ease(d3.easeLinear)
        .attr("x", (boxW * steps[0].getDstX()) + (boxW * targetBox.width) / 2 - magnetHookW / 2)
        .on("end", function () {
            console.log("Magnet engaged");
        })
        .transition()
        .duration(timeout)
        .ease(d3.easeLinear)
        .attr("y", terrainH - baseLineH - (boxH * steps[0].getDstY()) - (boxH * targetBox.height) - magnetHookH)
        .on("end", function () {
            console.log("Magnet dropped");
        });

    d3.select("#box-" + targetBox.name)
        .transition()
        .duration(timeout)
        .ease(d3.easeLinear)
        .attr("x", boxW * steps[0].getDstX())
        .transition()
        .duration(timeout)
        .ease(d3.easeLinear)
        .attr("y", terrainH - baseLineH - (boxH * steps[0].getDstY()) - (boxH * targetBox.height))
        .on("end", function () {
            console.log("Box dropped");
            steps.shift();
            resetCrane(function () {
                if (steps.length > 0) {
                    attachCrane(steps, dstX, dstY, callback);
                } else {
                    callback();
                }
            });
        });
}

function resetCrane(callback) {
    d3.select("#crane")
        .transition()
        .duration(timeout)
        .ease(d3.easeLinear)
        .attr("height", craneH);
    d3.select("#magnet")
        .transition()
        .duration(timeout)
        .ease(d3.easeLinear)
        .attr("y", baseLineH + craneH)
        .on("end", function () {
            if (callback) {
                callback();
            }
        });
}

function moveBoxClicked() {
    if (moveCommand.canMove()) {
        const dstX = moveCommand.getDstBox().x;
        //TODO possible bug indexOf('top')
        const dstY = moveCommand.getDstBox().height * (moveCommand.getWhere().indexOf("top") ? moveCommand.getDstBox().y + 1 : moveCommand.getDstBox().y);
        const steps = BoxPile.moveBox(new State(terrain), moveCommand.getSrcBox(), dstX, dstY);
        console.log("Number of steps: " + steps.length);
        attachCrane(steps.slice(), dstX, dstY, function () {
            steps.forEach(function (step) {
                const box = terrain.getBoxByName(step.getBox().name);
                box.x = step.getDstX();
                box.y = step.getDstY();
            });
        });
    }
}

runApp();