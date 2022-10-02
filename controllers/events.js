const { response } = require("express");
const Event = require("../models/Event");

const getEvents = async (req, res = response) => {
	const events = await Event.find().populate("user", "name");

	res.json({
		ok: true,
		events,
	});
};

const createEvent = async (req, res = response) => {
	const event = new Event(req.body);

	try {
		event.user = req.uid;

		const eventSaved = await event.save();

		res.json({
			ok: true,
			evento: eventSaved,
		});
	} catch (error) {
		res.status(500).json({
			ok: false,
		});
	}
};

const updateEvent = async (req, res = response) => {
	const eventId = req.params.id;
	const uid = req.uid;

	try {
		const event = await Event.findById(eventId);

		if (!event) {
			return res.status(404).json({
				ok: false,
				msg: "The event doesnt exist",
			});
		}

		if (event.user.toString() !== uid) {
			return res.status(401).json({
				ok: false,
				msg: "Invalid ",
			});
		}

		const newEvent = {
			...req.body,
			user: uid,
		};

		const updatedEvent = await Event.findByIdAndUpdate(eventId, newEvent, { new: true });

		res.json({
			ok: true,
			evento: updatedEvent,
		});
	} catch (error) {
		res.status(500).json({
			ok: false,
		});
	}
};

const deleteEvent = async (req, res = response) => {
	const eventoId = req.params.id;
	const uid = req.uid;

	try {
		const event = await Event.findById(eventoId);

		if (!event) {
			return res.status(404).json({
				ok: false,
			});
		}

		if (event.user.toString() !== uid) {
			return res.status(401).json({
				ok: false,
				msg: "Action not allowed",
			});
		}

		await Event.findByIdAndDelete(eventId);

		res.json({ ok: true });
	} catch (error) {
		res.status(500).json({
			ok: false,
		});
	}
};

module.exports = {
	getEvents,
	createEvent,
	updateEvent,
	deleteEvent,
};
