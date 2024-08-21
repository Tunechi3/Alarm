document.addEventListener("DOMContentLoaded", function () {
    const clockBtn = document.getElementById("clock-btn");
    const timerBtn = document.getElementById("timer-btn");
    const stopwatchBtn = document.getElementById("stopwatch-btn");
    const alarmBtn = document.getElementById("alarm-btn");

    const clockSection = document.getElementById("clock-section");
    const timerSection = document.getElementById("timer-section");
    const stopwatchSection = document.getElementById("stopwatch-section");
    const alarmSection = document.getElementById("alarm-section");

    const modeToggle = document.getElementById("mode-toggle");

    const alarmModal = document.getElementById("alarm-modal");
    const modalMessage = document.getElementById("modal-message");
    const closeModal = document.querySelector(".close");

    function showSection(section) {
        clockSection.classList.remove("show");
        timerSection.classList.remove("show");
        stopwatchSection.classList.remove("show");
        alarmSection.classList.remove("show");

        section.classList.add("show");
    }

    clockBtn.addEventListener("click", function () {
        showSection(clockSection);
    });

    timerBtn.addEventListener("click", function () {
        showSection(timerSection);
    });

    stopwatchBtn.addEventListener("click", function () {
        showSection(stopwatchSection);
    });

    alarmBtn.addEventListener("click", function () {
        showSection(alarmSection);
    });

    function updateClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString();
        document.getElementById("clock-display").textContent = timeString;
    }

    setInterval(updateClock, 1000);
    updateClock();

    modeToggle.addEventListener("change", function () {
        document.body.classList.toggle("dark-mode");
    });

    // Timer functionality
    const startTimerBtn = document.getElementById("start-timer");
    startTimerBtn.addEventListener("click", function () {
        const minutes = parseInt(document.getElementById("timer-minutes").value) || 0;
        const seconds = parseInt(document.getElementById("timer-seconds").value) || 0;
        let totalTime = minutes * 60 + seconds;

        const timerDisplay = document.getElementById("timer-display");

        const timerSound = new Audio("https://dl.prokerala.com/downloads/ringtones/files/mp3/twirling-intime-lenovo-k8-note-alarm-tone-41440.mp3");

        const interval = setInterval(function () {
            const min = Math.floor(totalTime / 60);
            const sec = totalTime % 60;
            timerDisplay.textContent = `${min}:${sec < 10 ? '0' + sec : sec}`;

            if (totalTime <= 0) {
                clearInterval(interval);
                timerSound.play();
            }
            totalTime--;
        }, 1000);
    });

    // Stopwatch functionality
    let stopwatchInterval;
    let stopwatchTime = 0;

    const startStopwatchBtn = document.getElementById("start-stopwatch");
    const resetStopwatchBtn = document.getElementById("reset-stopwatch");
    const stopwatchDisplay = document.getElementById("stopwatch-display");

    startStopwatchBtn.addEventListener("click", function () {
        if (startStopwatchBtn.textContent === "Start") {
            startStopwatchBtn.textContent = "Pause";
            stopwatchInterval = setInterval(function () {
                stopwatchTime++;
                const hours = Math.floor(stopwatchTime / 3600);
                const minutes = Math.floor((stopwatchTime % 3600) / 60);
                const seconds = stopwatchTime % 60;
                stopwatchDisplay.textContent = `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            }, 1000);
        } else {
            startStopwatchBtn.textContent = "Start";
            clearInterval(stopwatchInterval);
        }
    });

    resetStopwatchBtn.addEventListener("click", function () {
        clearInterval(stopwatchInterval);
        stopwatchTime = 0;
        stopwatchDisplay.textContent = "00:00:00";
        startStopwatchBtn.textContent = "Start";
    });

    // Alarm functionality
    const setAlarmBtn = document.getElementById("set-alarm");
    const alarmsList = document.getElementById("alarms-list");
    let alarms = [];

    setAlarmBtn.addEventListener("click", function () {
        const alarmTime = document.getElementById("alarm-time").value;

        if (alarmTime) {
            const alarmDate = new Date();
            const [hours, minutes] = alarmTime.split(":");
            alarmDate.setHours(hours);
            alarmDate.setMinutes(minutes);
            alarmDate.setSeconds(0);

            alarms.push(alarmDate);
            addAlarmToList(alarmDate, alarmTime);

            // Show modal with confirmation
            modalMessage.textContent = `Alarm set for ${alarmTime}`;
            alarmModal.style.display = "block";
        } else {
            alert("Please set a valid time.");
        }
    });

    function addAlarmToList(alarmDate, alarmTime) {
        const alarmItem = document.createElement("li");
        alarmItem.textContent = `Alarm set for ${alarmTime}`;

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.classList.add("edit-btn");

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.classList.add("delete-btn");

        alarmItem.appendChild(editBtn);
        alarmItem.appendChild(deleteBtn);
        alarmsList.appendChild(alarmItem);

        // Edit alarm
        editBtn.addEventListener("click", function () {
            const newAlarmTime = prompt("Enter new time (HH:MM)", alarmTime);
            if (newAlarmTime) {
                const [newHours, newMinutes] = newAlarmTime.split(":");
                alarmDate.setHours(newHours);
                alarmDate.setMinutes(newMinutes);
                alarmDate.setSeconds(0);

                alarmItem.firstChild.textContent = `Alarm set for ${newAlarmTime}`;
            }
        });

        // Delete alarm
        deleteBtn.addEventListener("click", function () {
            alarms = alarms.filter(alarm => alarm !== alarmDate);
            alarmsList.removeChild(alarmItem);
        });
    }

    setInterval(function () {
        const now = new Date();
        alarms.forEach((alarm, index) => {
            if (now >= alarm) {
                const alarmSound = new Audio("https://dl.prokerala.com/downloads/ringtones/files/mp3/twirling-intime-lenovo-k8-note-alarm-tone-41440.mp3");
                alarmSound.play();
                alert("Alarm ringing!");
                alarms.splice(index, 1);
                alarmsList.removeChild(alarmsList.childNodes[index]);
            }
        });
    }, 1000);

    // Close modal when the user clicks on <span> (x)
    closeModal.addEventListener("click", function () {
        alarmModal.style.display = "none";
    });

    // Close the modal when the user clicks anywhere outside of it
    window.addEventListener("click", function (event) {
        if (event.target === alarmModal) {
            alarmModal.style.display = "none";
        }
    });

    // Show the clock section by default
    showSection(clockSection);
});
