import React, { useEffect, useState } from "react";
import { Table, Pagination, Button } from "antd";
import APIs, { enpoints } from "../../configs/APIs";
import cookie from "react-cookies";
import { useNavigate } from "react-router-dom";
import { paths } from "../../authorizations/paths";

const JobRecommendationTable = () => {
	const [data, setData] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalElements, setTotalElements] = useState(0);
	const navigate = useNavigate();

	const loadJobrecommendationList = async (pageNumber = 1) => {
		try {
			const res = await APIs.get(
				`${enpoints["jobRecommendationHandler"]}/pageNumber=${pageNumber}`,
				{
					headers: {
						Authorization: `Bearer ${cookie.load("token")}`,
					},
				},
			);
			console.log(res);
			const result = res.data.result;
			setData(result.content);
			setTotalElements(result.totalElements);
		} catch (err) {
			console.error(err);
		}
	};

	// Gọi API khi component được mount hoặc khi currentPage thay đổi
	useEffect(() => {
		loadJobrecommendationList(currentPage);
	}, [currentPage]);

	// Hàm xử lý khi click vào CV
	const handleCVClick = (filePath) => {
		window.open(filePath, "_blank");
	};

	// Hàm xử lý khi click vào tên công việc
	const handleJobTitleClick = (jobTitle) => {
		console.log("Tên công việc:", jobTitle);
	};

	// Hàm xử lý khi bấm nút "Xem công việc"
	const handleViewJobClick = (id) => {
		console.log("ID công việc:", id);
	};

	// Hàm xử lý khi thay đổi trang
	const handlePageChange = (page) => {
		setCurrentPage(page); // Cập nhật số trang hiện tại
	};

	// Định nghĩa các cột cho bảng
	const columns = [
		{
			title: "CV",
			dataIndex: ["curriculumVitaeResponse", "name"],
			key: "cv",
			render: (text, record) => (
				<a
					onClick={() =>
						handleCVClick(record.curriculumVitaeResponse.filePath)
					}
					style={{
						color: "#1890ff",
						fontWeight: 500,
					}}
				>
					{text}
				</a>
			),
		},
		{
			title: "Tên công việc",
			dataIndex: ["jobPostResponse", "jobTitle"],
			key: "jobTitle",
			render: (text) => (
				<a
					onClick={() => handleJobTitleClick(text)}
					style={{
						color: "#1890ff",
						fontWeight: 500,
					}}
				>
					{text}
				</a>
			),
		},
		{
			title: "Công ty",
			dataIndex: ["jobPostResponse", "user", "companyName"],
			key: "company",
		},
		{
			title: "Hành động",
			key: "action",
			render: (text, record) => (
				<Button
					type="primary"
					onClick={
						() =>
							navigate(
								`${paths["job-detail"]}?jobPostId=${record.jobPostResponse.id}`,
							)
						// handleViewJobClick(record.jobPostResponse.id)
					}
				>
					Xem công việc
				</Button>
			),
		},
	];

	return (
		<>
			{data !== null && (
				<div
					style={{
						width: "80%",
						margin: "0 auto",
						boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
						borderRadius: "10px",
						overflow: "hidden",
						backgroundColor: "white",
						padding: "20px",
					}}
				>
					<Table
						columns={columns}
						dataSource={data}
						pagination={false}
						rowKey="id"
						style={{ borderRadius: "10px" }}
					/>
					<Pagination
						current={currentPage}
						pageSize={12} // API trả về mặc định 12 phần tử
						total={totalElements}
						onChange={handlePageChange}
						style={{
							display: "flex",
							justifyContent: "center",
							padding: "16px 0",
						}}
					/>
				</div>
			)}
		</>
	);
};

export default JobRecommendationTable;
