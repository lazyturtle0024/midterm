let video;  // webcam input
let model;  // BlazeFace machine-learning model
let face;   // detected face
let posX1 = 0
let posX2 = 0
let posX3 = 0
let posX4 = 0
let posY = 0

var song;

// print details when a face is
// first found
let firstFace = true;


function preload(){
  pic0=loadImage("dollhead.png")
  pic1=loadImage("red.png")
  pic2=loadImage("blue.png")
  pic3=loadImage("yellow.png")
  pic4=loadImage("green.png")
  pic5=loadImage("red2.png")
  pic6=loadImage("green2.png")
  song = loadSound("squidgamelong.mp3")
}


function setup() {
  createCanvas(640, 480);

  video = createCapture(VIDEO);
  video.hide();

  // load the BlazeFace model
  loadFaceModel();
  song.loop();                     //play sound 
  song.setVolume(1);              // sound volume

}

  var r1 = random(1,1.5)
  r2 = random(1,2)
  r3 = random(1,3)
  con1 = 0

// TensorFlow requires the loading of the
// model to be done in an asynchronous function
// this means it will load in the background
// and be available to us when it's done
async function loadFaceModel() {
  model = await blazeface.load();
}


function draw() {
  //background(220);
  

  // if the video is active and the model has
  // been loaded, get the face from this frame
  if (video.loadedmetadata && model !== undefined) {
    getFace();
  }

  // if we have face data, display it
  if (face !== undefined) {
    image(video, 0,0, width,height);

    // if this is the first face we've
    // found, print the info
    if (firstFace) {
      console.log(face);
      firstFace = false;
    }

    // the model returns us a variety of info
    // (see the output in the console) but the
    // most useful will probably be landmarks,
    // which correspond to facial features
    let rightEye = face.landmarks[0];
    let leftEye =  face.landmarks[1];
    let nose =     face.landmarks[2];
    let rightEar = face.landmarks[4];
    let leftEar =  face.landmarks[5];

    // the points are given based on the dimensions
    // of the video, which may be different than
    // your canvas – we can convert them using map()!
    rightEye = scalePoint(rightEye);
    leftEye =  scalePoint(leftEye);
    nose =     scalePoint(nose);

    image(pic1,posX1,50,60,60);
    image(pic2,posX2,150,60,60);
    image(pic3,posX3,250,60,60);
    image(pic4,posX4,350,60,60);

    
    posX1 += 1
    posX2 += 1.5
    posX3 += 0.7
    posX4 += 1.2
    
    dist5 = leftEye.x-rightEye
    if (leftEye.x-rightEye.x>=50){
      song.setVolume(0);
      posX1 = posX1-1
      posX2 = posX2-1.5
      posX3 = posX3-0.7
      posX4 = posX4-1.2
      
      image(pic0,nose.x-300,nose.y-220,600,440)
    }else{
      song.setVolume(1)
      
      
      
      
    }
  }
}


// a little utility function that converts positions
// in the video to the canvas' dimensions
function scalePoint(pt) {
  let x = map(pt[0], 0,video.width, 0,width);
  let y = map(pt[1], 0,video.height, 0,height);
  return createVector(x, y);
}


// like loading the model, TensorFlow requires
// we get the face data using an async function
async function getFace() {
  
  // get predictions using the video as
  // an input source (can also be an image
  // or canvas!)
  const predictions = await model.estimateFaces(
    document.querySelector('video'),
    false
  );

  // false means we want positions rather than 
  // tensors (ie useful screen locations instead
  // of super-mathy bits)
  
  // if we there were no predictions, set
  // the face to undefined
  if (predictions.length === 0) {
    face = undefined;
  }

  // otherwise, grab the first face
  else {
    face = predictions[0];
  }
}

