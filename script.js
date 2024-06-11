// Get the body element
const body = document.querySelector("body");

// Create the container element
const container = document.createElement("div");

// Set the styles for the container
container.style.height = "90vh";
container.style.width = "90vw";
container.style.position = "relative";
container.style.border = "2px solid black";

// Set the styles for the body to center the container
body.style.display = "flex";
body.style.alignItems = "center";
body.style.justifyContent = "center";
body.style.height = "100vh";
body.style.margin = "0";

// Append the container to the body
body.appendChild(container);

const CONTAINER_HEIGHT = container.clientHeight;
const CONTAINER_WIDTH = container.clientWidth;

function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

class Ball {
  constructor(
    posX = 0,
    posY = 0,
    diameter = 20,
    velocity = 2,
    color = "black"
  ) {
    this.posX = posX;
    this.posY = posY;
    this.diameter = diameter;
    this.velocity = velocity;
    this.color = color;

    this.velX = getRandomInt(-2, 2) * velocity;
    this.velY = getRandomInt(-2, 2) * velocity;

    this.element = document.createElement("div");

    this.element.style.width = `${this.diameter}px`;
    this.element.style.height = `${this.diameter}px`;
    this.element.style.top = `${this.posY}px`;
    this.element.style.left = `${this.posX}px`;
    this.element.style.position = `absolute`;
    this.element.style.background = this.color;
    this.element.style.borderRadius = "50%";
  }
  //Check collision with rectangular boundary
  boundaryCollision() {
    this.posX += this.velX;
    this.posY += this.velY;

    //left side collision
    if (this.posX <= 0) {
      this.posX = 0;
      this.velX = -this.velX;
    }
    //top collision
    if (this.posY <= 0) {
      this.posY = 0;
      this.velY = -this.velY;
    }
    //right side collision
    if (this.posX + this.diameter >= CONTAINER_WIDTH) {
      this.posX = CONTAINER_WIDTH - this.diameter;
      this.velX = -this.velX;
    }
    //bottom collision
    if (this.posY + this.diameter >= CONTAINER_HEIGHT) {
      this.posY = CONTAINER_HEIGHT - this.diameter;
      this.velY = -this.velY;
    }

    this.element.style.left = `${this.posX}px`;
    this.element.style.top = `${this.posY}px`;
  }

  //Check collision with other balls
  ballCollision(otherBall) {
    if(this!==otherBall){
      const dx = this.posX+this.diameter/2 - otherBall.posX-otherBall.diameter/2;
      const dy = this.posY+this.diameter/2 - otherBall.posY-otherBall.diameter/2;
      const ballDistance = Math.sqrt(dx * dx + dy * dy);
  
      if (this.diameter / 2 + otherBall.diameter / 2 >= ballDistance) {
        const angle_of_collision = Math.atan2(dy, dx);
        const sin = Math.sin(angle_of_collision);
        const cos = Math.cos(angle_of_collision);
  
        // Rotate velocities
        const velX1 = cos * this.velX + sin * this.velY;
        const velY1 = cos * this.velY - sin * this.velX;
        const velX2 = cos * otherBall.velX + sin * otherBall.velY;
        const velY2 = cos * otherBall.velY - sin * otherBall.velX;
  
        // Update velocities based on mass
        const m1 = this.diameter;
        const m2 = otherBall.diameter;
  
        const newVelX1 = (velX1 * (m1 - m2) + 2 * m2 * velX2) / (m1 + m2);
        const newVelX2 = (velX2 * (m2 - m1) + 2 * m1 * velX1) / (m1 + m2);
  
        // Rotate velocities back
        this.velX = cos * newVelX1 - sin * velY1;
        this.velY = cos * velY1 + sin * newVelX1;
        otherBall.velX = cos * newVelX2 - sin * velY2;
        otherBall.velY = cos * velY2 + sin * newVelX2;
  
        // Resolve overlap
        const overlap_distance =
          this.diameter / 2 + otherBall.diameter / 2 - ballDistance;
        const overlapX = overlap_distance * cos;
        const overlapY = overlap_distance * sin;
  
        this.posX += overlapX * (m2 / (m1 + m2));
        this.posY += overlapY * (m2 / (m1 + m2));
        otherBall.posX -= overlapX * (m1 / (m1 + m2));
        otherBall.posY -= overlapY * (m1 / (m1 + m2));
      }

    }
  }
}

//generate random color
function getRandomColor() {
  COLORS = ["red", "green", "black", "purple", "violet", "pink", "blue"];
  getColor = COLORS[Math.floor(Math.random() * 6)];
  return getColor;
}

//update the properties of balls
function updateBall() {
  const color = getRandomColor();
  const diameter = getRandomInt(15,40);

  const x = getRandomInt(0, container.clientWidth - diameter);
  const y = getRandomInt(0, container.clientHeight - diameter);

  const speed = getRandomInt(2, 3);

  const array_all = [x,y,diameter,speed,color]

  return array_all;
}

// Creating the ball array
const balls = [];

const ball_count = 100;
for (let i = 0; i < ball_count; i++) {
  array_all = updateBall();
  const ball = new Ball(array_all[0],array_all[1],array_all[2],array_all[3],array_all[4]);
  container.appendChild(ball.element);
  balls.push(ball);
}

function animateBalls() {
  balls.forEach((ball) => {
    ball.boundaryCollision();
    //compare each ball with other ball
    balls.forEach((otherBall) => {
      ball.ballCollision(otherBall)
    });

  });

  requestAnimationFrame(animateBalls);
}

animateBalls();
