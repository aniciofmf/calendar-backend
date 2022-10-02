const { Router } = require("express");
const { check } = require("express-validator");
const { validateFields } = require("../middlewares/validateFields");
const { validateJwt } = require("../middlewares/validateJwt");
const { createUser, login, revalidateToken } = require("../controllers/auth");

const router = Router();

router.post(
	"/new",
	[
		// middlewares
		check("name", "The Name is required").not().isEmpty(),
		check("email", "The email is required").isEmail(),
		check("password", "The Password must contains at least 6 characters").isLength({ min: 6 }),
		validateFields,
	],
	createUser
);

router.post(
	"/",
	[
		check("email", "The Name is required").isEmail(),
		check("password", "The Password must contains at least 6 characters").isLength({ min: 6 }),
		validateFields,
	],
	login
);

router.get("/renew", validateJwt, revalidateToken);

module.exports = router;
