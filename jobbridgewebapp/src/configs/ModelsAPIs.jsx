import axios from "axios";

export const BASE_URL = "http://127.0.0.1:5000";

const modelEnpoints = {};

export default axios.create({
	baseURL: BASE_URL,
});
