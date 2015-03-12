var express = require('express');
var router = express.Router();

//Mail Sending Module
var sendgrid  = require('sendgrid')(user, pass);

//PDF conversion, writing Modules
var fs = require('fs');
var pdf = require('html-pdf');

//ASYNC Module sans callbacks


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Brents Mail Service', age:25 });
});



// router.get('/send-mail', function(req, res){
//   sendgrid.send({
//     to:       'brentoneill@gmail.com',
//     from:     'no-reply@brentocreates.com',
//     subject:  'Test from Node Server',
//     text:     'Testing, testing, 1-2-3. TESTING.',
//     files: [
//       {
//         filename:     'Contract',           // required only if file.content is used.
//         contentType: '.pdf',
//         url:         'http://localhost:9000/tmp/pdf/businesscard.pdf',
//         content:      ('This is the content' | Buffer)
//       }
//     ],
//   }, function(err, json) {
//     if (err) { return res.send(err); }
//     console.log('sent file via email');
//     res.send('WOOHOOO')
//   });
// });
//
// router.get('/create-pdf', function(req, res){
//   res.send('<h1>PDF Generator</h1>');
//
//   var html = fs.readFileSync('./tmp/html/bizcard.html', 'utf8');
//   var options = {
//                   filename: './public/tmp/pdf/businesscard.pdf',
//                   format: 'Letter',
//                   type: 'pdf',
//                   height: '4in',
//                   width: '2in'
//                 };
//
//   pdf.create(html, options).toFile(function(err, res) {
//     if (err) return console.log(err);
//     console.log(res); // { filename: '/tmp/html-pdf-8ymPV.pdf' }
//   });
// });
//
router.get('/generate', function(req, res, next) {
  res.render('generate', { title: 'Generate and Send email' });
});



router.post('/generate-email', function(req, res, next){

  var html = req.body.code;
  var options = {
                  filename: './public/tmp/pdf/' + req.body.filename + '.pdf',
                  format: 'Letter',
                  type: 'pdf',
                  height: '4in',
                  width: '2in'
                };


  pdf.create(html, options).toFile(function(err, res) {
    if (err) return console.log(err);
    console.log(res); // { filename: '/tmp/html-pdf-8ymPV.pdf' }
  });
  setTimeout(function(){
    sendgrid.send({
      to:       req.body.email,
      from:     'no-reply@brentocreates.com',
      subject:  req.body.subject,
      text:     'Testing, testing, 1-2-3. TESTING.',
      files: [
        {
          filename:     req.body.filename + '.pdf',
          contentType: '.pdf',
          url:         'http://localhost:9000/tmp/pdf/' + req.body.filename + '.pdf',
          content:      ('This is the content' | Buffer)
        }
      ],
    }, function(err, json) {
      if (err) { return res.send(err); }
      console.log('sent file via email');
      res.send('WOOHOOO')
    });
  }, 1500);

});





module.exports = router;
