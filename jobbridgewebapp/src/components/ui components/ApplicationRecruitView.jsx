import React from "react";
import { Table, Typography, Tag, Dropdown, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { paths } from "../../authorizations/paths";

const { Link } = Typography;

const ApplicationRecruitView = ({ data }) => {
	const navigate = useNavigate();
	// Define the columns for the table
	const columns = [
		{
			title: "Tên hồ sơ",
			dataIndex: "curriculumVitae",
			key: "name",
			render: (curriculumVitae) => (
				<Link
					href={curriculumVitae.filePath}
					target="_blank"
					rel="noopener noreferrer"
					onMouseEnter={(e) =>
						(e.currentTarget.style.textDecoration = "underline")
					}
					onMouseLeave={(e) =>
						(e.currentTarget.style.textDecoration = "none")
					}
					style={{
						fontWeight: 600,
					}}
				>
					{curriculumVitae.name}
				</Link>
			),
		},
		{
			title: "Ngày tạo",
			dataIndex: "createdDate",
			key: "createdDate",
			render: (createdDate) =>
				new Date(createdDate).toLocaleDateString("vi-VN"),
		},
		{
			title: "Trạng thái",
			dataIndex: "status",
			key: "status",
			filters: [
				{ text: "Chưa xem", value: "UNSEEN" },
				{ text: "Đã xem", value: "SEEN" },
				{ text: "Hồ sơ phù hợp", value: "MATCH" },
				{ text: "Hồ sơ không phù hợp", value: "NOT_MATCH" },
			],
			onFilter: (value, record) => record.status?.trim() === value.trim(),
			render: (status) => {
				switch (status?.trim() || "") {
					case "SEEN":
						return <Tag color="blue">Đã xem</Tag>;
					case "MATCH":
						return <Tag color="green">Hồ sơ phù hợp</Tag>;
					case "NOT_MATCH":
						return <Tag color="red">Hồ sơ không phù hợp</Tag>;
					default:
						return <Tag color="gray">Chưa xem</Tag>;
				}
			},
		},
		{
			title: "Hành động",
			key: "action",
			render: (_, record) => (
				<Button
					onClick={() =>
						navigate(
							`${paths["application-detail-recruiter-view"]}?applicationId=${record.id}`,
						)
					}
				>
					Xem chi tiết
				</Button>
			),
		},
	];

	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				marginTop: "5rem",
			}}
		>
			<div
				style={{
					width: "80%",
					maxWidth: "1200px",
					boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
					borderRadius: 11,
				}}
			>
				<Table
					columns={columns}
					dataSource={data}
					rowKey="id"
					pagination={{ pageSize: 5 }} // Enable pagination with 5 rows per page
				/>
			</div>
		</div>
	);
};

export default ApplicationRecruitView;
