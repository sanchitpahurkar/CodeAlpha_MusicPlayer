document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const audio = document.getElementById('audio');
    const playBtn = document.querySelector('.play-btn');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const shuffleBtn = document.querySelector('.shuffle-btn');
    const repeatBtn = document.querySelector('.repeat-btn');
    const progressBar = document.querySelector('.progress-bar');
    const progress = document.querySelector('.progress');
    const currentTimeEl = document.querySelector('.current-time');
    const durationEl = document.querySelector('.duration');
    const volumeBar = document.querySelector('.volume-bar');
    const volumeLevel = document.querySelector('.volume-level');
    const songTitle = document.querySelector('.song-title');
    const artistName = document.querySelector('.artist-name');
    const albumArt = document.querySelector('.art-image');
    const playlist = document.querySelector('.playlist');
    const themeToggle = document.querySelector('.theme-toggle');
    const musicPlayer = document.querySelector('.music-player');
    const vinylRecord = document.querySelector('.vinyl-record');

    // Theme toggle
    themeToggle.addEventListener('click', function() {
        document.body.setAttribute('data-theme', 
            document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
        
        // Change icon
        const icon = this.querySelector('i');
        icon.classList.toggle('fa-moon');
        icon.classList.toggle('fa-sun');
    });

    // Song data
    const songs = [
        {
            title: "Blinding Lights",
            artist: "The Weeknd",
            src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
            cover: "https://via.placeholder.com/300/6c5ce7/ffffff?text=Blinding+Lights"
        },
        {
            title: "Save Your Tears",
            artist: "The Weeknd",
            src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
            cover: "https://via.placeholder.com/300/a29bfe/ffffff?text=Save+Your+Tears"
        },
        {
            title: "Levitating",
            artist: "Dua Lipa",
            src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
            cover: "https://via.placeholder.com/300/00b894/ffffff?text=Levitating"
        },
        {
            title: "Don't Start Now",
            artist: "Dua Lipa",
            src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
            cover: "https://via.placeholder.com/300/0984e3/ffffff?text=Don't+Start+Now"
        },
        {
            title: "Watermelon Sugar",
            artist: "Harry Styles",
            src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
            cover: "https://via.placeholder.com/300/fdcb6e/ffffff?text=Watermelon+Sugar"
        }
    ];

    // Player state
    let currentSongIndex = 0;
    let isPlaying = false;
    let isShuffled = false;
    let isRepeated = false;
    let originalPlaylist = [...songs];
    let shuffledPlaylist = [...songs];

    // Initialize player
    function initPlayer() {
        loadSong(currentSongIndex);
        renderPlaylist();
    }

    // Load song
    function loadSong(index) {
        const song = songs[index];
        songTitle.textContent = song.title;
        artistName.textContent = song.artist;
        albumArt.src = song.cover;
        audio.src = song.src;
    }

    // Play song
    function playSong() {
        isPlaying = true;
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        musicPlayer.classList.add('playing');
        vinylRecord.classList.add('playing');
        audio.play();
    }

    // Pause song
    function pauseSong() {
        isPlaying = false;
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        musicPlayer.classList.remove('playing');
        vinylRecord.classList.remove('playing');
        audio.pause();
    }

    // Previous song
    function prevSong() {
        currentSongIndex--;
        if (currentSongIndex < 0) {
            currentSongIndex = songs.length - 1;
        }
        loadSong(currentSongIndex);
        if (isPlaying) {
            playSong();
        }
        highlightCurrentSong();
    }

    // Next song
    function nextSong() {
        currentSongIndex++;
        if (currentSongIndex > songs.length - 1) {
            currentSongIndex = 0;
        }
        loadSong(currentSongIndex);
        if (isPlaying) {
            playSong();
        }
        highlightCurrentSong();
    }

    // Update progress bar
    function updateProgress(e) {
        const { duration, currentTime } = e.srcElement;
        const progressPercent = (currentTime / duration) * 100;
        progress.style.width = `${progressPercent}%`;
        
        // Update time display
        currentTimeEl.textContent = formatTime(currentTime);
        if (duration) {
            durationEl.textContent = formatTime(duration);
        }
    }

    // Set progress
    function setProgress(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = audio.duration;
        audio.currentTime = (clickX / width) * duration;
    }

    // Set volume
    function setVolume(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const volume = clickX / width;
        audio.volume = volume;
        volumeLevel.style.width = `${volume * 100}%`;
        
        // Update volume icon
        const volumeIcon = document.querySelector('.volume-icon');
        if (volume === 0) {
            volumeIcon.classList.remove('fa-volume-up');
            volumeIcon.classList.add('fa-volume-mute');
        } else {
            volumeIcon.classList.remove('fa-volume-mute');
            volumeIcon.classList.add('fa-volume-up');
        }
    }

    // Format time
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // Toggle shuffle
    function toggleShuffle() {
        isShuffled = !isShuffled;
        shuffleBtn.classList.toggle('active', isShuffled);
        
        if (isShuffled) {
            // Create a shuffled playlist
            shuffledPlaylist = [...songs];
            for (let i = shuffledPlaylist.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffledPlaylist[i], shuffledPlaylist[j]] = [shuffledPlaylist[j], shuffledPlaylist[i]];
            }
            songs.splice(0, songs.length, ...shuffledPlaylist);
        } else {
            // Restore original order
            songs.splice(0, songs.length, ...originalPlaylist);
        }
        
        renderPlaylist();
        currentSongIndex = songs.findIndex(song => song.title === songTitle.textContent);
    }

    // Toggle repeat
    function toggleRepeat() {
        isRepeated = !isRepeated;
        repeatBtn.classList.toggle('active', isRepeated);
    }

    // Render playlist
    function renderPlaylist() {
        playlist.innerHTML = '';
        songs.forEach((song, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="song-name">${song.title}</span>
                <span class="song-duration">2:30</span>
            `;
            li.addEventListener('click', () => {
                currentSongIndex = index;
                loadSong(currentSongIndex);
                playSong();
                highlightCurrentSong();
            });
            playlist.appendChild(li);
        });
        highlightCurrentSong();
    }

    // Highlight current song in playlist
    function highlightCurrentSong() {
        const playlistItems = document.querySelectorAll('.playlist li');
        playlistItems.forEach((item, index) => {
            item.classList.toggle('active', index === currentSongIndex);
        });
    }

    // Event listeners
    playBtn.addEventListener('click', () => {
        isPlaying ? pauseSong() : playSong();
    });

    prevBtn.addEventListener('click', prevSong);
    nextBtn.addEventListener('click', nextSong);
    shuffleBtn.addEventListener('click', toggleShuffle);
    repeatBtn.addEventListener('click', toggleRepeat);

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', () => {
        if (isRepeated) {
            audio.currentTime = 0;
            playSong();
        } else {
            nextSong();
        }
    });

    progressBar.addEventListener('click', setProgress);
    volumeBar.addEventListener('click', setVolume);

    // Initialize volume
    audio.volume = 0.8;
    volumeLevel.style.width = '80%';

    // Initialize player
    initPlayer();
});