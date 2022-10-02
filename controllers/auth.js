const { response } = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { generateJwt } = require("../helpers/jwt");

const createUser = async (req, res = response) => {
	const { email, password } = req.body;

	try {
		let user = await User.findOne({ email });

		if (user) {
			return res.status(400).json({
				ok: false,
				msg: "Invalid Credentials",
			});
		}

		user = new User(req.body);

		const salt = bcrypt.genSaltSync();
		user.password = bcrypt.hashSync(password, salt);

		await user.save();

		const token = await generateJwt(user.id, user.name);

		res.status(201).json({
			ok: true,
			uid: user.id,
			name: user.name,
			token,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
		});
	}
};

const login = async (req, res = response) => {
	const { email, password } = req.body;

	try {
		const user = await User.findOne({ email });

		console.log(user);
		if (!user) {
			return res.status(400).json({
				ok: false,
				msg: "Invalid Credentials",
			});
		}

		const validPassword = bcrypt.compareSync(password, user.password);

		if (!validPassword) {
			return res.status(400).json({
				ok: false,
				msg: "Invalid Credentials",
			});
		}

		const token = await generateJwt(user.id, user.name);

		res.json({
			ok: true,
			uid: user.id,
			name: user.name,
			token,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
		});
	}
};

const revalidateToken = async (req, res = response) => {
	const { uid, name } = req;

	const token = await generateJWT(uid, name);

	const user = await User.findById(uid);

	res.json({
		ok: true,
		token,
		uid,
		name: user.name,
	});
};

module.exports = {
	createUser,
	login,
	revalidateToken,
};
