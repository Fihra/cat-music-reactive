console.log("hooked");

let mainCanvas;
let waveformCanvas;

let song;
let bpmDetector;
let fft;
let beat;
let peakDetect;

let waveform;

//eyes
let eyeSizeX = 15;
let eyeSizeY = 8;

let counterWave = 45;
let speed = 0.01;

let interval = 1000;
let lastSwitchTime = 0;
let switchState = false;

let playButton;

let timer = 12;
let openCounter = 0;
let closeCounter = 0;

//closeMouth
let closeMouthX = 20;
let closeMouthY = 5;

//openMouth
let openMouthX = 75;
let openMouthY = 25;

let currentMouthX;
let currentMouthY;

let selectedColor;

function preload(){
    song = loadSound('random_sketch3.mp3');
    // bpmDetector = new p5.BeatDetect();
    
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
    mainCanvas = createCanvas(400, 400);
    mainCanvas.id('main-canvas');

    waveformCanvas = createGraphics(400, 400);
    waveformCanvas.background(255, 0, 0, 0.5);

    // mainCanvas.position(windowWidth/2, windowHeight);
    selectedColor = randomizeColors();
    playButton = createButton("Play");

    fft = new p5.FFT();
    peakDetect = new p5.PeakDetect();
    song.setLoop(true);
    // song.loop(0, 1, 1, 0, 18);

    fft.setInput(song);
    // console.log(fft.waveform());

    waveform = song.getPeaks();

    playButton.mousePressed(togglePlay);

    currentMouthX = closeMouthX;
    currentMouthY = closeMouthY;
}

function togglePlay(){
    

    // console.log(song.isLooping());
    if(song.isPlaying() ){
        song.stop();
        waveformCanvas.clear();
        playButton.html("Play");
        
    } else{
        // song.play();
        // song.play(0, 1, 1, 0, 18);
        song.loop();
        playButton.html("Stop");
    }
}

function draw(){
    background(220);

    if(song.currentTime() < 0.1 && song.isLooping()){
        waveformCanvas.clear();
    }

    image(waveformCanvas, 0, 0);
    waveformCanvas.beginShape();
    noFill();
    fill(100, 100, 100);
    for(let i = 0; i < waveform.length; i++){
        // console.log(waveform[i]);
        let waveformX = map(i, 0, waveform.length, 0, width);
        let waveformY = map(waveform[i], -1, 1, 0, height);
        waveformCanvas.vertex(waveformX, waveformY);
    }
    
    waveformCanvas.endShape();

    if(song.currentTime() <= 0 && song.isPlaying()){
        console.log("inside here??")
        waveformCanvas.clear();
    }

    // for(let i = 0; i < waveform.length; i++){
    //     let playheadX = map(song.currentTime(), 0, song.duration(), 0, width);
    //     waveformCanvas.stroke(selectedColor, 0, 0);
    //     waveformCanvas.vertex(waveformX)
    // }

    fill(120, 120, 20);
    let playheadX = map(song.currentTime(), 0 , song.duration(), 0, width);
    waveformCanvas.stroke(0, 0, selectedColor);
    waveformCanvas.line(playheadX, 100, playheadX, height/2);
    
    fill(100, 0, 0);
    triangle(width/2 - 100, 100, 150, 120, width/2, 200);
    triangle(width/2 + 100, 100, 250, 120, width/2, 200);
    // triangle(width/2, height/2, width/2 - 50, height/2 - 100, width/2 + 150, height/2 + 150);
    // line(width/2 - 20, 200, 140, 140);
    // fill(100, 0, 0);
    // line(width/2 + 40, 200, 140, 140);
    

    // console.log(song.currentTime());
    
    // line(width/2 - 10, height/2 - 10, 20, 30);
    ellipse(width/2, height/2, 100, 100);

    //Eyes
    fill(255, 255, 255);
    curve(width/2 - 100, 140, 155, 200, 200, 200, 250, 500);
    curve(width/2 + 100, 10, 225, 200, 240, 190, 250, 500);
    // ellipse(width/2 - 18, height/2, eyeSizeX, eyeSizeY);
    // ellipse(width/2 + 18, height/2, eyeSizeX, eyeSizeY);
    // console.log(peakDetect.isDetected);

    fft.analyze();
    peakDetect.update(fft);

    // console.log(fft.getEnergy("bass"));
    // console.log(peakDetect);
    //peakDetect.energy > 0.2
    // if(fft.getEnergy("bass") > 200)
 
    if(fft.getEnergy("bass") >= 230){
        // console.log("beat");
        // switchState = !switchState;
        currentMouthX = openMouthX;
        currentMouthY = openMouthY;
    } else {
        currentMouthX = closeMouthX;
        currentMouthY = closeMouthY; 
    }
    
   
    // openCounter++;
        
    // console.log(millis() - lastSwitchTime > interval);

    // if(millis() - lastSwitchTime > interval){
    //     switchState = !switchState;
    //     lastSwitchTime = millis();
    // }

    // if(switchState){
    //     currentMouthX = openMouthX;
    //     currentMouthY = openMouthY;
    // } else {
    //     currentMouthX = closeMouthX;
    //     currentMouthY = closeMouthY;        
    // }

    ellipse(width/2, height/2 + 30, currentMouthX, currentMouthY);

    fill(255, 255, 255);
    let currentTimeInSeconds = song.currentTime();
    let minutes = Math.floor(currentTimeInSeconds / 60);
    let seconds = Math.floor(currentTimeInSeconds % 60);

    let formattedSeconds = nf(seconds, 2);
    text(minutes + ":" + formattedSeconds, 20, 300);
    
}