import axios from "axios";

const BASE_URL = "https://fsopen-phonebook-hdvt.onrender.com/api/persons";

const getAll = () => {
	const request = axios.get(BASE_URL);
	return request.then((response) => response.data.persons);
};

const create = (newObject) => {
	const request = axios.post(BASE_URL, newObject);
	return request.then((response) => response.data);
};

const remove = (id) => {
	const request = axios.delete(`${BASE_URL}/${id}`);
	return request.then((response) => response.data);
};

const update = (id, newObject) => {
	const request = axios.put(`${BASE_URL}/${id}`, newObject);
	return request.then((response) => response.data);
};

export default { getAll, create, remove, update };
