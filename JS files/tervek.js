const SUPABASE_URL = 'https://bvositlxbeqztnhdembx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2b3NpdGx4YmVxenRuaGRlbWJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyMTY3NzAsImV4cCI6MjEwMjc5Mjc3MH0.41fAH1kEGYYmXSmS0Ny4lkYuXe2N5_pSPX2VVKYzhkQ';

const { createClient } = supabase;
const _supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

window.onload = function () {
    loadTervek();
};

async function loadTervek() {
    const { data, error } = await _supabase
        .from('tervek')
        .select('*')
        .order('id', { ascending: false });
    if (error) {
        console.error('Hiba a betöltéskor:', error);
        return;
    }

    const container = document.querySelector('.tervek');
    container.innerHTML = '';
    data.forEach(terv => {
        renderTervItem(terv.id, terv.text, terv.completed);
    });
}

async function add() {
    const inputField = document.getElementById('tervInput');
    const text = inputField.value.trim();

    if (text === '') return;

    const { data, error } = await _supabase
        .from('tervek')
        .insert([{ text: text, completed: false }])
        .select();

    if (error) {
        console.error('Hiba a mentéskor:', error);
        return;
    }

    inputField.value = '';
    loadTervek();
}

function renderTervItem(id, text, isCompleted) {
    const container = document.querySelector('.tervek');

    const itemDiv = document.createElement('div');
    itemDiv.className = 'terv-item';
    if (isCompleted) {
        itemDiv.classList.add('completed');
    }

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = isCompleted;

    const span = document.createElement('span');
    span.textContent = text;

    checkbox.addEventListener('change', async function () {
        const checked = checkbox.checked;

        const { error } = await _supabase
            .from('tervek')
            .update({ completed: checked })
            .eq('id', id);

        if (error) {
            console.error('Hiba a frissítéskor:', error);
            return;
        }

        loadTervek();
    });

    itemDiv.appendChild(checkbox);
    itemDiv.appendChild(span);

    if (isCompleted) {
        container.appendChild(itemDiv);
    } else {
        container.prepend(itemDiv);
    }
}