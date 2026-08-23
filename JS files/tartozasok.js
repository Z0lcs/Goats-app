const SUPABASE_URL = 'https://bvositlxbeqztnhdembx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2b3NpdGx4YmVxenRuaGRlbWJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyMTY3NzAsImV4cCI6MjEwMjc5Mjc3MH0.41fAH1kEGYYmXSmS0Ny4lkYuXe2N5_pSPX2VVKYzhkQ';

const { createClient } = supabase;
const _supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

window.onload = function () {
    loadTartozasok();
};

async function loadTartozasok() {
    const { data, error } = await _supabase
        .from('tartozasok')
        .select('*')
        .order('id', { ascending: false });

    if (error) {
        console.error('Hiba a betöltéskor:', error);
        return;
    }

    // Kiürítjük a dobozokat
    document.querySelector('.akos').innerHTML = '';
    document.querySelector('.feri').innerHTML = '';
    document.querySelector('.zali').innerHTML = '';
    document.querySelector('.zoli').innerHTML = '';

    data.forEach(item => {
        if (!item.kitartozik) return;

        const normalizedName = item.kitartozik
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();

        const targetDiv = document.querySelector(`.${normalizedName}`);

        if (targetDiv) {
            const card = document.createElement('div');
            card.className = 'tartozas-kartya';

            card.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span>${item.kinek} ${item.mennyiert} Ft ${item.miert}</span>
                        <span onclick="deleteTartozas(${item.id})" style="cursor: pointer; font-size: 1.1rem; padding-left: 8px;" title="Törlés">🗑️</span>
                    </div>
                `;
            targetDiv.appendChild(card);
        } else {
            console.warn('Nem található ilyen doboz:', normalizedName);
        }
    });
}
async function deleteTartozas(id) {
    const { error } = await _supabase
        .from('tartozasok')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Hiba a törléskor:', error);
        alert('Hiba történt a törlés során!');
        return;
    }

    // Újratöltjük a listát, hogy eltűnjön a kártya
    loadTartozasok();
}

async function addTartozas() {
    const miert = document.getElementById('miertInput').value.trim();
    const mennyiert = document.getElementById('mennyiertInput').value.trim();
    const kinek = document.getElementById('kinekInput').value;
    const kiTartozik = document.getElementById('kiTartozikInput').value;

    if (!miert || !mennyiert || !kinek || !kiTartozik) {
        alert('Kérlek töltsd ki az összes mezőt!');
        return;
    }

    const { data, error } = await _supabase
        .from('tartozasok')
        .insert([{
            miert: miert,
            mennyiert: mennyiert,
            kinek: kinek,
            kitartozik: kiTartozik
        }])
        .select();

    if (error) {
        console.error('Hiba a mentéskor:', error);
        return;
    }

    // Mezők tisztítása
    document.getElementById('miertInput').value = '';
    document.getElementById('mennyiertInput').value = '';
    document.getElementById('kinekInput').selectedIndex = 0;
    document.getElementById('kiTartozikInput').selectedIndex = 0;

    loadTartozasok();
}