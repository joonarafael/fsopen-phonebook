import { useState } from "react";

import recordService from "../services/recordservice";

const AddNewForm = (props) => {
	const [newName, setNewName] = useState("");
	const [newNumber, setNewNumber] = useState("");

	const addPerson = (event) => {
		event.preventDefault();

		if (!newName || !newNumber) {
			alert("Please enter a name and number");
			return;
		}

		const personObject = {
			name: newName,
			number: newNumber,
		};

		const existingPerson = props.persons.find(
			(person) => person.name === newName
		);

		if (existingPerson) {
			if (
				window.confirm(
					`${existingPerson.name} is already added to the phonebook, replace the old number with a new one?`
				)
			) {
				personObject.id = existingPerson.id;

				recordService
					.update(existingPerson.id, personObject)
					.then((returnedPerson) => {
						props.setPersons(
							props.persons.map((person) =>
								person.id !== returnedPerson.id ? person : returnedPerson
							)
						);

						props.setNotification({
							status: "success",
							message: `Updated number for ${returnedPerson.name}.`,
						});
					})
					.catch((err) => {
						if (err.response.data.error) {
							props.setNotification({
								status: "error",
								message: err.response.data.error,
							});
						} else {
							props.setNotification({
								status: "error",
								message: `DB operation failed.`,
							});
						}
					});

				return;
			} else {
				return;
			}
		}

		recordService
			.create(personObject)
			.then((returnedPerson) => {
				props.setPersons(props.persons.concat(returnedPerson));

				setNewName("");
				setNewNumber("");

				props.setNotification({
					status: "success",
					message: `Added ${returnedPerson.name} to the phonebook!`,
				});
			})
			.catch((err) => {
				if (err.response.data.error) {
					props.setNotification({
						status: "error",
						message: err.response.data.error,
					});
				} else {
					props.setNotification({
						status: "error",
						message: `DB operation failed.`,
					});
				}
			});
	};

	return (
		<form onSubmit={addPerson}>
			<div>
				name:{" "}
				<input value={newName} onChange={(e) => setNewName(e.target.value)} />
			</div>
			<div>
				number:{" "}
				<input
					value={newNumber}
					onChange={(e) => setNewNumber(e.target.value)}
				/>
			</div>
			<div>
				<button type="submit">add</button>
			</div>
		</form>
	);
};

export default AddNewForm;
