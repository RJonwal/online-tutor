var nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');

let transporter  = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "a4675565cb1dd9",
    pass: "4574e6f43e2c75"
  }
});

let renderTemplate = (token,relativePath) => {
  let mailHTML;
  ejs.renderFile(
      path.join(__dirname, '../views/mailer', relativePath),
      token,
      function(err, template){
          if (err){console.log('error in rendering template',err); return}
          mailHTML = template;
      }
  )
  return mailHTML;
}

module.exports = {
    transporter: transporter,
    renderTemplate: renderTemplate
}