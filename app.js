
const express = require ("express");
const bodyParser = require ("body-parser");
const app = express();
const https = require("https");
const mailchimp = require("@mailchimp/mailchimp_marketing");
const listId = "0e2fd8bd5d";

mailchimp.setConfig({
  apiKey: "82d296af8bf2faa91e1971a8556c284c-us13",
  server: "us13",
});

app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:true}))

app.listen(3000, (req,res) =>{
  console.log("Server is up and running on port 3000.");
})

app.get("/", (req,res) => {
  res.sendFile(__dirname + "/signup.html");
})

app.post("/", (req,res) => {
  var firstName = req.body.fName;
  var lastName = req.body.lName;
  var userEmail = req.body.userEmail;

  async function run() {
    const response = await mailchimp.lists.addListMember(listId, {
      email_address: userEmail,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    });
    var status = response.status;
    res.sendFile(__dirname + "/success.html");

  }

  run().catch((err) => {
    res.sendFile(__dirname + "/failure.html");
  });
})

app.post("/failure", (req,res) => {
  res.redirect("/");
})
