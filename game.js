let playerRegions = []
let enemyRegions = []

let gameOver = false
let playersTurn = true

let config = {
    create: create,
    update: update,
    onDotClicked: onDotClicked,
    onKeyPress: onKeyPress,
    gridWidth: 23,
    gridHeight: 23,
    containerId: "main-game-canvas"
}

// top-left-most dot in a region
let regionLocations = {
    0: {x: 0, y: 0},
    1: {x: 8, y: 0},
    2: {x: 16, y: 0},
    3: {x: 0, y: 8},
    4: {x: 8, y: 8},
    5: {x: 16, y: 8},
    6: {x: 0, y: 16},
    7: {x: 8, y: 16},
    8: {x: 16, y: 16},
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function create(game) {
    restart()
}
  
function update(game) {
    drawDefaultGrid()
    for (let region of playerRegions) {
        drawInRegion(x_symbol, region, Color.Blue);
    }
    for (let region of enemyRegions) {
        drawInRegion(o_symbol, region, Color.Red);
    }
}

function onDotClicked(x, y) {
    // make sure that dots can only be added to one of 
    // either playerDots or enemyDots
    if (!gameOver) {
        let region = getRegion(x, y)
        if (region != undefined) {
            if (playersTurn) {
                if (!playerRegions.includes(region) && !enemyRegions.includes(region)) {
                    playerRegions.push(region)
                    checkForWin()
                    
                    playersTurn = false
                    if (!gameOver) {
                        game.setText("Computer is choosing...")
                        setTimeout(() => {
                            let region = getRandomInt(Object.keys(regionLocations).length).toString()
                            while (playerRegions.includes(region) || enemyRegions.includes(region)) {
                                region = getRandomInt(Object.keys(regionLocations).length).toString()
                            }
                            enemyRegions.push(region)
                            game.setText("Your turn!")
                            playersTurn = true
                            checkForWin()
                        }, getRandomInt(2000) + 1000)
                    }
                }
            }
        }
    }
}

function onKeyPress(direction) {
    if (direction == Direction.Up) {
        restart();
    }
}

function restart() {
    playerRegions = []
    enemyRegions = []
    gameOver = false
    playersTurn = true
    game.setText("Click a dot to start!")
}

function playerWins() {
    game.setText("You win!")
    gameOver = true
}

function computerWins() {
    game.setText("Computer wins.")
    gameOver = true
}

function nobodyWins() {
    game.setText("Tie!")
    gameOver = true
}

function checkForWin() {
    if (!gameOver) {
        if (playerRegions.length >= 3 && isWinner(playerRegions)) {
            playerWins()
            return
        }
        if (enemyRegions.length >= 3 && isWinner(enemyRegions)) {
            computerWins()
            return
        }
        if (playerRegions.length + enemyRegions.length == 9) {
            nobodyWins()
            return
        }
    }
}

function isWinner(regions) {
    // horizontal wins
    if ((regions.includes("0") && regions.includes("1") && regions.includes("2")) ||
        (regions.includes("3") && regions.includes("4") && regions.includes("5")) ||
        (regions.includes("6") && regions.includes("7") && regions.includes("8"))) {
            return true;
        }
    // vertical wins
    if ((regions.includes("0") && regions.includes("3") && regions.includes("6")) ||
        (regions.includes("1") && regions.includes("4") && regions.includes("7")) ||
        (regions.includes("2") && regions.includes("5") && regions.includes("8"))) {
            return true;
        }
    // diagonal wins
    if ((regions.includes("0") && regions.includes("4") && regions.includes("8")) ||
        (regions.includes("2") && regions.includes("4") && regions.includes("6"))) {
        return true;
    }
    return false
}


function drawDefaultGrid() {
    for (var i = 0; i < defaultGrid.length; i++) {
        if (defaultGrid.charAt(i) === '#') {
            game.setDot(i % 23, Math.floor(i / 23), Color.Black)
        }
    }
}

function drawInRegion(symbol, regionNum, color) {
    let region = regionLocations[regionNum]
    for (var i = 0; i < symbol.length; i++) {
        if (symbol.charAt(i) === '#') {
            game.setDot(region.x + (i % 7), region.y + (Math.floor(i / 7)), color)
        }
    }
}

// regions are 7x7 little areas
function getRegion(x, y) {
    for (let regionNum in regionLocations) {
        let region = regionLocations[regionNum]
        for (let x_offset of [...Array(7).keys()]) {
            if (x === region.x + x_offset) {
                for (let y_offset of [...Array(7).keys()]) {
                    if (y === region.y + y_offset) {
                        return regionNum
                    }
                }
            }
        }
    }
    return undefined
}

let game = new Game(config);
game.run()