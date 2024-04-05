// selects canvas element from html file
const canvas = document.querySelector("canvas")
// setting rendering context. use c. as api
const c = canvas.getContext("2d")

// resolution
canvas.width = 1024
canvas.height = 576

// creating main canvas
c.fillRect(0, 0 ,canvas.width, canvas.height)

// gravity force
const gravity = 0.2

// sprite class
class Sprite {
    constructor({position, velocity, size, color = "red"}) {
        this.position = position
        this.velocity = velocity
        this.size = size
        // needed for left right smooth left/right movement
        this.lastKey = undefined
        // needed for double jump mechanic
        this.jumpCount = 0
        this.doubleJumpTimer = 0
        // needed for attacking
        this.attackBox = {
            position: this.position,
            width: 100,
            height: 50
        }
        this.isAttacking = false
        // object body color
        this.color = color
    }

    // draw sprite
    draw() {
        // body
        c.fillStyle = this.color
        c.fillRect(this.position.x, this.position.y, this.size.width, this.size.height)

        // attack box
        if (this.isAttacking) {
            c.fillStyle = "green"
            c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)
        }
    }

    // update sprite e.g related to gravity etc.
    update() {
        this.draw()

        // update position
        this.position.y += this.velocity.y
        this.position.x += this.velocity.x

        // checking canvas border related to y-axis
        if (this.position.y + this.size.height > canvas.height) {
            this.velocity.y = 0
            this.position.y = canvas.height - this.size.height
        } else {
            this.velocity.y += gravity
        }
        // checking canvas border related to x-axis right-side
        if (this.position.x + this.size.width > canvas.width) {
            this.velocity.x = 0
            this.position.x = canvas.width - this.size.width
        }
            // left-side
        if (this.position.x <= 0) {
            this.velocity.x = 0
            this.position.x = 0
        }
    }
    attack() {
        this.isAttacking = true
        setTimeout(() => {
            this.isAttacking = false
        }, 100)
    }

}

// instantiate player
const player = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    size : {
        width: 50,
        height: 150
    }
})

// instantiate enemy
const enemy = new Sprite({
    position: {
        x: 400,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    size : {
        width: 50,
        height: 150
    },
    color: "blue"
})

console.log(player)


// animation frame by frame
const animate = () => {
    window.requestAnimationFrame(animate)
    c.fillStyle = "black" // color background
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()

    player.doubleJumpTimer += 1
    enemy.doubleJumpTimer += 1

    // MOVEMENT-PART in animation loop
    // PLAYER
        // left right movement
    if (keys.a.pressed && player.lastKey === "a") {
        player.velocity.x = -4
    } else if (keys.d.pressed && player.lastKey === "d") {
        player.velocity.x = 4
    } else {
        player.velocity.x = 0
    }
    // ENEMY
        // left right movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
        enemy.velocity.x = -4
    } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
        enemy.velocity.x = 4
    } else {
        enemy.velocity.x = 0
    }

    // JUMP-PART in animation loop
    // PLAYER
            // initial jump
    if (keys.w.pressed && player.position.y + player.size.height === canvas.height){
        player.velocity.y = -5
        player.doubleJumpTimer = 0
        player.jumpCount += 1
    }
            // double jump
    if (keys.w.pressed && (player.position.y + player.size.height) !== canvas.height && player.jumpCount === 1 && player.doubleJumpTimer >= 20) {
        player.velocity.y = -5
        player.jumpCount = 0
    }
    // ENEMY
        // initial jump
    if (keys.ArrowUp.pressed && enemy.position.y + enemy.size.height === canvas.height){
        enemy.velocity.y = -5
        enemy.doubleJumpTimer = 0
        enemy.jumpCount += 1
    }
        // double jump
    if (keys.ArrowUp.pressed && (enemy.position.y + enemy.size.height) !== canvas.height && enemy.jumpCount === 1 && enemy.doubleJumpTimer >= 20) {
        enemy.velocity.y = -5
        enemy.jumpCount = 0
    }
    // DETECT FOR COLLISION
    if (
        player.attackBox.position.x + player.attackBox.width >= enemy.position.x
        && player.attackBox.position.x <= enemy.position.x + enemy.size.width
        && player.attackBox.position.y + player.attackBox.height >= enemy.position.y
        && player.attackBox.position.y <= enemy.position.y + enemy.size.height
        && player.isAttacking
    ) {
        player.isAttacking = false
        console.log("hit")
    }



}

// KEY-INPUTS

    // checking for keys that are pressed to provide exact movement without keys interrupting each other
        // initial all keys have to be false related to pressed
const keys = {
    // PLAYER KEYS
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    // ENEMY KEYS
    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowUp: {
        pressed: false
    }
}



    // checking if any button is pressed ("keydown")
window.addEventListener("keydown", (event) => {
    switch (event.key) {
        // PLAYER KEYS
        case "a":
            keys.a.pressed = true
            player.lastKey = "a"
            break
        case "d":
            keys.d.pressed = true
            player.lastKey = "d"
            break
        case "w":                   //TODO: adding double jump right here not in loop!!!!
            keys.w.pressed = true
            break
        case " ":
            player.attack()
            break

        // ENEMY KEYS
        case "ArrowLeft":
            keys.ArrowLeft.pressed = true
            enemy.lastKey = "ArrowLeft"
            break
        case "ArrowRight":
            keys.ArrowRight.pressed = true
            enemy.lastKey = "ArrowRight"
            break
        case "ArrowUp":
            keys.ArrowUp.pressed = true
            break
    }
    console.log(event.key)
})

    // checking if any specific button is not pressed
window.addEventListener("keyup", (event) => {
    switch (event.key) {
        // PLAYER KEYS
        case "a":
            keys.a.pressed = false
            break
        case "d":
            keys.d.pressed = false
            break
        case "w":
            keys.w.pressed = false
            break
        // ENEMY KEYS
        case "ArrowLeft":
            keys.ArrowLeft.pressed = false
            break
        case "ArrowRight":
            keys.ArrowRight.pressed = false
            break
        case "ArrowUp":
            keys.ArrowUp.pressed = false
            break
    }
    console.log(event.key)
})



// starting animation
animate()