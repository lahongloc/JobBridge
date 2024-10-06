import React, { useEffect, useState } from "react";
import {
	Table,
	Button,
	Avatar,
	Space,
	Popconfirm,
	message,
	Row,
	Col,
	Modal,
	Form,
	Input,
	Select,
} from "antd";
import {
	PlusOutlined,
	EyeOutlined,
	DeleteOutlined,
	UserAddOutlined,
} from "@ant-design/icons";
import APIs, { enpoints } from "../../configs/APIs";
import { roles } from "../../authorizations/roleAuth";
import cookie from "react-cookies";

const { Option } = Select;

const AccountManagement = () => {
	const [recruiters, setRecruiters] = useState([]);
	const [applicants, setApplicants] = useState([]);
	const [admins, setAdmins] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalElements, setTotalElements] = useState(0);

	const [isModalVisible, setIsModalVisible] = useState(false);
	const [selectedRole, setSelectedRole] = useState(null);

	const [form] = Form.useForm();

	const loadUsers = async (role, page) => {
		try {
			const res = await APIs.get(
				`${enpoints["getUsersByRole"]}/role=${role}&pageNumber=${page}`,
			);
			const result = res.data.result;
			if (role === roles.APPLICANT) {
				setApplicants(result.content);
			}
			if (role === roles.RECRUITER) {
				setRecruiters(result.content);
			}
			if (role === roles.ADMIN) {
				setAdmins(result.content);
			}
			setTotalElements(result.totalElements);
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		loadUsers(roles.RECRUITER, currentPage);
		loadUsers(roles.ADMIN, currentPage);
		loadUsers(roles.APPLICANT, currentPage);
	}, [currentPage]);

	const handleDelete = async (id, role) => {
		try {
			const res = await APIs.delete(`${enpoints["userHandler"]}/${id}`, {
				headers: {
					Authorization: `Bearer ${cookie.load("token")}`,
				},
			});
			message.info(`Xóa user thành công`);
			loadUsers(roles.RECRUITER, currentPage);
			loadUsers(roles.ADMIN, currentPage);
			loadUsers(roles.APPLICANT, currentPage);
		} catch (err) {
			message.error(`Xóa user thất bại`);
			console.error(err);
		}
	};

	const handleAddUser = () => {
		setIsModalVisible(true);
	};

	const handleSubmitForm = async (values) => {
		try {
			const formData = new FormData();
			for (const key in values) {
				if (values.hasOwnProperty(key)) {
					formData.append(key, values[key]);
				}
			}
			let url = "";
			if (values.role === roles.APPLICANT) {
				url = enpoints["applicantRegister"];
			}
			if (values.role === roles.RECRUITER) {
				url = enpoints["recruiterRegister"];
			}
			const res = await APIs.post(url, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			message.info(`Thêm user với vai trò: ${values.role}`);
			setIsModalVisible(false);
			form.resetFields();
			loadUsers(roles.RECRUITER, currentPage);
			loadUsers(roles.ADMIN, currentPage);
			loadUsers(roles.APPLICANT, currentPage);
		} catch (err) {
			message.error(
				`Thêm user thất bại, user có thể đã tồn tại trong hệ thống`,
			);
			console.error(err);
		}

		// Gọi API thêm user ở đây
	};

	const handleCancel = () => {
		setIsModalVisible(false);
		form.resetFields(); // Reset form khi hủy bỏ
	};

	const columns = (role) =>
		[
			{
				title: "Avatar",
				dataIndex: "avatar",
				key: "avatar",
				render: (avatar) => <Avatar src={avatar} />,
			},
			{
				title: "Họ và tên",
				dataIndex: "fullname",
				key: "fullname",
			},
			{
				title: "Giới tính",
				dataIndex: "gender",
				key: "gender",
				render: (gender) => (gender ? "Nam" : "Nữ"),
			},
			{
				title: "Email",
				dataIndex: "email",
				key: "email",
			},
			role === roles.RECRUITER
				? {
						title: "Tên công ty",
						dataIndex: "companyName",
						key: "companyName",
					}
				: null,
			{
				title: "Hành động",
				key: "action",
				render: (record) => (
					<Space size="middle">
						<Button
							type="primary"
							icon={<EyeOutlined />}
							onClick={() =>
								message.info(
									`Xem thông tin user: ${record.fullname}`,
								)
							}
						>
							Xem
						</Button>
						<Popconfirm
							title="Bạn có chắc chắn muốn xóa?"
							onConfirm={() => handleDelete(record.id, role)}
							okText="Có"
							cancelText="Không"
						>
							<Button type="danger" icon={<DeleteOutlined />}>
								Xóa
							</Button>
						</Popconfirm>
					</Space>
				),
			},
		].filter(Boolean);

	return (
		<div>
			{/* Bảng Recruiter */}
			<Row
				justify="space-between"
				align="middle"
				style={{ marginBottom: 16 }}
			>
				<Col>
					<h3>Danh sách Nhà tuyển dụng</h3>
				</Col>
				<Col>
					<Button
						type="primary"
						icon={<UserAddOutlined />}
						onClick={handleAddUser}
					>
						Thêm User
					</Button>
				</Col>
			</Row>
			<Table
				columns={columns(roles.RECRUITER)}
				dataSource={recruiters}
				rowKey="id"
				pagination={{
					current: currentPage,
					total: totalElements,
					pageSize: 12,
					onChange: (page) => setCurrentPage(page),
				}}
			/>

			{/* Modal thêm user */}
			<Modal
				title="Thêm user mới"
				visible={isModalVisible}
				onCancel={handleCancel}
				footer={null}
			>
				<Form form={form} layout="vertical" onFinish={handleSubmitForm}>
					<Form.Item
						name="role"
						label="Vai trò"
						rules={[{ required: true, message: "Chọn vai trò!" }]}
					>
						<Select
							placeholder="Chọn vai trò"
							onChange={(value) => setSelectedRole(value)}
						>
							<Option value={roles.APPLICANT}>Ứng viên</Option>
							<Option value={roles.RECRUITER}>
								Nhà tuyển dụng
							</Option>
							<Option value={roles.ADMIN}>Admin</Option>
						</Select>
					</Form.Item>

					{selectedRole === roles.RECRUITER && (
						<Form.Item
							name="companyName"
							label="Tên công ty"
							rules={[
								{
									required: true,
									message: "Nhập tên công ty!",
								},
							]}
						>
							<Input placeholder="Nhập tên công ty" />
						</Form.Item>
					)}

					<Form.Item
						name="fullname"
						label="Họ và tên"
						rules={[{ required: true, message: "Nhập họ và tên!" }]}
					>
						<Input placeholder="Nhập họ và tên" />
					</Form.Item>

					<Form.Item
						name="email"
						label="Email"
						rules={[{ required: true, message: "Nhập email!" }]}
					>
						<Input placeholder="Nhập email" />
					</Form.Item>

					<Form.Item
						name="password"
						label="Mật khẩu"
						rules={[{ required: true, message: "Nhập mật khẩu!" }]}
					>
						<Input.Password placeholder="Nhập mật khẩu" />
					</Form.Item>

					<Form.Item>
						<Button type="primary" htmlType="submit">
							Thêm User
						</Button>
					</Form.Item>
				</Form>
			</Modal>

			{/* Bảng Admin */}
			<Row
				justify="space-between"
				align="middle"
				style={{ marginBottom: 16 }}
			>
				<Col>
					<h3>Danh sách Admin</h3>
				</Col>
			</Row>
			<Table
				columns={columns(roles.ADMIN)}
				dataSource={admins}
				rowKey="id"
				pagination={{
					current: currentPage,
					total: totalElements,
					pageSize: 12,
					onChange: (page) => setCurrentPage(page),
				}}
			/>

			{/* Bảng Applicant */}
			<Row
				justify="space-between"
				align="middle"
				style={{ marginBottom: 16 }}
			>
				<Col>
					<h3>Danh sách Ứng viên</h3>
				</Col>
			</Row>
			<Table
				columns={columns(roles.APPLICANT)}
				dataSource={applicants}
				rowKey="id"
				pagination={{
					current: currentPage,
					total: totalElements,
					pageSize: 12,
					onChange: (page) => setCurrentPage(page),
				}}
			/>
		</div>
	);
};

export default AccountManagement;
