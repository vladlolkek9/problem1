'use strict';
//задний фон начало 

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d');


var background = new Image();
background.src = "./src/images/170229.jpg";
background.width = 3840;
background.height = 2400;

let vw, vh, cx, cy, bgX, bgY, bgW, bgH, maxDots, minDistance;

window.addEventListener('resize', updateSizes);
function updateSizes() {
    canvas.width = vw = window.innerWidth;
    canvas.height = vh = window.innerHeight;
    cx = Math.floor(vw / 2);
    cy = Math.floor(vh / 2);

    let k_w = background.width / vw;
    let k_h = background.height / vh;
    let k = k_w < k_h ? k_w : k_h;
    bgW = Math.floor(vw * k);
    bgH = Math.floor(vh * k);
    bgX = Math.floor((background.width - bgW) / 2);
    bgY = Math.floor((background.height - bgH) / 2);

    maxDots = Math.ceil(vw * vh / 50000)
    minDistance = Math.floor(Math.sqrt(vw**2 + vh**2) / (maxDots / 5));
}
updateSizes();

const getDistance = (x1, y1, x2, y2) => Math.sqrt( Math.pow( (x1 - x2), 2) + Math.pow( (y1 - y2), 2) );

class Dot {

    constructor() {
        this.isCharged = Math.random() < 0.5 ? true : false;
        this.color = this.isCharged ? 'rgba(255, 0, 0 , 0.0)' : 'rgba(255, 0, 0, 0.0)';
        this.hp = 254 + Math.ceil(255 * Math.random());
        this.sizeSub = 0.01
        this.size = (this.sizeSub * this.hp) + 1;
        // 0 - top; 1 - right; 2 - bottom; 3 - left.
        let startSide = Math.floor(Math.random() * 4);
        this.x = (startSide === 0 || startSide === 2) ? Math.floor(Math.random() * vw) 
            : (startSide === 1)? vw + this.size : 0 - this.size;
        this.y = (startSide === 1 || startSide === 3) ? Math.floor(Math.random() * vh)
            : (startSide === 2) ? vh + this.size : 0 - this.size;

        let targetX = (startSide === 0 || startSide === 2) ? Math.floor(Math.random() * vw) 
            : (startSide === 3)? vw + this.size : 0 - this.size;
        let targetY = (startSide === 1 || startSide === 3) ? Math.floor(Math.random() * vh)
            : (startSide === 0) ? vh + this.size : 0 - this.size;

        this.speed = 0.1 + Math.random();
        
        let dx = targetX - this.x; // - 10
        let dy = targetY - this.y; //  4.5
        let path = Math.sqrt( Math.pow(dx, 2) + Math.pow(dy, 2) );
        let steps = path / this.speed;

        this.stepX = dx / steps;
        this.stepY = dy / steps;
        
        this.isExist = true;
    }

    draw() {
        this.x += this.stepX;
        this.y += this.stepY;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();

        if (this.x + this.size + this.speed < 0
        || this.x - this.size - this.speed > vw
        || this.y + this.size + this.speed < 0
        || this.y - this.size - this.speed > vh
        || this.hp < 1) {
            this.isExist = false;
        }
    }
}

let dotsArr = [];

function checkDotsDistance() {
    for (let i = 0; i < dotsArr.length - 1; i++) {
        for (let j = i+1; j < dotsArr.length; j++) {
            if (dotsArr[i].isCharged !== dotsArr[j].isCharged) {
                let distance = getDistance(dotsArr[i].x, dotsArr[i].y, dotsArr[j].x, dotsArr[j].y)
                if (distance <= minDistance) {
                    drawLightning(dotsArr[i], dotsArr[j], distance);
                    dotsArr[i].hp -= 1;
                    dotsArr[j].hp -= 1;
                    dotsArr[i].size -= dotsArr[i].sizeSub;
                    dotsArr[j].size -= dotsArr[j].sizeSub;
                }
            }
        }
    }
}

const lightningColors = ['rgb(255, 215, 0)']
function drawLightning(dotA, dotB, distance) {
    let sx = dotA.x;
    let sy = dotA.y;
    let stepsCount = Math.ceil(distance * Math.random() / 2);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = lightningColors[Math.floor(Math.random() * lightningColors.length)];
    ctx.beginPath();
    ctx.moveTo(dotA.x, dotA.y);
    for (let i = stepsCount; i > 1; i--) {
        let pathLength = getDistance(dotA.x, dotA.y, sx, sy);
        let offset = Math.sin(pathLength / distance * Math.PI) * 7;
        sx += (dotB.x - sx) / i + Math.random() * offset * 2 - offset;
        sy += (dotB.y - sy) / i + Math.random() * offset * 2 - offset;
        ctx.lineTo(sx, sy);
    }
    ctx.stroke();
}

// ANIMATION
function animate() {
    frames++;
    ctx.clearRect(0, 0, vw, vh);

    ctx.drawImage(background, bgX, bgY, bgW, bgH, 0, 0, vw, vh);

    dotsArr.forEach( dot => dot.draw() );
    dotsArr = dotsArr.filter(dot => dot.isExist);

    checkDotsDistance();
    if (dotsArr.length < maxDots) dotsArr.push( new Dot() );

    requestAnimationFrame(animate);
}

background.onload = function(){
    animate();
}
//конец фона 
//текст 
