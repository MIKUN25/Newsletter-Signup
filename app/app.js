const express = require("express");
const bodyParser = require("body-parser");
// const request = require("request");
const https = require("https");


const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("Public"));    /*to enable express to get static files on your local pc */

app.get("/", (req,res) => {
    res.sendFile(`${__dirname}/signup.html`);
})

app.post("/", (req,res) => {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    let data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data)

    let url = "https://us21.api.mailchimp.com/3.0/lists/9669611386"
    const options = {
        method: "POST",
        auth: "ayo:553df68da3e04a1b6834a800aea2e03b-us21"
    }

    const request = https.request(url, options, (response) => {

        if (response.statusCode === 200) {
            res.sendFile(`${__dirname}/success.html`)
        }
        else if (response.statusCode != 200) {
            res.sendFile(`${__dirname}/failure.html`)
        }

        response.on("data", (data) => {
            const mailData = JSON.parse(data)
            console.log(mailData);
        });
    });
    // request.write(jsonData);
    request.end();
});


app.post("/failure", (req,res) => {
    res.redirect("/")
})


app.listen(3000, () => {       /*process.env.PORT is a dynamic port in which heroku or what ever platform you are using to host your server will determine on the fly*/
    console.log("Server is running on port 3000");
});