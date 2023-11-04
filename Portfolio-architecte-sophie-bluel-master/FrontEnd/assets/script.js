async function reponseData() {
    const reponse = await fetch("http://localhost:5678/api/works");
    const reponseProjetsArchitecte = await reponse.json();

    let gallery = document.querySelector(".gallery");

    for(let i = 0; i < reponseProjetsArchitecte.length; i++){
        const figure = document.createElement("figure");
        const image = document.createElement("img");
        const figcaption = document.createElement("figcaption");

        let imageUrl = reponseProjetsArchitecte[i].imageUrl

        const indiceDebut = imageUrl.lastIndexOf('/') + 1;
        const indiceFin =  imageUrl.indexOf('1');
        image.src = "assets/images/" + imageUrl.substring(indiceDebut, indiceFin) + ".png";
        image.alt = reponseProjetsArchitecte[i].title;
        figcaption.innerText = reponseProjetsArchitecte[i].title;

        figure.appendChild(image);
        figure.appendChild(figcaption);

        gallery.appendChild(figure);
    }
}

reponseData();