import { useEffect, useState } from "react";
import { Row, Col, Card, Statistic, Select } from "antd";
import { Column, Pie, Bar } from "@ant-design/charts";
import {
	UserOutlined,
	ShopOutlined,
	AreaChartOutlined,
	AppstoreOutlined,
} from "@ant-design/icons"; // Thêm icon
import APIs, { enpoints } from "../../configs/APIs";
import cookie from "react-cookies";

const ReportStatistics = () => {
	const [roleStatistic, setRoleStatistic] = useState(null);
	const [jobFieldStatistic, setJobFieldStatistic] = useState(null);
	const [jobLocationStatistic, setJobLocationStatistic] = useState(null);
	const [jobFieldYear, setJobFieldYear] = useState(new Date().getFullYear());
	const [jobLocationYear, setJobLocationYear] = useState(
		new Date().getFullYear(),
	);
	const years = [2022, 2023, 2024];

	const loadStatistics = async (fieldYear, locationYear) => {
		try {
			const jobFieldRes = await APIs.get(
				`${enpoints["jobPostFielsStatistic"]}?year=${fieldYear}`,
				{
					headers: {
						Authorization: `Bearer ${cookie.load("token")}`,
					},
				},
			);
			setJobFieldStatistic(jobFieldRes.data.result);

			const jobLocationRes = await APIs.get(
				`${enpoints["jobLocationStatistic"]}?year=${locationYear}`,
				{
					headers: {
						Authorization: `Bearer ${cookie.load("token")}`,
					},
				},
			);
			setJobLocationStatistic(jobLocationRes.data.result);

			const roleRes = await APIs.get(enpoints["roleStatistic"], {
				headers: {
					Authorization: `Bearer ${cookie.load("token")}`,
				},
			});

			setRoleStatistic(roleRes.data.result);
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		loadStatistics(jobFieldYear, jobLocationYear);
	}, [jobFieldYear, jobLocationYear]);

	const formatJobFieldStats = () => {
		if (!jobFieldStatistic) return [];
		return Object.entries(jobFieldStatistic).map(([field, count]) => ({
			field: count > 0 ? field : "Other Job Fields",
			count: count > 0 ? count : 0,
		}));
	};

	const formatJobLocationStats = () => {
		if (!jobLocationStatistic) return [];
		return Object.entries(jobLocationStatistic)
			.map(([location, count]) => ({
				location,
				count: parseInt(count, 10),
			}))
			.filter((item) => item.count > 0);
	};

	const formatRoleStats = () => {
		if (!roleStatistic) return [];
		return Object.entries(roleStatistic).map(([role, count]) => ({
			role,
			count,
		}));
	};

	const jobFieldChartData = formatJobFieldStats();
	const jobLocationChartData = formatJobLocationStats();
	const roleChartData = formatRoleStats();

	return (
		<div style={{ padding: 20, background: "#f0f2f5" }}>
			{" "}
			{/* Thêm màu nền nhẹ */}
			<Row gutter={16}>
				<Col span={8}>
					<Card>
						<Statistic
							title={
								<span>
									<UserOutlined /> Số lượng ứng viên tìm việc
								</span>
							} // Thêm icon
							value={
								roleStatistic
									? roleStatistic.applicantNumber
									: 0
							}
							precision={0}
							style={{
								backgroundColor: "#fafafa",
								padding: "20px",
								borderRadius: "8px",
							}}
						/>
					</Card>
				</Col>
				<Col span={8}>
					<Card>
						<Statistic
							title={
								<span>
									<ShopOutlined /> Số lượng nhà tuyển dụng
								</span>
							} // Thêm icon
							value={
								roleStatistic
									? roleStatistic.recruiterNumber
									: 0
							}
							precision={0}
							style={{
								backgroundColor: "#fafafa",
								padding: "20px",
								borderRadius: "8px",
							}}
						/>
					</Card>
				</Col>
			</Row>
			{/* Pie chart */}
			<Row gutter={16} style={{ marginTop: 20 }}>
				<Col span={24}>
					<Card title="Thống kê theo vai trò(role)">
						<div
							style={{
								width: "500px",
								height: "200px",
								margin: "0 auto",
							}}
						>
							{" "}
							{/* Đặt kích thước cho biểu đồ */}
							<Pie
								data={roleChartData}
								angleField="count"
								colorField="role"
								label={{
									type: "outer",
									content: "{name}: {percentage}",
								}}
								interactions={[{ type: "element-active" }]}
								style={{ height: "100%", width: "100%" }} // Đặt chiều cao và chiều rộng thành 100% để khớp với div cha
							/>
						</div>
					</Card>
				</Col>
			</Row>
			{/* Job field statistics */}
			<Row gutter={16} style={{ marginTop: 20 }}>
				<Col span={12}>
					<Card
						title={
							<span>
								<AreaChartOutlined /> Thống kê theo ngành
								nghề/lĩnh vực
							</span>
						}
					>
						{" "}
						{/* Thêm icon */}
						<Select
							defaultValue={jobFieldYear}
							style={{ width: 120, marginBottom: 16 }}
							onChange={(value) => setJobFieldYear(value)}
						>
							{years.map((yr) => (
								<Select.Option key={yr} value={yr}>
									{yr}
								</Select.Option>
							))}
						</Select>
						<Bar
							data={jobFieldChartData}
							xField="field"
							yField="count"
							label={{
								position: "middle",
								style: {
									fill: "#FFFFFF",
									opacity: 0.6,
								},
							}}
							color={["#0050B3", "#D3AD8C", "#FF4D4F"]}
							tooltip={{
								fields: ["field", "count"],
								formatter: (datum) => ({
									name: datum.field,
									value: datum.count,
								}),
							}}
						/>
					</Card>
				</Col>

				{/* Job location statistics */}
				<Col span={12}>
					<Card
						title={
							<span>
								<AreaChartOutlined /> Thống kê theo khu vực
							</span>
						}
					>
						{" "}
						{/* Thêm icon */}
						<Select
							defaultValue={jobLocationYear}
							style={{ width: 120, marginBottom: 16 }}
							onChange={(value) => setJobLocationYear(value)}
						>
							{years.map((yr) => (
								<Select.Option key={yr} value={yr}>
									{yr}
								</Select.Option>
							))}
						</Select>
						<Column
							data={jobLocationChartData}
							xField="location"
							yField="count"
							label={{
								position: "middle",
								style: {
									fill: "#FFFFFF",
									opacity: 0.6,
								},
							}}
							color={["#4CAF50", "#FF9800", "#F44336"]}
							tooltip={{
								fields: ["location", "count"],
								formatter: (datum) => ({
									name: datum.location,
									value: datum.count,
								}),
							}}
						/>
					</Card>
				</Col>
			</Row>
		</div>
	);
};

export default ReportStatistics;
