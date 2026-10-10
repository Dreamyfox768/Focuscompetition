const timer = document.getElementById("timer");
const status = document.getElementById("status");

const startButton = document.querySelector(".button1");
const stopButton = document.querySelector(".button2");
const resetButton = document.querySelector(".button3");

let elapsedSeconds = 0;
let startTime = null;
let interval = null;

let record = JSON.parse(localStorage.getItem("focusBuddyRecord")) || {
    seconds: 0,
    date: null
};
function formatTime(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return (
        String(hours).padStart(2, "0") + ":" +
        String(minutes).padStart(2, "0") + ":" +
        String(seconds).padStart(2, "0")
    );
}
function updateTimer() {
    let totalSeconds = elapsedSeconds;

    if (startTime !== null) {
        totalSeconds += Math.floor((Date.now() - startTime) / 1000);
    }

    timer.textContent = formatTime(totalSeconds);
}

function updateRecord() {
    if (record.seconds > 0) {
        status.textContent =
            `Personal Best: ${formatTime(record.seconds)} | Date: ${record.date}`;
    } else {
        status.textContent = "No personal record yet!";
    }
}

function saveRecord() {
    let currentSeconds = elapsedSeconds;

    if (startTime !== null) {
        currentSeconds += Math.floor((Date.now() - startTime) / 1000);
    }

    if (currentSeconds > record.seconds) {
        record = {
            seconds: currentSeconds,
            date: new Date().toLocaleDateString()
        };

        localStorage.setItem(
            "focusBuddyRecord",
            JSON.stringify(record)
        );

        updateRecord();
    }
}

function startTimer() {
    if (interval !== null) return;

    startTime = Date.now();
    interval = setInterval(updateTimer, 200);

    updateTimer();
}

function stopTimer() {
    if (interval === null) return;

    elapsedSeconds += Math.floor((Date.now() - startTime) / 1000);

    clearInterval(interval);
    interval = null;
    startTime = null;

    updateTimer();
    saveRecord();
}

function resetTimer() {
    saveRecord();

    clearInterval(interval);
    interval = null;
    startTime = null;
    elapsedSeconds = 0;

    updateTimer();
}

startButton.addEventListener("click", startTimer);
stopButton.addEventListener("click", stopTimer);
resetButton.addEventListener("click", resetTimer);

updateTimer();
updateRecord();