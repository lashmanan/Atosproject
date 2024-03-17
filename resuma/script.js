// script.js
const form = document.getElementById("form");
const tableContainer = document.getElementById("parsedContent");
form.addEventListener("submit", submitForm);

function submitForm(e) {
    e.preventDefault();
    const name = document.getElementById("name");
    const files = document.getElementById("files");
    const formData = new FormData();
    formData.append("name", name.value);
    for (let i = 0; i < files.files.length; i++) {
        formData.append("files", files.files[i]);
    }
    fetch("http://localhost:5000/upload_files", {
        method: "POST",
        body: formData,
    })
        .then((res) => {
            if (!res.ok) {
                throw new Error("Something went wrong", err);
            }
            return res.text();
        })
        .then((html) => {
            tableContainer.innerHTML = html;
        })
        .catch((err) => ("Error occured", err));
}
