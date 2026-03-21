// Spotify Birthday Player App
class BirthdayPlayer {
    constructor() {
        // DAFTAR LAGU - Sudah disesuaikan dengan file MP3 yang kamu upload
        this.songs = [
            { title: 'Risk It All', artist: 'Bruno Mars', src: 'music/Risk It All.mp3', cover: 'image/cover1.jpg' },
            { title: 'Iris', artist: 'Goo Goo Dolls', src: 'music/Iris.mp3', cover: 'image/cover2.jpg' },
            { title: 'The Man Who Can\'t Be Moved', artist: 'The Script', src: 'music/The Man Who Can\'t Be Moved.mp3', cover: 'image/cover3.jpg' },
            { title: 'Anugerah Terindah', artist: 'Sheila On 7', src: 'music/Anugerah Terindah Yang Pernah Kumiliki.mp3', cover: 'image/cover4.jpg' },
            { title: 'Tunjukkan Padaku', artist: 'Sheila On 7', src: 'music/Tunjukkan Padaku.mp3', cover: 'image/cover5.jpg' }
        ];
        
        this.currentSongIndex = 0;
        this.isPlaying = false;
        
        this.init();
    }
    
    init() {
        this.cacheDOM();
        this.bindEvents();
    }
    
    cacheDOM() {
        // Main elements
        this.mainPlayBtn = document.getElementById('mainPlayBtn');
        this.miniPlayer = document.getElementById('miniPlayer');
        this.playPauseBtn = document.getElementById('playPauseBtn');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.progressFill = document.getElementById('progressFill');
        
        // Player info
        this.playerTitle = document.getElementById('playerTitle');
        this.playerArtist = document.getElementById('playerArtist');
        this.miniPlayerCover = document.getElementById('miniPlayerCover');
        
        // Modal elements
        this.nowPlayingModal = document.getElementById('nowPlayingModal');
        this.collapseBtn = document.getElementById('collapseBtn');
        this.modalPlayBtn = document.getElementById('modalPlayBtn');
        this.modalPrevBtn = document.getElementById('modalPrevBtn');
        this.modalNextBtn = document.getElementById('modalNextBtn');
        this.modalTitle = document.getElementById('modalTitle');
        this.modalArtist = document.getElementById('modalArtist');
        this.modalProgressFill = document.getElementById('modalProgressFill');
        this.currentTimeEl = document.getElementById('currentTime');
        this.totalTimeEl = document.getElementById('totalTime');
        this.modalCover = document.getElementById('modalCover');
        
        // Song items
        this.songItems = document.querySelectorAll('.song-item');
        
        // Like button
        this.likeBtn = document.querySelector('.like-btn');

        // AUDIO ELEMENT ASLI 
        this.audioPlayer = document.getElementById('audioPlayer');
    }
    
    bindEvents() {
        // Main play button
        this.mainPlayBtn.addEventListener('click', () => this.togglePlay());
        
        // Mini player controls
        this.playPauseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.togglePlay();
        });
        this.prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.prevSong();
        });
        this.nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.nextSong();
        });
        
        // Mini player click to open modal
        this.miniPlayer.addEventListener('click', () => this.openModal());
        
        // Modal controls
        this.collapseBtn.addEventListener('click', () => this.closeModal());
        this.modalPlayBtn.addEventListener('click', () => this.togglePlay());
        this.modalPrevBtn.addEventListener('click', () => this.prevSong());
        this.modalNextBtn.addEventListener('click', () => this.nextSong());
        
        // Song list click
        this.songItems.forEach((item, index) => {
            item.addEventListener('click', () => this.selectSong(index));
        });
        
        // Like button
        this.likeBtn.addEventListener('click', () => this.toggleLike());

        // UPDATE PROGRESS BAR ASLI DARI MP3
        this.audioPlayer.addEventListener('timeupdate', () => this.updateRealProgress());
        
        // OTOMATIS LANJUT JIKA LAGU HABIS
        this.audioPlayer.addEventListener('ended', () => this.nextSong());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && e.target.tagName !== 'INPUT') {
                e.preventDefault();
                this.togglePlay();
            }
        });
    }
    
    togglePlay() {
        // Jika belum ada lagu yang dipilih, pilih lagu pertama
        if (!this.audioPlayer.src) {
            this.selectSong(0);
            return;
        }

        this.isPlaying = !this.isPlaying;
        this.updatePlayButtons();
        
        if (this.isPlaying) {
            this.audioPlayer.play();
            this.showMiniPlayer();
        } else {
            this.audioPlayer.pause();
        }
    }
    
    updatePlayButtons() {
        const icon = this.isPlaying ? 'fa-pause' : 'fa-play';
        
        // Update main play button
        this.mainPlayBtn.innerHTML = `<i class="fas ${icon}"></i>`;
        this.mainPlayBtn.classList.toggle('playing', this.isPlaying);
        
        // Update mini player button
        this.playPauseBtn.innerHTML = `<i class="fas ${icon}"></i>`;
        
        // Update modal button
        this.modalPlayBtn.innerHTML = `<i class="fas ${icon}"></i>`;
    }
    
    updateRealProgress() {
        // Jangan jalankan jika metadata audio belum dimuat
        if (!this.audioPlayer.duration) return;

        const currentTime = this.audioPlayer.currentTime;
        const duration = this.audioPlayer.duration;
        const progressPercent = (currentTime / duration) * 100;
        
        this.progressFill.style.width = `${progressPercent}%`;
        this.modalProgressFill.style.width = `${progressPercent}%`;
        
        this.currentTimeEl.textContent = this.formatTime(Math.floor(currentTime));
        this.totalTimeEl.textContent = this.formatTime(Math.floor(duration));
    }
    
    selectSong(index) {
        this.currentSongIndex = index;
        const song = this.songs[this.currentSongIndex];
        
        // Masukkan src lagu ke tag audio asli
        this.audioPlayer.src = song.src;
        
        this.updateSongInfo();
        this.updateActiveSong();
        
        this.isPlaying = true;
        this.updatePlayButtons();
        this.audioPlayer.play();
        this.showMiniPlayer();
    }
    
    prevSong() {
        this.currentSongIndex = (this.currentSongIndex - 1 + this.songs.length) % this.songs.length;
        this.selectSong(this.currentSongIndex);
    }
    
    nextSong() {
        this.currentSongIndex = (this.currentSongIndex + 1) % this.songs.length;
        this.selectSong(this.currentSongIndex);
    }
    
    updateSongInfo() {
        const song = this.songs[this.currentSongIndex];
        
        // Update mini player
        this.playerTitle.textContent = song.title;
        this.playerArtist.textContent = song.artist;
        this.miniPlayerCover.src = song.cover;
        
        // Update modal
        this.modalTitle.textContent = song.title;
        this.modalArtist.textContent = song.artist;
        this.modalCover.src = song.cover;
    }
    
    updateActiveSong() {
        this.songItems.forEach((item, index) => {
            item.classList.toggle('active', index === this.currentSongIndex);
            
            const songNumber = item.querySelector('.song-number');
            if (index === this.currentSongIndex && this.isPlaying) {
                songNumber.innerHTML = '<i class="fas fa-volume-up" style="color: var(--spotify-green);"></i>';
            } else {
                songNumber.textContent = index + 1;
            }
        });
    }
    
    showMiniPlayer() {
        this.miniPlayer.classList.remove('hidden');
    }
    
    openModal() {
        this.nowPlayingModal.classList.add('active');
    }
    
    closeModal() {
        this.nowPlayingModal.classList.remove('active');
    }
    
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    toggleLike() {
        this.likeBtn.classList.toggle('active');
        const icon = this.likeBtn.querySelector('i');
        icon.classList.toggle('far');
        icon.classList.toggle('fas');
        
        const isLiked = this.likeBtn.classList.contains('active');
        localStorage.setItem('playlistLiked', isLiked);
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const player = new BirthdayPlayer();
    
    const likeBtn = document.querySelector('.like-btn');
    const isLiked = localStorage.getItem('playlistLiked') === 'true';
    if (isLiked && likeBtn) {
        likeBtn.classList.add('active');
        const icon = likeBtn.querySelector('i');
        icon.classList.remove('far');
        icon.classList.add('fas');
    }
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.song-item, .photo-item, .message-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });
});