/* ═══════════════════════════════════════════════════════════════
   NutriScan — App Controller, SPA Router & API Client
   ═══════════════════════════════════════════════════════════════ */

// ─── Global State ──────────────────────────────────────────────
const state = {
    currentView: 'add',
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

    // Manual Log form
    const manualForm = document.getElementById('manual-log-form');
    if (manualForm) {
        manualForm.addEventListener('submit', handleManualSubmit);
    }

    // Set initial tab indicator
    updateTabIndicator('add');
}

// ─── Tab Router ────────────────────────────────────────────────
function switchTab(tab) {
    // Hide all views
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    // Show target
    const targetView = document.getElementById(`view-${tab}`);
    if (targetView) targetView.classList.add('active');
    
    // Update tabs
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    const targetTab = document.querySelector(`.tab[data-tab="${tab}"]`);
    if (targetTab) targetTab.classList.add('active');
    
    // Move indicator
    updateTabIndicator(tab);
    
    // Refresh view data
    state.currentView = tab;
    if (tab === 'log') refreshLog();
    if (tab === 'dashboard') refreshDashboard();
    if (tab === 'profile') loadGoals();
}

function updateTabIndicator(tab) {
    const tabs = ['add', 'log', 'dashboard', 'profile'];
    const idx = tabs.indexOf(tab);
    const indicator = document.getElementById('tab-indicator');
    if (indicator && idx !== -1) indicator.style.left = `${idx * 25}%`;
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

// ─── Manual & Quick Log ───────────────────────────────────────
async function handleManualSubmit(e) {
    e.preventDefault();
    const food = {
        name: document.getElementById('food-name').value,
        calories: parseInt(document.getElementById('food-calories').value) || 0,
        protein: parseInt(document.getElementById('food-protein').value) || 0,
        carbs: parseInt(document.getElementById('food-carbs').value) || 0,
        fat: parseInt(document.getElementById('food-fat').value) || 0,
    };
    await quickAdd(food.name, food.calories, food.protein, food.carbs, food.fat);
    e.target.reset();
}

async function quickAdd(name, cal, pro, carb, fat) {
    const data = await api('/api/log-meal', {
        method: 'POST',
        body: JSON.stringify({
            foods: [{ name, calories: cal, protein: pro, carbs: carb, fat: fat }],
            total_calories: cal,
            total_protein: pro,
            total_carbs: carb,
            total_fat: fat,
            meal_score: 7, // Default good score
            health_notes: 'Manual entry'
        }),
    });
    if (data.success) {
        showToast('✅', `${name} logged!`);
        if (state.currentView === 'log') refreshLog();
        if (state.currentView === 'dashboard') refreshDashboard();
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
