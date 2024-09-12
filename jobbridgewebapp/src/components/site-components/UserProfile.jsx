import React, { useEffect, useState } from "react";
import {
	Card,
	Input,
	Button,
	Row,
	Col,
	Avatar,
	Typography,
	Upload,
	Divider,
	Alert,
	Layout,
	message,
	Tag,
	Radio,
	DatePicker,
	Spin,
} from "antd";
import { UploadOutlined, SaveOutlined } from "@ant-design/icons";
import cookie from "react-cookies";
import dayjs from "dayjs";
import APIs, { enpoints } from "../../configs/APIs";

const { Title } = Typography;
const { Content } = Layout;

const UserProfile = () => {
	const [user, setUser] = useState(null);
	const [initialUser, setInitialUser] = useState(null);
	const loadUser = async () => {
		try {
			const res = await APIs.get(enpoints["currentUser"], {
				headers: {
					Authorization: `Bearer ${cookie.load("token")}`,
				},
			});

			const dob = res.data.result.dob
				? dayjs(res.data.result.dob, "YYYY-DD-MM")
				: null;
			setUser({
				...res.data.result,
				dob,
			});

			setInitialUser({
				...res.data.result,
				dob,
			});
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		loadUser();
	}, []);

	useEffect(() => {
		// console.log("date la: ");
		// if (user && user.hasOwnProperty("dob") && user.dob !== null)
		// 	console.log("khac null");
		// else console.log(user.dob);
	}, [user]);

	const [dobError, setDobError] = useState(null);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setUser((prevUser) => ({
			...prevUser,
			[name]: value,
		}));
	};

	const handleDateChange = (date, dateString) => {
		setUser((prevUser) => ({
			...prevUser,
			dob: date,
		}));
	};

	const handleGenderChange = (e) => {
		setUser((prevUser) => ({
			...prevUser,
			gender: e.target.value,
		}));
	};

	const beforeUpload = (file) => {
		const isImage = file.type.startsWith("image/");
		if (!isImage) {
			message.error("Bạn chỉ có thể tải lên các tệp ảnh!");
			return Upload.LIST_IGNORE;
		}
		setUser((prevUser) => ({
			...prevUser,
			avatarFile: file, // Store the file separately for later upload
			avatar: URL.createObjectURL(file), // For previewing the image
		}));
		return false; // Prevent automatic upload by the Upload component
	};

	const [loading, setLoading] = useState(false);

	const updateUser = async (userData) => {
		setLoading(true);

		const formData = new FormData();
		formData.append("fullname", userData.fullname);
		formData.append("email", userData.email);
		formData.append("dob", dayjs(userData.dob).format("YYYY-MM-DD"));
		formData.append("gender", userData.gender);

		if (userData.avatarFile) {
			formData.append("avatar", userData.avatarFile);
		}

		try {
			const res = await APIs.put(
				`${enpoints["userHandler"]}/${cookie.load("user").id}`,
				formData,
				{
					headers: {
						Authorization: `Bearer ${cookie.load("token")}`,
					},
				},
			);
			message.success("Hồ sơ đã được lưu thành công!");
			loadUser();
		} catch (err) {
			message.error("Lưu hồ sơ thất bại!");
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	const handleSave = () => {
		if (dobError) {
			message.error("Không thể lưu hồ sơ do có lỗi trong thông tin.");
			return;
		}

		const changedData = {};
		for (const key in user) {
			if (user[key] !== initialUser[key]) {
				if (key === "dob") {
					const userDob = dayjs(user.dob);
					const initialUserDob = dayjs(initialUser.dob);

					if (!userDob.isSame(initialUserDob, "day")) {
						changedData[key] = userDob.format("YYYY-MM-DD");
					}
				} else {
					changedData[key] = user[key];
				}
			}
		}

		if (Object.keys(changedData).length > 0 || user.avatarFile) {
			updateUser(user);
		} else {
			message.info("Không có thay đổi nào cần lưu.");
		}
	};

	return (
		<Layout
			style={{
				minHeight: "100vh",
				background: "#fff",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				padding: "20px",
			}}
		>
			{user !== null && (
				<Content style={{ width: "100%", maxWidth: "1200px" }}>
					<Row gutter={[32, 32]} justify="center">
						{/* Left Side - Form */}
						<Col xs={24} sm={24} md={14}>
							<Card
								title={
									<Tag
										style={{
											fontSize: "15px",
											padding: "5px",
										}}
										color="volcano"
									>
										CẬP NHẬP THÔNG TIN HỒ SƠ
									</Tag>
								}
								style={{
									borderRadius: "12px",
									boxShadow:
										"0px 4px 12px rgba(0, 0, 0, 0.1)",
								}}
								bodyStyle={{ padding: "30px" }}
							>
								<Input
									placeholder="Họ và tên"
									name="fullname"
									value={user.fullname}
									onChange={handleInputChange}
									style={{ marginBottom: 20 }}
								/>

								<DatePicker
									placeholder="Ngày sinh (dd/mm/yyyy)"
									name="dob"
									value={
										user.dob
											? dayjs(user.dob, "DD/MM/YYYY")
											: null
									}
									onChange={handleDateChange}
									format="DD/MM/YYYY"
									style={{ marginBottom: 20, width: "100%" }}
									allowClear={false}
								/>

								{dobError && (
									<Alert
										message={dobError}
										type="error"
										showIcon
										style={{ marginBottom: 20 }}
									/>
								)}
								<Radio.Group
									onChange={handleGenderChange}
									value={user.gender}
									style={{ marginBottom: 20 }}
								>
									<Radio value={true}>Nam</Radio>
									<Radio value={false}>Nữ</Radio>
								</Radio.Group>
								<Input
									placeholder="Email"
									disabled={true}
									name="email"
									value={user.email}
									onChange={handleInputChange}
									style={{ marginBottom: 20 }}
								/>
								<Button
									type="primary"
									icon={<SaveOutlined />}
									onClick={handleSave}
									style={{
										borderRadius: "6px",
										width: "100%",
										backgroundColor: "#1890ff",
										borderColor: "#1890ff",
									}}
									disabled={loading}
								>
									Lưu {loading && <Spin />}
								</Button>
							</Card>
						</Col>

						{/* Right Side - Profile Info */}
						<Col xs={24} sm={24} md={10}>
							<Card
								style={{
									borderRadius: "12px",
									boxShadow:
										"0px 4px 12px rgba(0, 0, 0, 0.1)",
								}}
								bodyStyle={{
									padding: "30px",
									textAlign: "left",
								}}
							>
								<div style={{ textAlign: "center" }}>
									<Upload
										name="avatar"
										showUploadList={false}
										beforeUpload={beforeUpload}
										style={{ marginBottom: 20 }}
									>
										<Avatar
											size={120}
											src={user.avatar}
											style={{
												border: "4px solid #f0f0f0",
												marginBottom: 12,
												cursor: "pointer",
											}}
										/>
									</Upload>
									<Title
										level={4}
										style={{ marginBottom: 20 }}
									>
										{user.fullname}
									</Title>
								</div>
								<Divider />
								<Alert
									message="Khi có cơ hội việc làm phù hợp, NTD sẽ liên hệ và trao đổi với bạn qua:"
									description={
										<ul
											style={{
												margin: 0,
												paddingLeft: "20px",
												textAlign: "left",
											}}
										>
											<li>
												Nhắn tin qua Top Connect trên
												JobBridge
											</li>
											<li>
												Email và Số điện thoại của bạn
											</li>
										</ul>
									}
									type="info"
									showIcon
									style={{ marginBottom: 20 }}
								/>
								<Alert
									style={{ marginBottom: 20 }}
									message="Tham khảo những tips hay để cải thiện hồ sơ giúp thu hút nhà tuyển dụng ngay!"
									type="success"
									showIcon
								/>
							</Card>
						</Col>
					</Row>
				</Content>
			)}
		</Layout>
	);
};

export default UserProfile;
