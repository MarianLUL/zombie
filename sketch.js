let zombies = [];
let player;
let bullets = [];
let score = 0;
let canvas;
let lastShotTime = 0;
const shotDelay = 100; // 0.3 second delay in milliseconds


function setup() {
  canvas = createCanvas(800, 900);
  canvas.position((windowWidth - width) / 2, (windowHeight - height) / 2);
  canvas.style('background-color', 'transparent'); // Nastavíme průhledné pozadí canvasu
  for (let i = 0; i < 5; i++) { // Přidáme více zombíků
    zombies.push(new Zombie());
  }
  player = new Player();
  document.body.style.backgroundColor = 'black'; // Nastavíme černé pozadí za canvasem
}

function draw() {
  background(50, 205, 50); // Nastavíme pozadí jako trávník
  
  // Instructions
  fill(0);

  textSize(16);
  text('Ovládání: Šipky vlevo/vpravo - pohyb, Mezerník - střelba', 20, 20);

  // Zombies
  for (let i = zombies.length - 1; i >= 0; i--) {
    zombies[i].update();
    zombies[i].show();

    if (zombies[i].y > height) {
      zombies.splice(i, 1);
      score--;
      zombies.push(new Zombie());
    }
  }

  // Player
  player.update();
  player.show();

  // Bullets
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].update();
    bullets[i].show();
    for (let j = zombies.length - 1; j >= 0; j--) {
      if (bullets[i].hits(zombies[j])) {
        bullets.splice(i, 1);
        zombies.splice(j, 1);
        score++;
        zombies.push(new Zombie());
        break;
      }
    }
  }

  // Display score
  fill(0);
  textSize(24);
  text('Score: ' + score, 10, 50);
}

function keyPressed() {
  if (key === ' ' && millis() - lastShotTime > shotDelay) {
    bullets.push(new Bullet(player.x + player.w / 2, player.y));
    lastShotTime = millis();
  }
  if (keyCode === LEFT_ARROW) {
    player.setDir(-1);
  } else if (keyCode === RIGHT_ARROW) {
    player.setDir(1);
  }
}

function keyReleased() {
  if (keyCode === LEFT_ARROW && player.dir === -1) {
    player.setDir(0);
  } else if (keyCode === RIGHT_ARROW && player.dir === 1) {
    player.setDir(0);
  }
}

class Zombie {
  constructor() {
    this.x = random(width);
    this.y = 0;
    this.r = 20;
  }

  update() {
    this.y += 2;
  }

  show() {
    fill(0, 128, 0); // Zelená barva pro zombíka
    rect(this.x - this.r, this.y - this.r, this.r * 1.5, this.r * 1.5); // Tělo zombíka
    fill(0);
    ellipse(this.x - this.r/4, this.y - this.r / 3, this.r / 1.5, this.r / 1.5); // Hlava
    rect(this.x - this.r - 10, this.y - this.r / 1.5, 10, 5); // Levá ruka
    rect(this.x + this.r/2, this.y - this.r / 1.5, 10, 5); // Pravá ruka
  }
}

class Player {
  constructor() {
    this.x = width / 2;
    this.y = height - 40;
    this.w = 40;
    this.h = 60;
    this.dir = 0;
  }

  update() {
    this.x += this.dir * 5;
    this.x = constrain(this.x, 0, width - this.w);
  }

  setDir(dir) {
    this.dir = dir;
  }

  show() {
    fill(0, 0, 255);
    rect(this.x, this.y, this.w, this.h); // Tělo postavičky
    fill(0);
    rect(this.x + this.w / 2 - 5, this.y - 10, 10, 20); // Hlava postavičky
    fill(255, 255, 0);
    rect(this.x + this.w / 2 - 2, this.y + 10, 4, 20); // Pistole
  }
}

class Bullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 4;
    this.h = 10;
  }

  update() {
    this.y -= 5;
  }

  hits(zombie) {
    let d = dist(this.x, this.y, zombie.x, zombie.y);
    return d < this.w + zombie.r;
  }

  show() {
    fill(255, 255, 0); // Žlutá barva pro náboj
    rect(this.x, this.y, this.w, this.h);
  }
}
