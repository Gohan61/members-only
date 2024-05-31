const express = require("express");
const router = express.Router();

const main_controller = require("../controllers/main");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render(
    "index",
    { title: "Express", user: req.user },
    console.log(req.user)
  );
});

router.get("/signup", main_controller.user_sign_up_get);
router.post("/signup", main_controller.user_sign_up_post);

router.get("/signin", main_controller.user_sign_in_get);
router.post("/signin", main_controller.user_sign_in_post);

router.get("/user/:id/membership", main_controller.user_membership_get);
router.post("/user/:id/membership", main_controller.user_membership_post);

module.exports = router;
