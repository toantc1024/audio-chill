

// Module Export
function getAverageRGB(imgEl) {

    var blockSize = 5, // only visit every 5 pixels
        defaultRGB = {r:0,g:0,b:0}, // for non-supporting envs
        canvas = document.createElement('canvas'),
        context = canvas.getContext && canvas.getContext('2d'),
        data, width, height,
        i = -4,
        length,
        rgb = {r:0,g:0,b:0},
        count = 0;

    if (!context) {
        return defaultRGB;
    }

    height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
    width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;

    context.drawImage(imgEl, 0, 0);

    try {
        data = context.getImageData(0, 0, width, height);
    } catch(e) {
        /* security error, img on diff domain */
        return defaultRGB;
    }

    length = data.data.length;

    while ( (i += blockSize * 4) < length ) {
        ++count;
        rgb.r += data.data[i];
        rgb.g += data.data[i+1];
        rgb.b += data.data[i+2];
    }

    // ~~ used to floor values
    rgb.r = ~~(rgb.r/count);
    rgb.g = ~~(rgb.g/count);
    rgb.b = ~~(rgb.b/count);
    return `rgb(${Object.values(rgb).join(',')})`;
}

// Declare
const image = document.querySelector('img');
const title = document.getElementById('title');
const artist = document.getElementById('artist');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const progressContainer = document.getElementById('progress-container');
const progress = document.getElementById('progress');
const playerCurrentTime = document.getElementById('current-time');
const playerDuration = document.getElementById('duration');
const nextBtn = document.getElementById('next');
const music = document.querySelector('audio');
// Music
const songs = [
    {
        name: "see-tinh",
        displayName: "See Tình",
        artist: "Hoàng Thuỳ Linh"
    },
    {
        name: "jacinto-1",
        displayName: "Electric Chill Machine",
        artist: "Toan Reserved",
    },
    {
        name: "jacinto-2",
        displayName: "Revoluntion Jacinto #2",
        artist: "Toan Reserved",
    },
    {
        name: "jacinto-3",
        displayName: "Remix See Tình",
        artist: "Toan Reserved",
    },
    {
        name: "metric-1",
        displayName: "Metric Grill Song",
        artist: "Jacinto Design",
    }
];
const virtualAudio = document.createElement('audio');

// Check if playing
let isPlaying = false;

// Formatter
const minutesFormatter = (time) => {
    if(isNaN(music.duration)) {
        return "00:00";
    }
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

music.onloadedmetadata = () => {
    playerDuration.textContent =  minutesFormatter(music.duration);
};

image.addEventListener('load', () => {
    progress.style.background = getAverageRGB(image);
})

// Play
const playSong = () => {
    isPlaying = true;
    playBtn.children[0].classList.replace('fa-play', 'fa-pause');
    playBtn.children[0].setAttribute('title', 'Pause');
    music.play();
}

// Pause
const pauseSong = () => {
    isPlaying = false;
    playBtn.children[0].classList.replace('fa-pause', 'fa-play');
    playBtn.children[0].setAttribute('title', 'Play');
    music.pause();
}

// Update DOM

const loadSong = (song) => {
    music.src = `music/${song.name}.mp3` ;
    title.textContent = song.displayName;
    artist.textContent = song.artist;
    image.src = `img/${song.name}.jpg`;
    document.body.style.backgroundImage = `url(${image.src})`;
}

const prevSong = () => {
    songIndex--;
    if(songIndex < 0) 
        songIndex = songs.length - 1;
    loadSong(songs[songIndex]);
    if(isPlaying) {
        playSong();
    }
}

const nextSong = () => {
    songIndex++;
    if(songIndex >= songs.length)
        songIndex = 0;
    loadSong(songs[songIndex]);
    if(isPlaying) {
        playSong();
    }
}

// Current song
let songIndex = 0;
loadSong(songs[songIndex]);


// Update Progress Bar
const updateProgressBar = (event) => {
        // Update progress bar width
        const {currentTime, duration} = event.target;
        progress.style.width = `${(currentTime/duration)*100}%`;
        // Calculate display for duration 
        console.log()
        playerCurrentTime.textContent = minutesFormatter(currentTime);
        playerDuration.textContent = minutesFormatter(duration);
        
        // console.log(, '->', songDuration.minutes, ":",songDuration.seconds)
}

const setProgressBar = (event) => {
    const width = progressContainer.clientWidth;
    const clickX = event.offsetX;
    const { duration } = music;
    music.currentTime = duration * clickX/width;
    console.log(clickX, width, duration);    
}

// Event Listeners
playBtn.addEventListener('click', () => (isPlaying ? pauseSong() : playSong()));
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);
music.addEventListener('timeupdate', updateProgressBar);
music.addEventListener('ended', nextSong);
progressContainer.addEventListener('click', setProgressBar);


