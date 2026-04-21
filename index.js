//CONSTS
const gameParams = {
    width: 800,
    height: 400
};
const pixelSize = 10;

//DOM
const selectPage = document.getElementById("select");

//SETUP
//Canvas
var canvas = document.createElement('canvas');
canvas.width = gameParams.width;
canvas.height = gameParams.height;
canvas.style.border = "1px black solid";
document.body.append(canvas);
var c = canvas.getContext("2d");

//Init
var grid = generateGrid();
var selected = "sand";
var clicking = false;
var lastPos = {x: 0, y: 0};
var iterations = 0;

generateSelectors();

window.addEventListener("load", () => loop());

//EVENTS
canvas.addEventListener("mousedown", (e) => {
    clicking = true;
    lastPos.x = Math.floor(e.offsetX / pixelSize);
    lastPos.y = Math.floor(e.offsetY / pixelSize);
});
canvas.addEventListener("mouseup", (e) => {
    clicking = false;
});
canvas.addEventListener("mousemove", (e) => {
    lastPos.y = Math.floor(e.offsetY / pixelSize);
    lastPos.x = Math.floor(e.offsetX / pixelSize);
});

//FUNCTION
function repeatArray(array, count) {
    let output = [];
    for(let i = 0; i < count; i++) {
        for (item in array) {
            output.push(array[item]);
        }
    }
    return output;
}
function arrayArray(array, count) {
    let output = [];
    for (let i = 0; i < count; i++) {
        output.push(copyArray(array));
    }
    return output;
}
function copyArray(array) {
    let output = [];
    array.forEach(i => {
        output.push(i);
    });
    return output;
}
function deepCopyArray(array) {
    return array.map(item => {return item.slice();});
}
function generateGrid() {
    let widths = repeatArray(["air"], gameParams.width / pixelSize);
    let ret = arrayArray(widths, gameParams.height / pixelSize);
    return ret;
}
function generateSelectors() {
    Object.keys(elements).forEach(elemN => {
        let elem = elements[elemN];
        let button = document.createElement('button');
        button.className = "selector";
        button.onclick = function () {
            selected = elemN;
        };
        button.innerText = toTitleCase(elemN);
        button.style.backgroundColor = elem.color;
        
        selectPage.append(button);
    });
}
function toTitleCase(string) {
    return string[0].toUpperCase() + string.slice(1);
}

//ERRORS

//LOOP
function loop() {
    iterations++;
    update();
    draw();
    setTimeout(loop, 1000 / 30)
}

//UPDATE
function update() {
    for (let y = grid.length - 1; y > -1; y--) {
        for (x in grid[y]) {
            x = Number(x);

            if ((iterations % 2) === 0) {
                if ((lastPos.y >= 0 && lastPos.y <= gameParams.height / pixelSize - 1) && (lastPos.x >= 0 && lastPos.x <= gameParams.width / pixelSize - 1) && clicking) {
                    grid[lastPos.y][lastPos.x] = selected;
                }
            }

            //Reactions
            let reactions = elements[grid[y][x]].reactions;
            if (reactions) {
                for (r in reactions) {
                    let reaction = reactions[r];
                    let cell = reaction.cell;
                    let coords = cell.split(";");
                    coords = coords.map(item => {return Number(item);});
                    let is = reaction.is;
                    let replaceWith = reaction.replaceWith;
                    if (grid[y + coords[1]] && grid[y + coords[1]][x + coords[0]] && grid[y + coords[1]][x + coords[0]] == is) {
                        grid[y + coords[1]][x + coords[0]] = replaceWith;
                        if (reaction.replaceSelf) {
                            grid[y][x] = reaction.replaceSelf;
                        }
                    }
                }
            }

            //Movement
            let movement = elements[grid[y][x]].movement;
            if (movement) for (p in movement) {
                let priority = deepCopyArray(movement[p]);
                let couldMove = true;
                while (priority.length > 0) {
                    let rndInd = Math.round(Math.random() * (priority.length - 1));
                    let instruction = priority[rndInd].split(";");
                    let xM = Number(instruction[0]);              //xM and yM stand for xMovement and yMovement
                    let yM = Number(instruction[1]);
                    
                    let nx = x + xM;
                    let ny = y + yM;

                    if (
                        ny >= 0 && ny < gameParams.height / pixelSize &&
                        nx >= 0 && nx < gameParams.width / pixelSize &&
                        grid[ny][nx] === "air"
                    ) {
                        grid[ny][nx] = grid[y][x];
                        grid[y][x] = "air";
                        break; // stop after moving once
}
                    priority.splice(rndInd, 1);
                }
            }
        }
    }
}

//DRAW
function draw() {
    c.clearRect(0, 0, gameParams.width, gameParams.height)
    for (y in grid) {
        for (x in grid[y]) {
            let color = elements[grid[y][x]].color;
            if (color == "clear") {} else {
                if (color) {
                    c.fillStyle = color;
                    c.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
                }
            }
        }
    }
}