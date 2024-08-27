import React from "react";
import { Card, Typography, Button, Space, Row, Col, Avatar } from "antd";
import { MessageOutlined, FilePdfOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { paths } from "../../authorizations/paths";

const { Title, Text } = Typography;

const JobApplicationCard = ({ application }) => {
	const {
		jobPost: {
			jobTitle,
			salaryRange,
			user: { companyName, avatar },
		},
		createdDate,
		curriculumVitae: { name: cvName, filePath },
	} = application;

	const navigate = useNavigate();

	return (
		<Card
			style={{
				maxWidth: 550,
				borderRadius: "12px",
				overflow: "hidden",
				boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
				margin: "auto",
				padding: "20px",
				background: "#ffffff",
				border: "1px solid #f0f0f0",
				marginTop: 5,
			}}
		>
			<Row gutter={[16, 16]} align="middle">
				<Col span={4}>
					<Avatar
						style={{
							boxShadow: "rgba(3, 102, 214, 0.3) 0px 0px 0px 3px",
						}}
						size={56}
						src={avatar}
					/>
				</Col>
				<Col span={14}>
					<Title
						onClick={() =>
							navigate(
								`${paths["job-detail"]}?jobPostId=${application.jobPost.id}`,
							)
						}
						level={4}
						style={{ margin: 0, color: "#333" }}
					>
						<span
							style={{
								display: "inline-block",
								cursor: "pointer",
								textDecoration: "none",
							}}
							onMouseEnter={(e) =>
								(e.currentTarget.style.textDecoration =
									"underline")
							}
							onMouseLeave={(e) =>
								(e.currentTarget.style.textDecoration = "none")
							}
						>
							{jobTitle}
						</span>
					</Title>
					<Text
						strong
						style={{
							fontSize: "14px",
							display: "block",
							marginBottom: 4,
							color: "#555",
						}}
					>
						{companyName}
					</Text>
					<Text
						style={{
							display: "block",
							marginBottom: 4,
							color: "#777",
						}}
					>
						<em>Mức lương: </em> {salaryRange}
					</Text>
					<Text style={{ display: "block", color: "#777" }}>
						<em>Ngày ứng tuyển: </em>
						{dayjs(createdDate).format("DD-MM-YYYY")}
					</Text>
				</Col>
				<Col span={6}>
					<Space
						direction="vertical"
						style={{ width: "100%" }}
						size="middle"
					>
						<Button
							type="primary"
							icon={<MessageOutlined />}
							size="middle"
							style={{ borderRadius: "6px", width: "100%" }}
						>
							Nhắn tin
						</Button>
						<Button
							type="default"
							icon={<FilePdfOutlined />}
							size="middle"
							style={{
								borderRadius: "6px",
								width: "100%",
								background: "#f0f0f0",
							}}
							href={filePath}
							target="_blank"
						>
							Xem CV
						</Button>
					</Space>
				</Col>
			</Row>
		</Card>
	);
};

export default JobApplicationCard;
