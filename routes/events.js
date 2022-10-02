const { Router } = require("express");
const { check } = require("express-validator");

const { isDate } = require("../helpers/isDate");
const { validateFields } = require("../middlewares/validateFields");
const { validateJwt } = require("../middlewares/validateJwt");
const { getEvents, createEvent, updateEvent, deleteEvent } = require("../controllers/events");

const router = Router();

router.use(validateJwt);

router.get("/", validateJwt, getEvents);

router.post(
	"/",
	[
		check("title", "The Title si required").not().isEmpty(),
		check("start", "The Start Date is required").custom(isDate),
		check("end", "The End Date is required").custom(isDate),
		validateFields,
	],
	createEvent
);

// Actualizar Evento
router.put(
	"/:id",
	[
		check("title", "The Title si required").not().isEmpty(),
		check("start", "The Start Date is required").custom(isDate),
		check("end", "The End Date is required").custom(isDate),
		validateFields,
	],
	updateEvent
);

// Borrar evento
router.delete("/:id", deleteEvent);

module.exports = router;
