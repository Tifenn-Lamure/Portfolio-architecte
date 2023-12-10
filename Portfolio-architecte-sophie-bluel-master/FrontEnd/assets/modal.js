import { initStateAddPhoto } from "./script.js";

let modalGallery = null;
let modalAddPhoto = null;

const openModalGallery = function (e) {
    e.preventDefault();
    const targetHref = document.querySelector("#modalGallery");
    targetHref.style.display = null;
    targetHref.removeAttribute('aria-hidden');
    targetHref.setAttribute('aria-modal', 'true');
    modalGallery = targetHref;
    modalGallery.addEventListener('click', closeModalGallery);
    modalGallery.querySelector(".modalGallery-close").addEventListener('click', closeModalGallery);
    modalGallery.querySelector(".modalGallery-stop").addEventListener('click', stopPropagation);
}

const closeModalGallery = function (e) {
    if (modalGallery === null) return;
    e.preventDefault();
    modalGallery.style.display = "none";
    modalGallery.setAttribute('aria-hidden', 'true');
    modalGallery.removeAttribute('aria-modal');
    modalGallery.removeEventListener('click', closeModalGallery);
    modalGallery.querySelector('.modalGallery-close').removeEventListener('click', closeModalGallery);
    modalGallery = null;

    initStateAddPhoto();
}

const openModalAddPhoto = function (e) {
    e.preventDefault();
    const targetHref = document.querySelector("#modalAddPhoto");
    targetHref.style.display = null;
    targetHref.removeAttribute('aria-hidden');
    targetHref.setAttribute('aria-modal', 'true');
    modalAddPhoto = targetHref;
    modalAddPhoto.addEventListener('click', closeModalAddPhoto);
    modalAddPhoto.querySelector(".modalAddPhoto-close").addEventListener('click', closeModalAddPhoto);
    modalAddPhoto.querySelector(".modalAddPhoto-stop").addEventListener('click', stopPropagation);
}

const closeModalAddPhoto = function (e) {
    if (modalAddPhoto === null) return;
    e.preventDefault();
    modalAddPhoto.style.display = "none";
    modalAddPhoto.setAttribute('aria-hidden', 'true');
    modalAddPhoto.removeAttribute('aria-modal');
    modalAddPhoto.removeEventListener('click', closeModalAddPhoto);
    modalAddPhoto.querySelector('.modalAddPhoto-close').removeEventListener('click', closeModalAddPhoto);
    modalAddPhoto = null;
}

const stopPropagation = function (e) {
    e.stopPropagation();
}

//pour qu'une seule modale reste ouverte en permanence,
//chaque interaction qui ouvre une modale ferme aussi toutes les autres
let lienModifier = document.querySelectorAll(".modalGallery");
lienModifier.forEach(lien => {
    lien.addEventListener('click', openModalGallery);
    lien.addEventListener('click', closeModalAddPhoto);
});
let lienAjouterPhoto = document.querySelectorAll(".modalAddPhoto");
lienAjouterPhoto.forEach(lien => {
    lien.addEventListener('click', openModalAddPhoto);
    lien.addEventListener('click', closeModalGallery);
});

export {closeModalAddPhoto};