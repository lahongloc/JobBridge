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
								<Route
									path={paths["upload-cv"]}
									element={<CVUpload />}
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
