const player_div =  document.getElementById('player')
const BOARD_HEIGHT = 800
const BOARD_WIDTH = 1200
let player = {}
player.jumping = false
player.left = 0
player.size = 20
player.top = BOARD_HEIGHT - player.size

// Store active keys in keys dict
let keys = {}
document.onkeyup = e => keys[e.code] = false
document.onkeydown = e => keys[e.code] = true

// Generate new blocks
// First, generate initial block, then generate a new one every 5s
let blocksArr = []
newBlock()
setInterval(() => newBlock(), 5000)

function newBlock() {
    let nb = {}
    nb.top = 0
    nb.left = Math.floor(Math.random() * BOARD_WIDTH)
    nb.size = 120
    blocksArr.push(nb)
    let newBlock = "<div data-id='" + (blocksArr.length - 1) + "' " +
        "class='block in_air' " +
        "style='width: 120px; top: 0; left: " + nb.left + "px'></div>"
    document.getElementById("game").insertAdjacentHTML("beforeend", newBlock)
}

// Update game board
setInterval(move, 50)
setInterval(() => {
    player_div.style.setProperty("left", player.left + "px")
    player_div.style.setProperty("top", player.top + "px")
    for (let b of document.getElementsByClassName("in_air")) {
        let curr = blocksArr[parseInt(b.getAttribute("data-id"))]
        curr.top++
        if (collisionDetect(curr, "down")) b.classList.remove("in_air")
        b.style.setProperty("top",  parseInt(curr.top) + "px")
    }
}, 10)

function collisionDetect(obj, dir) {
    if (dir === "down") {
        if (BOARD_HEIGHT - obj.size - obj.top <= 4) {
            obj.top = BOARD_HEIGHT - obj.size
            return true
        }
        for (let p of document.getElementsByClassName("block")) {
            let vd = obj.top - parseInt(p.style.top) + obj.size
            if (vd <= 4 && vd > -1
                    && obj.left >= parseInt(p.style.left) - obj.size
                    && obj.left <= (parseInt(p.style.left) + parseInt(p.style.width))) {
                if (vd !== 0) obj.top = parseInt(p.style.top) - obj.size
                return true
            }
        }
    }
    return false
}