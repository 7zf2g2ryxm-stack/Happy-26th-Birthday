document.addEventListener("DOMContentLoaded", function () {
  const cake = document.querySelector(".cake");
  const candleCountDisplay = document.getElementById("candleCount");
  const totalCandles = 26;
  let candles = [];
  let audioContext, analyser, microphone;

  // ---------------------------
  // Play Happy Birthday on page load
  // ---------------------------
  function playHappyBirthday() {
    const context = new (window.AudioContext || window.webkitAudioContext)();
    // Notes for "Happy Birthday" (in Hz) with durations in seconds
    const song = [
      { note: 523.25, duration: 0.2 }, // C5
      { note: 523.25, duration: 0.2 },
      { note: 587.33, duration: 0.5 }, // D5
      { note: 523.25, duration: 0.5 },
      { note: 698.46, duration: 0.5 }, // F5
      { note: 659.25, duration: 0.9 }, // E5
      // line 2
      { note: 523.25, duration: 0.2 },
      { note: 523.25, duration: 0.2 },
      { note: 587.33, duration: 0.5 },
      { note: 523.25, duration: 0.5 },
      { note: 783.99, duration: 0.5 },
      { note: 698.46, duration: 0.9 },
      // line 3
      { note: 523.25, duration: 0.2 },
      { note: 523.25, duration: 0.2 },
      { note: 1046.5, duration: 0.5 },
      { note: 880.0, duration: 0.5 },
      { note: 698.46, duration: 0.5 },
      { note: 659.25, duration: 0.5 },
      { note: 587.33, duration: 0.9 },
      // line 4
      { note: 932.33, duration: 0.2 },
      { note: 932.33, duration: 0.2 },
      { note: 880.0, duration: 0.5 },
      { note: 698.46, duration: 0.5 },
      { note: 783.99, duration: 0.5 },
      { note: 698.46, duration: 0.9 },
    ];

    let currentTime = context.currentTime;

    song.forEach(item => {
      const osc = context.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(item.note, currentTime);
      osc.connect(context.destination);
      osc.start(currentTime);
      osc.stop(currentTime + item.duration);
      currentTime += item.duration + 0.05; // small pause between notes
    });
  }

  // Play Song Button functionality
const playButton = document.getElementById("playSongBtn");
playButton.addEventListener("click", () => {
  playHappyBirthday();
});


  // ---------------------------
  // Candle functionality
  // ---------------------------
  function updateCandleCount() {
    const activeCandles = candles.filter(c => !c.classList.contains("out")).length;
    candleCountDisplay.textContent = activeCandles;
  }

  function createCandle(leftPercent) {
    const candle = document.createElement("div");
    candle.className = "candle";
    candle.style.left = leftPercent + "%";

    const flame = document.createElement("div");
    flame.className = "flame";
    candle.appendChild(flame);

    cake.appendChild(candle);
    candles.push(candle);
  }

  // Automatically create 26 candles spaced evenly
  for (let i = 0; i < totalCandles; i++) {
    const spacing = 10 + i * (80 / (totalCandles - 1)); // 5% margin left & right
    createCandle(spacing);
  }
  updateCandleCount();

  function isBlowing() {
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);
    const avg = dataArray.reduce((a, b) => a + b, 0) / bufferLength;
    return avg > 40;
  }

  function blowOutCandles() {
    if (isBlowing()) {
      candles.forEach(c => {
        if (!c.classList.contains("out") && Math.random() > 0.5) {
          c.classList.add("out");
        }
      });
      updateCandleCount();
    }
  }

  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
        analyser.fftSize = 256;
        setInterval(blowOutCandles, 200);
      })
      .catch(err => console.log("Unable to access microphone: " + err));
  } else {
    console.log("getUserMedia not supported on your browser!");
  }
});
