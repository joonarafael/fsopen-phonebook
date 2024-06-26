const mongoose = require("mongoose");

if (process.argv.length < 3) {
	console.log("Usage: node mongo.js <password>");
	process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://kettujoo:${password}@cluster0.quf7glm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personEntrySchema = new mongoose.Schema({
	id: String,
	name: String,
	number: String,
});

const PersonEntry = mongoose.model("PersonEntry", personEntrySchema);

if (process.argv.length === 5) {
	const name = process.argv[3];
	const number = process.argv[4];

	const person = new PersonEntry({
		id: Math.floor(Math.random() * 1000000),
		name,
		number,
	});

	person.save().then(() => {
		console.log(`Added ${name} with number ${number} to phonebook.`);
		mongoose.connection.close();
	});
} else {
	console.log("Phonebook:");
	PersonEntry.find({}).then((result) => {
		result.forEach((person) => {
			console.log(`${person.name} ${person.number}`);
		});
		mongoose.connection.close();
	});
}
