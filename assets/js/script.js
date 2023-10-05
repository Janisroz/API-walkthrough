const API_KEY = "s4omec5S8l__EM5VB_Wi2m8mov0"
const API_URL = "https://ci-jshint.herokuapp.com/api"
const resultsModal = new bootstrap.Modal(document.getElementById("resultsModal"))

document.getElementById("status").addEventListener("click", e => getStatus(e))
document.getElementById("submit").addEventListener("click", e => postForm(e))

function processOptions(form) {
    let optArray = [];
    for (let entry of form.entries()) {
        if (entry[0] === "options"){
            optArray.push(entry[1]);
        }
    }
    form.delete("options");
    form.append("options", optArray.join());
    return form;
}

async function postForm(e) {
    const form = processOptions(new FormData(document.getElementById("checksform")));

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Authorization": API_KEY,
        },
        body: form,
    })

    const data = await response.json();

    if (response.ok) {
        displayErrors(data);
    } else {
        displayException(data);
        throw new Error(data.error);
    }
}

function displayException(data) {
    let exception = `<div class ="exception">The API returned status code ${data.status_code}<br>`;
    exception += `Error number: ${data.error_no}<br>`;
    exception += `Error text: ${data.error}</div>`;

    document.getElementById("resultsModalTitle").innerText = "An exception Occured";
    document.getElementById("results-content").innerHTML = exception;
    resultsModal.show();
}

function displayErrors(data) {
    let heading = `JSHint Results for ${data.file}`;

    if (data.total_errors === 0){
        results = `<div class = "no_erros">No errors reported!</div>`;
    } else {
        results = `<div>Total Errors: <span ckass = "error_count">${data.total_errors}</span></div>`
        for (let error of data.error_list) {
            results += `<div>At line <span class="line">${error.line}</span>, `;
            results += `column <span class = "column">${error.col}</span></div>`;
            results += `<div class="error">${error.error}</div>`;
        }

    document.getElementById("resultsModalTitle").innerText = heading
    document.getElementById("results-content").innerHTML = results
    resultsModal.show();
    }
}

async function getStatus(e) {
    const queryString = `${API_URL}?api_key=${API_KEY}`;

    const response = await fetch(queryString);

    const data = await response.json();

    if (response.ok) {
        displayStatus(data)
    } else {
        displayException(data);
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

