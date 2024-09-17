import React, { useEffect, useState } from "react";
import {
	Card,
	Typography,
	Tag,
	Avatar,
	Row,
	Col,
	Divider,
	Button,
	Space,
	Select,
	Input,
	Form,
	notification,
} from "antd";
import {
	UserOutlined,
	MailOutlined,
	PhoneOutlined,
	FilePdfOutlined,
	EnvironmentOutlined,
} from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import APIs, { enpoints } from "../../configs/APIs";
import cookie from "react-cookies";
import { paths } from "../../authorizations/paths";

const { Option } = Select;
const { TextArea } = Input;

const ApplicationDetail = () => {
	const [application, setApplication] = useState(null);
	const [q] = useSearchParams();
	const navigate = useNavigate();

	const loadApplication = async () => {
		try {
			const res = await APIs.get(
				`${enpoints["applicationHandler"]}/applicationId=${q.get("applicationId")}&isRecruiterView=${true}`,
				{
					headers: {
						Authorization: `Bearer ${cookie.load("token")}`,
					},
				},
			);
			setApplication(res.data.result);
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		loadApplication();
	}, []);

	const [status, setStatus] = useState("UNSEEN");
	const [showEmailForm, setShowEmailForm] = useState(false);
	const [form] = Form.useForm();

	useEffect(() => {
		if (application) {
			setStatus(application.status);
		}
	}, [application]);

	const handleStatusChange = (value) => {
		setStatus(value);
		if (value === "Hồ sơ phù hợp" || value === "Hồ sơ không phù hợp") {
			setShowEmailForm(true);
		} else {
			setShowEmailForm(false);
		}
	};

	const handleSendEmail = (values) => {
		notification.success({
			message: "Email Sent",
			description: `An email has been sent to ${application.email} regarding the application.`,
		});
		form.resetFields(); // Reset the form after submission
	};

	return (
		<Card
			style={{
				borderRadius: "10px",
				padding: "5rem",
			}}
			title={
				<Tag
					color={
						status === "UNSEEN"
							? "blue"
							: status === "Hồ sơ phù hợp"
								? "green"
								: "red"
					}
				>
					{status}
				</Tag>
			}
			extra={
				application &&
				application.jobPost && (
					<Tag color="gold">
						{application.jobPost.workType.name} -{" "}
						{application.jobPost.jobLocation.name}
					</Tag>
				)
			}
		>
			{application && application.jobPost && (
				<>
					<Row gutter={16} align="middle">
						<Col span={18}>
							<Typography.Title level={4}>
								{application.jobPost.jobTitle} at{" "}
								{application.jobPost.detailedWorkplace}
							</Typography.Title>
							<Space direction="vertical" size="middle">
								<Typography.Text strong>
									Kinh nghiệm yêu cầu:{" "}
									{application.jobPost.requiredExperience}
								</Typography.Text>
								<Typography.Text strong>
									Lương: {application.jobPost.salaryRange}
								</Typography.Text>
								<Typography.Text strong>
									Quyền lợi:{" "}
									{application.jobPost.benefits
										.split("\n")
										.slice(0, 2)
										.join(", ")}
									...
								</Typography.Text>
								<Col span={12}>
									<Typography.Text>
										<EnvironmentOutlined />
										{application.jobPost.detailedWorkplace}
									</Typography.Text>
								</Col>
								<Col>
									<Space>
										<Button
											onClick={() =>
												navigate(
													`${paths["job-detail-recruiter-view"]}?jobPostId=${application.jobPost.id}`,
												)
											}
											type="primary"
										>
											Xem chi tiết công việc
										</Button>
									</Space>
								</Col>
							</Space>
						</Col>
						<Col span={6} style={{ textAlign: "center" }}>
							<Avatar
								size={100}
								src={application.jobPost.user.avatar}
								icon={<UserOutlined />}
							/>
						</Col>
					</Row>

					<Divider />

					<Typography.Title level={5}>
						Thư ứng tuyển:
					</Typography.Title>
					<Typography.Paragraph
						ellipsis={{ rows: 3, expandable: true, symbol: "more" }}
					>
						{application.coverLetter}
					</Typography.Paragraph>

					<Divider />

					<Row>
						<Col span={12}>
							<Typography.Text>
								<FilePdfOutlined />{" "}
								<a
									href={application.curriculumVitae.filePath}
									target="_blank"
									rel="noopener noreferrer"
								>
									{application.curriculumVitae.name}
								</a>
							</Typography.Text>
						</Col>
					</Row>
					<Row justify="space-between" align="middle">
						<Col>
							<Typography.Text type="secondary">
								Ngày ứng tuyển:{" "}
								{new Date(
									application.createdDate,
								).toLocaleDateString()}
							</Typography.Text>
						</Col>
					</Row>

					<Divider />

					<Row gutter={16}>
						<Col span={12}>
							<Typography.Text>
								<MailOutlined /> {application.email}
							</Typography.Text>
						</Col>
						<Col span={12}>
							<Typography.Text>
								<PhoneOutlined /> {application.hotline}
							</Typography.Text>
						</Col>
					</Row>

					<Divider />

					{/* Status Changing Section */}
					<Row
						justify="start"
						align="middle"
						style={{ marginBottom: "1rem" }}
					>
						<Typography.Text strong>
							Thay đổi trạng thái:{" "}
						</Typography.Text>
						<Select
							value={status}
							onChange={handleStatusChange}
							style={{ marginLeft: "1rem", width: "200px" }}
						>
							<Option value="Hồ sơ phù hợp">
								Đánh dấu là hồ sơ phù hợp
							</Option>
							<Option value="Hồ sơ không phù hợp">
								Đánh dấu là hồ sơ không phù hợp
							</Option>
						</Select>
					</Row>

					{/* Conditionally Render Email Form */}
					{showEmailForm && (
						<Form
							form={form}
							onFinish={handleSendEmail}
							layout="vertical"
						>
							<Form.Item
								label="Tiêu đề"
								name="subject"
								rules={[
									{
										required: true,
										message: "Vui lòng nhập tiêu đề email!",
									},
								]}
							>
								<Input placeholder="Nhập tiêu đề email" />
							</Form.Item>
							<Form.Item
								label="Nội dung email"
								name="message"
								rules={[
									{
										required: true,
										message:
											"Vui lòng nhập nội dung email!",
									},
								]}
							>
								<TextArea
									rows={4}
									placeholder="Nhập nội dung email"
								/>
							</Form.Item>
							<Form.Item>
								<Button type="primary" htmlType="submit">
									Gửi email
								</Button>
							</Form.Item>
						</Form>
					)}
				</>
			)}
		</Card>
	);
};

export default ApplicationDetail;
