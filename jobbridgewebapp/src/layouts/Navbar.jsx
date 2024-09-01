import React, { useState, useContext } from "react";
import {
	Menu,
	Dropdown,
	Button,
	Space,
	Modal,
	Typography,
	Radio,
	Row,
	Col,
	Avatar,
} from "antd";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { paths } from "../authorizations/paths";
import { UserContext } from "../App";
import { isLogin } from "../authorizations/roleAuth";
import UserAvatar from "../components/ui components/UserAvatar";
import { UserOutlined, SolutionOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const Navbar = () => {
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [selectedOption, setSelectedOption] = useState(null);
	const [selectedMenu, setSelectedMenu] = useState(null); // State để lưu menu được chọn
	const navigate = useNavigate();
	const [user, dispatch] = useContext(UserContext);

	const showModal = () => {
		setIsModalVisible(true);
	};

	const handleOk = () => {
		if (selectedOption === "applicant") {
			navigate("/applicant-register");
		} else if (selectedOption === "recruiter") {
			navigate("/employer-register");
		}
		setIsModalVisible(false);
	};

	const handleCancel = () => {
		setIsModalVisible(false);
	};

	const handleOptionChange = (e) => {
		setSelectedOption(e.target.value);
	};

	const menuItems = [
		{
			key: "jobs",
			label: "Việc làm",
			items: [
				{ key: "1", label: "Tìm việc", link: paths.home },
				{
					key: "2",
					label: "Việc làm theo ngành nghề",
					link: "/jobs/industry",
				},
				{
					key: "3",
					label: "Việc làm theo địa điểm",
					link: "/jobs/location",
				},
				{
					key: "4",
					label: "Việc làm đã ứng tuyển",
					link: paths["application-management"],
				},
			],
		},
		{
			key: "resume",
			label: "Hồ sơ & CV",
			items: [
				{ key: "1", label: "Quản lý CV", link: "/resume-management" },
				{ key: "2", label: "Tải CV lên", link: paths["upload-cv"] },
				{ key: "3", label: "Xem Hồ sơ", link: "/resume/view" },
			],
		},
		{
			key: "company",
			label: "Công ty",
			items: [
				{
					key: "1",
					label: "Danh sách công ty",
					link: "/company/list",
				},
				{
					key: "2",
					label: "Công ty nổi bật",
					link: "/company/highlights",
				},
			],
		},
		{
			key: "tools",
			label: "Công cụ",
			items: [
				{ key: "1", label: "Tính lương", link: "/tools/salary" },
				{
					key: "2",
					label: "Ước tính thuế thu nhập",
					link: "/tools/tax",
				},
			],
		},
		{
			key: "career",
			label: "Cẩm nang nghề nghiệp",
			items: [
				{ key: "1", label: "Mẹo tìm việc", link: "/career/tips" },
				{
					key: "2",
					label: "Hướng dẫn viết CV",
					link: "/career/guide",
				},
			],
		},
	];

	// Handle menu item click
	const handleMenuClick = (link, menuKey) => {
		navigate(link);
		setSelectedMenu(menuKey); // Cập nhật menu được chọn
	};

	// Dropdown menu generator
	const renderDropdown = (menu, index) => (
		<Dropdown
			key={index}
			overlay={
				<Menu>
					{menu.items.map((item) => (
						<Menu.Item
							key={item.key}
							onClick={() => handleMenuClick(item.link, menu.key)}
						>
							{item.label}
						</Menu.Item>
					))}
				</Menu>
			}
			trigger={["hover"]}
		>
			<Button
				type="link"
				style={{
					fontWeight: "bold",
					fontSize: "15px",
					color: selectedMenu === menu.key ? "#1890ff" : "black", // Đổi màu khi menu được chọn
				}}
				onClick={
					() => handleMenuClick(menu.items[0].link, menu.key) // Navigate đến item đầu tiên
				}
			>
				{menu.label}
			</Button>
		</Dropdown>
	);

	return (
		<div
			style={{
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
				padding: "10px 20px",
				backgroundColor: "#fff",
				borderBottom: "1px solid #f0f0f0",
				position: "fixed",
				top: "0",
				left: "0",
				right: "0",
				zIndex: "1000", // Ensure the navbar is above other content
				marginBottom: "20px", // Adds space below the navbar
				boxShadow: "rgba(33, 35, 38, 0.1) 0px 10px 10px -10px",
			}}
		>
			{/* Logo bên trái */}
			<div style={{ display: "flex", alignItems: "center" }}>
				<img
					onClick={() => navigate(paths.home)}
					src={logo}
					alt="Logo"
					style={{
						height: "40px",
						marginRight: "20px",
						cursor: "pointer",
					}}
				/>
			</div>

			<Space>
				{menuItems.map((menu, index) => renderDropdown(menu, index))}
			</Space>

			<Space>
				{!isLogin(user) && (
					<>
						<Button
							type="default"
							onClick={() => navigate(paths["user-login"])}
							style={{ fontWeight: "bold", fontSize: "15px" }}
						>
							Đăng nhập
						</Button>
						<Button
							type="primary"
							onClick={showModal}
							style={{ fontWeight: "bold", fontSize: "15px" }}
						>
							Đăng ký
						</Button>
						<Modal
							title="Chào bạn,"
							visible={isModalVisible}
							onOk={handleOk}
							onCancel={handleCancel}
							okText="Xác nhận"
							cancelText="Hủy"
							okButtonProps={{ disabled: !selectedOption }} // Disable the confirm button until an option is selected
						>
							<Paragraph>
								Bạn hãy dành ra vài giây để xác nhận thông tin
								dưới đây nhé!
							</Paragraph>
							<Paragraph>
								Để tối ưu tốt nhất cho trải nghiệm của bạn với
								JobBridge, vui lòng lựa chọn nhóm phù hợp nhất
								với bạn:
							</Paragraph>

							<Radio.Group
								onChange={handleOptionChange}
								style={{ width: "100%" }}
							>
								<Row gutter={16} align="middle">
									<Col
										span={12}
										style={{ textAlign: "center" }}
									>
										<Avatar
											size={64}
											icon={<UserOutlined />}
											style={{
												backgroundColor: "#87d068",
												marginBottom: "10px",
											}}
										/>
										<Radio value="applicant">
											Tôi là ứng viên tìm việc
										</Radio>
									</Col>
									<Col
										span={12}
										style={{ textAlign: "center" }}
									>
										<Avatar
											size={64}
											icon={<SolutionOutlined />}
											style={{
												backgroundColor: "#1890ff",
												marginBottom: "10px",
											}}
										/>
										<Radio value="recruiter">
											Tôi là nhà tuyển dụng
										</Radio>
									</Col>
								</Row>
							</Radio.Group>
						</Modal>
					</>
				)}
				{isLogin(user) && (
					<>
						<UserAvatar icon={user.avatar} />
					</>
				)}
			</Space>
		</div>
	);
};

export default Navbar;
