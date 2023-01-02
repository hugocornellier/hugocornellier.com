/* CHANGES MUST BE APPLIED BOTH HERE & IOS.CSS  */
const GAME_DIMENSIONS = 800
const HEALTH_BAR_SIZE = 30
const BLOCK_SIZE      = 40
const ENEMY_SIZE      = 15
/* CHANGES MUST BE APPLIED BOTH HERE & IOS.CSS  */

const MOVEMENT_SPEED  = 300     // Lower is faster
const [ROWS, COLS] = [GAME_DIMENSIONS / BLOCK_SIZE, GAME_DIMENSIONS / BLOCK_SIZE]
const c = (BLOCK_SIZE / 2) - (ENEMY_SIZE / 2)
const board = document.getElementById("gameboard");
const display = document.getElementById("display");
let health_coefficient = 1.5
let enemy_worth = 10
let gold = 150
let enemyCount = 0
let enemies = []
let towers = []
let gameHasStarted = false
createColumnsAndRows()
createHomeBase()
createNewEnemy()

towerCheck = setInterval(() => {
    if (towers.length > 0 && gameHasStarted) {
        towers.forEach(t => {
            const enemy = document.getElementById('enemy_' + (enemyCount-1));
            if (enemy) {
                let distanceToEnemy = getDistance(tileToPixel(t.col), tileToPixel(t.row), parseInt(enemy.style.left), parseInt(enemy.style.top))
                if (distanceToEnemy <= (BLOCK_SIZE * 2)) {
                    reduceHealth(t, enemy)
                }
            }
        })
    }
}, MOVEMENT_SPEED);

function reduceHealth(attacker, enemy) {
    const health = enemy.getElementsByClassName("health")[0];
    let rawID = enemy.id.substring(enemy.id.indexOf('_') + 1);
    let e = enemies[rawID]
    e.health -= attacker.damage
    console.log(e.health)
    if (e.health < 0) e.health = 0
    let newHealth = ((e.health / e.origHealth) * HEALTH_BAR_SIZE)
    health.style.width = newHealth + "px"
    if (health.style.width === "0px") {
        enemy.remove()
        updateGold(enemy_worth)
        let currLevel = parseInt(document.getElementById('score').innerText) + 1
        enemy_worth = 10 + Math.floor(currLevel / 5)
        console.log("Enemy is worth: " + enemy_worth)
        let score = parseInt(document.getElementById('score').innerText);
        document.getElementById('score').innerText = ++score
        createNewEnemy()
        findPath(enemies[enemyCount - 1], 19, 19)
    }
}

function createNewEnemy() {
    enemies.push(
        createEnemy(c, c)
    )
}

function tileToPixel(tiles) {
    return tiles * BLOCK_SIZE + c
}

function findPath(obj, dest_x, dest_y) {
    let source_x = obj.row;
    let source_y = obj.col;
    let destinationID = "block_" + dest_x + "_" + dest_y;
    let stopInterval = false;
    let visited = create2DArray(ROWS)
    for (let i = 0; i < ROWS; i++)
        for (let j = 0; j < COLS; j++)
            visited[i][j] = false;
    let adjacentBlocks = [];
    let lastVisited = []
    let ladded = []
    let a = []
    let added = []

    visited[source_x][source_y] = true;
    adjacentBlocks = getFreeAdjacentBlocks(source_x, source_y, visited, lastVisited, ladded)

    while (true) {

        if (!obj) break

        if (stopInterval) {
            let reversePath = destinationID;
            let path = []
            while (true) {
                path.push(reversePath);
                let result = lastVisited.find(item => item.blockID === reversePath)
                if (!result)
                    break
                reversePath = result.lastVisited;
            }
            path = path.reverse();
            let last_x = parseInt(document.getElementById(path[0]).getAttribute("data-row"));
            let last_y = parseInt(document.getElementById(path[0]).getAttribute("data-column"));

            let i = 0;
            let interv = setInterval(() => {
                let p = path[i++]
                if (!p || !obj)
                    clearInterval(interv)
                else {
                    let x = parseInt(document.getElementById(p).getAttribute("data-row"))
                    let y = parseInt(document.getElementById(p).getAttribute("data-column"))
                    if (x === last_x + 1 && y === last_y)
                        move(obj, 'down', MOVEMENT_SPEED);
                    if (y === last_y + 1 && x === last_x)
                        move(obj, 'right', MOVEMENT_SPEED);
                    if (x === last_x - 1 && y === last_y)
                        move(obj, 'up', MOVEMENT_SPEED);
                    if (y === last_y - 1 && x === last_x)
                        move(obj, "left", MOVEMENT_SPEED);
                    if (x === last_x + 1 && y === last_y + 1)
                        move(obj, 'downright', MOVEMENT_SPEED)
                    if (x === last_x + 1 && y === last_y - 1)
                        move(obj, 'downleft', MOVEMENT_SPEED)
                    if (x === last_x - 1 && y === last_y + 1)
                        move(obj, 'upright', MOVEMENT_SPEED)
                    if (x === last_x - 1 && y === last_y - 1)
                        move(obj, 'upleft', MOVEMENT_SPEED)
                    last_x = x
                    last_y = y
                }
            }, MOVEMENT_SPEED);
            break;
        }

        a = []
        added = []
        adjacentBlocks.forEach(block => {
            let blockID = `block_${block.row}_${block.col}`
            visited[block.row][block.col] = true;
            let newBlocks = getFreeAdjacentBlocks(block.row, block.col, visited, lastVisited, ladded);
            if (newBlocks) {
                newBlocks.forEach(b => {
                    let newBlockID = `block_${b.row}_${b.col}`
                    if (newBlockID === destinationID)
                        stopInterval = true;
                    if (!(added.includes(newBlockID))) {
                        a.push(b)
                        added.push(newBlockID)
                    }
                });
            }
        });
        adjacentBlocks = a;
    }
}

function move(obj, dir, speed) {
    const enemy = document.getElementById(obj.id);
    const directMovement = (dir === 'right' || dir === 'left' || dir === 'up' || dir === 'down')
    const diagonalMovement = (dir === 'upright' || dir === 'upleft' || dir === 'downright' || dir === 'downleft')
    let pixelsMoved = 0
    let pixelsToCover = ""
    let pixelsPerMovement = ""

    if (directMovement) {
        pixelsToCover = BLOCK_SIZE
        pixelsPerMovement = pixelsToCover / BLOCK_SIZE
        let interval = setInterval(() => {
            if (!enemy || pixelsMoved === pixelsToCover)
                clearInterval(interval)
            else {
                if (dir === 'down')
                    enemy.style.top = (parseInt(enemy.style.top) + pixelsPerMovement) + "px";
                if (dir === 'up')
                    enemy.style.top = (parseInt(enemy.style.top) - pixelsPerMovement) + "px";
                if (dir === 'right')
                    enemy.style.left = (parseInt(enemy.style.left) + pixelsPerMovement) + "px";
                if (dir === 'left')
                    enemy.style.left = (parseInt(enemy.style.left) - pixelsPerMovement) + "px";
                pixelsMoved = pixelsMoved + pixelsPerMovement
            }
        }, (speed / BLOCK_SIZE));
    }

    if (diagonalMovement) {
        pixelsToCover = BLOCK_SIZE * 2
        pixelsPerMovement = (pixelsToCover / BLOCK_SIZE) / 2
        let interval = setInterval(() => {
            if (!enemy || pixelsMoved === pixelsToCover)
                clearInterval(interval)
            else {
                if (dir.includes('down'))
                    enemy.style.top = (parseInt(enemy.style.top) + pixelsPerMovement) + "px";
                if (dir.includes('up'))
                    enemy.style.top = (parseInt(enemy.style.top) - pixelsPerMovement) + "px";
                if (dir.includes('right'))
                    enemy.style.left = (parseInt(enemy.style.left) + pixelsPerMovement) + "px";
                if (dir.includes('left'))
                    enemy.style.left = (parseInt(enemy.style.left) - pixelsPerMovement) + "px";
                pixelsMoved = pixelsMoved + (2 * pixelsPerMovement)
            }
        }, (speed / BLOCK_SIZE));
    }
}

function getFreeAdjacentBlocks(row, col, visited, lastVisited, ladded) {

    let blockFound = false;
    let adj = []
    let blockID = `block_${row}_${col}`
    let newBlockID = ""

    const adjacentBlocks = [
        [row - 1, col],
        [row + 1, col],
        [row, col - 1],
        [row, col + 1],
        [row + 1, col + 1],
        [row - 1, col - 1],
        [row + 1, col - 1],
        [row - 1, col + 1]
    ];

    const freeBlocks = adjacentBlocks.filter(([x, y]) =>
        blockIsFree(row, col, x, y, visited)
    );

    freeBlocks.forEach(([x, y]) => {
        blockFound = true;
        adj.push({
            row: x,
            col: y
        });
        newBlockID = `block_${x}_${y}`;

        if (!ladded.includes(newBlockID)) {
            lastVisited.push({
                blockID: newBlockID,
                lastVisited: blockID
            });
            ladded.push(newBlockID);
        }
    });

    return blockFound ? adj : false;
}

function blockIsFree(orig_x, orig_y, new_x, new_y, visited) {
    // The block we're checking to see if it's free
    const newBlock = document.getElementById(`block_${new_x}_${new_y}`)

    if (new_y < 0 || new_x < 0 || new_x >= ROWS || new_y >= COLS)
        return false
    if (alreadyVisited({row: new_x, col: new_y}, visited))
        return false
    if (isBlocked(newBlock))
        return false
    if (attemptingToWrapAroundObject(orig_x, orig_y, new_x, new_y))
        return false

    return true
}

function attemptingToWrapAroundObject(orig_x, orig_y, new_x, new_y) {
    if (
        new_x === orig_x + 1 &&
        new_y === orig_y + 1 &&
        (
            document.getElementById(`block_${orig_x+1}_${orig_y}`).getAttribute('data-content') !== '' ||
            document.getElementById(`block_${orig_x}_${orig_y+1}`).getAttribute('data-content') !== ''
        )
    ) return true

    if (
        new_x === orig_x - 1 &&
        new_y === orig_y + 1 &&
        (
            document.getElementById(`block_${orig_x-1}_${orig_y}`).getAttribute('data-content') !== '' ||
            document.getElementById(`block_${orig_x}_${orig_y+1}`).getAttribute('data-content') !== ''
        )
    ) return true

    if (
        new_x === orig_x + 1 &&
        new_y === orig_y - 1 &&
        (
            document.getElementById(`block_${orig_x+1}_${orig_y}`).getAttribute('data-content') !== '' ||
            document.getElementById(`block_${orig_x}_${orig_y-1}`).getAttribute('data-content') !== ''
        )
    ) return true

    if (
        new_x === orig_x - 1 &&
        new_y === orig_y - 1 &&
        (
            document.getElementById(`block_${orig_x-1}_${orig_y}`).getAttribute('data-content') !== '' ||
            document.getElementById(`block_${orig_x}_${orig_y-1}`).getAttribute('data-content') !== ''
        )
    ) return true

    return false
}

function isBlocked(block) {
    return block.getAttribute('data-content') !== ''
}

function alreadyVisited(check, visited) {
    if (visited[check.row][check.col])
        return visited[check.row][check.col]
    return false
}

function createEnemy(top, left) {
    let hp = Math.floor((30 + (5 * enemyCount)) * health_coefficient)
    hp = hp - (hp % 10)
    health_coefficient += 0.05
    let enemyID = "enemy_" + enemyCount++;
    let enemy_html = `<div id='` + enemyID + `' class='enemy' style='top: ${top}px; left: ${left}px'><div class="health"></div></div>`
    board.insertAdjacentHTML("afterbegin", enemy_html)
    return {
        id: enemyID,
        row: ((top - c) / BLOCK_SIZE),
        col: ((left - c) / BLOCK_SIZE),
        health: hp,
        origHealth: hp
    };
}

function createHomeBase() {
    let homebase_html = `<div id='' class='homebase'></div>`
    document.getElementById("block_19_19").insertAdjacentHTML("beforeend", homebase_html)
}

function createColumnsAndRows() {
    for (let rowID = 0; rowID < ROWS; rowID++) {
        let rowhtml = `<div id='row_${rowID}' class='row'></div>`
        board.insertAdjacentHTML("beforeend", rowhtml)
        const currRow = document.getElementById(`row_${rowID}`)
        for (let colID = 0; colID < COLS; colID++) {
            let blockhtml = `<div id='block_${rowID}_${colID}' data-column='${colID}' data-row='${rowID}' data-content='' class='gameblock'></div>`
            currRow.insertAdjacentHTML("beforeend", blockhtml)
        }
    }

    display.insertAdjacentHTML("beforeend", "<div id='gold-wrap'><div class='title'>Gold</div><i class='fa-solid fa-coins'></i><div id='gold'>" + gold + "</div></div>")
    display.insertAdjacentHTML("beforeend", "<div id='level-wrap'><div class='title'>Level</div> <div id='score'>1</div></div>")
    display.insertAdjacentHTML("beforeend", "<div id='objects'><div class='title'>Build</div></div>")
    display.insertAdjacentHTML("beforeend", "<div id='info-wrap'><div id='info-title' class='title'>Info</div><div id='info-content'></div></div>")
    document.getElementById('objects').insertAdjacentHTML("beforeend", "<div id='placeTower'></div>")
    document.getElementById('objects').insertAdjacentHTML("beforeend", "<div id='placeWall'></div>")
    document.getElementById('placeTower').addEventListener('click', function handleClick(e) {
        placeTower();
    });
    document.getElementById('placeWall').addEventListener('click', function handleClick(e) {
        placeWall();
    });
    display.insertAdjacentHTML("beforeend", "<button id='startGame' onClick='startGame(); this.remove()'>Start Game</button>")
    document.addEventListener('keydown', (event)=> {
        if (event.key === 't' || event.key === 'T')
            placeTower()
        if (event.key === 'w' || event.key === 'W')
            placeWall()
        if (event.key === 'Escape')
            clearListeners('.gameblock')
    })
}

function startGame() {
    gameHasStarted = true
    findPath(enemies[0], 19, 19);
}

function placeWall() {
    clearListeners('.gameblock')
    document.body.style.cursor = "url('https://i.imgur.com/wpM5SOs.png'), default"
    document.querySelectorAll('.gameblock').forEach(block => {
        block.addEventListener('click', function handleClick(e) {
            if (isBlocked(block)) {
                select(block)
            }

            if (!isBlocked(block)) {
                let wallCost = 1
                if (gold >= wallCost) {
                    block.setAttribute('style', 'background-image: url(\'https://i.imgur.com/PQuiPUI.png\')')
                    updateGold(-wallCost)
                    block.setAttribute('data-content', 'wall')
                }
            }
        });
    });
}

function placeTower() {
    clearListeners('.gameblock')
    document.body.style.cursor = "url('https://i.imgur.com/ktbv6Sd.png'), default"
    document.querySelectorAll('.gameblock').forEach(block => {
        block.addEventListener('click', function handleClick(e) {
            if (isBlocked(block))
                select(block)
            if (!isBlocked(block)) {
                let towerCost = 20
                if (gold >= towerCost) {
                    block.setAttribute('style', 'background-image: url(\'https://i.imgur.com/UTPBQRz.png\')')
                    block.setAttribute('data-content', 'tower')
                    let towerID = "tower_" + towers.length
                    updateGold(-towerCost)
                    block.setAttribute('data-id', towerID)
                    towers.push({
                        towerID: towerID,
                        level: 1,
                        target: "",
                        upgradeCost: 50,
                        location: block.getAttribute('id'),
                        row: parseInt(block.getAttribute('data-row')),
                        col: parseInt(block.getAttribute('data-column')),
                        damage: 5
                    })
                }
            }
        });
    });
}

function clearListeners(div) {
    document.body.style.cursor = 'default'
    document.querySelectorAll(div).forEach(e => {
        e.replaceWith(e.cloneNode(true));
    });
    document.querySelectorAll(div).forEach(b => {
        b.style.border = ""
    })
    document.querySelectorAll(div).forEach(b => {
        b.addEventListener('click', function handleClick(e) {
            if (isBlocked(b))
                select(b)
        })
    })
}

function select(block) {
    clearListeners('.gameblock')
    let blockTitle = ""
    document.getElementById(block.id).style.border = "1px solid #9afe79"
    document.getElementById('info-wrap').style.display = 'block'
    let blockType = block.getAttribute('data-content');
    let objID = block.getAttribute('data-id')

    // Guard tower selected
    if (objID && blockType === 'tower') {
        blockType = 'Guard Tower'
        let towerID = parseInt(objID.substring(objID.indexOf('_') + 1))
        document.getElementById('info-content').innerHTML = "Level: <span id='selecetedTowerLevel'>" + towers[towerID].level +
                                                                      "</span><br>Damage: <span id='selecetedTowerDamage'>" + towers[towerID].damage +
                                                                      "</span><br>Upgrade Cost: <span id='selecetedUpgradeCost'>" + towers[towerID].upgradeCost +
                                                                      "</span><button onClick=\"upgrade('tower', " + towerID + ")\">Upgrade</button>";
        blockTitle = blockType + " #" + (towerID + 1);
    }

    // Wall selected
    if (blockTitle.length === 0)
        blockTitle = 'Wall'
    document.getElementById('info-title').innerText = blockTitle;
}

function upgrade(type, id)
{
    if (type === 'tower') {
        if (gold > towers[id].upgradeCost) {
            updateGold(-(towers[id].upgradeCost))
            towers[id].level = towers[id].level + 1
            document.getElementById('selecetedTowerLevel').innerText = towers[id].level
            towers[id].damage = 3 * towers[id].damage
            document.getElementById('selecetedTowerDamage').innerText = towers[id].damage
            towers[id].upgradeCost = 2.5 * towers[id].upgradeCost
            document.getElementById('selecetedUpgradeCost').innerText = towers[id].upgradeCost
            console.log("Success! Modified object: ")
            console.log(towers[id])
        }
    }
}

function updateGold(val)
{
    gold += val
    document.getElementById('gold').innerText = gold
}

function getDistance(source_x, source_y, new_x, new_y) {
    return Math.sqrt(((new_x-source_x) * (new_x-source_x)) + ((new_y-source_y) * (new_y-source_y)))
}

function create2DArray(rows) {
    let arr = [];
    for (let i = 0; i < rows; i++)
        arr[i] = [];
    return arr;
}
