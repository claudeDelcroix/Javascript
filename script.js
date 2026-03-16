// État initial (immuable)
let state = {
    tasks: [
        { id: Date.now() - 3000, text: '✨ Créer une todo list magnifique', completed: true },
        { id: Date.now() - 2000, text: '🎨 Ajouter des animations fluides', completed: true },
        { id: Date.now() - 1000, text: '🌟 Rendre l\'expérience utilisateur exceptionnelle', completed: false },
        { id: Date.now(), text: '🚀 Partager ce chef-d\'œuvre', completed: false }
    ],
    filter: 'all'
};

// --- Fonctions pures ---
const addTask = (tasks, text) => {
    if (!text.trim()) return tasks;
    const newTask = {
        id: Date.now(),
        text: text.trim(),
        completed: false,
        createdAt: new Date().toISOString()
    };
    return [...tasks, newTask];
};

const deleteTask = (tasks, id) => tasks.filter(task => task.id !== id);

const toggleTask = (tasks, id) =>
    tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
    );

const clearCompleted = (tasks) => tasks.filter(task => !task.completed);

const filterTasks = (tasks, filter) => {
    switch (filter) {
        case 'active': return tasks.filter(task => !task.completed);
        case 'completed': return tasks.filter(task => task.completed);
        default: return tasks;
    }
};

const getStats = (tasks) => ({
    total: tasks.length,
    remaining: tasks.filter(t => !t.completed).length,
    completed: tasks.filter(t => t.completed).length
});

// --- Références DOM ---
const elements = {
    taskInput: document.getElementById('taskInput'),
    addBtn: document.getElementById('addBtn'),
    taskList: document.getElementById('taskList'),
    filterBtns: document.querySelectorAll('.filter-btn'),
    remainingSpan: document.getElementById('remainingCount'),
    allCount: document.getElementById('allCount'),
    activeCount: document.getElementById('activeCount'),
    completedCount: document.getElementById('completedCount'),
    totalCount: document.getElementById('totalCount'),
    completedTotal: document.getElementById('completedTotal'),
    clearCompletedBtn: document.getElementById('clearCompleted'),
    currentDate: document.getElementById('currentDate'),
    toast: document.getElementById('toast'),
    toastMessage: document.getElementById('toastMessage')
};

// --- Fonctions utilitaires ---
const showToast = (message) => {
    elements.toastMessage.textContent = message;
    elements.toast.classList.add('show');
    setTimeout(() => {
        elements.toast.classList.remove('show');
    }, 3000);
};

const formatDate = () => {
    const date = new Date();
    return date.toLocaleDateString('ru-RU', { 
        day: 'numeric', 
        month: 'long',
        year: 'numeric'
    });
};

// --- Fonction de rendu améliorée ---
function render() {
    const filteredTasks = filterTasks(state.tasks, state.filter);
    const stats = getStats(state.tasks);

    // Mise à jour des compteurs
    elements.remainingSpan.textContent = stats.remaining;
    elements.allCount.textContent = stats.total;
    elements.activeCount.textContent = stats.remaining;
    elements.completedCount.textContent = stats.completed;
    elements.totalCount.textContent = stats.total;
    elements.completedTotal.textContent = stats.completed;
    elements.currentDate.textContent = formatDate();

    // Rendu des tâches avec animation
    elements.taskList.innerHTML = filteredTasks.map((task, index) => `
        <li class="task-item-modern ${task.completed ? 'completed' : ''}" style="animation-delay: ${index * 0.05}s">
            <input type="checkbox" class="task-checkbox-modern" data-id="${task.id}" ${task.completed ? 'checked' : ''}>
            <span class="task-text-modern">${task.text}</span>
            <button class="delete-btn-modern" data-id="${task.id}">
                <i class="fas fa-trash-alt"></i>
            </button>
        </li>
    `).join('');

    // Mise à jour des filtres actifs
    elements.filterBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === state.filter);
    });
}

// --- Gestionnaires d'événements ---
elements.addBtn.addEventListener('click', () => {
    const text = elements.taskInput.value;
    if (text.trim()) {
        state = { ...state, tasks: addTask(state.tasks, text) };
        elements.taskInput.value = '';
        render();
        showToast('✅ Tâche ajoutée avec succès');
    }
});

elements.taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        elements.addBtn.click();
    }
});

elements.taskList.addEventListener('click', (e) => {
    const deleteBtn = e.target.closest('.delete-btn-modern');
    const checkbox = e.target.closest('.task-checkbox-modern');
    
    if (deleteBtn) {
        const id = Number(deleteBtn.dataset.id);
        state = { ...state, tasks: deleteTask(state.tasks, id) };
        render();
        showToast('🗑️ Tâche supprimée');
    }
    
    if (checkbox) {
        const id = Number(checkbox.dataset.id);
        state = { ...state, tasks: toggleTask(state.tasks, id) };
        render();
        showToast(checkbox.checked ? '✅ Tâche complétée' : '🔄 Tâche réactivée');
    }
});

elements.filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        state = { ...state, filter: btn.dataset.filter };
        render();
        showToast(`📋 Filtre: ${btn.textContent.trim()}`);
    });
});

elements.clearCompletedBtn.addEventListener('click', () => {
    const completedCount = state.tasks.filter(t => t.completed).length;
    if (completedCount > 0) {
        state = { ...state, tasks: clearCompleted(state.tasks) };
        render();
        showToast(`🧹 ${completedCount} tâche(s) nettoyée(s)`);
    }
});

// Animation d'entrée pour l'input
elements.taskInput.addEventListener('focus', () => {
    elements.taskInput.parentElement.style.transform = 'scale(1.02)';
});

elements.taskInput.addEventListener('blur', () => {
    elements.taskInput.parentElement.style.transform = 'scale(1)';
});

// Rendu initial et date
render();

// Animation de bienvenue
setTimeout(() => {
    showToast('🎉 Bienvenue sur votre todo list élégante');
}, 1000);
