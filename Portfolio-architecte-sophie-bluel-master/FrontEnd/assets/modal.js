let modal = null;

const openModal = function (e) {
    e.preventDefault();
    const targetHref = document.querySelector(e.currentTarget.getAttribute('href'));
    targetHref.style.display = null;
    targetHref.removeAttribute('aria-hidden');
    targetHref.setAttribute('aria-modal', 'true');
    modal = targetHref;
    modal.addEventListener('click', closeModal);
    modal.querySelector(".js-modal-close").addEventListener('click', closeModal);
    modal.querySelector(".js-modal-stop").addEventListener('click', stopPropagation);
}

const closeModal = function (e) {
    if (modal === null) return;
    e.preventDefault();
    modal.style.display = "none";
    modal.setAttribute('aria-hidden', 'true');
    modal.removeAttribute('aria-modal');
    modal.removeEventListener('click', closeModal);
    modal.querySelector('.js-modal-close').removeEventListener('click', closeModal);
    modal = null;
}

const stopPropagation = function (e) {
    e.stopPropagation();
}

let lienModal = document.querySelectorAll(".js-modal");
lienModal.forEach(a => {
    a.addEventListener('click', openModal);
});