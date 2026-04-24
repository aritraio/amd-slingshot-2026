/* ═══════════════════════════════════════════════════════════════
   NutriScan — Camera & Image Upload Handler
   ═══════════════════════════════════════════════════════════════ */

(function () {
    // DOM elements
    const uploadArea = document.getElementById('upload-area');
    const previewArea = document.getElementById('preview-area');
    const scanningOverlay = document.getElementById('scanning-overlay');
    const resultsArea = document.getElementById('results-area');
    const previewImg = document.getElementById('preview-img');
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const cameraInput = document.getElementById('camera-input');

    // Buttons
    const btnCamera = document.getElementById('btn-camera');
    const btnUpload = document.getElementById('btn-upload');
    const btnRetake = document.getElementById('btn-retake');
    const btnAnalyze = document.getElementById('btn-analyze');
    const btnLogMeal = document.getElementById('btn-log-meal');
    const btnGetAlts = document.getElementById('btn-get-alternatives');
    const btnScanNew = document.getElementById('btn-scan-new');

    // ─── Event Listeners ───────────────────────────────────────
    btnCamera.addEventListener('click', () => cameraInput.click());
    btnUpload.addEventListener('click', () => fileInput.click());
    btnRetake.addEventListener('click', resetToUpload);
    btnAnalyze.addEventListener('click', analyzeImage);
    btnLogMeal.addEventListener('click', () => logCurrentMeal());
    btnGetAlts.addEventListener('click', getAlternatives);
    btnScanNew.addEventListener('click', resetToUpload);

    fileInput.addEventListener('change', handleFileSelect);
    cameraInput.addEventListener('change', handleFileSelect);

    // Drag & drop
    dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('drag-over'); });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        if (e.dataTransfer.files.length) processFile(e.dataTransfer.files[0]);
    });

    // ─── File Handling ─────────────────────────────────────────
    function handleFileSelect(e) {
        if (e.target.files.length) processFile(e.target.files[0]);
    }

    function processFile(file) {
        if (!file.type.startsWith('image/')) {
            showToast('❌', 'Please select an image file');
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            state.currentImageBase64 = e.target.result;
            previewImg.src = e.target.result;
            showPreview();
        };
        reader.readAsDataURL(file);
    }

    // ─── View State ────────────────────────────────────────────
    function showPreview() {
        uploadArea.classList.add('hidden');
        previewArea.classList.remove('hidden');
        scanningOverlay.classList.add('hidden');
        resultsArea.classList.add('hidden');
    }

    function showScanning() {
        uploadArea.classList.add('hidden');
        previewArea.classList.add('hidden');
        scanningOverlay.classList.remove('hidden');
        resultsArea.classList.add('hidden');
    }

    function showResults() {
        uploadArea.classList.add('hidden');
        previewArea.classList.add('hidden');
        scanningOverlay.classList.add('hidden');
        resultsArea.classList.remove('hidden');
    }

    function resetToUpload() {
        uploadArea.classList.remove('hidden');
        previewArea.classList.add('hidden');
        scanningOverlay.classList.add('hidden');
        resultsArea.classList.add('hidden');
        document.getElementById('alternatives-area').classList.add('hidden');
        state.currentAnalysis = null;
        state.currentImageBase64 = null;
        fileInput.value = '';
        cameraInput.value = '';
        // Reset log button
        btnLogMeal.disabled = false;
        btnLogMeal.innerHTML = '<span class="btn-icon">✅</span> Log This Meal';
    }

    // ─── Analyze ───────────────────────────────────────────────
    async function analyzeImage() {
        if (!state.currentImageBase64) return;
        showScanning();

        const data = await api('/api/analyze', {
            method: 'POST',
            body: JSON.stringify({ image: state.currentImageBase64 }),
        });

        if (data.error) {
            showToast('❌', data.error);
            showPreview();
            return;
        }

        state.currentAnalysis = data;
        renderResults(data);
        showResults();
    }

    // ─── Render Results ────────────────────────────────────────
    function renderResults(data) {
        // Score ring
        const score = data.meal_score || 0;
        const circumference = 2 * Math.PI * 52; // r=52
        const offset = circumference - (score / 10) * circumference;
        const ringFill = document.getElementById('score-ring-fill');
        ringFill.style.strokeDasharray = circumference;
        // Animate after a tick
        setTimeout(() => { ringFill.style.strokeDashoffset = offset; }, 50);

        // Color based on score
        const scoreColor = score >= 7 ? 'var(--color-primary)' : score >= 4 ? 'var(--color-accent)' : 'var(--color-danger)';
        ringFill.style.stroke = scoreColor === 'var(--color-primary)' ? '#00d67e' : scoreColor === 'var(--color-accent)' ? '#ffb347' : '#ff6b6b';

        document.getElementById('score-number').textContent = score;
        document.getElementById('score-label').textContent = data.meal_score_label || 'N/A';
        document.getElementById('score-label').style.background = scoreColor === 'var(--color-primary)' ? 'rgba(0,214,126,0.15)' : scoreColor === 'var(--color-accent)' ? 'rgba(255,179,71,0.15)' : 'rgba(255,107,107,0.15)';
        document.getElementById('score-label').style.color = scoreColor === 'var(--color-primary)' ? '#00d67e' : scoreColor === 'var(--color-accent)' ? '#ffb347' : '#ff6b6b';
        document.getElementById('health-notes').textContent = data.health_notes || '';

        // Nutrition totals
        document.getElementById('result-calories').textContent = data.total_calories || 0;
        document.getElementById('result-protein').textContent = `${Math.round(data.total_protein || 0)}g`;
        document.getElementById('result-carbs').textContent = `${Math.round(data.total_carbs || 0)}g`;
        document.getElementById('result-fat').textContent = `${Math.round(data.total_fat || 0)}g`;

        // Food items list
        const listEl = document.getElementById('food-items-list');
        if (data.foods && data.foods.length) {
            listEl.innerHTML = data.foods.map((f, i) => `
                <div class="food-item" style="animation-delay:${i * 0.1}s">
                    <div class="food-item-info">
                        <div class="food-item-name">${f.name}</div>
                        <div class="food-item-portion">${f.portion || ''}</div>
                    </div>
                    <div class="food-item-cals">${f.calories} cal</div>
                </div>
            `).join('');
        } else {
            listEl.innerHTML = '<p style="color:var(--text-muted);font-size:0.85rem">No food items detected</p>';
        }

        // Suggestion
        document.getElementById('suggestion-text').textContent = data.suggestions || '';
    }

    // ─── Get Alternatives ──────────────────────────────────────
    async function getAlternatives() {
        if (!state.currentAnalysis || !state.currentAnalysis.foods) return;

        btnGetAlts.disabled = true;
        btnGetAlts.innerHTML = '<span class="btn-icon">⏳</span> Finding alternatives...';

        const data = await api('/api/recommend', {
            method: 'POST',
            body: JSON.stringify({ foods: state.currentAnalysis.foods }),
        });

        btnGetAlts.disabled = false;
        btnGetAlts.innerHTML = '<span class="btn-icon">🔄</span> Healthier Alternatives';

        if (data.error || !data.alternatives) {
            showToast('❌', 'Could not get alternatives');
            return;
        }

        renderAlternatives(data);
    }
})();
