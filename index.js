const audioContext = new AudioContext();
const analyzer = audioContext.createAnalyser();

const bucketsInput = document.getElementById("buckets");
const typeSelect = document.getElementById("type");
const colorSelect = document.getElementById("color-input");
colorSelect.value = "#65d2a1";

const canvas = document.getElementById("canvas");
// const WIDTH = 500;
const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
canvas.width = WIDTH;
canvas.height = HEIGHT;
const canvasContext = canvas.getContext("2d");

console.log("analyzer", analyzer);

const audioElement = document.getElementById("audio");
const playButton = document.getElementById("play-button");

const source = audioContext.createMediaElementSource(audioElement);
source.connect(analyzer);
analyzer.connect(audioContext.destination);

const bufferLength = analyzer.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

let buckets = 100;
let type = "radial";
let COLOR = "#65d2a1";

bucketsInput.value = buckets;
typeSelect.value = type;

bucketsInput.addEventListener("change", function (e) {
  console.log("buckets change", e.target.value);
  buckets = e.target.value;
});

typeSelect.addEventListener("change", function (e) {
  console.log("type change", e.target.value);
  type = e.target.value;
});

colorSelect.addEventListener("change", function (e) {
  console.log("color change", e.target.value);
  COLOR = e.target.value;
});

const bucketSize = bufferLength / buckets;
console.log("bufferLength", bufferLength);
console.log("buckets", buckets);
console.log("bucketSize", bucketSize);

playButton.addEventListener("click", function (e) {
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
  if (audioElement.paused) {
    audioElement.play();
    setInterval(function () {
      // analyzer.getByteTimeDomainData(dataArray);
      // drawBarGraph();
      // drawCircleGraph();
      //   console.log(dataArray);
      draw(type);
    }, 30);
    // draw();
  } else {
    audioElement.pause();
  }
});

function draw(type) {
  switch (type) {
    case "radial":
      drawCircleGraph();
      break;
    case "bar":
    default:
      drawBarGraph();
  }
}

const totalWidth = WIDTH;
const widthPerBar = totalWidth / buckets;

console.log("totalWidth", totalWidth);
console.log("widthPerBar", widthPerBar);

const degToRadian = function (deg) {
  return deg * (Math.PI / 180);
};

// drawInitialBarGraph();
drawInitialRadialGraph();

function drawCircleGraph() {
  const bucketSize = bufferLength / buckets;

  analyzer.getByteFrequencyData(dataArray);
  canvasContext.clearRect(0, 0, WIDTH, HEIGHT);
  const amountToRotate = degToRadian(360 / buckets);

  canvasContext.save();
  canvasContext.translate(WIDTH / 2, HEIGHT / 2);

  let count = 0;
  for (let i = 0; i < bufferLength; i += bucketSize) {
    const height =
      dataArray.slice(i, i + bucketSize).reduce((a, b) => a + b) / bucketSize;

    canvasContext.rotate(amountToRotate);

    canvasContext.fillStyle = COLOR;
    canvasContext.fillRect(0, 100, 5, height);

    canvasContext.beginPath();
    canvasContext.arc(2.5, 99 + height, 2.5, 0, Math.PI * 2);
    canvasContext.fillStyle = COLOR;
    canvasContext.fill();

    count++;
  }

  canvasContext.restore();
}

function drawBarGraph() {
  const widthPerBar = totalWidth / buckets;
  const bucketSize = bufferLength / buckets;

  analyzer.getByteFrequencyData(dataArray);
  canvasContext.clearRect(0, 0, WIDTH, HEIGHT);

  //   requestAnimationFrame(draw);
  let count = 0;
  for (let i = 0; i < bufferLength; i += bucketSize) {
    const height =
      dataArray.slice(i, i + bucketSize).reduce((a, b) => a + b) / bucketSize;

    canvasContext.fillStyle = COLOR;
    canvasContext.fillRect(count * widthPerBar, 300, widthPerBar - 2, -height);
    count++;
  }
}

function drawInitialRadialGraph() {
  canvasContext.clearRect(0, 0, WIDTH, HEIGHT);
  const amountToRotate = degToRadian(360 / buckets);

  canvasContext.save();
  canvasContext.translate(WIDTH / 2, HEIGHT / 2);

  // canvasContext.beginPath();
  // canvasContext.arc(0, 0, 90, 0, Math.PI * 2);
  // canvasContext.strokeStyle = COLOR;
  // canvasContext.stroke();
  // canvasContext.fillStyle = COLOR;
  // canvasContext.fill();

  let count = 0;
  for (let i = 0; i < bufferLength; i += bucketSize) {
    canvasContext.rotate(amountToRotate);

    // canvasContext.fillStyle = count % 2 === 0 ? "#326173" : COLOR;
    canvasContext.fillStyle = COLOR;
    canvasContext.fillRect(0, 100, 5, 0);

    canvasContext.beginPath();
    canvasContext.arc(2.5, 99 + 0, 2.5, 0, Math.PI * 2);
    canvasContext.fillStyle = COLOR;
    canvasContext.fill();

    count++;
  }

  canvasContext.restore();
}

function drawInitialBarGraph() {
  analyzer.getByteFrequencyData(dataArray);
  console.log("initialdata", dataArray);

  let count = 0;
  for (let i = 0; i < bufferLength; i += bucketSize) {
    canvasContext.fillStyle = COLOR;
    canvasContext.fillRect(count * widthPerBar, 300, widthPerBar - 2, -50);

    count++;
  }
}
