const JUMP_DUR = 30
const STALL_DUR = 10
const PLAYER_HEIGHT = 20

async function jump() {
    player.jumping = true
    await jump_helper(JUMP_DUR, "up")       // Jump up!
    await jump_helper(STALL_DUR, null)      // Stall in the air
    await jump_helper(JUMP_DUR, "down")     // Fall...
    player.jumping = false
}

function jump_helper(iterations, dir) {
    return new Promise((resolve) => {
        let x = 0
        let interval = setInterval(() => {
            if (dir === "up")
                player.top = player.top - Math.round((70 - x) / 10)
            else if (dir === "down")
                player.top = player.top + Math.round((4 + x) / 10)
            if (x++ === iterations && dir !== "down" || collisionDetect(player, dir) && dir === "down") {
                clearInterval(interval)
                resolve()
            }
        }, 15)
    })
}

function move() {
    if (keys["ArrowLeft"] || keys["KeyA"])
        movePlayer("left")
    if (keys["ArrowRight"] || keys["KeyD"])
        movePlayer("right")
    if ((keys["ArrowUp"] || keys["KeyW"]) && player.jumping === false) {
        jump()
    }
    function movePlayer(direction) {
        let x = 0
        const interval = setInterval(async () => {
            if (!player.jumping && !collisionDetect(player, "down")) {
                console.log("falling")
                player.jumping = true
                await jump_helper(JUMP_DUR, "down")     // Fall...
                player.jumping = false
            }
            player.left = direction === "left" ? player.left - 1 : player.left + 1;
            if (x++ === 15) clearInterval(interval)
        }, 30);
    }
}