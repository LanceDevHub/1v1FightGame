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
    constructor({position, velocity, size}) {
        this.position = position
        this.velocity = velocity
        this.size = size
    }

    // draw sprite
    draw() {
        c.fillStyle = "red"
        c.fillRect(this.position.x, this.position.y, this.size.width, this.size.height)
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
    }
})

console.log(player)


// animation frame by frame
const animate = () => {
    window.requestAnimationFrame(animate)
    c.fillStyle = "black" // color background
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()

    doubleJumpTimer += 1

    // MOVEMENT-PART in animation loop
        // left right movement
    if (keys.a.pressed && lastKey === "a") {
        player.velocity.x = -2
    } else if (keys.d.pressed && lastKey === "d") {
        player.velocity.x = 2
    } else {
        player.velocity.x = 0
    }
        // jump movement
            // initial jump
    if (keys.w.pressed && player.position.y + player.size.height === canvas.height){
        player.velocity.y = -5
        doubleJumpTimer = 0
        jumpCount += 1
    }
            // double jump
    if (keys.w.pressed && (player.position.y + player.size.height) !== canvas.height && jumpCount === 1 && doubleJumpTimer >= 20) {
        player.velocity.y = -5
        jumpCount = 0
    }
    console.log(doubleJumpTimer)

}

// KEY-INPUTS

    // checking for keys that are pressed to provide exact movement without keys interrupting each other
        // initial all keys have to be false related to pressed
const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    }
}
    // includes last pressed key
let lastKey = undefined
    // essential for double jump
let jumpCount = 0
let doubleJumpTimer = 0



    // checking if any button is pressed ("keydown")
window.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "a":
            keys.a.pressed = true
            lastKey = "a"
            break
        case "d":
            keys.d.pressed = true
            lastKey = "d"
            break
        case "w":
            keys.w.pressed = true
            break
    }
    console.log(event.key)
})

    // checking if any specific button is not pressed
window.addEventListener("keyup", (event) => {
    switch (event.key) {
        case "a":
            keys.a.pressed = false
            break
        case "d":
            keys.d.pressed = false
            break
        case "w":
            keys.w.pressed = false
            break
    }
    console.log(event.key)
})



// starting animation
animate()