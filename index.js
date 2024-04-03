// selects canvas element from html file
const canvas = document.querySelector("canvas")
// setting rendering context. use c. as api
const c = canvas.getContext("2d")

// resolution
canvas.width = 1024
canvas.height = 576

// creating main canvas
c.fillRect(0, 0 ,canvas.width, canvas.height)

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
        if (this.position.y >= canvas.height - this.size.height) {
            this.position.y = canvas.height - this.size.height
        } else {
            this.position.y += this.velocity.y
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
        y: 10
    },
    size : {
        width: 50,
        height: 150
    }
})

const enemy = new Sprite({
    position: {
        x: 400,
        y: 0
    },
    velocity: {
        x: 0,
        y: 5
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
}

animate()