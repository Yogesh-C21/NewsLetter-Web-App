const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const { response } = require('express');
const { request } = require('http');

const app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

// API 9f91fd20c11f2ba2b821cf6646fa419e-us21

// list_id ae97040f2b

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/signup.html');
});

app.post('/', (req, res) => {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;
  const data = {
    members: [
      {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          "FNAME":firstName,
          "LNAME":lastName
        }
      }
    ]
  };
  
  const jsonData = JSON.stringify(data);
  const options = {
    method: "POST",
    auth: "nil:9f91fd20c11f2ba2b821cf6646fa419e-us21"
  }; // HTTPS auth method
  const url = "https:/us21.api.mailchimp.com/3.0/lists/ae97040f2b"; //endpoint url
  const respo = https.request(url, options, (response) => {
    response.on("data", (data) => {
      if (JSON.parse(data).total_created >= 1) {  // check total created using mailchimp api
        res.sendFile(__dirname + '/success.html');
      } else {
        res.sendFile(__dirname + '/failure.html');
      }
    });
  });
  respo.write(jsonData);
  respo.end();
});

app.post('/failure', (req, res) => {
  res.redirect('/');
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Successfully connected to port :: 3000");
});
