const app = require("express")();
const bodyParser = require("body-parser");
const nunjucks = require("nunjucks");
const Vonage = require("@vonage/server-sdk");

const dotenv = require("dotenv");
const { response } = require("express");
dotenv.config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
nunjucks.configure("views", { express: app });

const vonage = new Vonage({
   apiKey: process.env.VONAGE_API_KEY,
   apiSecret: process.env.VONAGE_API_SECRET,
});

app.get("/", (req, res) => {
   res.render("index.html", { message: "Hello, world!" });
});

// app.post("/verify", (req, res) => {
//    vonage.verify.request(
//       {
//          number: req.body.number,
//          brand: "Vonage Demo",
//       },
//       (error, result) => {
//          if (result.status != 0 && result.status != 10) {
//             res.render("index.html", { message: result.error_text });
//          } else {
//             res.render("check.html", { requestId: result.request_id });
//          }
//       }
//    );
// });

app.post("/verify", (req, res) => {
   console.log(req.body); // number: '15754947093', choice: 'text' }
   let workflow = 6; // SMS
   if (req.body.choice == "call") {
      workflow = 7; // Text-To-Speach
   }

   vonage.verify.request(
      {
         number: req.body.number,
         brand: "Vonage Demo",
         workflow_id: workflow,
      },
      (error, result) => {
         if (result.status != 0 && result.status != 10) {
            res.render("index.html", { message: result.error_text });
         } else {
            res.render("check.html", { requestId: result.request_id });
         }
      }
   );
});

app.post("/check", (req, res) => {
   vonage.verify.check(
      {
         request_id: req.body.requestId,
         code: req.body.code,
      },
      (error, result) => {
         if (result.status != 0) {
            res.render("index.html", { message: result.error_text });
         } else {
            res.render("success.html");
         }
      }
   );
});

// app.post("/cancel", (req, res) => {
//    vonage.verify.control(
//       {
//          request_id: req.body.requestId,
//          cmd: "cancel",
//       },
//       (error, result) => {
//          if (error) return console.log("Error", error);

//          console.log("/cancel", result);

//          if (result.status != 0) {
//             return response.render("index.html", {
//                message: result.error_text,
//             });
//          } else {
//             return response.render("index.html", {
//                message: "Request has been cancelled",
//             });
//          }
//       }
//    );
// });

app.listen(3000);
