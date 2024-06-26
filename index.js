const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(
	morgan(":method :url :status :res[content-length] - :response-time ms")
);

app.get("/api/persons", (request, response) => {
	response.json(PERSONS);
});

app.get("/api/persons/:id", (request, response) => {
	const id = Number(request.params.id);
	const person = PERSONS["persons"].find((person) => person.id === id);

	if (person) {
		response.send(`
            <div>
                <p>${person.name}</p>
                <p>${person.number}</p>
            </div>
        `);
	} else {
		response.status(404).end();
	}
});

app.post("/api/persons", (request, response) => {
	const { name, number } = request.body;

	if (!name || !number) {
		return response.status(400).json({ error: "Name or number is missing." });
	}

	const existing = PERSONS["persons"].find((person) => person.name === name);

	if (existing) {
		return response.status(400).json({ error: "Name is already in use." });
	}

	let id;

	do {
		id = Math.floor(Math.random() * 1000000);
	} while (PERSONS["persons"].some((person) => person.id === id));

	const newPerson = {
		id,
		name,
		number,
	};

	PERSONS["persons"].push(newPerson);

	fs.writeFileSync("./db.json", JSON.stringify(PERSONS, null, 2));

	response.status(201).json(newPerson);
});

app.delete("/api/persons/:id", (request, response) => {
	const id = Number(request.params.id);
	const personIndex = PERSONS["persons"].findIndex(
		(person) => person.id === id
	);

	if (personIndex !== -1) {
		PERSONS["persons"].splice(personIndex, 1);

		fs.writeFileSync("./db.json", JSON.stringify(PERSONS, null, 2));

		response.status(204).json({ success: "Record deleted!" });
	} else {
		response.status(404).json({ error: "No record with matching ID." });
	}
});

app.get("/info", (request, response) => {
	response.send(`
		<div>
			<p>Phonebook has info for ${PERSONS["persons"].length} people</p>
			<p>${new Date()}</p>
		</div>
	`);
});

app.use(express.static(path.join(__dirname, "build")));

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
