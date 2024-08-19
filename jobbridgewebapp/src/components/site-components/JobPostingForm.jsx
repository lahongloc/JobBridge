import React, { useContext, useEffect, useState } from "react";
import {
	Form,
	Input,
	Button,
	DatePicker,
	Select,
	Radio,
	Col,
	Row,
	Typography,
} from "antd";
import { DownOutlined } from "@ant-design/icons";
import "antd/dist/reset.css"; // Import Ant Design styles
import APIs, { enpoints } from "../../configs/APIs";
import cookie from "react-cookies";
import dayjs from "dayjs";
import { message, Space, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { paths } from "../../authorizations/paths";
import SalaryRange from "../ui components/SalaryRange";
import {
	JobFieldContext,
	JobLocationContext,
	WorkTypeContext,
} from "../../App";

const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;

const JobPostingForm = () => {
	const workTypes = useContext(WorkTypeContext);
	const jobFields = useContext(JobFieldContext);
	const jobLocations = useContext(JobLocationContext);

	const [loading, setLoading] = useState(false);
	const [messageApi, contextHolder] = message.useMessage();
	const navigate = useNavigate();

	const handleFinish = async (values) => {
		if (Array.isArray(values.salaryRange)) {
			const [min, max] = values.salaryRange;
			values.salaryRange = `${min} - ${max} triệu`;
		}
		try {
			const res = await APIs.post(enpoints["jobPostHandlder"], values, {
				headers: {
					Authorization: `Bearer ${cookie.load("token")}`,
				},
			});
			if (res.status === 200) {
				messageApi.open({
					type: "success",
					content: "Đăng tin tuyển dụng thành công!",
				});
				navigate(paths.home);
			} else {
				messageApi.open({
					type: "error",
					content: "Đăng tin tuyển dụng thất bại",
				});
			}
			setLoading(false);
		} catch (err) {
			messageApi.open({
				type: "error",
				content: "Đăng tin tuyển dụng thất bại",
			});
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div style={{ padding: "20px", maxWidth: "1200px", margin: "auto" }}>
			{contextHolder}
			<Title level={2}>Đăng Tin Tuyển Dụng</Title>
			<Form onFinish={handleFinish} layout="vertical">
				<Row gutter={16}>
					<Col span={12}>
						<Form.Item
							name="jobTitle"
							label="Tiêu đề"
							rules={[
								{
									required: true,
									message: "Vui lòng nhập tiêu đề!",
								},
							]}
						>
							<Input placeholder="Nhập tiêu đề công việc" />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item
							name="hiringQuantity"
							label="Số lượng tuyển"
							rules={[
								{
									required: true,
									message: "Vui lòng nhập số lượng tuyển!",
								},
								({ getFieldValue }) => ({
									validator(_, value) {
										if (value > 0) {
											return Promise.resolve();
										}
										return Promise.reject(
											new Error(
												"Số lượng tuyển phải lớn hơn 0!",
											),
										);
									},
								}),
							]}
						>
							<Input
								min={1}
								type="number"
								placeholder="Nhập số lượng tuyển"
							/>
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={16}>
					<Col span={12}>
						<Form.Item
							name="salaryRange"
							label="Khoảng lương"
							rules={[
								{
									required: true,
									message: "Vui lòng nhập khoảng lương!",
								},
							]}
						>
							<SalaryRange
								onChange={(value) => console.log(value)}
							/>
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={16}>
					<Col span={12}>
						<Form.Item
							name="requiredExperience"
							label="Yêu cầu kinh nghiệm"
							rules={[
								{
									required: true,
									message:
										"Vui lòng nhập yêu cầu kinh nghiệm!",
								},
							]}
						>
							<Input placeholder="Nhập yêu cầu kinh nghiệm" />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item
							name="applicationDueDate"
							label="Hạn chót ứng tuyển"
							rules={[
								{
									required: true,
									message:
										"Vui lòng chọn hạn chót ứng tuyển!",
								},
							]}
						>
							<DatePicker
								placeholder="Chọn hạn chót ứng tuyển"
								style={{ width: "100%" }}
								disabledDate={(current) => {
									// Disable all dates before today
									return (
										current &&
										current < dayjs().endOf("day")
									);
								}}
							/>
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={16}>
					<Col span={24}>
						<Form.Item
							name="jobDescription"
							label="Mô tả công việc"
							rules={[
								{
									required: true,
									message: "Vui lòng nhập mô tả công việc!",
								},
							]}
						>
							<TextArea
								rows={4}
								placeholder="Nhập mô tả công việc"
							/>
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={16}>
					<Col span={24}>
						<Form.Item
							name="requirements"
							label="Yêu cầu"
							rules={[
								{
									required: true,
									message: "Vui lòng nhập yêu cầu!",
								},
							]}
						>
							<TextArea rows={4} placeholder="Nhập yêu cầu" />
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={16}>
					<Col span={24}>
						<Form.Item
							name="benefits"
							label="Lợi ích khi làm việc"
							rules={[
								{
									required: true,
									message:
										"Vui lòng nhập lợi ích khi làm việc!",
								},
							]}
						>
							<TextArea
								rows={4}
								placeholder="Nhập lợi ích khi làm việc"
							/>
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={16}>
					<Col span={12}>
						<Form.Item
							name="detailedWorkplace"
							label="Địa chỉ làm việc"
							rules={[
								{
									required: true,
									message: "Vui lòng nhập địa chỉ làm việc!",
								},
							]}
						>
							<Input placeholder="Nhập địa chỉ làm việc" />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item
							name="workType"
							label="Hình thức làm việc"
							rules={[
								{
									required: true,
									message:
										"Vui lòng chọn hình thức làm việc!",
								},
							]}
						>
							<Select
								showSearch
								placeholder="Chọn hình thức làm việc"
								suffixIcon={<DownOutlined />}
								filterOption={(input, option) =>
									(option?.children ?? "")
										.toLowerCase()
										.includes(input.toLowerCase())
								}
							>
								{workTypes.map((workType, index) => {
									return (
										<Option key={index} value={workType.id}>
											{workType.name}
										</Option>
									);
								})}
							</Select>
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={16}>
					<Col span={12}>
						<Form.Item
							name="jobLocation"
							label="Khu vực tuyển"
							rules={[
								{
									required: true,
									message: "Vui lòng chọn khu vực tuyển!",
								},
							]}
						>
							<Select
								showSearch
								placeholder="Chọn khu vực tuyển"
								suffixIcon={<DownOutlined />}
								filterOption={(input, option) =>
									(option?.children ?? "")
										.toLowerCase()
										.includes(input.toLowerCase())
								}
							>
								{jobLocations.map((jobLocation, index) => {
									return (
										<Option
											key={index}
											value={jobLocation.id}
										>
											{jobLocation.name}
										</Option>
									);
								})}
							</Select>
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item
							name="jobField"
							label="Ngành nghề/Lĩnh vực"
							rules={[
								{
									required: true,
									message:
										"Vui lòng chọn ngành nghề/lĩnh vực!",
								},
							]}
						>
							<Select
								showSearch
								placeholder="Chọn ngành nghề/lĩnh vực"
								suffixIcon={<DownOutlined />}
								filterOption={(input, option) =>
									(option?.children ?? "")
										.toLowerCase()
										.includes(input.toLowerCase())
								}
							>
								{jobFields.map((jobField, index) => {
									return (
										<Option key={index} value={jobField.id}>
											{jobField.name}
										</Option>
									);
								})}
							</Select>
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={16}>
					<Col span={24}>
						<Form.Item
							name="requiredGender"
							label="Giới tính yêu cầu"
							rules={[
								{
									required: true,
									message: "Vui lòng chọn giới tính yêu cầu!",
								},
							]}
						>
							<Radio.Group>
								<Radio value="Nam">Nam</Radio>
								<Radio value="Nữ">Nữ</Radio>
								<Radio value="Không yêu cầu">
									Không yêu cầu
								</Radio>
							</Radio.Group>
						</Form.Item>
					</Col>
				</Row>

				<Form.Item>
					<Button disabled={loading} type="primary" htmlType="submit">
						Đăng Tin {loading && <Spin />}
					</Button>
				</Form.Item>
			</Form>
		</div>
	);
};

export default JobPostingForm;
