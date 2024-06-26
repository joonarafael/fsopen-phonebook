const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

mongoose
	.connect(url)

	.then((result) => {
		console.log("Connected to Atlas");
	})
	.catch((error) => {
		console.log("Error connecting to Atlas:", error.message);
	});

const personEntrySchema = new mongoose.Schema({
	name: String,
	number: String,
});

personEntrySchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

module.exports = mongoose.model("PersonEntry", personEntrySchema);
