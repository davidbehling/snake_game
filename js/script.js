const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

const score = document.querySelector('.score-value')
const finalScore = document.querySelector('.final-score > span')
const menu = document.querySelector('.menu-screen')
const buttonPlay = document.querySelector('.btn-play')

const eatSom = new Audio('../assets/audio.mp3')

const size = 30

let snake = [{ x: 270, y: 240 }]

const incrementScore = () => {
    score.innerHTML = +score.innerHTML + 10
}

const randomNumber = (min, max) => {
    return Math.round(Math.random() * (max - min) + min)
}

const randomPosition = () => {
    const number = randomNumber(0, canvas.width - size)
    return Math.round(number / size) * size
}

const randomColor = () => {
    red = randomNumber(0, 255)
    green = randomNumber(0, 255)
    blue = randomNumber(0, 255)

    return `rgb(${red}, ${green}, ${blue})`
}

const food = { x: randomPosition(), y: randomPosition(), color: randomColor() }

const chagePositionFood = () => {
    food.x = randomPosition()
    food.y = randomPosition()
    food.color = randomColor()

    const head = getHead()

    snake.forEach((position) => {
        if (equalCoordinates(position, food)) {
            chagePositionFood() 
        }
    })
}

const drawGrid = () => {
    context.lineWidth = 1
    context.strokeStyle = '#191919'

    for(let i = size; i < canvas.width; i += size) {
        context.beginPath()
        context.lineTo(i, 0)
        context.lineTo(i, 600)
        context.stroke()

        context.beginPath()
        context.lineTo(0, i)
        context.lineTo(600, i)
        context.stroke()
    }
}

const drawFood = () => {
    const { x, y, color } = food

    context.shadowColor = color
    context.shadowBlur = 6
    context.fillStyle = food.color
    context.fillRect(x, y, size, size)
    context.shadowBlur = 0
}

const drawSnake = () => {
    context.fillStyle = '#ddd'

    snake.forEach((position, index) => {
        if (index == snake.length - 1) {
            context.fillStyle = 'white'
        }

        context.fillRect(position.x, position.y, size, size)
    })
}

let direction, loopId

const getHead = () => {
    return snake[snake.length - 1]
}

const moveSnake = () => {
    if (!direction) return

    const head = getHead()

    if (direction == 'right') {
        snake.push( { x: head.x + size, y: head.y })
    }

    if (direction == 'left') {
        snake.push( { x: head.x - size, y: head.y })
    }

    if (direction == 'down') {
        snake.push( { x: head.x, y: head.y + size })
    }

    if (direction == 'up') {
        snake.push( { x: head.x, y: head.y - size })
    }

    snake.shift()
}

const checkEat = () => {
    const head = getHead()

    if (equalCoordinates(head, food)) {
        eatSom.play()
        snake.push(head)
        incrementScore()
        chagePositionFood() 
    }
}

const selfCollision = (head) => {
    const neakIndex = snake.length - 2

    return snake.find((position, index) => {
        return index < neakIndex  && position.x == head.x && position.y == head.y
    })
}

const wallCollision = (head) => {
    const canvasLimit = canvas.width - size
    return head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit
}

const checkCollision = () => {
    const head = getHead()

    if (wallCollision(head) || selfCollision(head)) {
        gameOver()
    }
}

const gameOver = () => {
    direction = undefined
    menu.style.display = 'flex'
    finalScore.innerHTML = score.innerHTML
    canvas.style.filter = 'blur(2px)'    
}

const playAgain = () => {
    snake = [{ x: 270, y: 240 }]
    menu.style.display = 'none'
    canvas.style.filter = 'none'
    score.innerHTML = '00'
    finalScore.innerHTML = '00'

    game()
}

const equalCoordinates = (head, food) => {
    return head.x == food.x && head.y == food.y
}

const game = () => {
    clearInterval(loopId)
    context.clearRect(0, 0, 600, 600)

    drawGrid()
    drawFood()
    moveSnake()
    drawSnake()
    checkEat()
    checkCollision()

    loopId = setInterval(() => {
        game()
    }, 300)
}

game()

document.addEventListener("keydown", ({ key }) => {
    let directions = ['right', 'left', 'up', 'down']
    let keyDirection = key.toLowerCase().replace('arrow', '')

    if (directions.includes(keyDirection)) {
        if ((keyDirection == 'right' && direction == 'left') 
        || (keyDirection == 'left' && direction == 'right')
        || (keyDirection == 'up' && direction == 'down')
        || (keyDirection == 'down' && direction == 'up')) return

        direction = keyDirection
    }
})

buttonPlay.addEventListener('click', () => {playAgain()})

