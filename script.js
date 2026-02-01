document.addEventListener('DOMContentLoaded', () => {
    const wavesurfer = WaveSurfer.create({
        container: '#waveform',
        waveColor: '#334155',
        progressColor: '#818cf8',
        cursorColor: '#818cf8',
        height: 80,
        barWidth: 3,
        barGap: 4,
        barRadius: 20,
        responsive: true,
    });

    const dropZone = document.getElementById('drop-zone');
    const audioInput = document.getElementById('audio-input');
    const playbackContainer = document.getElementById('playback-container');
    const analyzeBtn = document.getElementById('analyze-btn');
    const resultsDisplay = document.getElementById('results-display');
    const playBtn = document.getElementById('play-btn');

    // --- 1. File Handling Logic ---
    dropZone.onclick = () => audioInput.click();

    audioInput.onchange = (e) => {
        const file = e.target.files[0];
        if (file) handleAudioUpload(file);
    };

    // DRAG & DROP FIX
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
        }, false);
    });

    dropZone.addEventListener('drop', (e) => {
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('audio/')) {
            handleAudioUpload(file);
        }
    });

    function handleAudioUpload(file) {
        playbackContainer.classList.remove('hidden');
        document.getElementById('file-name').innerText = file.name;
        const url = URL.createObjectURL(file);
        wavesurfer.load(url);
        playbackContainer.scrollIntoView({ behavior: 'smooth' });
    }

    // --- 2. Playback Control ---
    playBtn.onclick = () => {
        wavesurfer.playPause();
        const isPlaying = wavesurfer.isPlaying();
        playBtn.innerHTML = isPlaying ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
    };

    // --- 3. Analysis Logic ---
    analyzeBtn.onclick = () => {
        analyzeBtn.disabled = true;
        analyzeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
        
        setTimeout(() => {
            displayResults();
            analyzeBtn.disabled = false;
            analyzeBtn.innerHTML = '<i class="fas fa-check"></i> Analysis Complete';
        }, 2500);
    };

    function displayResults() {
        resultsDisplay.classList.remove('hidden');
        
        const mockResponse = {
            lang: "Telugu",
            score: 97.8,
            isAI: true,
            details: "Neural vocoder artifacts detected. Spectral flux distribution is too consistent for human vocal cords. Lack of physiological micro-jitters."
        };

        const label = document.getElementById('classification-label');
        const badge = document.getElementById('language-badge');
        const scoreVal = document.getElementById('score-value');
        const terminalText = document.getElementById('explanation-text');

        label.innerText = mockResponse.isAI ? "AI-GENERATED VOICE" : "HUMAN VOICE DETECTED";
        label.style.color = mockResponse.isAI ? "#f43f5e" : "#10b981";
        badge.innerText = mockResponse.lang;
        
        animateScore(scoreVal, mockResponse.score);
        typeWriter(terminalText, `> [REPORT]: ${mockResponse.details}`);
        resultsDisplay.scrollIntoView({ behavior: 'smooth' });
    }

    function animateScore(element, target) {
        let count = 0;
        const timer = setInterval(() => {
            count += 1.5;
            element.innerText = count.toFixed(1) + "%";
            if (count >= target) {
                element.innerText = target + "%";
                clearInterval(timer);
            }
        }, 20);
    }

    function typeWriter(element, text, i = 0) {
        if (i === 0) element.innerHTML = '';
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            setTimeout(() => typeWriter(element, text, i + 1), 30);
        }
    }
});