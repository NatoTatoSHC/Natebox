//CONSTS
const gameParams = {
    width: 850,
    height: 560
};
const pixelSize = 10;

//DOM
const selectPage = document.getElementById("select");

//SETUP
//Canvas
var canvas = document.createElement('canvas');
canvas.width = gameParams.width;
canvas.height = gameParams.height;
canvas.style.border = "1px gray solid";
canvas.style.gridColumn = 1;
canvas.style.gridRow = 1;
document.body.append(canvas);
var c = canvas.getContext("2d");

//Mods
if (!localStorage.getItem("mods")) {
    localStorage.setItem("mods", JSON.stringify([]));
}
var mods = JSON.parse(localStorage.getItem("mods"));
mods.forEach((mod) => {
    let script = document.createElement('script');
    if (mod.startsWith("https://")) {
        script.src = mod;
    } else {
        script.src = "mods/"+mod;
    }
    document.head.append(script);
    script.onload = () => {
        generateSelectors();
    }
});

//Init
var grid = generateGrid("air");
var timeGrid = generateGrid(0);
var tempGrid = generateGrid([20, false, 0]);
var selected = "sand";
var clicking = false;
var lastPos = {x: 0, y: 0};
var iterations = 0;
var brushSize = 2;
var hovering = false;
var playing = true;

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
canvas.addEventListener("mouseleave", (e) => {
    clicking = false;
});

canvas.addEventListener("touchstart", (e) => {
    clicking = true;
    lastPos.x = Math.floor(e.offsetX / pixelSize);
    lastPos.y = Math.floor(e.offsetY / pixelSize);
});
canvas.addEventListener("touchend", (e) => {
    clicking = false;
});
canvas.addEventListener("touchmove", (e) => {
    lastPos.y = Math.floor(e.offsetY / pixelSize);
    lastPos.x = Math.floor(e.offsetX / pixelSize);
});
canvas.addEventListener("wheel", (e) => {
    if (e.deltaY < 0) {
        changeSize(1);
    } else if (e.deltaY > 0) {
        changeSize(-1);
    }
});

window.addEventListener("keypress", (e) => {
    if (e.key == " ") {
        playing = !playing;
    }
});

//FUNCTION
function repeatArray(array, count) {
    let output = [];
    for(let i = 0; i < count; i++) {
        for (item in array) {
            output.push(JSON.parse(JSON.stringify(array[item])));
        }
    }
    return output;
}
function arrayArray(array, count) {
    let output = [];
    for (let i = 0; i < count; i++) {
        try {
            output.push(deepCopyArray(array));
        } catch {
            output.push(copyArray(array));
        }
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
function generateGrid(str) {
    let widths = repeatArray([str], gameParams.width / pixelSize);
    let ret = arrayArray(widths, gameParams.height / pixelSize);
    return ret;
}
function generateSelectors() {
    Array.from(selectPage.children).forEach(child => {
        while (child.children.length > 1) {
            child.removeChild(child.lastChild);
        }
    });
    Object.keys(elements).forEach(elemN => {
        let elem = elements[elemN];
        let button = document.createElement('button');
        button.className = "selector";
        button.onclick = function () {
            selected = elemN;
        };
        button.innerText = toTitleCase(elemN);
        button.style.backgroundColor = elem.color;
        
        if (elem.category) {
            document.querySelector(`#${selectPage.id} #${elem.category}`).append(button);
        }
    });
}
function toTitleCase(string) {
    return string[0].toUpperCase() + string.slice(1);
}
function isInGrid(x, y) {
    return y >= 0 &&
           y < grid.length &&
           x >= 0 &&
           x < grid[0].length;
}
function explode(x, y, size) {
    for (let eY = -size; eY < size + 1; eY++) {
        for (let eX = -size; eX < size + 1; eX++) {
            let distance = Math.abs(eX) + Math.abs(eY);
            if (distance <= size && isInGrid(x + eX, y + eY)) {
                grid[y + eY][x + eX] = "air";
                timeGrid[y + eY][x + eX] = 0;
                tempGrid[y + eY][x + eX][0] =  70;
                let isCaught = Math.random();
                tempGrid[y + eY][x + eX][1] = isCaught < .5 ? true: false;
                tempGrid[y + eY][x + eX][2] = isCaught < .5 ? 10: 0;
            }
        }
    }
}
function changeSize(by) {
    if (brushSize + by > -1) {
        brushSize += by;
    }
}
function neighboringAirOrFire(x,y, by) {
    let out = false;
    [-by, by].forEach(o => {
        if (isInGrid(x, y + o) && (grid[y + o][x] == "air" || (tempGrid[y + o][x][1] && tempGrid[y + o][x][2] <= elements[grid[y + o][x]].burnTime - 5))) {
            out = true;
        }
    });
    [-by, by].forEach(o => {
        if (isInGrid(x + o, y) && (grid[y][x + o] == "air" || (tempGrid[y][x + o][1] && tempGrid[y][x + o][2] <= elements[grid[y][x + o]].burnTime - 5))) {
            out = true;
        }
    });
    return out;
}

//ERRORS

//LOOP
function loop() {
    iterations++;
    if (playing) {
        update();
    }
    draw();
    setTimeout(loop, 1000 / 30)
}

//UPDATE
function update() {
    //Draw
    if ((iterations % 2) === 0) {
        if (clicking) {
            for (let y = -brushSize; y < brushSize + 1; y++) {
                for (let x = -brushSize; x < brushSize + 1; x++) {
                    let pixelPosX = lastPos.x + x;
                    let pixelPosY = lastPos.y + y;
                    if (["heat", "drink", "fire"].includes(selected)) {
                        if (isInGrid(pixelPosX, pixelPosY)) {
                            switch(selected) {
                                case 'heat':
                                    tempGrid[pixelPosY][pixelPosX][0] += 2;
                                    break;
                                case 'drink':
                                    if (elements[grid[pixelPosY][pixelPosX]].state == "liquid") {
                                        grid[pixelPosY][pixelPosX] = "air";
                                        timeGrid[pixelPosY][pixelPosX] = 0;
                                        tempGrid[pixelPosY][pixelPosX][0] = 20;
                                    }
                                    break;
                                case 'fire':
                                    tempGrid[pixelPosY][pixelPosX][0] = 600;
                                    tempGrid[pixelPosY][pixelPosX][1] = true;
                                    tempGrid[pixelPosY][pixelPosX][2] = Number(elements[grid[pixelPosY][pixelPosX]].burnTime);
                                    break;
                            }
                        }
                    } else {
                        if (isInGrid(pixelPosX, pixelPosY) && grid[pixelPosY][pixelPosX] != selected) {
                            grid[pixelPosY][pixelPosX] = selected;
                            timeGrid[pixelPosY][pixelPosX] = 0;
                            tempGrid[pixelPosY][pixelPosX][0] = 20;
                        }
                    }
                }
            }
        }
    }

    for (let y = grid.length - 1; y > -1; y--) {
        let xDir = Math.random() < 0.5 ? -1: 1;
        if (xDir == 1) {
            for (let x = 0; x < grid[y].length; x++) {
                cellUpdate(x, y);
            }
        } else {
            for (let x = grid[y].length - 1; x > -1; x--) {
                cellUpdate(x, y);
            }
        }
    }
}

function cellUpdate(x, y) {
    //Reactions
    let reactions = elements[grid[y][x]].reactions;
    if (reactions) {
        for (r in reactions) {
            let reaction = reactions[r];
            let is = reaction.is;
            let replaceWith = reaction.replaceWith;
            for (let reactY = -1; reactY < 2; reactY += 2) {
                for (let reactX = -1; reactX < 2; reactX += 2) {
                    let coords = [reactX, reactY];
                    if (isInGrid(x + coords[0], y + coords[1]) && grid[y + coords[1]][x + coords[0]] == is) {
                        grid[y + coords[1]][x + coords[0]] = replaceWith;
                        timeGrid[y + coords[1]][x + coords[0]] = 0;
                        if (reaction.replaceSelf) {
                            grid[y][x] = reaction.replaceSelf;
                            timeGrid[y][x] = 0;
                            tempGrid[y][x][0] = 20;
                        }
                    }
                }
            }
        }
    }

    //Growth
    let grow = elements[grid[y][x]].grow;
    if (grow) {
        let tick = grow.tick;
        let rndTick = tick.min + Math.round(Math.random() * (tick.max - tick.min));
        let picked = grow.growth[Math.floor(Math.random() * grow.growth.length)];
        if ((iterations % rndTick) === 0) {
            let rndX = -1 + Math.floor(Math.random() * 3);
            let rndY = -1 + Math.floor(Math.random() * 3);
            let can = isInGrid(x + rndX, y + rndY) && grid[y + rndY][x + rndX] == "air";
            if (can) {
                grid[y + rndY][x + rndX] = picked;
                timeGrid[y + rndY][x + rndX] = 0;
                tempGrid[y + rndY][x + rndX][0] = 20;
            }
        }
    }

    //Explode
    let explosion = elements[grid[y][x]].explode;
    if (explosion) {
        let trigger = explosion.trigger;
        switch(trigger) {
            case 'impact':
                if (!isInGrid(x, y + 1) || (isInGrid(x, y + 1) && grid[y + 1][x] != "air")) {
                    explode(x, y, explosion.size);
                }
                break;
        }
    }

    //Tempature Coverts
    let converts = elements[grid[y][x]].converts;
    if (converts) {
        let hots = Object.keys(converts.hot);
        hots.sort((a, b) => b - a);
        for (t in hots) {
            let temp = hots[t];
            if (tempGrid[y][x][0] >= temp) {
                grid[y][x] = converts.hot[temp];
                break;
            }
        };
    }

    //Timeout
    let timeout = elements[grid[y][x]].timeout;
    if (timeout) {
        timeGrid[y][x]++;
        if (timeGrid[y][x] >= timeout.min + Math.round(Math.random() * (timeout.max - timeout.min))) {
            grid[y][x] = "air";
            timeGrid[y][x] = 0;
            tempGrid[y][x][0] = 20;
        }
    }

    //Spread
    if (grid[y][x] == "fire" || tempGrid[y][x][1]) {
        tempGrid[y][x][1] = true;
    }
    //Fire Timout
    if (tempGrid[y][x][1]) {
        tempGrid[y][x][2]--;
        if (tempGrid[y][x][2] <= 0) {
            grid[y][x] = "air";
            tempGrid[y][x] = [20, false, 0];
        }
    }
    if (tempGrid[y][x][1]) {
        if (!neighboringAirOrFire(x, y, 1)) {
            tempGrid[y][x] = [tempGrid[y][x][0], false, 0];
        }
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                //set fire,(())/ fire animation
                if(isInGrid(x + dx, y + dy)) {
                    if (elements[grid[y + dy][x + dx]].flamable &&
                        Math.random() < elements[grid[y + dy][x + dx]].flamable &&
                        neighboringAirOrFire(x + dx, y + dy, 1)
                    ) {
                        /*if (isInGrid(x + dx, y + dy + 1) && elements[grid[y + dy][x + dx]].coalChance && Math.random() < elements[grid[y + dy][x + dx]].coalChance && grid[y + dy][x + dx] == "air") {
                            grid[y + dy + 1][x + dx] = "charcoal",
                            timeGrid[y + dy + 1][x + dx] = 0;
                            tempGrid[y + dy + 1][x + dx] = 20;
                        }*/
                        tempGrid[y + dy][x + dx][0] = 100;
                        tempGrid[y + dy][x + dx][1] = true;
                        tempGrid[y + dy][x + dx][2] = Number(elements[grid[y + dy][x + dx]].burnTime)
                        timeGrid[y + dy][x + dx] = 0;
                    }
                }
            }
        }
    }

    //Movement
    let movement = elements[grid[y][x]].movement;
    if (movement) for (p in movement) {
        let priority = deepCopyArray(movement[p]);
        while (priority.length > 0) {
            let rndInd = Math.floor(Math.random() * (priority.length));
            let instruction = priority[rndInd].split(";");
            let xM = Number(instruction[0]);              //xM and yM stand for xMovement and yMovement
            let yM = Number(instruction[1]);
            
            let nx = x + xM;
            let ny = y + yM;
            if (elements[grid[y][x]].state == "gas") {
                if (!isInGrid(nx - 1, 0)) {
                    nx += 2;
                } else if (!isInGrid(nx + 1, 0)) {
                    nx -= 2;
                }
                if (!isInGrid(0, ny - 1)) {
                    ny += 2;
                } else if (!isInGrid(0, ny + 1)) {
                    ny -= 2;
                }
            }
            if (
                ny >= 0 && ny < gameParams.height / pixelSize &&
                nx >= 0 && nx < gameParams.width / pixelSize &&
                grid[ny][nx] === "air"
            ) {
                grid[ny][nx] = grid[y][x];
                timeGrid[ny][nx] = 0;
                tempGrid[ny][nx] = tempGrid[y][x];

                grid[y][x] = "air";
                timeGrid[y][x] = 0;
                tempGrid[y][x] = [20, false];
                
                break; // stop after moving once
            } else if (
                ny >= 0 && ny < gameParams.height / pixelSize &&
                nx >= 0 && nx < gameParams.width / pixelSize &&
                elements[grid[ny][nx]].density < elements[grid[y][x]].density
            ) {
                if (elements[grid[ny][nx]].state == "liquid" && elements[grid[y][x]].state == "liquid" && (iterations % 4) === 0) {
                    let thisElem = grid[y][x];
                    let thisTemp = tempGrid[y][x];
                    grid[y][x] = grid[ny][nx];
                    timeGrid[y][x] = 0;
                    tempGrid[y][x] = tempGrid[ny][nx];

                    grid[ny][nx] = thisElem;
                    timeGrid[ny][nx] = 0;
                    tempGrid[ny][nx] = thisTemp;
                    break;
                } else if ((elements[grid[y][x]].state != "liquid" || elements[grid[ny][nx]].state != "liquid") && (iterations % 2) === 0) {
                    let thisElem = grid[y][x];
                    let thisTemp = tempGrid[y][x];
                    grid[y][x] = grid[ny][nx];
                    timeGrid[y][x] = 0;
                    tempGrid[y][x] = tempGrid[ny][nx];

                    grid[ny][nx] = thisElem;
                    timeGrid[ny][nx] = 0;
                    tempGrid[ny][nx] = thisTemp;
                    break;
                }
            }
            priority.splice(rndInd, 1);
        }
    }
}

//DRAW
function draw() {
    c.clearRect(0, 0, gameParams.width, gameParams.height)
    c.fillStyle = "black";
    c.fillRect(0, 0, gameParams.width, gameParams.height);
    for (y in grid) {
        for (x in grid[y]) {
            let color = elements[grid[y][x]].color;
            if (color == "clear") {} else {
                if (color) {
                    if (["gas", "energy"].includes(elements[grid[y][x]].state) || tempGrid[y][x][1]) {
                        const match = color.match(/rgba?\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*([0-9.]+))?\s*\)/i);
                        if (!match) continue;
                        let r = match[1];
                        let g = match[2];
                        let b = match[3];
                        c.fillStyle = `rgba(${r}, ${g}, ${b}, 0.5)`;
                        c.fillRect((x - .5) * pixelSize, (y - .5) * pixelSize, pixelSize * 2, pixelSize * 2);
                    }
                    c.fillStyle = color;
                    if (tempGrid[y][x][1] && Math.random() < .7) {
                        c.fillStyle = elements.fire.color;
                        let tColor = elements.fire.color;
                        const match = tColor.match(/rgba?\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*([0-9.]+))?\s*\)/i);
                        if (!match) continue;
                        let r = match[1];
                        let g = match[2];
                        let b = match[3];
                        c.fillStyle = `rgba(${r}, ${g}, ${b}, 0.5)`;
                        c.fillRect((x - .5) * pixelSize, (y - .5) * pixelSize, pixelSize * 2, pixelSize * 2);
                        c.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
                    }
                    c.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
                } else {
                    if (tempGrid[y][x][1] && Math.random() < .7) {
                        c.fillStyle = elements.fire.color;
                        let tColor = elements.fire.color;
                        const match = tColor.match(/rgba?\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*([0-9.]+))?\s*\)/i);
                        if (!match) continue;
                        let r = match[1];
                        let g = match[2];
                        let b = match[3];
                        c.fillStyle = `rgba(${r}, ${g}, ${b}, 0.5)`;
                        c.fillRect((x - .5) * pixelSize, (y - .5) * pixelSize, pixelSize * 2, pixelSize * 2);
                        c.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
                    }
                }
            }
        }
    }

    //Outline
    c.strokeStyle = `rgba(255, 255, 255, 0.43)`;
    c.strokeRect((lastPos.x - brushSize) * pixelSize, (lastPos.y - brushSize) * pixelSize, (brushSize * 2 + 1) * pixelSize, (brushSize * 2 + 1) * pixelSize);

    //Pause
    if (!playing) {
        c.fillStyle = "lightblue";
        c.font = "50px arial"
        c.fillText("Paused", 10, 60);
    }
}