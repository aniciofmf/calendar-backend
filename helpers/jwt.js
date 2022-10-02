const jwt = require("jsonwebtoken");

const generateJwt = (uid, name) => {
	return new Promise((resolve, reject) => {
		const payload = { uid, name };

		jwt.sign(
			payload,
			process.env.SECRET_JWT_SEED,
			{
				expiresIn: "2h",
			},
			(err, token) => {
				if (err) {
					console.log(err);
					reject("The token could not be generated");
				}

				resolve(token);
			}
		);
	});
};

module.exports = {
	generateJwt,
};
