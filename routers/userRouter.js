const {Router} = require("express");
const userController = require("../controllers/userController");

const router = new Router();

router.post('/registration', userController.registration);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.post('/refresh', userController.refresh);

module.exports = router;