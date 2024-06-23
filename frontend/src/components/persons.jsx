import recordService from "../services/recordservice";

const Persons = (props) => {
	const handleDelete = (id) => {
		if (window.confirm("Do you really want to remove this person?")) {
			recordService
				.remove(id)
				.then(() => {
					props.setPersons(props.persons.filter((person) => person.id !== id));

					props.setNotification({
						status: "success",
						message: `Record deleted.`,
					});
				})
				.catch((err) => {
					console.log(err);

					props.setNotification({
						status: "error",
						message: "DB operation failed.",
					});
				});
		}
	};

	return (
		<div>
			{props.persons
				.filter((person) =>
					person.name.toLowerCase().includes(props.searchValue.toLowerCase())
				)
				.map((person) => (
					<div
						key={person.id}
						style={{
							display: "flex",
							columnGap: "12px",
						}}
					>
						<p>
							{person.name} {person.number}
						</p>
						<button
							onClick={() => {
								handleDelete(person.id);
							}}
						>
							Delete
						</button>
					</div>
				))}
		</div>
	);
};

export default Persons;
