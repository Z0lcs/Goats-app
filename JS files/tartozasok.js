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

    document.querySelector('.akos').innerHTML = '';
    document.querySelector('.feri').innerHTML = '';
    document.querySelector('.zalan').innerHTML = '';
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

            const row = document.createElement('div');
            row.style.display = 'flex';
            row.style.justifyContent = 'space-between';
            row.style.alignItems = 'center';

            const textSpan = document.createElement('span');
            textSpan.textContent = `${item.kinek} ${item.mennyiert} Ft ${item.miert}`;

            const deleteSpan = document.createElement('span');
            deleteSpan.textContent = '🗑️';
            deleteSpan.style.cursor = 'pointer';
            deleteSpan.style.fontSize = '1.1rem';
            deleteSpan.style.paddingLeft = '8px';
            deleteSpan.title = 'Törlés';
            deleteSpan.addEventListener('click', () => deleteTartozas(item.id));

            row.appendChild(textSpan);
            row.appendChild(deleteSpan);
            card.appendChild(row);

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

    document.getElementById('miertInput').value = '';
    document.getElementById('mennyiertInput').value = '';
    document.getElementById('kinekInput').selectedIndex = 0;
    document.getElementById('kiTartozikInput').selectedIndex = 0;

    loadTartozasok();
}