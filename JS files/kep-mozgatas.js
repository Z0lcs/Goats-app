if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then(() => console.log('Service Worker regisztrálva'));
}

const BUCKET_NEV = 'kepek';

let kepekLista = [];
let currentIndex = 0;

async function betoltKepek() {
    const { data, error } = await _supabase
        .storage
        .from(BUCKET_NEV)
        .list('', {
            sortBy: { column: 'name', order: 'asc' }
        });

    if (error) {
        console.error('Hiba a képek betöltésekor:', error);
        return;
    }

    const fajlok = data.filter(item => item.id !== null);

    kepekLista = fajlok.map(fajl => {
        const { data: publicData } = _supabase
            .storage
            .from(BUCKET_NEV)
            .getPublicUrl(fajl.name);
        return publicData.publicUrl;
    });

    if (kepekLista.length === 0) {
        console.warn('Nincs kép a bucketben:', BUCKET_NEV);
        return;
    }

    if (currentIndex >= kepekLista.length) {
        currentIndex = 0;
    }

    frissitGaleria();
}

function frissitGaleria() {
    const elemBal = document.getElementById("kepBal");
    const elemKozep = document.getElementById("kepKozep");
    const elemJobb = document.getElementById("kepJobb");

    if (!elemBal || !elemKozep || !elemJobb) return;
    if (kepekLista.length === 0) return;

    let balIndex = (currentIndex - 1 + kepekLista.length) % kepekLista.length;
    let jobbIndex = (currentIndex + 1) % kepekLista.length;

    elemBal.src = kepekLista[balIndex];
    elemKozep.src = kepekLista[currentIndex];
    elemJobb.src = kepekLista[jobbIndex];
}

function eloKep() {
    if (kepekLista.length === 0) return;
    currentIndex = (currentIndex + 1) % kepekLista.length;
    frissitGaleria();
}

function kovKep() {
    if (kepekLista.length === 0) return;
    currentIndex = (currentIndex - 1 + kepekLista.length) % kepekLista.length;
    frissitGaleria();
}

function nyisdMegFajlValasztot() {
    const fajlInput = document.getElementById('kepFeltoltesInput');
    if (fajlInput) fajlInput.click();
}

async function feltoltKepek(event) {
    const fajlok = event.target.files;
    if (!fajlok || fajlok.length === 0) return;

    const gomb = document.getElementById('kepFeltoltesGomb');
    if (gomb) {
        gomb.classList.add('feltoltes-folyamatban');
        gomb.setAttribute('aria-busy', 'true');
    }

    for (const fajl of fajlok) {
        const kiterjesztes = fajl.name.split('.').pop();
        const egyediNev = `${Date.now()}-${Math.round(Math.random() * 1e6)}.${kiterjesztes}`;

        const { error } = await _supabase
            .storage
            .from(BUCKET_NEV)
            .upload(egyediNev, fajl);

        if (error) {
            console.error('Hiba a feltöltéskor:', error);
            alert(`Nem sikerült feltölteni: ${fajl.name}`);
        }
    }

    event.target.value = '';

    if (gomb) {
        gomb.classList.remove('feltoltes-folyamatban');
        gomb.removeAttribute('aria-busy');
    }

    await betoltKepek();
}

document.addEventListener("DOMContentLoaded", function () {
    betoltKepek();

    const fajlInput = document.getElementById('kepFeltoltesInput');
    if (fajlInput) {
        fajlInput.addEventListener('change', feltoltKepek);
    }
});