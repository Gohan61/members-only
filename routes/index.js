const express = require("express");
const router = express.Router();

const main_controller = require("../controllers/main");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/signup", main_controller.user_sign_up_get);
router.post("/signup", main_controller.user_sign_up_post);

module.exports = router;
