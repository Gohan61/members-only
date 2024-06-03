const express = require("express");
const router = express.Router();

const main_controller = require("../controllers/main");

/* GET home page. */
router.get("/", main_controller.home_get);
router.post("/", main_controller.home_post);

router.get("/signup", main_controller.user_sign_up_get);
router.post("/signup", main_controller.user_sign_up_post);

router.get("/signin", main_controller.user_sign_in_get);
router.post("/signin", main_controller.user_sign_in_post);

router.get("/logout", main_controller.logout_get);

router.get("/user/:id/admin", main_controller.user_admin_get);
router.post("/user/:id/admin", main_controller.user_admin_post);

router.get("/user/:id/membership", main_controller.user_membership_get);
router.post("/user/:id/membership", main_controller.user_membership_post);

router.get("/user/:id/create-message", main_controller.user_createMessage_get);
router.post(
  "/user/:id/create-message",
  main_controller.user_createMessage_post
);

module.exports = router;
