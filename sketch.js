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

let isThresholdEnergySet = false;

let audioZone = document.getElementById("drop-zone");

let currentSong = null;
let nextSong = null;

let someHeight = 21.5;

let ball = {
    x: 380,
    y: 180,
    jumpHeight: 30,
    floorHeight: 80,
    size: 5,
    xSpeed: 2,
    ySpeed: 2
};

let critter = {
    leftEar: {
        x1: 400,
        y1: 120,
        x2: 500,
        y2: 80,
        x3: 500,
        y3: 40
    },
    rightEar: {
        x1: 280,
        y1: 60,
        x2: 400,
        y2: 120,
        x3: 300,
        y3: 120        
    },
    head: {
        x:400,
        y:150,
        xSize: 100,
        ySize: 100
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
    // console.log(fft.waveform());

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
        panLabel.innerText = "R: " + panning.value();
    } else if (panning.value() < 0.0){
        panLabel.innerText = "L: " + panning.value();
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
    //Ears
    fill(100, 0, 0);
    // triangle(width/2 - 100, 100, 350, 120, width/2, 200);
    // triangle(width/2 + 100, 100, 450, 120, width/2, 200);

    triangle(critter.leftEar.x1, critter.leftEar.y1, critter.leftEar.x2, critter.leftEar.y2, critter.leftEar.x3, critter.leftEar.y3);
    triangle(critter.rightEar.x1, critter.rightEar.y1, critter.rightEar.x2, critter.rightEar.y2, critter.rightEar.x3, critter.rightEar.y3);
    
    //Head
    ellipse(critter.head.x, critter.head.y, critter.head.xSize, critter.head.ySize);

    //Eyes
    fill(255, 255, 255);
    curve(critter.leftEye.x1, critter.leftEye.y1, critter.leftEye.x2, critter.leftEye.y2, critter.leftEye.x3, critter.leftEye.y3, critter.leftEye.x4, critter.leftEye.y4);
    curve(critter.rightEye.x1, critter.rightEye.y1, critter.rightEye.x2, critter.rightEye.y2, critter.rightEye.x3, critter.rightEye.y3, critter.rightEye.x4, critter.rightEye.y4);

    console.log("Bass: " + fft.getEnergy("bass") / 255);

    //Mouth
    if(fft.getEnergy("bass") / 255 >= 0.9){
        currentMouthX = critter.mouth.openMouthX;
        currentMouthY = critter.mouth.openMouthY;
    } else {
        currentMouthX = critter.mouth.closeMouthX;
        currentMouthY = critter.mouth.closeMouthY; 
    }

    // ellipse(width/2, height/2 + 30, currentMouthX, currentMouthY);
    ellipse(critter.mouth.x, critter.mouth.y, currentMouthX, currentMouthY);
}

function draw(){
    background(0);
    textFont("Faustina");
    controlVolume();
    controlPanning();

    if(song && song.isLoaded()){
        let currentPlaybackPosition = map(song.currentTime(), 0, song.duration(), 0, width);
        let fftWave = fft.waveform();

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

    // console.log(peakDetect);
    //peakDetect.energy > 0.2
    // if(fft.getEnergy("bass") > 200)


    // console.log(fft.getEnergy("bass"));
        

    //beat Circle

    let bassEnergy = fft.getEnergy('bass') / 255; //normalize to 0-1

    let ballSize = map(bassEnergy, 0, 0.3, 0 , height /8);
    ball.size = ballSize / 2 ;
    
    // ball.x += ball.xSpeed;
    ball.y -= ball.ySpeed;

    // if(ball.x + ball.size / 2 > width || ball.x - ball.size / 2 < 0){
    //     ball.xSpeed *= -1;
    // }

    if(ball.y < ball.jumpHeight) {
        ball.ySpeed *= -1;
    }

    if(ball.y > ball.floorHeight){
        ball.ySpeed *= -1;
    }

    // if(bassEnergy >= 0.9){
    //     beatPulse = 100;
    //     someHeight -=0.5;
        
    // } else {
    //     beatPulse = 50;
    //     someHeight+= 0.5;
    // }someHeight-=0.5;

    fill(255, 255, 255);
    // ellipse(width/2 - someHeight, (height/2 - 150) - someHeight, beatPulse, beatPulse);
    ellipse(ball.x, ball.y, ball.size);

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