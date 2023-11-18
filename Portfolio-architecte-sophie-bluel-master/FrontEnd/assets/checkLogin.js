const login = document.querySelector("#login");
const logout = document.querySelector("#logout");

const modifier = document.querySelector("#modifier");

// fonction qui vérifie si un user est connecté
function checkIfUserLogged() {
    //par défaut aucun user est connecté : on cache le login et le lien modifier pour ouvrir la modale de modification
    logout.style.display = "none";
    modifier.style.display = "none";
    //on regarde si un token a été enregistré
    const token = window.localStorage.getItem("token");
    //si on a un token...
    if(token !== null) {
        //on affiche le logout
        logout.style.display = null;
        //on cache le login
        login.style.display = "none";
        //on teste si le user connecté est le userId 1 (admin ?)
        const userId = parseInt(window.localStorage.getItem("userId")); // parseInt pour convertir le string sauvegardé dans le localStorage en int
        if(userId === 1) {
            //on affiche le lien "modifier"
            modifier.style.display = null;
        }
    }
    else {
        //on affiche le login
        login.style.display = null;
        //on cache le logout
        logout.style.display = "none";
    }
}

checkIfUserLogged();

//on ajoute un évènement au clic sur logout pour déconnecter le user
logout.addEventListener("click", () => {
    //on supprime le token et le userId
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("userId");
    //on recharge la page
    location.reload();
});