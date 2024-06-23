import { useEffect, useState } from "react";
import Search from "./components/search";
import AddNewForm from "./components/addnewform";
import Persons from "./components/persons";
import Notification from "./components/notification";

import recordService from "./services/recordservice";

const App = () => {
	const [persons, setPersons] = useState([]);
	const [searchValue, setSearchValue] = useState("");
	const [notification, setNotification] = useState({
		status: "success",
		message: "",
	});

	useEffect(() => {
		recordService.getAll().then((initialPersons) => {
			setPersons(initialPersons);
		});
	}, []);

	useEffect(() => {
		setTimeout(() => {
			setNotification({
				status: "success",
				message: "",
			});
		}, 5000);
	}, [notification]);

	return (
		<div>
			<h2>Phonebook</h2>
			<Notification
				status={notification.status}
				message={notification.message}
			/>
			<Search searchValue={searchValue} setSearchValue={setSearchValue} />
			<h2>Add a new</h2>
			<AddNewForm
				persons={persons}
				setPersons={setPersons}
				setNotification={setNotification}
			/>
			<h2>Numbers</h2>
			<Persons
				persons={persons}
				setPersons={setPersons}
				searchValue={searchValue}
				setNotification={setNotification}
			/>
		</div>
	);
};

export default App;
