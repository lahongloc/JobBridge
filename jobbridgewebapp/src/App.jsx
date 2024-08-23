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

export const UserContext = createContext();
export const WorkTypeContext = createContext();
export const JobLocationContext = createContext();
export const JobFieldContext = createContext();

const job = {
	jobTitle: "Senior DevOps Engineer",
	hiringQuantity: 4,
	requiredExperience: "3 năm",
	applicationDueDate: "2024-08-30T17:00:00.000+00:00",
	jobDescription:
		"Thực hiện công tác vận hành hệ thống CNTT\nPhát triển, duy trì các ứng dụng web, công cụ/tiện ích hỗ trợ vận hành mạng, vận hành hệ thống\nĐánh giá định kỳ để đưa ra các yêu cầu xây dựng, cải tiến tính năng/tiện ích cho công tác hỗ trợ vận hành, tối ưu quy trình/chức nặng \nThực hiện kiểm tra hệ thống, rà soát định kỳ theo quy trình, quy định theo hướng dẫn nhằm phát hiện các bất thường\nTham gia các dự án tích hợp công cụ/phần mềm ứng dụng (CRM, SSO ...) \nPhối hợp các đơn vị thực hiện theo các quy trình, công cụ\nXây dựng tài liệu và đào tạo công tác hỗ trợ vận hành, tối ưu công cụ\nQuản lý nhóm phát triển (4 người)",
	createdDate: "2024-08-21T09:06:58.116+00:00",
	requirements:
		"Tốt nghiệp đại học chính quy chuyên ngành công nghệ thông tin/điện tử viễn thông hoặc tương đương\nCó 2 năm kinh nghiệm xây dựng ứng dụng web, công cụ/tiện ích tích hợp hệ thống (python, php, shellscript, api)\nCó kinh nghiệm triển khai, vận hành các hệ thống database mysql,Mssql\nCó kinh nghiệm triển khai vận hành các dịch vụ webserver nginx, apache, docker container, Git\nCó kinh nghiệp quản lý nhóm hoặc lead kỹ thuật các task dự án ở mức vừa\nHiểu biết rõ về các giao thức mạng nền tảng (tcp/ip, dns, dhcp, snmp, smtp...)\nƯu tiên các ứng viên có kinh nghiệm triển khai/vận hành 1 trong các hệ thống giám sát cảnh báo: Icinga, Zabbix, Prtg, Nagios, solarwind...\nƯu tiên các ứng viên có các chứng chỉ về Linux, Oracle (CCNA, CCNP, LPIC, OCA, OCP), MariaDB, kubenetes (k8s), DevOps\nƯu tiên ứng viên có kiến thức cloud, ảo hóa, lưu trữ, high availability (ha-proxy, keepalive, ...)\nTrung thực, trách nhiệm, cởi mở\nTiếng anh đọc hiểu tài liệu",
	salaryRange: "10-20 triệu VND",
	benefits:
		"Thưởng lễ, tết, lương tháng 13 và nghỉ phép theo quy định\nPhụ cấp cơm trưa, được cấp laptop và giữ xe miễn phí\nĐược hưởng các gói bảo hiểm sức khỏe 24/7, bảo hiểm tai nạn và các loại bảo hiểm khác theo quy định của nhà nước\nKhám sức khỏe định kỳ hàng năm tại các phòng khám đa khoa quốc tế, tiêm phòng vacxin phòng ngừa cúm\nCác hoạt động thể thao như đá bóng, chạy bộ, cầu lông\nÍt nhất một chuyến du lịch nước ngoài; 1 chuyến teambuilding trong nước, các hoạt động Tân Niên, Tất Niên\nCơ hội thăng tiến, phát triển, lộ trình nghề nghiệp rõ ràng",
	detailedWorkplace:
		"Hồ Chí Minh: 10A Nguyễn Thị Minh Khai, Phường Đa Kao, Quận 1",
	requiredGender: "Nam",
	workType: {
		id: "2552ee6c-eb00-4999-b266-394a8455a0ab",
		name: "Full-time",
	},
	jobLocation: {
		id: "158fa181-2e66-405a-93e1-ea220a69b9a6",
		name: "TP Hồ Chí Minh",
	},
	jobField: {
		id: "58a7f288-f4b5-4dff-827a-be953f843236",
		name: "Công nghệ thông tin",
		englishName: "INFORMATION-TECHNOLOGY",
	},
	user: {
		id: "bcd6f22d-211d-4afa-8c82-1afd3a363691",
		fullname: "La Hồng Lộc",
		gender: true,
		companyName: "DXC Technology",
		email: "hongloc111990@gmail.com",
		roles: [
			{
				name: "RECRUITER",
				description: "recruiter role",
				permissions: [],
			},
		],
	},
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
											path="/"
											element={<JobPostUpdatingForm />}
										/>
									</>
								)}
								<Route
									path={paths["job-detail"]}
									element={<JobDetail />}
								/>
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
