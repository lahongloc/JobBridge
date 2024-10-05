import { useNavigate } from "react-router-dom";
import { paths } from "../../authorizations/paths";
import { Card, Row, Col, Pagination, Typography, Avatar, Button } from "antd";
import { MailOutlined } from "@ant-design/icons";

const { Text } = Typography;

const RecruiterList = ({
	data,
	handlePageChange,
	currentPage,
	notFlex = true,
	current = "",
}) => {
	const pageSize = data.result.size || 12;
	const navigate = useNavigate();

	const handleViewJobs = (companyId) => {
		console.log("ID công ty:", companyId);
	};

	return (
		<div style={{ padding: "20px" }}>
			<Row gutter={[16, 16]}>
				{data.result.content.map((recruiter) => (
					<Col
						xs={24}
						sm={notFlex ? 12 : 24}
						md={notFlex ? 8 : 24}
						lg={notFlex ? 8 : 24}
						key={recruiter.id}
					>
						{/* xs={24} sm={24} md={24} lg={24} */}
						<Card
							onClick={() =>
								navigate(
									`${paths["companies-hiring"]}/company?companyId=${recruiter.id}`,
								)
							}
							bordered={false}
							style={{
								borderRadius: "8px",
								textAlign: "left",
								padding: "2px",
								cursor: "pointer",
								transition: "border 0.3s",
								boxShadow: `${current === recruiter.id ? "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px" : ""}`,
							}}
							onMouseEnter={(e) =>
								(e.currentTarget.style.border =
									"1px solid #1890ff")
							}
							onMouseLeave={(e) =>
								(e.currentTarget.style.border = "none")
							}
						>
							<div
								style={{
									display: "flex",
									justifyContent: "flex-start",
									alignItems: "center",
								}}
							>
								<Avatar
									src={recruiter.avatar}
									size={64}
									style={{ marginRight: "30px" }}
								/>
								<div>
									<br />
									<Text strong>{recruiter.companyName}</Text>
									<br />
									<Text
										style={{
											display: "flex",
											alignItems: "center",
											marginBottom: 10,
										}}
									>
										<MailOutlined
											style={{ marginRight: 5 }}
										/>
										{recruiter.email}
									</Text>
								</div>
							</div>
						</Card>
					</Col>
				))}
			</Row>

			<Pagination
				current={currentPage}
				pageSize={pageSize}
				total={data.result.totalElements}
				onChange={handlePageChange}
				style={{ marginTop: "20px", textAlign: "left" }}
			/>
		</div>
	);
};

export default RecruiterList;
