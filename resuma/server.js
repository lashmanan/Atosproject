const express = require("express");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const cors = require("cors");
const fs = require("fs");
const mammoth = require("mammoth");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.post("/upload_files", upload.array("files"), uploadFiles);

function uploadFiles(req, res) {
    console.log(req.body);
    console.log(req.files);
    let documentContent = [];

    req.files.forEach((file) => {
        const filePath = file.path;

        const fileExtension = file.originalname.split(".").pop().toLowerCase();

        if (fileExtension === "docx") {
            fs.readFile(filePath, "utf-8", (err, data) => {
                if (err) {
                    console.log("Error reading docx", err);
                    return res
                        .status(500)
                        .json({ error: "Failed to read file" });
                }
                mammoth
                    .extractRawText({ path: `./${filePath}` })
                    .then((result) => {
                        documentContent.push(result.value);
                        
if (documentContent.length === req.files.length) {
                            res.send(generateHTMLTable(documentContent));
                        }
                    })
                    .catch((err) => {
                        console.log("Error while reading from mammoth", err);
                        return res.status(500).json({
                            error: "Failed to extract text from DOCX",
                        });
                    });
            });
        } else {
            return res.status(400).json({
                error: "Unsupported file type. Only DOCX files are supported.",
            });
        }
    });
}
function generateHTMLTable(contentArray) {
    let tableHtml =
        "<table style='border-collapse: collapse; border: 1px solid black;'>";

    // Create an array of headers
    const headers = [
        "Objective",
        "Education",
        "Experience",
        "Skills",
        "References",
    ];

    // Add header row
    tableHtml += "<tr>";
    headers.forEach((header) => {
        tableHtml +=
            "<th style='padding: 10px; border: 1px solid black;'>" +
            header +
            "</th>";
    });
    tableHtml += "</tr>";

    const content = contentArray[0]; // Assuming there's only one element in contentArray
    const sections = content.split(/\n{2,}/); // Split content into sections

    // Add content rows
    tableHtml += "<tr>";
    headers.forEach((header) => {
        const headerIndex = sections.findIndex((section) =>
            section.startsWith(header + ":")
        );
        if (headerIndex !== -1) {
            let content = "";
            for (let i = headerIndex + 1; i < sections.length; i++) {
                if (
                    sections[i].startsWith(
                        headers[
                            (headers.indexOf(header) + 1) % headers.length
                        ] + ":"
                    )
                ) {
                    break;
                }
                content += sections[i] + "<br>";
            }
            tableHtml +=
                "<td style='padding: 10px; border: 1px solid black;'>" +
                content +
                "</td>";
        } else {
            tableHtml +=
                "<td style='padding: 10px; border: 1px solid black;'></td>";
        }
    });
    tableHtml += "</tr>";

    tableHtml += "</table>";

    return tableHtml;
}

app.listen(5000, () => {
    console.log(`Server started...`);
});



