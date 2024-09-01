import { useEffect, useState } from "react";
import APIs, { enpoints } from "../../configs/APIs";
import cookie from "react-cookies";
import JobApplicationCard from "../ui components/JobApplicationCard";
import notFound from "../../assets/notFound.png";

const ApplicationList = () => {
	const [applications, setApplications] = useState(null);
	const loadApplications = async () => {
		try {
			const res = await APIs.get(enpoints["getApplicationsByUser"], {
				headers: {
					Authorization: `Bearer ${cookie.load("token")}`,
				},
			});
			console.log(res.data.result);
			setApplications(res.data.result);
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		loadApplications();
	}, []);

	return (
		<>
			{applications !== null &&
				applications.map((application, index) => {
					if (!application.jobPost) {
						application.jobPost = {
							jobTitle: "Bài đăng đã bị xóa",
							salaryRange: "null",
							user: {
								companyName: "null",
								avatar: notFound,
							},
						};
					}

					return (
						<JobApplicationCard
							application={application}
							key={index}
						/>
					);
				})}
		</>
	);
};

export default ApplicationList;
