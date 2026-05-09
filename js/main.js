/* ============================================
   AMBROSE STARLIT - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ============ Navigation ============ */
  const nav = document.getElementById('nav');
  const hamburger = document.getElementById('nav-hamburger');
  const mobileNav = document.getElementById('nav-mobile');
  const navLinks = document.querySelectorAll('.nav-link');

  // Scroll → add .scrolled
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    updateActiveNav();
    togglePageTopBtn();
  }, { passive: true });

  // Hamburger
  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav?.classList.toggle('open');
  });

  // Mobile nav links → close on click
  document.querySelectorAll('.nav-mobile .nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger?.classList.remove('open');
      mobileNav?.classList.remove('open');
    });
  });

  // Active nav highlight on scroll
  function updateActiveNav() {
    const sections = document.querySelectorAll('section[id], div[id]');
    let currentId = '';
    sections.forEach(sec => {
      const top = sec.getBoundingClientRect().top;
      if (top <= 100) currentId = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
    });
  }

  /* ============ Smooth scroll ============ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = document.getElementById('nav')?.offsetHeight || 70;
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - offset,
          behavior: 'smooth'
        });
      }
    });
  });

  /* ============ Fade-in on scroll ============ */
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));

  /* ============ Page top button ============ */
  const pageTopBtn = document.getElementById('page-top-btn');

  function togglePageTopBtn() {
    if (!pageTopBtn) return;
    if (window.scrollY > 400) {
      pageTopBtn.classList.add('visible');
    } else {
      pageTopBtn.classList.remove('visible');
    }
  }

  /* ============ Music Player ============ */
  const audioEl      = document.getElementById('audio-player');
  const playBtn      = document.getElementById('music-play');
  const prevBtn      = document.getElementById('music-prev');
  const nextBtn      = document.getElementById('music-next');
  const shuffleBtn   = document.getElementById('music-shuffle');
  const repeatBtn    = document.getElementById('music-repeat');
  const progressBar  = document.getElementById('music-progress-bar');
  const progressFill = document.getElementById('music-progress-fill');
  const timeEl       = document.getElementById('music-time-current');
  const durationEl   = document.getElementById('music-time-total');
  const trackTitle   = document.getElementById('music-track-title');
  const coverEl      = document.getElementById('music-cover');
  const playlistEl   = document.getElementById('music-playlist-items');
  const playlistCount = document.getElementById('music-playlist-count');
  const emptyMsg     = document.getElementById('music-empty');
  const volumeSlider = document.getElementById('music-volume');

  let playlist = [];      // [{ title, file }]
  let currentIndex = 0;
  let isPlaying = false;
  let isShuffle = false;
  let repeatMode = 0;     // 0=off 1=all 2=one

  function formatTime(sec) {
    if (isNaN(sec) || !isFinite(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  /* --- playlist.json を fetch して初期化 --- */
  fetch('playlist.json')
    .then(r => r.json())
    .then(data => {
      playlist = data.filter(t => t.title && t.file);
      if (playlist.length > 0) {
        loadTrack(0);
      }
      updatePlaylistUI();
    })
    .catch(() => {
      // playlist.json が存在しないか読めない場合
      if (playlistCount) playlistCount.textContent = '0 tracks';
    });

  function updatePlaylistUI() {
    if (!playlistEl) return;

    if (playlist.length === 0) {
      playlistEl.innerHTML = '';
      emptyMsg?.classList.remove('hidden');
      if (playlistCount) playlistCount.textContent = '0 tracks';
      return;
    }

    emptyMsg?.classList.add('hidden');
    if (playlistCount) playlistCount.textContent = `${playlist.length} track${playlist.length > 1 ? 's' : ''}`;

    playlistEl.innerHTML = playlist.map((track, i) => `
      <div class="music-playlist-item ${i === currentIndex ? 'active' : ''}" data-index="${i}">
        <span class="music-playlist-num">${i === currentIndex && isPlaying ? '▶' : i + 1}</span>
        <div class="music-playlist-item-info">
          <div class="music-playlist-item-name">${track.title}</div>
        </div>
        <span class="music-playlist-item-dur" id="dur-${i}">-:--</span>
      </div>
    `).join('');

    // 各トラックのdurationを非同期取得
    playlist.forEach((track, i) => {
      const tmp = new Audio();
      tmp.preload = 'metadata';
      tmp.src = track.file;
      tmp.addEventListener('loadedmetadata', () => {
        const el = document.getElementById(`dur-${i}`);
        if (el) el.textContent = formatTime(tmp.duration);
      });
    });

    // クリックで再生
    playlistEl.querySelectorAll('.music-playlist-item').forEach(item => {
      item.addEventListener('click', () => {
        const idx = parseInt(item.dataset.index);
        loadTrack(idx);
        playAudio();
      });
    });
  }

  function loadTrack(index) {
    if (!playlist[index] || !audioEl) return;
    currentIndex = index;
    const track = playlist[index];
    audioEl.src = track.file;
    if (trackTitle) trackTitle.textContent = track.title;
    coverEl?.classList.remove('playing');
    // progress reset
    if (progressFill) progressFill.style.width = '0%';
    if (timeEl) timeEl.textContent = '0:00';
    if (durationEl) durationEl.textContent = '0:00';
    updatePlaylistUI();
  }

  function playAudio() {
    if (!audioEl) return;
    audioEl.play().then(() => {
      isPlaying = true;
      if (playBtn) playBtn.innerHTML = '⏸';
      coverEl?.classList.add('playing');
    }).catch(() => {});
  }

  function pauseAudio() {
    audioEl?.pause();
    isPlaying = false;
    if (playBtn) playBtn.innerHTML = '▶';
    coverEl?.classList.remove('playing');
  }

  function nextTrack() {
    if (playlist.length === 0) return;
    if (isShuffle) {
      let next = Math.floor(Math.random() * playlist.length);
      if (playlist.length > 1) while (next === currentIndex) next = Math.floor(Math.random() * playlist.length);
      loadTrack(next);
    } else {
      loadTrack((currentIndex + 1) % playlist.length);
    }
    if (isPlaying) playAudio();
  }

  function prevTrack() {
    if (playlist.length === 0) return;
    if (audioEl && audioEl.currentTime > 3) {
      audioEl.currentTime = 0;
      return;
    }
    loadTrack((currentIndex - 1 + playlist.length) % playlist.length);
    if (isPlaying) playAudio();
  }

  // Controls
  playBtn?.addEventListener('click', () => {
    if (!audioEl || playlist.length === 0) return;
    if (isPlaying) pauseAudio(); else playAudio();
  });

  nextBtn?.addEventListener('click', nextTrack);
  prevBtn?.addEventListener('click', prevTrack);

  shuffleBtn?.addEventListener('click', () => {
    isShuffle = !isShuffle;
    shuffleBtn.style.color = isShuffle ? 'var(--color-accent-primary)' : '';
  });

  repeatBtn?.addEventListener('click', () => {
    repeatMode = (repeatMode + 1) % 3;
    const labels = ['↩', '🔁', '🔂'];
    repeatBtn.innerHTML = labels[repeatMode];
    repeatBtn.style.color = repeatMode > 0 ? 'var(--color-accent-primary)' : '';
  });

  // Progress bar update
  audioEl?.addEventListener('timeupdate', () => {
    if (!audioEl.duration) return;
    const pct = (audioEl.currentTime / audioEl.duration) * 100;
    if (progressFill) progressFill.style.width = `${pct}%`;
    if (timeEl) timeEl.textContent = formatTime(audioEl.currentTime);
    if (durationEl) durationEl.textContent = formatTime(audioEl.duration);
  });

  // Seek on click
  progressBar?.addEventListener('click', e => {
    if (!audioEl?.duration) return;
    const rect = progressBar.getBoundingClientRect();
    audioEl.currentTime = ((e.clientX - rect.left) / rect.width) * audioEl.duration;
  });

  // Volume
  if (audioEl) audioEl.volume = 0.8;
  volumeSlider?.addEventListener('input', e => {
    if (audioEl) audioEl.volume = e.target.value;
  });

  // Auto-next on track end
  audioEl?.addEventListener('ended', () => {
    if (repeatMode === 2) {
      audioEl.currentTime = 0;
      playAudio();
    } else if (repeatMode === 1 || currentIndex < playlist.length - 1) {
      nextTrack();
    } else {
      pauseAudio();
    }
  });

  /* ============ Gallery ============ */
  const galleryGrid    = document.getElementById('gallery-grid');
  const galleryUpload  = document.getElementById('gallery-upload-input');
  const lightbox       = document.getElementById('lightbox');
  const lightboxImg    = document.getElementById('lightbox-img');
  const lightboxClose  = document.getElementById('lightbox-close');
  const filterBtns     = document.querySelectorAll('.gallery-filter-btn');

  let galleryItems = [];

  galleryUpload?.addEventListener('change', e => {
    const files = Array.from(e.target.files).filter(f => f.type.startsWith('image/'));
    files.forEach(file => {
      const url = URL.createObjectURL(file);
      galleryItems.push({ url, name: file.name, tag: 'all' });
    });
    renderGallery('all');
    e.target.value = '';
  });

  function renderGallery(filter) {
    if (!galleryGrid) return;
    const items = filter === 'all' ? galleryItems : galleryItems.filter(i => i.tag === filter);
    if (items.length === 0) {
      galleryGrid.innerHTML = `
        <div class="gallery-item gallery-placeholder">
          <div class="gallery-placeholder-icon">🖼</div>
          <span>イラストをアップロード</span>
        </div>`;
      return;
    }
    galleryGrid.innerHTML = items.map((item, i) => `
      <div class="gallery-item" data-index="${i}">
        <img src="${item.url}" alt="${item.name}" loading="lazy">
        <div class="gallery-item-overlay">
          <span class="gallery-item-label">${item.name.replace(/\.[^.]+$/, '')}</span>
        </div>
      </div>
    `).join('');

    galleryGrid.querySelectorAll('.gallery-item').forEach(item => {
      item.addEventListener('click', () => {
        const idx = parseInt(item.dataset.index);
        openLightbox(items[idx].url);
      });
    });
  }

  function openLightbox(src) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox?.classList.remove('open');
    document.body.style.overflow = '';
  }

  lightboxClose?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
  });

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderGallery(btn.dataset.filter);
    });
  });

  // Initial render
  renderGallery('all');

  /* ============ Init ============ */
  updatePlaylistUI();

});
