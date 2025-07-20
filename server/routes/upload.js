const router = require('express').Router();
const uploadCtrl = require('../controllers/uploadCtrl'); // You'll create this next
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin');

// Add the upload POST route
router.post('/upload', auth, authAdmin, uploadCtrl.uploadImage);

module.exports = router;
