// CONFIG
 
const TARGET_YEAR = 2026;
const NEW_YEAR_TIME = new Date(`Jan 1, ${TARGET_YEAR} 00:00:00 GMT+0530`).getTime();

//DOM ELEMENTS

const contentWrapper = document.querySelector(".content-wrapper");
const fireworksContainer = document.querySelector(".fireworks-container");

const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");
const yearEl = document.getElementById("new-year");

const modal = document.getElementById("nameModal");
const openBtn = document.getElementById("openModal");
const closeBtn = document.getElementById("closeModal");
const generateBtn = document.getElementById("generateQR");
const nameInput = document.getElementById("nameInput");
const qrBox = document.getElementById("qrCode");
const whatsappLink = document.getElementById("whatsappShare");

//URL PARAMS

const params = new URLSearchParams(window.location.search);
const userName = params.get("name");


//FIREWORKS INIT

const fireworks = new Fireworks(fireworksContainer, {
    speed: 3,
    acceleration: 1.05,
    friction: 1,
    gravity: 4,
    particles: window.innerWidth < 768 ? 150 : 350,
    explosion: 8,
    opacity: 0.2
});


//HELPERS

const format = (n) => String(n).padStart(2, "0");

function showGreeting(big = false) {
    const greeting = document.createElement("div");
    greeting.className = big ? "greeting big" : "greeting";
    greeting.innerHTML = `
        Happy New Year ${TARGET_YEAR},<br>
        <span>${userName}</span> 
        ${big ? `<div class="sub">Wishing you success & happiness ✨</div>` : ""}
    `;
    document.body.appendChild(greeting);
}


//COUNTDOWN LOGIC

function startCountdown() {
    yearEl.textContent = TARGET_YEAR;

    const interval = setInterval(() => {
        const now = Date.now();
        const distance = NEW_YEAR_TIME - now;

        if (distance <= 0) {
            clearInterval(interval);
            daysEl.textContent = hoursEl.textContent =
            minutesEl.textContent = secondsEl.textContent = "0";

            if (userName) {
                contentWrapper.style.display = "none";
                showGreeting(true);
                fireworks.start();
            }
            return;
        }

        daysEl.textContent = Math.floor(distance / (1000 * 60 * 60 * 24));
        hoursEl.textContent = format(Math.floor((distance / (1000 * 60 * 60)) % 24));
        minutesEl.textContent = format(Math.floor((distance / (1000 * 60)) % 60));
        secondsEl.textContent = format(Math.floor((distance / 1000) % 60));
    }, 1000);
}

//INITIAL PAGE STATE

const now = Date.now();
const isNewYearPassed = now >= NEW_YEAR_TIME;

if (userName) fireworks.start();
else fireworks.stop();

if (userName && isNewYearPassed) {
    contentWrapper.style.display = "none";
    showGreeting(true);
} else {
    startCountdown();
}


//MODAL EVENTS

openBtn.onclick = () => modal.style.display = "flex";
closeBtn.onclick = () =>{
    modal.style.display = "none";
    qrBox.innerHTML = "";
    nameInput.value = "";
} 

//QR CODE GENERATION

generateBtn.onclick = () => {
    const name = nameInput.value.trim();
    if (!name) return alert("Please enter a name");

    qrBox.innerHTML = "";

    const baseUrl = window.location.origin + window.location.pathname;
    const shareUrl = `${baseUrl}?name=${encodeURIComponent(name)}`;

    new QRCode(qrBox, {
        text: shareUrl,
        width: 200,
        height: 200
    });

    setTimeout(() => {
        const img = qrBox.querySelector("img");
        if (!img) return;

        const download = document.createElement("a");
        download.href = img.src;
        download.download = `NewYear-${name}.png`;
        download.textContent = "Download QR Code";
        qrBox.appendChild(download);
    }, 300);

    whatsappLink.href =
        `https://wa.me/?text=🎆%20Scan%20this%20New%20Year%20greeting!%20${encodeURIComponent(shareUrl)}`;
};
