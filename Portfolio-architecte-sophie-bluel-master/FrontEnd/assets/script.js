let reponse;
let reponseProjetsArchitecte;
let reponseCategories;

let categorySelected = "Tous";

function creerTravaux() {
    let gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";

    for(let i = 0; i < reponseProjetsArchitecte.length; i++){
        const projetArchitecte = reponseProjetsArchitecte[i];
        if(categorySelected === "Tous" || projetArchitecte.category.name === categorySelected) {
            const figure = document.createElement("figure");
            const image = document.createElement("img");
            const figcaption = document.createElement("figcaption");

            let imageUrl = projetArchitecte.imageUrl;

            const indiceDebut = imageUrl.lastIndexOf('/') + 1;
            const indiceFin =  imageUrl.indexOf('1');
            image.src = "assets/images/" + imageUrl.substring(indiceDebut, indiceFin) + ".png";
            image.alt = projetArchitecte.title;
            figcaption.innerText = projetArchitecte.title;

            figure.appendChild(image);
            figure.appendChild(figcaption);

            gallery.appendChild(figure);
        }
    }
}

function changeSelectedFilter(event) {
    categorySelected = event.target.innerText;
    creerTravaux();

    let selected = document.querySelector(".selected");
    selected.classList.remove("selected");
    selected.classList.add("not_selected");
    let toSelected = document.querySelector(`#${event.target.id}`);
    toSelected.classList.remove("not_selected");
    toSelected.classList.add("selected");
}

function creerFiltres() {
    let filters = document.querySelector(".filters");

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
        span.addEventListener("click",changeSelectedFilter);
        span.classList.add("filter");
        span.classList.add("not_selected");
        span.innerText = reponseCategories[i].name;
        filters.appendChild(span);
    }
}

// fonction qui génère la galerie des travaux à supprimer
function creerGalerieSuppression() {
    //on sélectionne la div galerie
    let gallery = document.querySelector(".removeWorks");
    //on parcourt tous les projets
    for(let i = 0; i < reponseProjetsArchitecte.length; i++){
        const projetArchitecte = reponseProjetsArchitecte[i];

        const icon = document.createElement("i");
        icon.classList.add("fa-solid");
        icon.classList.add("fa-trash-can");
        icon.classList.add("fa-xs");
        icon.style.color = "white";

        const div = document.createElement("div");
        div.classList.add("deleteButton");
        div.appendChild(icon);

        const image = document.createElement("img");
        image.classList.add("thumbnail");
        let imageUrl = projetArchitecte.imageUrl;
        const indiceDebut = imageUrl.lastIndexOf('/') + 1;
        const indiceFin =  imageUrl.indexOf('1');
        image.src = "assets/images/" + imageUrl.substring(indiceDebut, indiceFin) + ".png";
        image.alt = projetArchitecte.title;

        const divParent = document.createElement("div");
        divParent.classList.add("workToDelete");
        divParent.appendChild(image);
        divParent.appendChild(div);

        gallery.appendChild(divParent);
    }
}

async function reponseData() {
    reponse = await fetch("http://localhost:5678/api/works");
    reponseProjetsArchitecte = await reponse.json();

    reponse = await fetch("http://localhost:5678/api/categories");
    reponseCategories = await reponse.json();

    creerTravaux();
    creerFiltres();
    creerGalerieSuppression();
}

reponseData();