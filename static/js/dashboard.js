/* ═══════════════════════════════════════════════════════════════
   NutriScan — Dashboard Charts & Progress Visualization
   ═══════════════════════════════════════════════════════════════ */

// ─── Draw Macro Ring (Canvas) ──────────────────────────────────
function drawMacroRing(canvasId, value, max, color) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = canvas.width;
    const center = size / 2;
    const radius = (size / 2) - 10;
    const lineWidth = 8;
    const pct = Math.min(value / max, 1);

    ctx.clearRect(0, 0, size, size);

    // Background ring
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = lineWidth;
    ctx.stroke();

    // Progress ring
    if (pct > 0) {
        ctx.beginPath();
        ctx.arc(center, center, radius, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * pct);
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.stroke();
    }

    // Percentage text
    ctx.fillStyle = color;
    ctx.font = `700 ${size * 0.22}px Inter, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${Math.round(pct * 100)}%`, center, center);
}

// ─── Refresh Dashboard ─────────────────────────────────────────
async function refreshDashboard() {
    const data = await api('/api/daily-summary');
    if (data.error) return;

    const { totals, goals, progress, avg_meal_score } = data;

    // Calorie bar
    document.getElementById('dash-cal-current').textContent = totals.calories || 0;
    document.getElementById('dash-cal-goal').textContent = goals.calories || 2000;
    document.getElementById('dash-cal-remaining').textContent = Math.max(0, (goals.calories || 2000) - (totals.calories || 0));

    const calFill = document.getElementById('calorie-bar-fill');
    setTimeout(() => {
        calFill.style.width = `${progress.calories || 0}%`;
        // Color based on progress
        if (progress.calories > 100) {
            calFill.style.background = 'linear-gradient(90deg, var(--color-danger), #ff4444)';
        } else if (progress.calories > 80) {
            calFill.style.background = 'linear-gradient(90deg, var(--color-accent), var(--color-danger))';
        } else {
            calFill.style.background = 'linear-gradient(90deg, var(--color-primary), var(--color-accent))';
        }
    }, 100);

    // Macro rings
    document.getElementById('dash-protein').textContent = `${Math.round(totals.protein || 0)}g`;
    document.getElementById('dash-carbs').textContent = `${Math.round(totals.carbs || 0)}g`;
    document.getElementById('dash-fat').textContent = `${Math.round(totals.fat || 0)}g`;
    document.getElementById('dash-protein-goal').textContent = `/ ${goals.protein || 150}g`;
    document.getElementById('dash-carbs-goal').textContent = `/ ${goals.carbs || 250}g`;
    document.getElementById('dash-fat-goal').textContent = `/ ${goals.fat || 65}g`;

    drawMacroRing('protein-ring', totals.protein || 0, goals.protein || 150, '#6c9fff');
    drawMacroRing('carbs-ring', totals.carbs || 0, goals.carbs || 250, '#00d67e');
    drawMacroRing('fat-ring', totals.fat || 0, goals.fat || 65, '#a78bfa');

    // Average score
    const scoreEl = document.getElementById('dash-avg-score');
    if (avg_meal_score > 0) {
        scoreEl.textContent = avg_meal_score;
        scoreEl.style.color = avg_meal_score >= 7 ? 'var(--color-primary)' : avg_meal_score >= 4 ? 'var(--color-accent)' : 'var(--color-danger)';
    } else {
        scoreEl.textContent = '—';
        scoreEl.style.color = 'var(--text-muted)';
    }
}
