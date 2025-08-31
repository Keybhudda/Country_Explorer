const { error } = require("console");
const fs = require("fs");
const path = require("path");
const { fetchCountries } = require("./countries-services");

function getContentType(extname) {
    switch (extname) {
       case ".js":
            return "text/javascript";
        case ".css":
            return "text/css";
        case ".json":
            return "application/json";
        case ".png":
            return "image/png";
        case ".jpg":
        case ".jpeg":
            return "image/jpeg";
        default:
            return "text/html"; 
    }
}

function readAndServe(filePath, contentType, res) {
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === "ENOENT") {
                fs.readFile(path.join(__dirname, "public", "404.html"), (err404, notFoundContent) => {
                  res.writeHead(404, { "Content-Type": "text/html" });
                  res.end(notFoundContent, "utf8");  
                });
            } else {
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`);
            }
        }   else {
            res.writeHead(200, { "Content-Type": contentType });
            res.end(content, "utf8");
        }
    });
    console.log()
}

function handleRequest(req, res) {
    console.log(`Requet for: ${req.url}`);
    

    if (req.url === "/api/welcome") {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("Welcome to Country Explorer");
        
    }

    if (req.url === "/api/countries" && req.method === "GET") {
        console.log("Fecthing countries...");
        fetchCountries()
            .then((countries) => {
                if (countries) {
                    console.log("Amount of Countries:", countries.length);
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify(countries));
                } else {
                    res.writeHead(500 , { "Content-Type": "application/json" });
                    res.end(JSON.stringify({error: "Response data is null"}));
                }
            })
            .catch((error) => {
                console.error("Error fetching countries:", error);
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({error: "Failed to fetch data "}));
            });

            
            return;
            
    }

   const parsedUrl = req.url.split("?")[0];  // remove query string
    let filePath = path.join(__dirname, "public", parsedUrl === "/" ? "index.html" : parsedUrl);
    let extname = path.extname(filePath);
    let contentType = getContentType(extname);
    
    readAndServe(filePath, contentType, res);
}

module.exports = { handleRequest };