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
import {
	isAdmin,
	isApplicant,
	isLogin,
	isRecruiter,
} from "./authorizations/roleAuth";
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
import JobRecommendationTable from "./components/ui components/JobRecommendationTable";
import { data } from "./assets/fixedData";
import JobRecommendationList from "./components/site-components/JobRecommendationList";
import CompanyList from "./components/site-components/CompanyList";
import CompanyJobList from "./components/site-components/CompanyJobList";
import Statistic from "./components/site-components/Statistic";
import AdminPage from "./components/site-components/AdminPage";

export const UserContext = createContext();
export const WorkTypeContext = createContext();
export const JobLocationContext = createContext();
export const JobFieldContext = createContext();

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
							<div
								style={{
									marginBottom: "5rem",
									backgroundColor: `${isAdmin(user) ? "rgb(240, 242, 245)" : "#fff"}`,
								}}
							>
								<Navbar />
							</div>
							<Routes>
								{isApplicant(user) && (
									<>
										<Route
											path={paths["resume-management"]}
											element={<CVList user={user} />}
										/>
										<Route
											path={
												paths[
													"applicant-job-recommendation"
												]
											}
											element={<JobRecommendationList />}
										/>
										<Route
											path={
												paths["application-management"]
											}
											element={<ApplicationList />}
										/>
										<Route
											path={paths["upload-cv"]}
											element={<CVUpload />}
										/>
									</>
								)}

								{/* RECRUITER */}
								{isRecruiter(user) && (
									<>
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
											element={<ApplicationDetail />}
										/>
										<Route
											path={
												paths[
													"job-detail-recruiter-view"
												]
											}
											element={<JobPostDetail />}
										/>
										<Route
											path={paths["posted-jobs"]}
											element={<JobList />}
										/>
										<Route
											path={paths["job-posting"]}
											element={<JobPostingForm />}
										/>
									</>
								)}

								{/* NOT LOGIN */}
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
										<Route
											path={paths["employer-register"]}
											element={<EmployerRegister />}
										/>
									</>
								)}

								{isAdmin(user) && (
									<Route
										path={paths["admin-page"]}
										element={<AdminPage />}
									/>
								)}
								{/* LOGIN */}
								{isLogin(user) && (
									<>
										<Route
											path={paths["user-profile"]}
											element={<UserProfile />}
										/>
									</>
								)}

								{/* ANY STATE */}
								<Route
									path={paths["job-detail"]}
									element={<JobDetail />}
								/>
								<Route path={paths.home} element={<Home />} />

								<Route
									path="/test-chart"
									element={<CompanyList />}
								/>
								<Route
									path={`${paths["companies-hiring"]}/company`}
									element={<CompanyJobList />}
								/>
								{/* <Route
									path="/test-chart"
									element={<Statistic />}
								/> */}
							</Routes>

							{isAdmin(user) || (
								<div style={{ marginTop: "5rem" }}>
									<AppFooter />
								</div>
							)}
						</JobLocationContext.Provider>
					</JobFieldContext.Provider>
				</WorkTypeContext.Provider>
			</UserContext.Provider>
		</BrowserRouter>
	);
};

export default App;
