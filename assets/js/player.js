// Global variables
let audio = null;
let isPlaying = false;

// Get DOM elements
let playIcon, progress, currentTimeEl, durationEl, volumeSlider, songTitle, songArtists;

// Format time (seconds to mm:ss)
function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Update progress bar and time
function updateProgress() {
    if (audio && audio.duration) {
        const percent = (audio.currentTime / audio.duration) * 100;
        progress.style.width = `${percent}%`;
        currentTimeEl.textContent = formatTime(audio.currentTime);
    }
}

// Toggle play/pause
function togglePlay() {
    if (!audio) {
        // Initialize audio if not already initialized
        initPlayer('assets/audio/Gehra Hua.mp3', 'Gehra Hua', 'Mittal');
        return;
    }
    
    if (isPlaying) {
        audio.pause();
        playIcon.classList.remove('mobi-mbri-pause');
        playIcon.classList.add('mobi-mbri-play');
    } else {
        audio.play().catch(function(error) {
            console.log("Audio play error:", error);
            // Some browsers require user interaction first
            alert("Please click the play button again to start the music.");
        });
        playIcon.classList.remove('mobi-mbri-play');
        playIcon.classList.add('mobi-mbri-pause');
    }
    isPlaying = !isPlaying;
}

// Seek to position in song
function seek(event) {
    if (!audio) return;
    
    const progressBar = event.currentTarget;
    const clickPosition = event.offsetX;
    const progressBarWidth = progressBar.clientWidth;
    const percentage = clickPosition / progressBarWidth;
    
    audio.currentTime = percentage * audio.duration;
}

// Seek backward 10 seconds
function seekBackward() {
    if (!audio) return;
    audio.currentTime = Math.max(0, audio.currentTime - 10);
}

// Seek forward 10 seconds
function seekForward() {
    if (!audio) return;
    audio.currentTime = Math.min(audio.duration, audio.currentTime + 10);
}

// Change volume
function changeVolume() {
    if (!audio) return;
    audio.volume = volumeSlider.value;
}

// Initialize player
function initPlayer(songFile = 'assets/audio/Gehra Hua.mp3', title = 'Gehra Hua', artists = 'Mittal') {
    // Stop current audio if playing
    if (audio) {
        audio.pause();
        audio.currentTime = 0;
        isPlaying = false;
    }
    
    // Create new audio element
    audio = new Audio(songFile);
    
    // Update song info
    if (songTitle) songTitle.textContent = title;
    if (songArtists) songArtists.textContent = artists;
    
    // Reset play icon
    if (playIcon) {
        playIcon.classList.remove('mobi-mbri-pause');
        playIcon.classList.add('mobi-mbri-play');
    }
    
    // Reset progress
    if (progress) {
        progress.style.width = '0%';
    }
    if (currentTimeEl) {
        currentTimeEl.textContent = '0:00';
    }
    
    // Setup audio event listeners
    audio.addEventListener('loadedmetadata', function() {
        console.log("Audio loaded, duration:", audio.duration);
        if (durationEl) {
            durationEl.textContent = formatTime(audio.duration);
        }
    });
    
    audio.addEventListener('timeupdate', updateProgress);
    
    audio.addEventListener('ended', function() {
        console.log("Audio ended");
        isPlaying = false;
        if (playIcon) {
            playIcon.classList.remove('mobi-mbri-pause');
            playIcon.classList.add('mobi-mbri-play');
        }
        audio.currentTime = 0;
        if (progress) {
            progress.style.width = '0%';
        }
    });
    
    audio.addEventListener('error', function(e) {
        console.error("Audio error:", e);
        console.log("Audio src:", audio.src);
        console.log("Error code:", audio.error ? audio.error.code : 'No error code');
        alert("Error loading audio file. Please check the file path.");
    });
    
    // Set initial volume
    if (volumeSlider) {
        audio.volume = volumeSlider.value;
    }
    
    console.log("Player initialized with:", songFile);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM loaded, initializing player...");
    
    // Get DOM elements
    playIcon = document.getElementById('playIcon');
    progress = document.getElementById('progress');
    currentTimeEl = document.getElementById('currentTime');
    durationEl = document.getElementById('duration');
    volumeSlider = document.getElementById('volumeSlider');
    songTitle = document.getElementById('songTitle');
    songArtists = document.getElementById('songArtists');
    
    // Log elements for debugging
    console.log("Elements found:");
    console.log("playIcon:", playIcon);
    console.log("progress:", progress);
    console.log("currentTimeEl:", currentTimeEl);
    console.log("durationEl:", durationEl);
    console.log("volumeSlider:", volumeSlider);
    console.log("songTitle:", songTitle);
    console.log("songArtists:", songArtists);
    
    // Check if player elements exist
    if (playIcon) {
        console.log("Initializing default player...");
        initPlayer();
        
        // Add event listener for volume slider if it exists
        if (volumeSlider) {
            volumeSlider.addEventListener('input', changeVolume);
        }
        
        // Add click event to progress bar if it exists
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.addEventListener('click', seek);
        }
    } else {
        console.log("Player elements not found, skipping initialization.");
    }
});

// Make functions globally available
window.togglePlay = togglePlay;
window.seekBackward = seekBackward;
window.seekForward = seekForward;
window.changeVolume = changeVolume;
window.seek = seek;
window.initPlayer = initPlayer;