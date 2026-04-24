/* ═══════════════════════════════════════════════════════════════
   NutriScan — Healthier Alternatives / Recommendations UI
   ═══════════════════════════════════════════════════════════════ */

function renderAlternatives(data) {
    const area = document.getElementById('alternatives-area');
    const list = document.getElementById('alternatives-list');
    const tipEl = document.getElementById('overall-tip');

    if (!data.alternatives || data.alternatives.length === 0) {
        area.classList.add('hidden');
        return;
    }

    list.innerHTML = data.alternatives.map((alt, i) => `
        <div class="alt-card" style="animation-delay:${i * 0.15}s">
            <div class="alt-header">
                <span class="alt-original">${alt.original}</span>
                <span class="alt-arrow">→</span>
                <span class="alt-suggestion">${alt.suggestion}</span>
            </div>
            <p class="alt-reason">${alt.reason || ''}</p>
            <div style="display:flex;gap:0.5rem;align-items:center;flex-wrap:wrap">
                <span class="alt-savings">Save ${alt.calories_saved || 0} cal</span>
                ${alt.nutrition_benefit ? `<span style="font-size:0.75rem;color:var(--text-muted)">${alt.nutrition_benefit}</span>` : ''}
            </div>
        </div>
    `).join('');

    if (data.overall_tip) {
        tipEl.textContent = `💡 ${data.overall_tip}`;
        tipEl.style.display = 'block';
    } else {
        tipEl.style.display = 'none';
    }

    area.classList.remove('hidden');

    // Scroll to alternatives
    setTimeout(() => {
        area.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 200);
}
