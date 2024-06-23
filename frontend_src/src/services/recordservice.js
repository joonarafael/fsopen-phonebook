import axios from "axios";

const getAll = () => {
	const request = axios.get(process.env.BASE_URL);
	return request.then((response) => response.data.persons);
};

const create = (newObject) => {
	const request = axios.post(process.env.BASE_URL, newObject);
	return request.then((response) => response.data);
};

const remove = (id) => {
	const request = axios.delete(`${process.env.BASE_URL}/${id}`);
	return request.then((response) => response.data);
};

const update = (id, newObject) => {
	const request = axios.put(`${process.env.BASE_URL}/${id}`, newObject);
	return request.then((response) => response.data);
};

export default { getAll, create, remove, update };
