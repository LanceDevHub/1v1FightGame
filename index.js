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
    constructor({position, velocity, size, healthBar}) {
        this.position = position
        this.velocity = velocity
        this.size = size
        this.healthBar = healthBar
        this.attackFinished = false
    }


    // draw sprite
    drawSprite() {
        c.fillStyle = "red"
        c.fillRect(this.position.x, this.position.y, this.size.width, this.size.height)
    }
    // draw healthBar
    drawHealthBar() {
        c.fillStyle = "green"
        // player 1 healthBar
        if (this.healthBar.player === 1) {
            if (this.healthBar.health <= 0) {
                c.fillRect(30, 20, 0, 20)
            } else {
                c.fillRect(30, 20, 150 / 100 * this.healthBar.health, 20)
            }
        // player 2 healthBar
        } else if (this.healthBar.player === 2) {
            if (this.healthBar.health <= 0) {
                c.fillRect(1024 - this.size.height , 20, 0, 20)
            } else {
                c.fillRect(1024 - this.size.height - 30, 20, 150 / 100 * this.healthBar.health, 20)
            }
        }
    }

    drawHand() {
        c.fillStyle = "orange"
        c.fillRect(this.position.x, this.position.y + 50, 75, 25)
    }


    // TODO:
        // let the doAttack be a class variable instead of a global one
        // attackAnimation and attackRate timer as well to make it individual for every sprite instance
    drawAttack() {
        c.fillStyle = "orange"
        c.fillRect(this.position.x, this.position.y + 50, 75 + 25 / 20 * attackAnimationTimer, 25)
        if (attackAnimationTimer >= 20) {
            this.attackFinished = true
        } else if (attackAnimationTimer <= 0) {
            this.attackFinished = false
            doAttack = false
        }
        if (this.attackFinished === false) {
            attackAnimationTimer += 1
        } else if (this.attackFinished === true) {
            attackAnimationTimer -= 1
        }

    }

    // update sprite e.g related to gravity etc.
    update() {
        this.drawSprite()
        this.drawHealthBar()
        this.drawHand()


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
        // checking canvas border related to x-axis right side
        if (this.position.x + this.size.width > canvas.width) {
            this.velocity.x = 0
            this.position.x = canvas.width - this.size.width
        }
            // left side
        if (this.position.x <= 0) {
            this.velocity.x = 0
            this.position.x = 0
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
    size: {
        width: 50,
        height: 150
    },
    healthBar: {
        health: 100,
        player: 1
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
    size: {
        width: 50,
        height: 150
    },
    healthBar: {
        health: 100,
        player: 2
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
    if (doAttack) {
        player.drawAttack()
    }
    player.healthBar.health -= 0.75
    enemy.healthBar.health -= 0.5
    doubleJumpTimer += 1
    attackRateTimer += 1

    // MOVEMENT-PART in animation loop

        // left/right-movement
    if (keys.a.pressed && lastKey === "a") {
        player.velocity.x = -4
    } else if (keys.d.pressed && lastKey === "d") {
        player.velocity.x = 4
    } else {
        player.velocity.x = 0
    }
        // jump-movement
            // initial jump
    if (keys.w.pressed && player.position.y + player.size.height === canvas.height){
        player.velocity.y = -5
        doubleJumpTimer = 0
        jumpCount += 1
    }
            // double-jump
    if (keys.w.pressed && (player.position.y + player.size.height) !== canvas.height && jumpCount === 1 && doubleJumpTimer >= 20) {
        player.velocity.y = -5
        jumpCount = 0
    }

    // ATTACKING
    if (keys.p.pressed && attackRateTimer >= 60) {
        doAttack = true
        attackRateTimer = 0
    }


    // delete later on just for checking some insights
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
    },
    p:  {
        pressed: false
    }
}

    // includes last pressed key
let lastKey = undefined
    // essential for double jump
let jumpCount = 0
let doubleJumpTimer = 0
    // essential for attacking
        // attack rate timer
let attackRateTimer = 0
        // attack animation timer
let attackAnimationTimer = 1
let doAttack = false



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
        case "p":
            keys.p.pressed = true
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
        case "p":
            keys.p.pressed = false
            break
    }
    console.log(event.key)
})



// starting animation
animate()