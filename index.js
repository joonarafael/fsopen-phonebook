require("dotenv").config();

const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const fs = require("fs");
const morgan = require("morgan");
const path = require("path");
const PersonEntry = require("./models/person");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(
	morgan(":method :url :status :res[content-length] - :response-time ms")
);

const errorHandler = (error, request, response, next) => {
	console.error(error.message);

	if (error.name === "CastError") {
		return response.status(400).send({ error: "malformatted id" });
	}

	next(error);
};

app.get("/api/persons", (request, response, next) => {
	PersonEntry.find({})
		.then((result) => {
			const typeSafe = {
				persons: result,
			};
			response.json(typeSafe);
		})
		.catch((error) => next(error));
});

app.get("/api/persons/:id", (request, response, next) => {
	const id = request.params.id;

	PersonEntry.findById(id)
		.then((result) => {
			if (result) {
				response.json(result);
			} else {
				response.status(404).end();
			}
		})
		.catch((error) => next(error));
});

app.post("/api/persons", (request, response, next) => {
	const { name, number } = request.body;

	if (!name || !number) {
		return response.status(400).json({ error: "Name or number is missing." });
	}

	let existing = false;

	PersonEntry.findOne({ name: name })
		.then((result) => {
			if (result) {
				existing = true;
			}
		})
		.catch((error) => next(error));

	if (existing) {
		return response.status(400).json({ error: "Name is already in use." });
	}

	const newPersonEntry = new PersonEntry({
		name: name,
		number: number,
	});

	newPersonEntry.save().then((savedNewPersonEntry) => {
		response.json(savedNewPersonEntry);
	});
});

app.put("/api/persons/:id", (request, response, next) => {
	const { id, name, number } = request.body;

	if (!id || !name || !number) {
		return response
			.status(400)
			.json({ error: "ID, name or number is missing." });
	}

	PersonEntry.findByIdAndUpdate(id, { number: number })
		.then((result) => {
			if (result) {
				response.json(result);
			}
		})
		.catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
	const id = request.params.id;

	PersonEntry.findByIdAndDelete(id)
		.then(() => {
			response.status(204).end();
		})
		.catch((error) => next(error));
});

app.get("/info", (request, response, next) => {
	PersonEntry.countDocuments({})
		.then((count) => {
			response.send(`
				<div>
					<p>Phonebook has info for ${count} people</p>
					<p>${new Date()}</p>
				</div>
			`);
		})
		.catch((error) => next(error));
});

app.use(express.static(path.join(__dirname, "build")));
app.use(errorHandler);
app.use((req, res) => {
	res.status(404).json({ error: "Unknown request" });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
