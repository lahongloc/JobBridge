import React, { useEffect, useState } from "react";
import { Card, Row, Col, Typography, Tag, Avatar, Divider } from "antd";
import {
	UserOutlined,
	EnvironmentOutlined,
	CalendarOutlined,
	MoneyCollectOutlined,
	FieldTimeOutlined,
	InfoCircleOutlined,
	TeamOutlined,
	FileTextOutlined,
	FileDoneOutlined,
	GiftOutlined,
} from "@ant-design/icons";
import FabMenu from "./FabMenu";
import { Spin } from "antd";
import APIs, { enpoints } from "../../configs/APIs";
import { useSearchParams } from "react-router-dom";

const { Title, Text } = Typography;
const JobPostDetail = () => {
	const [job, setJob] = useState(null);
	const [q] = useSearchParams();
	const [loading, setLoading] = useState(false);

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
		loadJobPost();
	}, []);

	return (
		<>
			<Row justify="center" style={{ marginTop: "20px" }}>
				{job === null && <Spin />}
				{job !== null && (
					<Col xs={24} sm={20} md={16} lg={12}>
						<Card
							title={
								<Title
									style={{
										textTransform: "uppercase",
										color: "#fff",
										marginTop: 15,
									}}
									level={3}
								>
									{job.jobTitle}
								</Title>
							}
							extra={<Tag color="blue">{job.workType.name}</Tag>}
							style={{
								borderRadius: 15,
								boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
								backgroundColor: "#f9f9f9",
							}}
							headStyle={{
								backgroundColor: "rgb(30 136 229)",
								color: "white",
								borderRadius: "15px 15px 0 0",
							}}
						>
							<Row gutter={[16, 16]}>
								<Col
									xs={24}
									sm={12}
									md={8}
									style={{ textAlign: "center" }}
								>
									<Avatar
										size={100}
										src={job.user.avatar}
										icon={<UserOutlined />}
										style={{
											border: "2px solid #001529",
										}}
									/>
									<Title level={4} style={{ marginTop: 10 }}>
										{job.user.companyName}
									</Title>
									<Text type="secondary">
										{job.user.email}
									</Text>
								</Col>
								<Col xs={24} sm={12} md={16}>
									<Row gutter={[16, 16]}>
										<Col span={24}>
											<Text strong>
												<CalendarOutlined /> Hạn ứng
												tuyển
											</Text>
											<Text>{` ${new Date(job.applicationDueDate).toLocaleDateString()}`}</Text>
										</Col>
										<Col span={24}>
											<Text strong>
												<EnvironmentOutlined /> Khu vực
												tuyển:
											</Text>
											<Text>{` ${job.jobLocation.name}`}</Text>
										</Col>
										<Col span={24}>
											<Text strong>
												<MoneyCollectOutlined /> Mức
												lương:
											</Text>
											<Text>{` ${job.salaryRange}`}</Text>
										</Col>
										<Col span={24}>
											<Text strong>
												<TeamOutlined /> Số lượng tuyển:
											</Text>
											<Text>{` ${job.hiringQuantity}`}</Text>
										</Col>
										<Col span={24}>
											<Text strong>
												<FieldTimeOutlined /> Kinh
												nghiệm yêu cầu:
											</Text>
											<Text>{` ${job.requiredExperience}`}</Text>
										</Col>
									</Row>
								</Col>
							</Row>

							<Divider />

							<Row gutter={[16, 16]}>
								<Col span={24}>
									<Title level={4}>
										<FileTextOutlined /> Mô tả công việc
									</Title>
									<Text>
										<span
											dangerouslySetInnerHTML={{
												__html: `- ${job.jobDescription.replace(/\n/g, "<br />- ")}`,
											}}
										/>
									</Text>
								</Col>
								<Col span={24}>
									<Title level={4}>
										<FileDoneOutlined /> Yêu cầu ứng viên
									</Title>
									<Text>
										<span
											dangerouslySetInnerHTML={{
												__html: `- ${job.requirements.replace(/\n/g, "<br />- ")}`,
											}}
										/>
									</Text>
								</Col>
								<Col span={24}>
									<Title level={4}>
										<GiftOutlined /> Quyền lợi
									</Title>
									<Text>
										<span
											dangerouslySetInnerHTML={{
												__html: `- ${job.benefits.replace(/\n/g, "<br />- ")}`,
											}}
										/>
									</Text>
								</Col>
								<Col span={24}>
									<Title level={4}>
										<EnvironmentOutlined /> Địa điểm làm
										việc
									</Title>
									<Text>{job.detailedWorkplace}</Text>
								</Col>
							</Row>
							<FabMenu jobPostId={job.id} />
						</Card>
					</Col>
				)}
			</Row>
		</>
	);
};

export default JobPostDetail;
