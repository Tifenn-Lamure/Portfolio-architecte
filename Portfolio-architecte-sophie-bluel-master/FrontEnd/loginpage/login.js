let myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

function submitForm() {
    const loginForm = document.querySelector("form");
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const formData = {
            email: document.querySelector("[name=email]").value,
            password: document.querySelector("[name=password]").value,
        };
        const raw = JSON.stringify(formData);

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("http://localhost:5678/api/users/login", requestOptions)
          .then(response => {
            if(!response.ok) throw new Error('Erreur de connexion');
            return response.json();
          })
          .then(result => {
            window.localStorage.setItem("token", result.token);
            window.location.href = "../index.html";
          })
          .catch(error => {
            const badLoginText = document.querySelector("form p");
            badLoginText.classList.add("badLogin");
            badLoginText.classList.remove("hidden");
          });
    });
}

submitForm();