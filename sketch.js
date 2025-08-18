console.log("hooked");

let mainCanvas;
let waveformCanvas;
let seekerCanvas;

let song;
let fft;

let waveform;

let trackName = "random_sketch1.wav";

let volume;
let volumeLabel;

let panning;
let panLabel;

let beatPulse = 50;

//eyes
let eyeSizeX = 15;
let eyeSizeY = 8;

let counterWave = 45;
let speed = 0.01;

let playButton;
let playText;

let timer = 12;

let checkThreshold = false;
let currentEnergy = 0;
let newEnergy = 0;

//closeMouth
let closeMouthX = 20;
let closeMouthY = 5;

//openMouth
let openMouthX = 75;
let openMouthY = 25;

let currentMouthX;
let currentMouthY;

let selectedColor;

let speedRateValue = document.getElementById("rate-value");
let rightArrow = document.getElementById("right-arrow");
let leftArrow = document.getElementById("left-arrow");
let currentSpeedRate = 1;

let isThresholdEnergySet = false;

let audioZone = document.getElementById("drop-zone");

let currentSong = null;
let nextSong = null;

let critter = {
    leftEar: {
        x1: 400,
        y1: 120,
        x2: 500,
        y2: 80,
        x3: 500,
        y3: 40,
        moveSideX2: 480,
        moveSideX3: 480
    },
    rightEar: {
        x1: 280,
        y1: 60,
        x2: 400,
        y2: 120,
        x3: 300,
        y3: 120,
        moveSideX2: 380,
        moveSideX3: 280      
    },
    head: {
        x:400,
        y:150,
        currentXSize: 100,
        currentYSize: 100,
        xSize: 100,
        ySize: 100,
        xBigSize: 130,
        yBigSize: 130,
        xSpeed: 2,
        ySpeed: 2
    },
    leftEye: {
        x1: 220,
        y1: 80,
        x2: 405,
        y2: 120,
        x3: 420,
        y3: 160,
        x4: 180,
        y4: 320 
    },
    rightEye: {
        x1: 300,
        y1: 40,
        x2: 345,
        y2: 120,
        x3: 390,
        y3: 160,
        x4: 200,
        y4: 450 
    },
    mouth: {
        x: 400,
        y: 190,
        closeMouthX: 20,
        closeMouthY: 5,
        openMouthX: 75,
        openMouthY: 25,
    }
}

rightArrow.addEventListener("click", () => {
        currentSpeedRate++;
        song.rate(song.rate() + 0.1);
        speedRateValue.innerText = currentSpeedRate;
})

leftArrow.addEventListener("click", () => {
        currentSpeedRate--;
        song.rate(song.rate() - 0.1);
        speedRateValue.innerText = currentSpeedRate;
})

function preload(){
    song = loadSound('random_sketch1.wav');
    currentSong = song;
}

function randomizeColors() {
    return random(0, 255);
}

function keyPressed(){
    if(keyCode === 32 || key === ' '){
        togglePlay();
    }

    if(key === 'ArrowRight'){
        rightArrow.style.fontSize = '55px';
        currentSpeedRate++;
        song.rate(song.rate() + 0.1);
    } else if(key === 'ArrowLeft'){
        leftArrow.style.fontSize = '55px';
        currentSpeedRate--;
        song.rate(song.rate() - 0.1);
    }

    speedRateValue.innerText = currentSpeedRate;
    console.log("Current Rate: ", song.rate());

}

function keyReleased() {
    if(key === 'ArrowRight'){
    rightArrow.style.fontSize = '35px';
    } else if(key === 'ArrowLeft'){
    leftArrow.style.fontSize = '35px';
    }
}

function setup(){
    mainCanvas = createCanvas(800, 400);
    mainCanvas.id('main-canvas');

    let audioDrop = select('#drop-zone');

    waveformCanvas = createGraphics(800, 400);
    waveformCanvas.background(255, 0, 0, 0.5);

    seekerCanvas = createGraphics(800, 400);
    seekerCanvas.background(0, 255, 0, 0.3);

    selectedColor = randomizeColors();
    playButton = createButton("Play");
    playButton.class("play-button");

    playText = createP("Spacebar to Play/Stop");
    playText.class("play-text");

    fft = new p5.FFT();
    peakDetect = new p5.PeakDetect();
    song.setLoop(true);
    fft.setInput(song);

    speedRateValue.innerText = currentSpeedRate;

    waveform = song.getPeaks();

    playButton.mousePressed(togglePlay);

    currentMouthX = closeMouthX;
    currentMouthY = closeMouthY;

    volume = select("#volume");
    song.setVolume(volume.value());
    volumeLabel = document.getElementById("volume-value");
    volumeLabel.innerText = Math.floor(volume.value() * 100);

    panning = select("#panning");
    song.pan(panning.value());
    panLabel = document.getElementById("pan-value");
    
    audioDrop.dragOver(highlight);
    audioDrop.dragLeave(unhighlight);
    audioDrop.drop(handleDrop);

    function highlight(e) {
        audioDrop.addClass('highlight');
    }

    function unhighlight(e) {
        audioDrop.removeClass('highlight');
    }

    function handleDrop(file) {
        unhighlight();
        if(file.type === 'audio'){
            trackName = file.name;
            loadSound(file.data, (newSong) => {
                stopSong();
                song = newSong;
                fft.setInput(song);
            })
        } else {
            console.log("not loaded");
        }
    }
}

function stopSong(){
    if(song.isPlaying()){
        song.stop();
        seekerCanvas.clear();
        playButton.html("Play");
        resetCreature();
        song.rate(1);
        currentSpeedRate = 1;
        speedRateValue.innerText = currentSpeedRate;
    }
}

function togglePlay(){
    if(song.isPlaying() ){
        checkThreshold = false;
        stopSong();
    } else{
        checkThreshold = true;
        song.loop();
        playButton.html("Stop");
    }
}

function controlVolume() {
    volumeLabel.innerText = Math.floor(volume.value() * 100);
    song.setVolume(volume.value());
}

function controlPanning(){
    panLabel.innerText = panning.value();
    song.pan(panning.value());

    if(panning.value() > 0.0){
        panLabel.innerText = "(R)ight = " + panning.value();
    } else if (panning.value() < 0.0){
        panLabel.innerText = "(L)eft = " + panning.value();
    } else {
        panLabel.innerText = panning.value();
    }
}

function setupWaveform(peaks, currentPlaybackPosition){
        //waveform
        image(waveformCanvas, 0, 0);
        waveformCanvas.fill(0, 200, 0);

        waveformCanvas.clear();
        
        for(let i = 0; i < peaks.length; i++){
            let waveformX = map(i, 0, peaks.length, 0, width);
            let waveformY = map(peaks[i], -1, 1, 0, height);

            let barHeight = height - waveformY;

            if(waveformX < currentPlaybackPosition){
                waveformCanvas.fill(100, 200, 0);
            } else{
                waveformCanvas.fill(10, 10, 120);
            }
            waveformCanvas.noStroke();
            waveformCanvas.rect(waveformX, waveformY, 1, barHeight);
            
        }
}

function myCreature(){
    let bassBeat = fft.getEnergy("bass") / 255;
    fill(100, 0, 0);

    if(song.isPlaying()){ 
        let newEarSize = map(bassBeat, 0, 5.5, 5, 25);
        if(bassBeat >= 0.9){
            critter.leftEar.x2 = critter.leftEar.moveSideX2 + newEarSize;
            critter.leftEar.x3 = critter.leftEar.moveSideX3 + newEarSize;
            critter.rightEar.x2 = critter.rightEar.moveSideX2 + newEarSize;
            critter.rightEar.x3 = critter.rightEar.moveSideX3 + newEarSize;
        } else {
            critter.leftEar.x2 = 500;
            critter.leftEar.x3 = 500;
            critter.rightEar.x2 = 400;
            critter.rightEar.x3 = 300;
        }
    }

    triangle(critter.leftEar.x1, critter.leftEar.y1, critter.leftEar.x2, critter.leftEar.y2, critter.leftEar.x3, critter.leftEar.y3);
    triangle(critter.rightEar.x1, critter.rightEar.y1, critter.rightEar.x2, critter.rightEar.y2, critter.rightEar.x3, critter.rightEar.y3);

    //Head
    ellipse(critter.head.x, critter.head.y, critter.head.xSize, critter.head.ySize);

    //Eyes
    fill(255, 255, 255);
    curve(critter.leftEye.x1, critter.leftEye.y1, critter.leftEye.x2, critter.leftEye.y2, critter.leftEye.x3, critter.leftEye.y3, critter.leftEye.x4, critter.leftEye.y4);
    curve(critter.rightEye.x1, critter.rightEye.y1, critter.rightEye.x2, critter.rightEye.y2, critter.rightEye.x3, critter.rightEye.y3, critter.rightEye.x4, critter.rightEye.y4);

    let newEyeSize = map(bassBeat, 0, 0.3, 0, 10);

    let newHeadSize = map(bassBeat, 0, 0.5, 0, 25);

    if(song.isPlaying()){
        // critter.head.currentXSize += 0.01;
        // critter.head.currentYSize += 0.01;
    }

    if(song.isPlaying()) {
        critter.leftEye.x2 = 400 + newEyeSize;
        critter.leftEye.x3 = 400 + newEyeSize;
        critter.leftEye.y2 = 100 + newEyeSize;

        critter.rightEye.x1 = 150 + newEyeSize;
        critter.rightEye.x2 = 300 + newEyeSize;
        critter.rightEye.x3 = 370 + newEyeSize;
        critter.rightEye.y1 = 10 + newEyeSize;
        critter.rightEye.y2 = 150 - newEyeSize;
        critter.rightEye.y3 = 130 + newEyeSize;
    } else {
        critter.leftEye.x2 = 405;
        critter.leftEye.x3 = 420;
        critter.leftEye.y2 = 120;

        critter.rightEye.x1 = 300;
        critter.rightEye.x2 = 345;
        critter.rightEye.x3 = 390;
        critter.rightEye.y2 = 120;
        critter.rightEye.y3 = 160;
    }

    critter.head.xSize = critter.head.currentXSize + newHeadSize;
    critter.head.ySize = critter.head.currentYSize + newHeadSize;

    let newMouthSize = map(bassBeat, 0, 0.5, 0, 10);

    if(song.isPlaying()){
        critter.mouth.currentMouthX += 0.01;
        critter.head.currentMouthY += 0.01;
    }

    //Mouth
    if(bassBeat >= 0.9){
        currentMouthX = critter.mouth.openMouthX + newMouthSize;
        currentMouthY = critter.mouth.openMouthY + newMouthSize;

        // currentMouthX = critter.mouth.openMouthX;
        // currentMouthY = critter.mouth.openMouthY;
    } else {
        currentMouthX = critter.mouth.closeMouthX;
        currentMouthY = critter.mouth.closeMouthY; 
    }

    ellipse(critter.mouth.x, critter.mouth.y, currentMouthX, currentMouthY);
}

function resetCreature() {
    critter = {
        leftEar: {
            x1: 400,
            y1: 120,
            x2: 500,
            y2: 80,
            x3: 500,
            y3: 40,
            moveSideX2: 480,
            moveSideX3: 480
        },
        rightEar: {
            x1: 280,
            y1: 60,
            x2: 400,
            y2: 120,
            x3: 300,
            y3: 120,
            moveSideX2: 380,
            moveSideX3: 280      
        },
        head: {
            x:400,
            y:150,
            currentXSize: 100,
            currentYSize: 100,
            xSize: 100,
            ySize: 100,
            xBigSize: 130,
            yBigSize: 130,
            xSpeed: 2,
            ySpeed: 2
        },
        leftEye: {
            x1: 220,
            y1: 80,
            x2: 405,
            y2: 120,
            x3: 420,
            y3: 160,
            x4: 180,
            y4: 320 
        },
        rightEye: {
            x1: 300,
            y1: 40,
            x2: 345,
            y2: 120,
            x3: 390,
            y3: 160,
            x4: 200,
            y4: 450 
        },
        mouth: {
            x: 400,
            y: 190,
            closeMouthX: 20,
            closeMouthY: 5,
            openMouthX: 75,
            openMouthY: 25,
        }
    }
}

function draw(){
    background(0);
    textFont("Faustina");
    controlVolume();
    controlPanning();

    if(song && song.isLoaded()){
        let currentPlaybackPosition = map(song.currentTime(), 0, song.duration(), 0, width);
        let peaks = song.getPeaks();

        setupWaveform(peaks, currentPlaybackPosition);
    }

    if(song.currentTime() < 0.1 && song.isLooping()){
        seekerCanvas.clear();
    }

    noFill();

    if(song.currentTime() <= 0 && song.isPlaying()){
        seekerCanvas.clear();
    }

    fft.analyze();
    peakDetect.update(fft);

    myCreature();

    fill(255, 255, 255);

    //Time Counter
    fill(255, 255, 255);
    let currentTimeInSeconds = song.currentTime();
    let minutes = Math.floor(currentTimeInSeconds / 60);
    let seconds = Math.floor(currentTimeInSeconds % 60);

    let formattedSeconds = nf(seconds, 2);
    fill(0, 0, 0, 100);
    textSize(14);
    text(trackName, 17, 17);

    fill(255,255,255);
    text(trackName, 18, 18);

    fill(0, 0, 0, 100);
    textSize(14);
    text(minutes + ":" + formattedSeconds, 17, 39);

    fill(255,255,255);
    text(minutes + ":" + formattedSeconds, 18, 40);
}