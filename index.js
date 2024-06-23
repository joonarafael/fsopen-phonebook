const express = require("express");
const PERSONS = require("./db.json");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();

app.use(bodyParser.json());

app.get("/api/persons", (request, response) => {
	response.json(PERSONS);
});

app.get("/api/persons/:id", (request, response) => {
	const id = Number(request.params.id);
	const person = PERSONS["persons"].find((person) => person.id === id);

	console.log(PERSONS["persons"]);
	console.log(person);

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

		response.status(204).end().json({ success: "Record deleted!" });
	} else {
		response.status(404).end().json({ error: "No record with matching ID." });
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

const PORT = 3001;

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
