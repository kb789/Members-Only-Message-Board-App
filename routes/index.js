const express = require("express");
const router = express.Router();

const user_controller = require("../controllers/usercontroller");
const post_controller = require("../controllers/post_controller");

// GET home page.
router.get("/", post_controller.post_list);

router.get("/sign_up", user_controller.sign_up_get);

router.post("/sign_up", user_controller.sign_up_post);

router.get("/log-in", user_controller.log_in_get);

router.post("/log-in", user_controller.log_in_post);

router.get("/log-out", user_controller.log_out_get);

router.get("/add-post", post_controller.get_new_post);

router.post("/add-post", post_controller.add_new_post);

router.get("/join", post_controller.get_join);

router.post("/join", post_controller.post_join);

router.get("/admin", post_controller.get_admin);

router.post("/admin", post_controller.post_admin);

router.post("/post/:id/delete", post_controller.delete_post);

module.exports = router;
