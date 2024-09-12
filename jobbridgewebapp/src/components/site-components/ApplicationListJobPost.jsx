import ApplicationRecruitView from "../ui components/ApplicationRecruitView";

const data = [
	{
		id: "20b0367b-2ade-4e47-86dd-41d88d8538",
		createdDate: "2024-08-22T09:03:03.254+00:00",
		curriculumVitae: {
			id: "80b566df-23a2-48b2-a0c1-7c616709f310",
			name: "CV Fresher Backend Developer - LA HONG LOC",
			filePath:
				"https://res.cloudinary.com/dbfh15hki/image/upload/v1724317383/jurwnwpl58cti4vpoy6o.pdf",
		},
		status: "UNSEEN",
	},
	{
		id: "21b1234b-2ade-4e7-86dd-0041d88d9999",
		createdDate: "2024-09-10T11:23:03.254+00:00",
		curriculumVitae: {
			id: "90b1234f-23a2-48b2-a0c1-7c616709f987",
			name: "CV Senior Backend Developer - John Doe",
			filePath: "https://example.com/johndoe_cv.pdf",
		},
		status: "UNSEEN",
	},
	{
		id: "21b1234b-2ade-4e47-86dd0041d88999",
		createdDate: "2024-09-10T11:23:03.254+00:00",
		curriculumVitae: {
			id: "90b1234f-23a2-48b2-a0c1-7c616709f987",
			name: "CV Senior Marketing - Tran Van Mau",
			filePath: "https://example.com/johndoe_cv.pdf",
		},
		status: "MATCH",
	},
	{
		id: "21b1234b-2ade-4e47-86dd-0041d999",
		createdDate: "2024-09-10T11:23:03.254+00:00",
		curriculumVitae: {
			id: "90b1234f-23a2-48b2-a0c1-7c616709f987",
			name: "CV Data Analysis - Duong Van Khanh",
			filePath: "https://example.com/johndoe_cv.pdf",
		},
		status: "NOT_MATCH",
	},
	{
		id: "21b1234b-2ade-4e47-86dd-0041d88d9999",
		createdDate: "2024-09-10T11:23:03.254+00:00",
		curriculumVitae: {
			id: "90b1234f-23a2-48b2-a0c1-7c616709f987",
			name: "CV Design Junior - Nguyen Phuoc Vinh",
			filePath: "https://example.com/johndoe_cv.pdf",
		},
		status: "SEEN",
	},
	// Add more objects as needed
];
const ApplicationListJobPost = () => {
	return <ApplicationRecruitView data={data} />;
};

export default ApplicationListJobPost;
