if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then(() => console.log('Service Worker regisztrálva'));
}

const kepekLista = [
    "Images/Fecó.jpg",
    "Images/icon-192.png",
    "Images/icon-512.png",
];

let currentIndex = 0;

function frissitGaleria() {
    const elemBal = document.getElementById("kepBal");
    const elemKozep = document.getElementById("kepKozep");
    const elemJobb = document.getElementById("kepJobb");

    if (!elemBal || !elemKozep || !elemJobb) return;

    let balIndex = (currentIndex - 1 + kepekLista.length) % kepekLista.length;
    let jobbIndex = (currentIndex + 1) % kepekLista.length;

    elemBal.src = kepekLista[balIndex];
    elemKozep.src = kepekLista[currentIndex];
    elemJobb.src = kepekLista[jobbIndex];
}

function eloKep() {
    currentIndex = (currentIndex + 1) % kepekLista.length;
    frissitGaleria(); 
}

function kovKep() {
    currentIndex = (currentIndex - 1 + kepekLista.length) % kepekLista.length;
    frissitGaleria();
}

document.addEventListener("DOMContentLoaded", function () {
    frissitGaleria();
});