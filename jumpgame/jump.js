class Bird {
    constructor() {
      this.x = 150;
      this.y = 200;
      this.vy = 0;
      this.width = 20;
      this.height = 20;
      this.weight = 1;
    }
    update() {
      let curve = Math.sin(angel) * 20;
      if (this.y > canvas.height - this.height * 3 + curve) {
        this.y = canvas.height - this.height * 3 + curve;
        this.vy = 0;
      } else {
        this.vy += this.weight;
        this.vy *= 0.9;
        this.y += this.vy;
      }
      if (this.y < 0 + this.height) {
        this.y = this.height;
        this.vy = 0;
      }
      if (spacePressed && this.y > this.height * 3) this.flap();
    }
    draw() {
      ctx.fillStyle = "hsla(" + hue + ",100%, 50%, 0.8)";
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    flap() {
      this.vy -= 2;
    }
  }
  
  let bird = new Bird();
  
  let particlesArray = [];
  
  class Particle {
    constructor() {
      this.x = bird.x;
      this.y = bird.y + 10;
      this.size = Math.random() * 7 + 3;
      this.speedY = Math.random() * 1 - 0.5;
      this.color = "hsla(" + hue + ",100%, 50%, 0.8)";
    }
    update() {
      this.x -= gamespeed;
      this.y -= this.speedY;
    }
    draw() {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  function handleParticles() {
    particlesArray.unshift(new Particle());
    for (i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
      particlesArray[i].draw();
    }
    // if mor than 200
    if (particlesArray.length > 200) {
      for (let i = 0; i < 20; i++) {
        particlesArray.pop(particlesArray[i]);
      }
    }
  }
  let obstaclesArray = [];
  
  function init() {
    bird = new Bird();
    particlesArray = [];
    obstaclesArray = [];
    handleObstacles();
    score = 0;
    gamespeed = 2;
    long = 100;
  }
  
  class Obstacle {
    constructor() {
      this.top = (Math.random() * canvas.height) / 3 + 25;
      this.bottom = (Math.random() * canvas.height) / 3 + 25;
      this.x = canvas.width;
      this.width = 20;
      this.color = "hsl(" + hue + "," + "100%, 50%, 1)";
      this.counted = false;
    }
    draw() {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, 0, this.width, this.top);
      ctx.fillRect(this.x, canvas.height - this.bottom, this.width, this.bottom);
    }
    update() {
      this.x -= gamespeed;
      if (!this.counted && this.x < bird.x) {
        score++;
        this.counted = true;
      }
      this.draw();
    }
  }
  let long = 100;
  function handleObstacles() {
    if (score > 10) {
      long = 30;
      gamespeed = 4;
    }
    if (score > 30) {
      long = 20;
      gamespeed = 6;
    }
    if  (score > 40) {
      long = 10;
      gamespeed = 8;
    }
    if (frame % long === 0) {
      obstaclesArray.unshift(new Obstacle());
    }
    for (let i = 0; i < obstaclesArray.length; i++) {
      obstaclesArray[i].update();
    }
    if (obstaclesArray.length > 20) {
      obstaclesArray.pop(obstaclesArray[0]);
    }
  }
  const canvas = document.getElementById("canvas1");
  window.ctx = canvas.getContext("2d");
  const replay = document.getElementById("replay");
  
  // const highScoreBo = document.querySelector('.highScore');
  // let highScore = localStorage.getItem('theHighScore') || 0;
  
  canvas.width = 600;
  canvas.height = 400;
  
  let spacePressed = false;
  let angel = 0;
  let hue = 0;
  let frame = 0;
  let score = 0;
  let gamespeed = 2;
  
  const gradient = ctx.createLinearGradient(0, 0, 0, 70);
  gradient.addColorStop("0.4", "black");
  //gradient.addColorStop("0.5", "#000");
  //gradient.addColorStop("0.55", "#4040ff");
  //gradient.addColorStop("0.6", "#000");
  //gradient.addColorStop("0.9", "#fff");
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleObstacles();
    handleParticles();
    bird.update();
    bird.draw();
    //score count
    ctx.fillStyle = gradient;
    ctx.font = "90px Georgia";
    ctx.fillText(score, 450, 70);
    ctx.strokeText(score, 450, 70);
    handleCollisions();
    if (handleCollisions()) return;
    requestAnimationFrame(animate);
    angel += 0.12;
    hue++;
    frame++;
  }
  
  // animate();
  
  replay.addEventListener("click", () => {
    init();
    animate();
    replay.style.display = "none";
  });
  
  window.addEventListener("keydown", function (e) {
    if (e.code === "Space") spacePressed = true;
  });
  window.addEventListener("keyup", function (e) {
    if (e.code === "Space") spacePressed = false;
  });

  const bang = new Image();
  // bang.src = ' ';
  function handleCollisions() {
    for (i = 0; i < obstaclesArray.length; i++) {
      if (
        bird.x < obstaclesArray[i].x + obstaclesArray[i].width &&
        bird.x + bird.width > obstaclesArray[i].x &&
        ((bird.y < 0 + obstaclesArray[i].top && bird.y + bird.height > 0) ||
          (bird.y > canvas.height - obstaclesArray[i].bottom &&
            bird.y + bird.height < canvas.height))
      ) {
        ctx.drawImage(bang, bird.x, bird.y, 50, 50);
        replay.style.display = "inline-block";
        replay.innerHTML = `Total score:${score}</br>Play Again`;
        checkHighScore();
        return true;
      }
    }
  }
  
  const highScoreBo = document.querySelector(".highScore");
  let highScore = localStorage.getItem("theHighScore") || 0;
  
  highScoreBo.textContent = "High Score: " + highScore;
  
  function checkHighScore() {
    if (score > localStorage.getItem("theHighScore")) {
      localStorage.getItem("theHighScore", score);
      highScore = score;
      highScoreBo.textContent = "High Score: " + highScore;
    }
  }

  
  
