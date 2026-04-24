/* ═══════════════════════════════════════════════════════════════
   NutriScan — App Controller, SPA Router & API Client
   ═══════════════════════════════════════════════════════════════ */

// ─── Global State ──────────────────────────────────────────────
const state = {
    currentView: 'scan',
    currentAnalysis: null,
    currentImageBase64: null,
    meals: [],
    goals: { calories: 2000, protein: 150, carbs: 250, fat: 65 },
};

// ─── Splash Screen ─────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const splash = document.getElementById('splash');
        splash.classList.add('hide');
        setTimeout(() => {
            splash.style.display = 'none';
            document.getElementById('app').classList.remove('hidden');
            initApp();
        }, 500);
    }, 1800);
});

// ─── Init ──────────────────────────────────────────────────────
function initApp() {
    // Set date
    const now = new Date();
    const opts = { weekday: 'short', month: 'short', day: 'numeric' };
    document.getElementById('header-date').textContent = now.toLocaleDateString('en-US', opts);

    // Load goals
    loadGoals();

    // Goals form
    document.getElementById('goals-form').addEventListener('submit', saveGoals);

    // Suggest meal button
    document.getElementById('btn-suggest').addEventListener('click', suggestMeal);

    // Set initial tab indicator
    updateTabIndicator('scan');
}

// ─── Tab Router ────────────────────────────────────────────────
function switchTab(tab) {
    // Hide all views
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    // Show target
    document.getElementById(`view-${tab}`).classList.add('active');
    // Update tabs
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`.tab[data-tab="${tab}"]`).classList.add('active');
    // Move indicator
    updateTabIndicator(tab);
    // Refresh view data
    state.currentView = tab;
    if (tab === 'log') refreshLog();
    if (tab === 'dashboard') refreshDashboard();
    if (tab === 'profile') loadGoals();
}

function updateTabIndicator(tab) {
    const tabs = ['scan', 'log', 'dashboard', 'profile'];
    const idx = tabs.indexOf(tab);
    const indicator = document.getElementById('tab-indicator');
    if (indicator) indicator.style.left = `${idx * 25}%`;
}

// ─── API Client ────────────────────────────────────────────────
async function api(endpoint, options = {}) {
    try {
        const res = await fetch(endpoint, {
            headers: { 'Content-Type': 'application/json' },
            ...options,
        });
        return await res.json();
    } catch (err) {
        console.error('API Error:', err);
        showToast('❌', 'Network error. Please try again.');
        return { error: err.message };
    }
}

// ─── Toast ─────────────────────────────────────────────────────
function showToast(icon, msg, duration = 3000) {
    const toast = document.getElementById('toast');
    document.getElementById('toast-icon').textContent = icon;
    document.getElementById('toast-msg').textContent = msg;
    toast.classList.remove('hidden');
    // Force reflow
    toast.offsetHeight;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.classList.add('hidden'), 300);
    }, duration);
}

// ─── Goals ─────────────────────────────────────────────────────
async function loadGoals() {
    const data = await api('/api/goals');
    if (!data.error) {
        state.goals = data;
        document.getElementById('goal-calories').value = data.calories || 2000;
        document.getElementById('goal-protein').value = data.protein || 150;
        document.getElementById('goal-carbs').value = data.carbs || 250;
        document.getElementById('goal-fat').value = data.fat || 65;
    }
}

async function saveGoals(e) {
    e.preventDefault();
    const goals = {
        calories: parseInt(document.getElementById('goal-calories').value),
        protein: parseInt(document.getElementById('goal-protein').value),
        carbs: parseInt(document.getElementById('goal-carbs').value),
        fat: parseInt(document.getElementById('goal-fat').value),
    };
    const data = await api('/api/set-goals', {
        method: 'POST',
        body: JSON.stringify(goals),
    });
    if (data.success) {
        state.goals = data.goals;
        showToast('✅', 'Goals saved!');
    }
}

// ─── Log Meal ──────────────────────────────────────────────────
async function logCurrentMeal() {
    if (!state.currentAnalysis || state.currentAnalysis.error) return;
    const a = state.currentAnalysis;
    const data = await api('/api/log-meal', {
        method: 'POST',
        body: JSON.stringify({
            foods: a.foods || [],
            total_calories: a.total_calories || 0,
            total_protein: a.total_protein || 0,
            total_carbs: a.total_carbs || 0,
            total_fat: a.total_fat || 0,
            total_fiber: a.total_fiber || 0,
            meal_score: a.meal_score || 5,
            health_notes: a.health_notes || '',
        }),
    });
    if (data.success) {
        showToast('✅', 'Meal logged successfully!');
        document.getElementById('btn-log-meal').disabled = true;
        document.getElementById('btn-log-meal').textContent = '✅ Meal Logged';
    }
}

// ─── Refresh Log View ──────────────────────────────────────────
async function refreshLog() {
    const data = await api('/api/meals');
    const timeline = document.getElementById('meal-timeline');
    const emptyState = document.getElementById('log-empty');

    if (!data.meals || data.meals.length === 0) {
        timeline.innerHTML = '';
        timeline.appendChild(emptyState);
        emptyState.style.display = 'flex';
        document.getElementById('log-meal-count').textContent = '0 meals';
        return;
    }

    document.getElementById('log-meal-count').textContent = `${data.meals.length} meal${data.meals.length > 1 ? 's' : ''}`;

    let totalCal = 0, totalP = 0, totalC = 0, totalF = 0;
    let html = '';

    data.meals.reverse().forEach((meal, i) => {
        totalCal += meal.total_calories || 0;
        totalP += meal.total_protein || 0;
        totalC += meal.total_carbs || 0;
        totalF += meal.total_fat || 0;

        const time = new Date(meal.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        const foodNames = (meal.foods || []).map(f => f.name).join(', ') || 'Unnamed meal';
        const score = meal.meal_score || 5;
        const scoreColor = score >= 7 ? 'var(--color-primary)' : score >= 4 ? 'var(--color-accent)' : 'var(--color-danger)';

        html += `<div class="meal-entry" style="animation-delay:${i * 0.1}s">
            <div class="meal-entry-header">
                <span class="meal-entry-time">🕐 ${time}</span>
                <span class="meal-entry-score" style="background:${scoreColor}20;color:${scoreColor}">${score}/10</span>
            </div>
            <div class="meal-entry-foods">${foodNames}</div>
            <div class="meal-entry-macros">
                <span>🔥 <strong>${meal.total_calories || 0}</strong> cal</span>
                <span>💪 <strong>${Math.round(meal.total_protein || 0)}g</strong> P</span>
                <span>🌾 <strong>${Math.round(meal.total_carbs || 0)}g</strong> C</span>
                <span>🥑 <strong>${Math.round(meal.total_fat || 0)}g</strong> F</span>
            </div>
        </div>`;
    });

    timeline.innerHTML = html;
    document.getElementById('log-total-cal').textContent = totalCal;
    document.getElementById('log-total-protein').textContent = `${Math.round(totalP)}g`;
    document.getElementById('log-total-carbs').textContent = `${Math.round(totalC)}g`;
    document.getElementById('log-total-fat').textContent = `${Math.round(totalF)}g`;
}

// ─── Suggest Meal ──────────────────────────────────────────────
async function suggestMeal() {
    const btn = document.getElementById('btn-suggest');
    btn.disabled = true;
    btn.innerHTML = '<span class="btn-icon">⏳</span> Thinking...';

    const data = await api('/api/suggest-meal');
    const container = document.getElementById('meal-suggestion');

    if (data.error || !data.suggestion) {
        const isRateLimit = data.error && (data.error.includes('429') || data.error.includes('quota') || data.error.includes('503'));
        const errorMsg = isRateLimit 
            ? 'AI is temporarily rate-limited. Please wait a moment and try again.'
            : 'Couldn\'t get suggestion. Try again in a moment.';
        container.innerHTML = `<p style="color:var(--text-muted);font-size:0.85rem">${errorMsg}</p>
            <button id="btn-suggest" class="btn btn-accent btn-full" onclick="suggestMeal()"><span class="btn-icon">✨</span> Try Again</button>`;
        return;
    }

    const s = data.suggestion;
    container.innerHTML = `<div class="suggestion-result">
        <div class="suggestion-meal-name">${s.meal_name}</div>
        <p class="suggestion-desc">${s.description}</p>
        <div class="suggestion-macros">
            <span class="suggestion-macro">🔥 ${s.estimated_calories} cal</span>
            <span class="suggestion-macro">💪 ${s.estimated_protein}g protein</span>
            <span class="suggestion-macro">🌾 ${s.estimated_carbs}g carbs</span>
            <span class="suggestion-macro">🥑 ${s.estimated_fat}g fat</span>
        </div>
        <p class="suggestion-why">💡 ${s.why || ''}</p>
        <button class="btn btn-accent btn-full" style="margin-top:0.75rem" onclick="suggestMeal()"><span class="btn-icon">🔄</span> Another Suggestion</button>
    </div>`;
}
