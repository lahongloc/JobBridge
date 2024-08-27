import React from "react";
import { Card, Button, Typography, Tag, Divider } from "antd";
import {
	EyeOutlined,
	CalendarOutlined,
	MoneyCollectOutlined,
	FireOutlined,
	EnvironmentOutlined,
	AppstoreAddOutlined,
} from "@ant-design/icons";
import { paths } from "../../authorizations/paths";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const JobCard = ({
	jobTitle,
	createdDate,
	salaryRange,
	jobLocation,
	workType,
	hiringQuantity,
	id,
}) => {
	const navigate = useNavigate();
	return (
		<Card
			bordered={false}
			style={{
				width: "90%", // Card rộng khoảng 90% màn hình
				borderRadius: 15, // Góc bo tròn hơn
				boxShadow:
					"rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px",
				position: "relative",
				marginBottom: 10,
			}}
			bodyStyle={{ padding: "16px" }}
		>
			<div
				style={{
					display: "flex",
					alignItems: "center", // Căn giữa theo chiều dọc
					marginBottom: 16,
				}}
			>
				<Title
					level={4}
					style={{
						marginBottom: 0,
						marginRight: 16,
						textTransform: "uppercase",
					}}
				>
					{jobTitle}
				</Title>

				<Tag
					color="volcano"
					icon={<FireOutlined />}
					style={{
						borderRadius: 20,
						fontWeight: "bold",
						backgroundColor: "rgba(255, 87, 34, 0.1)", // Độ mờ cho màu volcano
						color: "#d4380d", // Màu chữ phù hợp với màu volcano
					}}
				>
					{workType}
				</Tag>
			</div>
			<Divider
				style={{
					borderColor: "rgb(45 183 245)",
				}}
			></Divider>
			<div
				style={{
					marginBottom: 16,
					display: "flex",
					flexDirection: "column",
				}}
			>
				<div
					style={{
						marginBottom: 8,
						display: "flex",
						alignItems: "center",
					}}
				>
					<div
						style={{
							width: "80%",
							display: "flex",
							justifyContent: "space-between",
						}}
					>
						<div style={{ width: "40%" }}>
							<CalendarOutlined style={{ marginRight: 8 }} />
							<Text>
								Ngày đăng:{" "}
								{dayjs(createdDate).format("DD MMM YYYY")}
							</Text>
						</div>
						<div style={{ width: "40%" }}>
							<EnvironmentOutlined style={{ marginRight: 8 }} />
							<Text style={{}}>Khu vực tuyển: {jobLocation}</Text>
						</div>
					</div>
				</div>
				<div
					style={{
						marginBottom: 16,
						display: "flex",
						alignItems: "center",
					}}
				>
					<div
						style={{
							width: "80%",
							display: "flex",
							justifyContent: "space-between",
						}}
					>
						<div style={{ width: "40%" }}>
							<MoneyCollectOutlined style={{ marginRight: 8 }} />
							<Text>Mức lương: {salaryRange}</Text>
						</div>
						<div style={{ width: "40%" }}>
							<AppstoreAddOutlined style={{ marginRight: 8 }} />
							<Text style={{}}>
								Số lượng tuyển: {hiringQuantity}
							</Text>
						</div>
					</div>
				</div>
			</div>
			<Button
				type="primary"
				icon={<EyeOutlined />} // Biểu tượng con mắt
				style={{
					borderRadius: 20, // Góc bo tròn nút
					padding: "6px 12px", // Điều chỉnh kích thước nút để nó ngắn lại
					backgroundColor: "#2d7cf11a", // Màu nền với opacity
					border: "none", // Xóa viền để nhìn rõ hiệu ứng opacity
					color: "#2d7cf1", // Màu chữ cho nút
					fontWeight: "bold",
					position: "absolute",
					bottom: 16,
					right: 16,
				}}
				onClick={() =>
					navigate(
						`${paths["job-detail-recruiter-view"]}?jobPostId=${id}`,
					)
				}
			>
				Xem chi tiết
			</Button>
		</Card>
	);
};

export default JobCard;
