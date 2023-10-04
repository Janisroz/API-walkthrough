const API_KEY = "s4omec5S8l__EM5VB_Wi2m8mov0"
const API_URL = "https://ci-jshint.herokuapp.com/api"
const resultsModal = new bootstrap.Modal(document.getElementById("resultsModal"))

document.getElementById("status").addEventListener("click", e => getStatus(e))

async function getStatus(e) {
    const queryString = `${API_URL}?api_key=${API_KEY}`;

    const response =await fetch(queryString);

    const data = await response.json();

    if (response.ok) {
        displayStatus(data)
    }else {
        throw new Error(data.error);
    }
}

function displayStatus(data) {
    let modalHead = document.getElementById("resultsModalTitle")
    modalHead.innerText = "API Key Status"

    let modalBody = document.getElementById("results-content")

    modalBody.innerHTML = `<p>Your key is valid until <br>${data.expiry}<p>`

    resultsModal.show();
}