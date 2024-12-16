var express = require('express');
var router = express.Router();
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const path = require("path");
var app = express();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const originalName = path.basename(file.originalname, path.extname(file.originalname));
      const extension = path.extname(file.originalname); 
      cb(null, `${originalName}-${uniqueSuffix}${extension}`); 
    }
  });


  const fileFilter = (req, file, cb) => {
    const allowed = ['image/png','image/jpeg'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true); 
    } else {
      cb(new Error('Bakarrik PNG eta JPG fitxategiak onartzen dira.'), false); 
    }
  };

  const limits = {
    fileSize: 2 * 1024 * 1024,
  };

  const uploadIm = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: limits,
  });

/* GET home page. */
router.get('/', function(req, res, next) {
    res.redirect('form.html');
});

router.post('/', uploadIm.single('avatar'), function (req, res, next) {

    // req.body will hold the text fields, if there were any
    const izena = req.body.name;
    const fileUrl = `http://localhost:3000/uploads/${req.file.filename}`;
    console.log(`Zure izena: ${izena}. Fitxategia: ${fileUrl}`)
    res.send(`Zure izena: ${izena}. Fitxategia: <a href="${fileUrl}" target="_blank">${fileUrl}</a>`)
})


router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    
    if (err.code === 'LIMIT_FILE_SIZE') {
      res.status(400).send('Ezin dira 2MB baino gehiagoko fitxategiak sartu.');
    } else {
      res.status(400).send('Errorea fitxategia igotzerakoan.');
    }
  } else if (err) {
    
    res.status(400).send(err.message);
  } else {
    next();
  }
});

module.exports = router;
