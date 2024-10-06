import axios from "axios";

export const BASE_URL = "http://localhost:8080/jobbridge";

export const enpoints = {
	userHandler: "/users",
	applicantRegister: "/users/create-applicant",
	recruiterRegister: "/users/create-recruiter",
	login: "/auth/log-in",
	logout: "/auth/log-out",
	currentUser: "/users/myInfo",
	workTypesHandler: "/workTypes",
	jobFieldsHandler: "/jobFields",
	jobLocationsHandler: "/jobLocations",
	jobPostHandlder: "/jobPosts",
	getJobPostsByUser: "/jobPosts/get-by-user",
	searchJobPost: "/jobPosts/search-jobPost",
	uploadCV: "/curriculumVitaes/upload",
	getCVsByUser: "/curriculumVitaes/get-cvs-by-user",
	applicationHandler: "/applications",
	curriculumVitaeHandler: "/curriculumVitaes",
	getApplicationsByUser: "/applications/get-all-by-user",
	updateApplicantStatus: "/applications/update-application-status",
	getGroupOfJobPosts: "/jobPosts/get-by-job-field-group",
	jobRecommendationHandler: "/jobRecommendations",
	getCompanies: "/users/get-users",
	getJobPostByCompany: "/jobPosts/get-all",
	getUsersByRole: "/users/get-users",
	jobPostFielsStatistic: "/jobPosts/statistic-by-field",
	jobLocationStatistic: "jobPosts/statistic-by-location",
	roleStatistic: "/users/role-statistic",
};

export default axios.create({
	baseURL: BASE_URL,
});
