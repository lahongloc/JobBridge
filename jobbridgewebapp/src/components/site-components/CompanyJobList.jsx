import { useEffect, useState } from "react";
import APIs, { enpoints } from "../../configs/APIs";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Row, Col, Card, Pagination } from "antd";
import { DollarOutlined, EnvironmentOutlined } from "@ant-design/icons";
import CompanyList from "./CompanyList"; // Assuming this is another component
import RecruiterList from "../ui components/RecruiterList";
import { paths } from "../../authorizations/paths";

const CompanyJobList = () => {
	const [jobList, setJobList] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalItems, setTotalItems] = useState(0); // Total number of jobs
	const [companies, setCompanies] = useState(null);
	const [currentCompanyPage, setCurrentCompanyPage] = useState(1);

	const [q] = useSearchParams();

	const handlePageChange = (page) => {
		setCurrentPage(page);
	};

	const handleCompanyPageChange = (page) => {
		setCurrentCompanyPage(page);
	};

	const loadJobList = async () => {
		try {
			const res = await APIs.get(
				`${enpoints["getJobPostByCompany"]}/recruiterId=${q.get("companyId")}&pageNumber=${currentPage}`,
			);
			const { content, totalElements } = res.data.result;
			setJobList(content);
			setTotalItems(totalElements);
		} catch (err) {
			console.error(err);
		}
	};

	const loadCompanies = async () => {
		try {
			const res = await APIs.get(
				`${enpoints["getCompanies"]}/pageNumber=${currentCompanyPage}`,
			);
			setCompanies(res.data);
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		loadJobList();
	}, [currentPage, q]);

	useEffect(() => {
		loadCompanies();
	}, [currentCompanyPage]);

	const truncateTitle = (title, length) => {
		return title.length > length ? `${title.slice(0, length)}...` : title;
	};

	const navigate = useNavigate();

	return (
		jobList && (
			<div style={{ width: "80%", margin: "auto", paddingTop: "3rem" }}>
				<Row gutter={[16, 16]}>
					<Col
						xs={24}
						sm={24}
						md={9}
						lg={9}
						style={{ maxWidth: "38%" }}
					>
						{companies !== null && (
							<RecruiterList
								notFlex={false}
								data={companies}
								current={q.get("companyId")}
								currentPage={currentCompanyPage}
								handlePageChange={handleCompanyPageChange}
							/>
						)}
					</Col>
					<Col
						xs={24}
						sm={24}
						md={15}
						lg={15}
						style={{ maxWidth: "62%" }}
					>
						<Row gutter={[16, 16]}>
							{jobList.map((job) => (
								<Col
									key={job.id}
									xs={24}
									sm={24}
									md={24}
									lg={24}
								>
									<Card
										style={{
											borderRadius: "8px",
											border: "1px solid #e0e0e0",
											padding: "20px",
											boxShadow:
												"0 4px 8px rgba(0, 0, 0, 0.05)",
											transition:
												"transform 0.2s ease-in-out",
											width: "100%",
										}}
										hoverable
										bodyStyle={{ padding: "0" }}
										onClick={() =>
											navigate(
												`${paths["job-detail"]}?jobPostId=${job.id}`,
											)
										}
									>
										<div
											style={{
												display: "flex",
												alignItems: "center",
												justifyContent: "space-between",
												paddingBottom: "10px",
											}}
										>
											<span
												style={{
													fontSize: "18px",
													fontWeight: "600",
													display: "inline-block",
													minWidth: "35%",
												}}
											>
												{truncateTitle(
													job.jobTitle,
													29,
												)}
											</span>
											<div>
												<DollarOutlined
													style={{
														fontSize: "16px",
														color: "#1890ff",
													}}
												/>
												<strong
													style={{
														marginLeft: "5px",
													}}
												>
													{job.salaryRange}
												</strong>
											</div>
											<div>
												<EnvironmentOutlined
													style={{
														fontSize: "16px",
														color: "#1890ff",
													}}
												/>
												<span
													style={{
														marginLeft: "5px",
													}}
												>
													{job.jobLocation.name}
												</span>
											</div>
										</div>
									</Card>
								</Col>
							))}
						</Row>
						<Pagination
							current={currentPage}
							pageSize={10} // Assuming each page shows 10 jobs
							total={totalItems} // Set the total number of jobs
							onChange={handlePageChange}
							style={{ textAlign: "center", marginTop: "20px" }}
						/>
					</Col>
				</Row>
			</div>
		)
	);
};

export default CompanyJobList;
