let zombies = []; // Pole pro uložení všech zombíků ve hře
let player;       // Objekt hráče
let bullets = []; // Pole pro uložení všech střel
let score = 0;    // Skóre hráče
let canvas;
let lastShotTime = 0;  // Čas posledního výstřelu
const shotDelay = 99;  // Prodleva mezi výstřely v milisekundách (0.099 sekund)

function setup() {
  canvas = createCanvas(800, 900);  // Nastavení velikosti herního prostoru
  canvas.position((windowWidth - width) / 2, (windowHeight - height) / 2);  // Centrované umístění canvasu
  

  for (let i = 0; i < 5; i++) {  // Vytvoření úvodních pěti zombíků
    zombies.push(new Zombie());
  }
  player = new Player();  // Vytvoření objektu hráče
  document.body.style.backgroundColor = 'black';  // Nastavení pozadí stránky na černou barvu
}

function draw() {
  background(50, 205, 50);  // Zelené pozadí (trávník)

  // Instrukce pro ovládání
  fill(0);
  textSize(16);
  text('Ovládání: Šipky vlevo/vpravo - pohyb, Mezerník - střelba', 20, 20);

  // Aktualizace a zobrazení všech zombíků
  for (let i = zombies.length - 1; i >= 0; i--) {
    zombies[i].update();
    zombies[i].show();

    // Pokud zombík projde spodní hranici, odstraní se a sníží se skóre
    if (zombies[i].y > height) {
      zombies.splice(i, 1);
      score--;
      zombies.push(new Zombie());  // Přidání nového zombíka
    }
  }

  // Aktualizace a zobrazení hráče
  player.update();
  player.show();

  // Aktualizace a zobrazení všech střel
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].update();
    bullets[i].show();

    // Kontrola kolize střely se zombíkem
    for (let j = zombies.length - 1; j >= 0; j--) {
      if (bullets[i].hits(zombies[j])) {
        bullets.splice(i, 1);  // Odstranění střely
        zombies.splice(j, 1);  // Odstranění zasaženého zombíka
        score++;               // Zvýšení skóre
        zombies.push(new Zombie());  // Přidání nového zombíka
        break;
      }
    }
  }

  // Zobrazení skóre
  fill(0);
  textSize(24);
  text('Score: ' + score, 10, 50);
}

function keyPressed() {
  // Kontrola stisknutí mezerníku a prodlevy mezi výstřely
  if (key === ' ' && millis() - lastShotTime > shotDelay) {
    bullets.push(new Bullet(player.x + player.w / 2, player.y));  // Vytvoření nové střely
    lastShotTime = millis();  // Aktualizace času posledního výstřelu
  }

  // Nastavení směru pohybu hráče
  if (keyCode === LEFT_ARROW) {
    player.setDir(-1);  // Pohyb vlevo
  } else if (keyCode === RIGHT_ARROW) {
    player.setDir(1);   // Pohyb vpravo
  }
}

function keyReleased() {
  // Zastavení pohybu hráče po uvolnění klávesy
  if (keyCode === LEFT_ARROW && player.dir === -1) {
    player.setDir(0);
  } else if (keyCode === RIGHT_ARROW && player.dir === 1) {
    player.setDir(0);
  }
}

// Třída pro zombíky
class Zombie {
  constructor() {
    this.x = random(width);  // Náhodná počáteční horizontální pozice
    this.y = 0;              // Vertikální pozice (začíná nahoře)
    this.r = 20;             // Poloměr pro vykreslení
  }

  update() {
    this.y += 2;  // Pohyb směrem dolů
  }

  show() {
    fill(0, 128, 0);  // Zelená barva těla
    rect(this.x - this.r, this.y - this.r, this.r * 1.5, this.r * 1.5);  // Tělo zombíka
    fill(0);  // Černá barva hlavy
    ellipse(this.x - this.r / 4, this.y - this.r / 3, this.r / 1.5, this.r / 1.5);  // Hlava zombíka
    // Ruce zombíka
    rect(this.x - this.r - 10, this.y - this.r / 1.5, 10, 5);  // Levá ruka
    rect(this.x + this.r / 2, this.y - this.r / 1.5, 10, 5);   // Pravá ruka
  }
}

// Třída pro hráče
class Player {
  constructor() {
    this.x = width / 2;    // Počáteční horizontální pozice (střed)
    this.y = height - 40;  // Vertikální pozice (dole)
    this.w = 40;           // Šířka hráče
    this.h = 60;           // Výška hráče
    this.dir = 0;          // Směr pohybu (0 = stojí)
  }

  update() {
    this.x += this.dir * 5;  // Aktualizace pozice podle směru
    this.x = constrain(this.x, 0, width - this.w);  // Omezení pohybu na hranice canvasu
  }

  setDir(dir) {
    this.dir = dir;  // Nastavení směru pohybu (-1 = vlevo, 1 = vpravo)
  }

  show() {
    fill(0, 0, 255);  // Modrá barva těla
    rect(this.x, this.y, this.w, this.h);  // Tělo hráče
    fill(0);  // Černá barva hlavy
    rect(this.x + this.w / 2 - 5, this.y - 10, 10, 20);  // Hlava hráče
    fill(255, 255, 0);  // Žlutá barva pistole
    rect(this.x + this.w / 2 - 2, this.y + 10, 4, 20);  // Pistole
  }
}

// Třída pro střely
class Bullet {
  constructor(x, y) {
    this.x = x;      // Počáteční horizontální pozice střely
    this.y = y;      // Počáteční vertikální pozice střely
    this.w = 4;      // Šířka střely
    this.h = 10;     // Výška střely
  }

  update() {
    this.y -= 5;  // Pohyb střely směrem nahoru
  }

  hits(zombie) {
    let d = dist(this.x, this.y, zombie.x, zombie.y);  // Vzdálenost mezi střelou a zombíkem
    return d < this.w + zombie.r;  // Kontrola, zda došlo k zásahu
  }

  show() {
    fill(255, 255, 0);  // Žlutá barva střely
    rect(this.x, this.y, this.w, this.h);
  }
}
