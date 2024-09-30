import "antd/dist/reset.css";
import RegistrationForm from "./components/site-components/RegistrationForm";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./layouts/Navbar";
import AppFooter from "./layouts/AppFooter";
import { paths } from "./authorizations/paths";
import LoginForm from "./components/site-components/LoginForm";
import { createContext, useEffect, useReducer, useState } from "react";
import UserReducer from "./reducers/UserReducer";
import cookie from "react-cookies";
import { isLogin } from "./authorizations/roleAuth";
import Home from "./components/site-components/Home";
import EmployerRegister from "./components/site-components/EmployerRegister";
import JobPostingForm from "./components/site-components/JobPostingForm";
import JobList from "./components/site-components/JobList";
import APIs, { enpoints } from "./configs/APIs";
import CVUpload from "./components/site-components/CVUpload";
import JobDetail from "./components/site-components/JobDetail";
import CVList from "./components/site-components/CVList";
import JobPostUpdatingForm from "./components/site-components/JobPostUpdatingForm";
import JobPostDetail from "./components/ui components/JobPostDetail";
import ApplicationList from "./components/site-components/ApplicationList";
import UserProfile from "./components/site-components/UserProfile";
import ApplicationListJobPost from "./components/site-components/ApplicationListJobPost";
import ApplicationDetail from "./components/ui components/ApplicationDetail";

export const UserContext = createContext();
export const WorkTypeContext = createContext();
export const JobLocationContext = createContext();
export const JobFieldContext = createContext();

const data = {
	id: "c010e62c-dfb1-4a6d-b22a-9a1176d9d49d",
	coverLetter:
		'I’m Nguyen Phươc Vinh, and I’m interested in the Backend Developer Internship at Innotech. I’m currently [your status, e.g., "a student at [Your University]" or "a recent graduate in [Your Degree]"] with experience in [mention relevant technologies, e.g., Python, Node.js].\r\n\r\nI am excited about this opportunity because [mention a specific reason related to Innotech]. My attached resume provides further details on my skills and projects.\r\n\r\nThank you for considering my application. I look forward to discussing how I can contribute to your team.\r\n\r\nBest,\r\nNguyen Phươc Vinh',
	createdDate: "2024-09-17T03:39:57.274+00:00",
	hotline: "0869587764",
	email: "vinh@gmail.com",
	curriculumVitae: {
		id: "b1e0e809-3990-466b-808d-83edd5801a77",
		name: "CV Nguyễn Phước Vinh - Marketing-TopCV.vn (3)",
		filePath:
			"https://res.cloudinary.com/dad8ejn0r/image/upload/v1726544397/hqewhdwj3ejtvaervhzf.pdf",
		jobField: null,
	},
	jobPost: {
		id: "b8368ddb-58cb-463f-8113-0abdf4f4a6c5",
		jobTitle: "Backend Developer Intern",
		hiringQuantity: 5,
		requiredExperience: "Không yêu cầu",
		createdDate: "2024-09-17T03:36:30.252+00:00",
		applicationDueDate: "2024-09-25T17:00:00.000+00:00",
		jobDescription:
			"Develop and maintain back-end web applications using Java/NodeJs\nCollaborate with front-end developers to ensure seamless integration between the front-end and back-end logic.\nDesign and maintain databases using PostgreSQL or other database languages.\nIdentify and troubleshoot back-end bugs and issues.\nContinuously learn and stay up-to-date with new back-end technologies and techniques",
		requirements:
			"Graduated in Computer Science, Information technology or related field\nStrong understanding of Java programming language or framework of NodeJs\nExperience working with databases using PostgreSQL\nAbility to communicate in English\nAttention to detail and strong problem-solving skills.\nGood communication skills and ability to work well in a team environment.",
		benefits:
			"13th month salary base on exactly time available monthly working at INNOTECH\nBudget for team building each quarter/ kick off project\nBirthday party each month with party/ cake and gifts/provide one paid leave\nWedding/New Born ~ 2,000,000/ time\nVaccine for baby from 0-36 months: 3,000,000/ 1 year\nProvide Laptop & Extra high definition screens for working\nPerformance bonus plan.\nEmployee referral bonus: 2,000,000 – 10,000,000 (depend on level / roles)",
		detailedWorkplace: "33 Ba Vi Street, Tan Binh District, HCM",
		requiredGender: "Không yêu cầu",
		salaryRange: "Lương thỏa thuận",
		workType: {
			id: "2138c1e3-2a3d-4602-9b02-d79f1d648bf2",
			name: "Internship",
		},
		jobLocation: {
			id: "44efe75f-6a64-4ad4-ab0f-e52e515db5a3",
			name: "TP Hồ Chí Minh",
		},
		jobField: {
			id: "e294da15-b8bf-482b-9d8a-e058f8455d32",
			name: "Công nghệ thông tin",
			englishName: "INFORMATION-TECHNOLOGY",
		},
		user: {
			id: "fc57bf3f-4c20-4c24-a5db-eb69dbf26175",
			fullname: "La Hồng Lộc",
			password:
				"$2a$10$vPUCvjWPcNy1P7CBdUN2O.qogJl9r.FfGCwN0.5lvKZTg4xSyej1e",
			gender: true,
			avatar: "https://res.cloudinary.com/dad8ejn0r/image/upload/v1726544080/zj4lj7cfjgzip5sm9nj6.jpg",
			companyName: null,
			email: "hongloc111990@gmail.com",
			dob: "2024-09-05",
			roles: [
				{
					name: "RECRUITER",
					description: "recruiter role",
					permissions: [],
				},
			],
			curriculumVitaes: [],
		},
	},
	status: "UNSEEN",
};

const App = () => {
	const [workTypes, setWorkTypes] = useState([]);
	const [jobFields, setJobFields] = useState([]);
	const [jobLocations, setJobLocations] = useState([]);

	const loadResources = async () => {
		try {
			const resWorkTypes = await APIs.get(enpoints["workTypesHandler"]);
			setWorkTypes(resWorkTypes.data.result);

			const resJobFields = await APIs.get(enpoints["jobFieldsHandler"]);
			setJobFields(resJobFields.data.result);

			const resJobLocations = await APIs.get(
				enpoints["jobLocationsHandler"],
			);
			setJobLocations(resJobLocations.data.result);
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		loadResources();
	}, []);

	const [user, dispatch] = useReducer(
		UserReducer,
		cookie.load("user") || null,
	);

	return (
		<BrowserRouter>
			<UserContext.Provider value={[user, dispatch]} className="App">
				<WorkTypeContext.Provider value={workTypes}>
					<JobFieldContext.Provider value={jobFields}>
						<JobLocationContext.Provider value={jobLocations}>
							<div style={{ marginBottom: "5rem" }}>
								<Navbar />
							</div>
							<Routes>
								{isLogin(user) || (
									<>
										<Route
											path={paths["user-login"]}
											element={<LoginForm />}
										/>
										<Route
											path={paths["applicant-register"]}
											element={<RegistrationForm />}
										/>
									</>
								)}
								{isLogin(user) && (
									<>
										<Route
											path={paths["resume-management"]}
											element={<CVList />}
										/>
										<Route
											path={paths["update-jobPost"]}
											element={<JobPostUpdatingForm />}
										/>
										<Route
											path={
												paths[
													"application-detail-recruiter-view"
												]
											}
											element={
												<ApplicationDetail
												// data={data}
												/>
											}
										/>
									</>
								)}
								<Route
									path={paths["user-profile"]}
									element={<UserProfile />}
								/>
								<Route
									path={paths["application-management"]}
									element={<ApplicationList />}
								/>
								<Route
									path={paths["job-detail"]}
									element={<JobDetail />}
								/>
								<Route
									path={paths["upload-cv"]}
									element={<CVUpload />}
								/>

								<Route
									path={paths["job-detail-recruiter-view"]}
									element={<JobPostDetail />}
								/>

								<Route
									path={paths["posted-jobs"]}
									element={<JobList />}
								/>
								<Route path={paths.home} element={<Home />} />
								<Route
									path={paths["employer-register"]}
									element={<EmployerRegister />}
								/>
								<Route
									path={paths["job-posting"]}
									element={<JobPostingForm />}
								/>
							</Routes>

							<div style={{ marginTop: "5rem" }}>
								<AppFooter />
							</div>
						</JobLocationContext.Provider>
					</JobFieldContext.Provider>
				</WorkTypeContext.Provider>
			</UserContext.Provider>
		</BrowserRouter>
	);
};

export default App;
