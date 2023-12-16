import { closeModalAddPhoto } from "./modal.js";

let myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

let reponse;
let reponseProjetsArchitecte;
let reponseCategories;

let categorySelected = "Tous";

const inputFilePhoto = document.getElementById("filePhoto");
const defaultAddPhotoDisplay = document.querySelector("#defaultAddPhotoDisplay");
const preview = document.querySelector("#preview");
let formAjouterPhoto = document.querySelector(".formAjouterPhoto");
let cardAjouterPhoto = document.querySelector(".cardAjouterPhoto");
const titre = document.querySelector("[name=title]");
const category = document.querySelector("[name=category]");

let fileAjouterPhoto;
let titreValue;
let categoryValue = "-1";

function getToken(){
    return window.localStorage.getItem("token");
}



// fonction qui stocke les valeurs des works que renvoie l'API dans reponseProjetsArchitecte
async function getWorks() {
    reponse = await fetch("http://localhost:5678/api/works");
    reponseProjetsArchitecte = await reponse.json();
}

// fonction qui stocke les valeurs des catégories que renvoie l'API dans reponseCategories
async function getCategories() {
    reponse = await fetch("http://localhost:5678/api/categories");
    reponseCategories = await reponse.json();
}



// fonction qui crée la gallerie de tous les travaux à partir des informations de l'API
function creerTravaux() {
    let gallery = document.querySelector(".gallery");
    // on reset les balises à l'init pour les fois suivantes où on appelle la fonction
    gallery.innerHTML = "";

    for(let i = 0; i < reponseProjetsArchitecte.length; i++){
        const projetArchitecte = reponseProjetsArchitecte[i];
        // on affiche le work si on affiche toutes les catégories
        // OU dans le cas où on a sélectionné une catégorie, on affiche que les works de même catégorie
        if(categorySelected === "Tous" || projetArchitecte.category.name === categorySelected) {
            const figure = document.createElement("figure");
            const image = document.createElement("img");
            const figcaption = document.createElement("figcaption");

            let imageUrl = projetArchitecte.imageUrl;
            image.src = imageUrl;
            image.alt = projetArchitecte.title;

            figcaption.innerText = projetArchitecte.title;

            figure.appendChild(image);
            figure.appendChild(figcaption);

            gallery.appendChild(figure);
        }
    }
}

// fonction qui crée les filtres à partir des catégories récupérées de l'API
function creerFiltres() {
    let filters = document.querySelector(".filters");
    // on reset les balises à l'init pour les fois suivantes où on appelle la fonction
    filters.innerHTML = "";

    // le premier filtre est "Tous", on le gère différemment des catégories
    let span = document.createElement("span");
    span.id = "filter0";
    span.addEventListener("click", changeSelectedFilter);
    span.classList.add("filter");
    span.classList.add("selected");
    span.innerText = "Tous";

    filters.appendChild(span);

    for(let i = 0; i < reponseCategories.length; i++){
        span = document.createElement("span");
        span.id = "filter" + (i+1);
        span.addEventListener("click", changeSelectedFilter);
        span.classList.add("filter");
        span.classList.add("not_selected");
        span.innerText = reponseCategories[i].name;

        filters.appendChild(span);
    }
}

// fonction qui gère la modification des travaux que l'on affiche lorsqu'un filtre est sélectionné
function changeSelectedFilter(event) {
    // on récupère a nouvelle catégorie
    categorySelected = event.target.innerText;
    // on recrée les works avec la nouvelle catégorie comme filtre qui définit les works à afficher
    creerTravaux();

    // on actualise le style des filtres
    let selected = document.querySelector(".selected");
    selected.classList.remove("selected");
    selected.classList.add("not_selected");
    let toSelected = document.querySelector(`#${event.target.id}`);
    toSelected.classList.remove("not_selected");
    toSelected.classList.add("selected");
}



//fonction qui supprime le work X dans la liste des works en utilisant son id
function deleteWork(workIdString) {
    //on récupère le numéro dans l'id. Ex : work1 -> 1
    //longueur de work (4)
    const indiceDebut = 4;
    //longueur de workIdString. Ex : work11 -> 6
    const indiceFin =  workIdString.length;
    //on récupère la sous-chaine avec l'id que l'on convertit en number (integer)
    const workId = parseInt(workIdString.substring(indiceDebut, indiceFin));

    //on prépare la requête DELETE
    let myHeadersDelete = new Headers(); 
    myHeadersDelete.append("Authorization", "Bearer " + getToken());

    const requestOptions = {
        method: 'DELETE',
        headers: myHeadersDelete,
    };

    fetch(`http://localhost:5678/api/works/${workId}`, requestOptions)
        .then(response => {
            if(!response.ok) throw new Error(`Impossible de supprimer le travail d'id ${workId}`);
            return response;
        })
        .catch((error) => {
            console.log('erreur : ', error);
        })

    reponseProjetsArchitecte = reponseProjetsArchitecte.filter((work) => work.id !== workId);

    creerTravaux();
    creerGalerieSuppression();
}

// fonction qui génère la galerie des travaux à supprimer
function creerGalerieSuppression() {
    //on sélectionne la div galerie
    let gallery = document.querySelector(".removeWorks");
    gallery.innerHTML = "";
    //on parcourt tous les projets
    for(let i = 0; i < reponseProjetsArchitecte.length; i++){
        const projetArchitecte = reponseProjetsArchitecte[i];

        const icon = document.createElement("i");
        icon.classList.add("fa-solid", "fa-trash-can", "fa-xs");
        icon.style.color = "white";

        const div = document.createElement("div");
        div.id = "work" + projetArchitecte.id;
        div.classList.add("deleteButton");
        div.addEventListener("click", (e) => {
            deleteWork(e.currentTarget.id);
            e.preventDefault();
            e.stopPropagation();
        });
        
        div.appendChild(icon);

        const image = document.createElement("img");
        image.classList.add("thumbnail");
        let imageUrl = projetArchitecte.imageUrl;
        image.src = imageUrl;
        image.alt = projetArchitecte.title;

        const divParent = document.createElement("div");
        divParent.classList.add("workToDelete");
        divParent.appendChild(image);
        divParent.appendChild(div);

        gallery.appendChild(divParent);
    }
}

//fonction qui gère l'état du bouton Valider (enable ou disable)
function checkEtatBoutonValider() {
    const boutonValider = document.querySelector('[value=Valider]');

    //on désactive le bouton si
    boutonValider.disabled = 
        //titreValue est vide
        !(titreValue 
        //OU si categoryValue vaut -1
        && categoryValue !== "-1"
        //OU si fileAjouterPhoto est vide
        && fileAjouterPhoto);
}

//fonction qui gère l'ajout d'un work
function ajouterPhoto() {
    inputFilePhoto.click();
}

//fonction qui ajoute les options au sélecteur de catégories
function createSelectOptions() {
    const select = document.querySelector("select");
    select.innerHTML = "";

    let option = document.createElement("option");
    option.value = "-1";
    option.innerText = "";
    select.appendChild(option);

    reponseCategories.forEach((category) => {
        option = document.createElement("option");
        option.value = category.id;
        option.innerText = category.name;
        select.appendChild(option);
    });
}

// fonction qui gère le reset des valeurs nécessaires à l'upload
function initStateAddPhoto() {
    //reset des champs du formulaire
    titre.value = "";
    titreValue = "";
    category.value = null;
    categoryValue = "-1";
    fileAjouterPhoto = null;

    document.querySelector("#photoAdded").innerText = "";

    checkEtatBoutonValider();

    defaultAddPhotoDisplay.style.display = null;
    preview.style.display = "none";
}



// fonction qui setup tous les objets (galleries, filtres, selecteur d'options) qui dépendent des valeurs 
// retournées par l'API
async function setupWorksCategoriesFilters() {
    await getWorks();
    await getCategories();    

    creerTravaux();
    creerFiltres();
    creerGalerieSuppression();
    createSelectOptions();
}

//on exécute la fonction pour que par défaut le bouton soit désactivé
checkEtatBoutonValider();

setupWorksCategoriesFilters();



inputFilePhoto.addEventListener("input", _ => {
    //inputFilePhoto.files retourne un array, notre fichier est le premier élément
    fileAjouterPhoto = (inputFilePhoto.files)[0];

    preview.style.display = "block";
    preview.file = fileAjouterPhoto;

    const readerURL = new FileReader();
    readerURL.onload = (e) => {
        preview.src = e.target.result;
    }
    readerURL.readAsDataURL(fileAjouterPhoto);

    defaultAddPhotoDisplay.style.display = "none";

    checkEtatBoutonValider();
    document.querySelector("#photoAdded").innerText = `${fileAjouterPhoto.name} sélectionné`;
});

formAjouterPhoto.addEventListener("submit", (event) => {
    let formData = new FormData(formAjouterPhoto);

    let myHeadersPost = new Headers(); 
    myHeadersPost.append("Authorization", "Bearer " + getToken());
    myHeadersPost.append("Accept", "application/json");

    var requestOptions = {
        method: 'POST',
        headers: myHeadersPost,
        body: formData,
    };

    fetch("http://localhost:5678/api/works", requestOptions)
        .then(response => {
            if(!response.ok) throw new Error('Erreur lors de la télétransmission');
            return response.json();
        })
        .then(_ => {
            closeModalAddPhoto(event);

            initStateAddPhoto();
            setupWorksCategoriesFilters();
        })

    event.preventDefault();
});

cardAjouterPhoto.addEventListener('click', ajouterPhoto);

titre.addEventListener("input", () => {
    //on stocke la valeur du champ pour gérer l'état disabled du bouton valider
    titreValue = titre.value;
    checkEtatBoutonValider();
});

category.addEventListener("input", () => {
    //idem que pour titre
    categoryValue = category.value;
    checkEtatBoutonValider();
});

export {initStateAddPhoto};