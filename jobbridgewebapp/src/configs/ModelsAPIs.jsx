import axios from "axios";

export const BASE_URL = "http://127.0.0.1:5000";

export const modelEnpoints = {
	cvClassify: "/cv-classify-file",
	cvMatching: "/cv-matching-jd",
};

export default axios.create({
	baseURL: BASE_URL,
});
