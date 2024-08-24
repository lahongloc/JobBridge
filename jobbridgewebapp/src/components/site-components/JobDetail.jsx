import React, { useState, useEffect, useContext } from "react";
import {
	Card,
	Row,
	Col,
	Avatar,
	Button,
	Descriptions,
	Divider,
	Typography,
	Tag,
	message,
} from "antd";
import {
	UsergroupAddOutlined,
	ClockCircleOutlined,
	ManOutlined,
	AppstoreOutlined,
	FileTextOutlined,
	FileDoneOutlined,
	GiftOutlined,
	ScheduleOutlined,
} from "@ant-design/icons";

import {
	MailOutlined,
	EnvironmentOutlined,
	DollarOutlined,
	UserOutlined,
} from "@ant-design/icons";
import { useSearchParams } from "react-router-dom";
import APIs, { enpoints } from "../../configs/APIs";
import ApplyJobModal from "../ui components/ApplyJobModal";
import dayjs from "dayjs";
import Alert from "antd/es/alert/Alert";
import { UserContext } from "../../App";
import { isLogin } from "../../authorizations/roleAuth";
import FabMenu from "../ui components/FabMenu";

const { Title, Text } = Typography;

const JobDetail = () => {
	const [user, dispatch] = useContext(UserContext);
	const [q] = useSearchParams();
	const [job, setJob] = useState(null);
	const [loading, setLoading] = useState(false);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [jobStatus, setJobStatus] = useState({
		messageType: "",
		text: "",
		isPastDue: false,
	});

	const handleApplyClicked = () => {
		if (isLogin(user)) {
			setIsModalVisible(true);
		} else {
			message.info("Vui lòng đăng nhập để ứng tuyển!");
		}
	};

	const handleCancel = () => {
		setIsModalVisible(false);
	};

	const loadJobPost = async () => {
		setLoading(true);
		try {
			const res = await APIs.get(
				`${enpoints["jobPostHandlder"]}/jobPostId=${q.get("jobPostId")}`,
			);
			setJob(res.data.result);
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (job !== null) {
			const applicationDueDate = dayjs(job.applicationDueDate);
			const today = dayjs();

			const isPastDue = applicationDueDate.isBefore(today, "day");

			if (isPastDue) {
				setJobStatus({
					messageType: "warning",
					text: "Đã quá hạn ứng tuyển!",
					isPastDue: false,
				});
			} else {
				setJobStatus({
					messageType: "info",
					text: `Hạn ứng tuyển: ${dayjs(
						job.applicationDueDate,
					).format("DD/MM/YYYY")}`,
					isPastDue: true,
				});
			}
		}
	}, [job]);

	useEffect(() => {
		loadJobPost();
	}, []);

	const [isSticky, setIsSticky] = useState(false);
	const [activeSection, setActiveSection] = useState("job-details");

	const handleScroll = () => {
		const jobDetailsSection = document.getElementById("job-details");
		const relatedJobsSection = document.getElementById("related-jobs");

		if (window.scrollY > 200) {
			setIsSticky(true);
		} else {
			setIsSticky(false);
		}

		if (jobDetailsSection && relatedJobsSection) {
			const jobDetailsTop = jobDetailsSection.offsetTop;
			const relatedJobsTop = relatedJobsSection.offsetTop;

			if (window.scrollY >= relatedJobsTop - 300) {
				setActiveSection("related-jobs");
			} else if (window.scrollY >= jobDetailsTop - 100) {
				setActiveSection("job-details");
			}
		}
	};

	useEffect(() => {
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const handleButtonClick = (section) => {
		setActiveSection(section);
		document.getElementById(section).scrollIntoView({ behavior: "smooth" });
	};

	return (
		job === null || (
			<div style={{ width: "80%", margin: "0 auto", padding: "20px" }}>
				{/* Floating Top Bar */}
				<div
					style={{
						position: isSticky ? "fixed" : "absolute",
						display: isSticky ? "block" : "none",
						top: isSticky ? "5rem" : 0,
						left: "10%",
						width: "50%",
						background: "#fff",
						boxShadow: isSticky
							? "0px 2px 8px rgba(0, 0, 0, 0.1)"
							: "none",
						padding: "10px 20px",
						zIndex: 1000,
						transition: "all 0.3s ease",
					}}
				>
					<Row justify="space-between" align="middle">
						<Col>
							<Button
								type="link"
								onClick={() => handleButtonClick("job-details")}
								style={{
									fontWeight:
										activeSection === "job-details"
											? "bold"
											: "normal",
								}}
							>
								Chi tiết tuyển dụng
							</Button>
						</Col>
						<Col>
							<Button
								type="link"
								onClick={() =>
									handleButtonClick("related-jobs")
								}
								style={{
									fontWeight:
										activeSection === "related-jobs"
											? "bold"
											: "normal",
								}}
							>
								Việc làm liên quan
							</Button>
						</Col>
						<Col>
							<Button
								disabled={!jobStatus.isPastDue}
								onClick={handleApplyClicked}
								type="primary"
							>
								Ứng tuyển ngay
							</Button>
						</Col>
					</Row>
				</div>
				<FabMenu jobPostId={job.id} />

				{/* Job Summary and Company Info */}
				<Card
					bordered={false}
					style={{
						borderRadius: "8px",
						boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
						marginBottom: "24px",
						marginTop: isSticky ? "60px" : "0px", // Offset for fixed bar
					}}
				>
					<Row gutter={16} align="middle">
						<Col span={18}>
							<div>
								<h2
									style={{
										fontSize: "24px",
										fontWeight: "bold",
										marginBottom: "16px",
										textTransform: "uppercase",
									}}
								>
									{job.jobTitle}{" "}
								</h2>
								<Descriptions
									column={5}
									labelStyle={{ padding: 0, margin: 0 }}
									contentStyle={{ padding: 0, margin: 0 }}
								>
									<Descriptions.Item label="">
										<DollarOutlined
											style={{
												marginRight: "8px",
												color: "#1890ff",
											}}
										/>
										<span>
											<b>Mức lương</b>
											<br /> {job.salaryRange}
										</span>
									</Descriptions.Item>
									<Descriptions.Item label="">
										<EnvironmentOutlined
											style={{
												marginRight: "8px",
												color: "#1890ff",
											}}
										/>
										<span>
											<b>Khu vực tuyển</b>
											<br /> {job.jobLocation.name}
										</span>
									</Descriptions.Item>
									<Descriptions.Item label="">
										<UserOutlined
											style={{
												marginRight: "8px",
												color: "#1890ff",
											}}
										/>
										<span>
											<b>Kinh nghiệm yêu cầu</b>
											<br />
											{job.requiredExperience}
										</span>
									</Descriptions.Item>
								</Descriptions>
								<Alert
									style={{
										width: "fit-content",
										marginTop: 20,
									}}
									message={jobStatus.text}
									type={jobStatus.messageType}
									icon={
										<ScheduleOutlined
											style={{ display: "inline" }}
										/>
									}
									showIcon
								/>
							</div>
						</Col>

						<Col span={6} style={{ textAlign: "center" }}>
							<Avatar size={64} src={job.user.avatar} />
							<h3 style={{ marginTop: "16px" }}>
								{job.user.companyName}
							</h3>
							<p>
								<MailOutlined
									style={{
										marginRight: "8px",
										color: "#1890ff",
									}}
								/>
								{job.user.email}
							</p>
						</Col>
					</Row>
				</Card>

				{/* Job Details */}
				<Row gutter={16}>
					<Col span={16}>
						<Card
							id="job-details"
							title={
								<Text style={{ textTransform: "uppercase" }}>
									Chi tiết tuyển dụng
								</Text>
							}
							bordered={false}
							style={{
								borderRadius: "12px",
								boxShadow: "0px 6px 18px rgba(0, 0, 0, 0.1)",
								padding: "20px",
							}}
						>
							<Descriptions
								column={1}
								labelStyle={{
									fontWeight: "bold",
									color: "#595959",
									fontSize: "16px",
								}}
								contentStyle={{
									color: "#4a4a4a",
									fontSize: "16px",
								}}
							>
								<Descriptions.Item label="">
									<FileTextOutlined
										style={{
											marginRight: "8px",
											color: "#1890ff",
										}}
									/>
									<span>
										<b>Mô tả công việc:</b>
										<br />
										<span
											dangerouslySetInnerHTML={{
												__html: `- ${job.jobDescription.replace(/\n/g, "<br />- ")}`,
											}}
										/>
									</span>
								</Descriptions.Item>
								<Descriptions.Item label="">
									<FileDoneOutlined
										style={{
											marginRight: "8px",
											color: "#52c41a",
										}}
									/>
									<span>
										<b>Yêu cầu ứng viên:</b>
										<br />
										<span
											dangerouslySetInnerHTML={{
												__html: `- ${job.requirements.replace(/\n/g, "<br />- ")}`,
											}}
										/>
									</span>
								</Descriptions.Item>
								<Descriptions.Item label="">
									<GiftOutlined
										style={{
											marginRight: "8px",
											color: "#faad14",
										}}
									/>
									<span>
										<b>Quyền lợi:</b>
										<br />
										<span
											dangerouslySetInnerHTML={{
												__html: `- ${job.benefits.replace(/\n/g, "<br />- ")}`,
											}}
										/>
									</span>
								</Descriptions.Item>
								<Descriptions.Item label="">
									<EnvironmentOutlined
										style={{
											marginRight: "8px",
											color: "#f5222d",
										}}
									/>
									<span>
										<b>Địa điểm làm việc:</b>
										<br />
										{job.detailedWorkplace}
									</span>
								</Descriptions.Item>
							</Descriptions>

							<Alert
								style={{
									width: "fit-content",
									marginTop: 20,
								}}
								message={jobStatus.text}
								type={jobStatus.messageType}
								icon={
									<ScheduleOutlined
										style={{ display: "inline" }}
									/>
								}
								showIcon
							/>
							<Divider />

							<Button
								type="primary"
								disabled={!jobStatus.isPastDue}
								onClick={handleApplyClicked}
								style={{ marginRight: "16px" }}
							>
								Ứng tuyển
							</Button>
							<Button> Lưu tin</Button>
						</Card>
					</Col>
					<Col span={8}>
						<Card
							title={
								<Text style={{ textTransform: "uppercase" }}>
									Thông tin chung
								</Text>
							}
							bordered={false}
							style={{
								borderRadius: "12px",
								boxShadow: "0px 6px 18px rgba(0, 0, 0, 0.1)",
								padding: "20px",
							}}
						>
							<Descriptions
								column={1}
								labelStyle={{
									fontWeight: "bold",
									color: "#595959",
									fontSize: "16px",
								}}
								contentStyle={{
									color: "#4a4a4a",
									fontSize: "16px",
								}}
							>
								<Descriptions.Item label="">
									<UsergroupAddOutlined
										style={{
											marginRight: "8px",
											color: "#1890ff",
										}}
									/>
									<span>
										Số lượng tuyển:
										<br />
										<b>{job.hiringQuantity} người</b>
									</span>
								</Descriptions.Item>
								<Descriptions.Item label="">
									<ClockCircleOutlined
										style={{
											marginRight: "8px",
											color: "#52c41a",
										}}
									/>
									<span>
										Hình thức làm việc:
										<br />
										<b>{job.workType.name}</b>
									</span>
								</Descriptions.Item>
								<Descriptions.Item label="">
									<ManOutlined
										style={{
											marginRight: "8px",
											color: "#faad14",
										}}
									/>
									<span>
										Giới tính yêu cầu:
										<br />
										<b>{job.requiredGender}</b>
									</span>
								</Descriptions.Item>
								<Descriptions.Item label="">
									<AppstoreOutlined
										style={{
											marginRight: "8px",
											color: "#f5222d",
										}}
									/>
									<span>
										Lĩnh vực/Nghành nghề:
										<br />
										<b>{job.jobField.name}</b>
									</span>
								</Descriptions.Item>
							</Descriptions>
						</Card>
						<ApplyJobModal
							job={job}
							isModalVisible={
								jobStatus.isPastDue && isModalVisible
							}
							handleCancel={handleCancel}
						/>
					</Col>
				</Row>
				<h1 id="related-jobs">Công việc liên quan</h1>
			</div>
		)
	);
};

export default JobDetail;
