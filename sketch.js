console.log("hooked");

let mainCanvas;
let waveformCanvas;
let seekerCanvas;

let song;
let fft;
let peaks;

let waveform;

let volume;
let volumeLabel;

//eyes
let eyeSizeX = 15;
let eyeSizeY = 8;

let counterWave = 45;
let speed = 0.01;

let playButton;

let timer = 12;

//closeMouth
let closeMouthX = 20;
let closeMouthY = 5;

//openMouth
let openMouthX = 75;
let openMouthY = 25;

let currentMouthX;
let currentMouthY;

let selectedColor;

let audioZone = document.getElementById("drop-zone");

let currentSong = null;
let nextSong = null;

function preload(){
    song = loadSound('random_sketch3.mp3');
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
    mainCanvas = createCanvas(400, 400);
    mainCanvas.id('main-canvas');

    let audioDrop = select('#drop-zone');

    waveformCanvas = createGraphics(400, 400);
    waveformCanvas.background(255, 0, 0, 0.5);

    seekerCanvas = createGraphics(400, 400);
    seekerCanvas.background(0, 255, 0, 0.3);

    selectedColor = randomizeColors();
    playButton = createButton("Play");

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
            loadSound(file.data, (newSong) => {
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
        stopSong();
    } else{
        song.loop();
        playButton.html("Stop");
    }
}

function controlVolume() {
    volumeLabel.innerText = Math.floor(volume.value() * 100);
    song.setVolume(volume.value());
}

function setupWaveform(fftWave, currentPlaybackPosition){
        //waveform
        image(waveformCanvas, 0, 0);
        waveformCanvas.fill(0, 200, 0);
        
        for(let i = 0; i < fftWave.length; i++){
            let waveformX = map(i, 0, fftWave.length, 0, width);
            let waveformY = map(waveform[i], -1, 1, 0, height);

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

function myCat(){

}

function draw(){
    background(220);

    controlVolume();

    if(song && song.isLoaded()){
        let currentPlaybackPosition = map(song.currentTime(), 0, song.duration(), 0, width);
        let fftWave = fft.waveform();

        setupWaveform(fftWave, currentPlaybackPosition);
    }

    if(song.currentTime() < 0.1 && song.isLooping()){
        seekerCanvas.clear();
    }

    noFill();

    if(song.currentTime() <= 0 && song.isPlaying()){
        seekerCanvas.clear();
    }

    //Ears
    fill(100, 0, 0);
    triangle(width/2 - 100, 100, 150, 120, width/2, 200);
    triangle(width/2 + 100, 100, 250, 120, width/2, 200);
    
    //Head
    ellipse(width/2, height/2, 100, 100);

    //Eyes
    fill(255, 255, 255);
    curve(width/2 - 100, 140, 155, 200, 200, 200, 250, 500);
    curve(width/2 + 100, 10, 225, 200, 240, 190, 250, 500);

    fft.analyze();
    peakDetect.update(fft);

    // console.log(fft.getEnergy("bass"));
    // console.log(peakDetect);
    //peakDetect.energy > 0.2
    // if(fft.getEnergy("bass") > 200)

    // console.log(fft.getEnergy("bass"));
    // console.log(volume.value());
        
    //Mouth
    if(fft.getEnergy("bass") >= 230){
        currentMouthX = openMouthX;
        currentMouthY = openMouthY;
    } else {
        currentMouthX = closeMouthX;
        currentMouthY = closeMouthY; 
    }

    ellipse(width/2, height/2 + 30, currentMouthX, currentMouthY);

    //Time Counter
    fill(255, 255, 255);
    let currentTimeInSeconds = song.currentTime();
    let minutes = Math.floor(currentTimeInSeconds / 60);
    let seconds = Math.floor(currentTimeInSeconds % 60);

    let formattedSeconds = nf(seconds, 2);
    text(minutes + ":" + formattedSeconds, 20, 300);
}