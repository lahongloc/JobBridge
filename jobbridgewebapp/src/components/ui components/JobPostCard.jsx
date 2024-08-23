import React, { useState } from "react";
import { Card, Typography, Avatar, Space, Tag } from "antd";
import {
	UserOutlined,
	MoneyCollectOutlined,
	EnvironmentOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { paths } from "../../authorizations/paths";

const { Title, Text } = Typography;

const JobPostCard = ({ jobPost }) => {
	const [isHovered, setIsHovered] = useState(false);
	const navigate = useNavigate();

	const truncateTitle = (title, length) => {
		return title?.length > length
			? `${title.substring(0, length)}...`
			: title;
	};

	return (
		<Card
			hoverable
			onClick={() =>
				navigate(`${paths["job-detail"]}?jobPostId=${jobPost.id}`)
			}
			style={{
				borderRadius: "8px",
				boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
				width: "30%",
				marginBottom: "7px",
				marginLeft: "7px",
				marginRight: "7px",
			}}
		>
			<div
				style={{
					display: "flex",
					alignItems: "center",
				}}
			>
				<Avatar
					shape="square"
					size={100}
					src={
						jobPost.user?.avatar ??
						"https://via.placeholder.com/100"
					}
					alt="Company Logo"
					style={{
						borderRadius: "8px",
						marginRight: "12px",
						boxShadow:
							"rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px",
					}}
				/>

				{/* Info Section */}
				<div style={{ flex: 1, marginLeft: "1rem" }}>
					<Space
						direction="vertical"
						size="small"
						style={{ width: "100%" }}
					>
						<Text
							level={4}
							style={{
								textTransform: "capitalize",
								fontWeight: 700,
								textDecoration: isHovered
									? "underline"
									: "none",
							}}
							onMouseEnter={() => setIsHovered(true)}
							onMouseLeave={() => setIsHovered(false)}
						>
							{truncateTitle(jobPost.jobTitle, 22)}
						</Text>
						<Text>
							<UserOutlined style={{ marginRight: "8px" }} />
							{jobPost.user.companyName}
						</Text>
						<Text>
							<MoneyCollectOutlined
								style={{ marginRight: "8px" }}
							/>
							{jobPost.salaryRange}
						</Text>
						<Text>
							<EnvironmentOutlined
								style={{ marginRight: "8px" }}
							/>
							{jobPost.jobLocation.name}
						</Text>
						{/* <Space size="small">
							<Tag color="blue">Full-time</Tag>
							<Tag color="green">Remote</Tag>
						</Space> */}
					</Space>
				</div>
			</div>
		</Card>
	);
};

export default JobPostCard;
