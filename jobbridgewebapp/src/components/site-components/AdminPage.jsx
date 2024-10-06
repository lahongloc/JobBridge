import React, { useState } from "react";
import { Layout, Menu } from "antd";
import AccountManagement from "./AccountManagement";
import ReportStatistics from "./ReportStatistics";

const { Sider, Content } = Layout;

const JobManagement = () => (
	<div>
		<h2>Quản lý tin tuyển dụng</h2>
		<p>Đây là giao diện quản lý tin tuyển dụng.</p>
	</div>
);

const AdminPage = () => {
	const [selectedMenu, setSelectedMenu] = useState("1");

	const handleMenuClick = ({ key }) => {
		setSelectedMenu(key);
	};

	const renderContent = () => {
		switch (selectedMenu) {
			case "1":
				return <AccountManagement />;
			case "2":
				return <JobManagement />;
			case "3":
				return <ReportStatistics />;
			default:
				return null;
		}
	};

	return (
		<Layout
			style={{
				minHeight: "100vh",
			}}
		>
			{/* Sider với nền xanh đen trong suốt và màu chữ sáng phù hợp */}
			<Sider
				width="25%"
				style={{
					background: "rgba(0, 21, 41, 0.8)", // Nền xanh đen với độ trong suốt
					color: "#d3d3d3", // Màu chữ sáng, xám nhạt
				}}
			>
				<Menu
					mode="inline"
					defaultSelectedKeys={["1"]}
					onClick={handleMenuClick}
					style={{
						background: "transparent", // Nền trong suốt cho Menu
						color: "#d3d3d3", // Màu chữ xám nhạt
					}}
					theme="dark" // Đặt theme tối cho menu
					items={[
						{
							key: "1",
							label: "Quản lý tài khoản",
							style: {
								color:
									selectedMenu === "1"
										? "#ffffff"
										: "#d3d3d3",
							}, // Màu khi được chọn
						},
						{
							key: "2",
							label: "Quản lý tin tuyển dụng",
							style: {
								color:
									selectedMenu === "2"
										? "#ffffff"
										: "#d3d3d3",
							}, // Màu khi được chọn
						},
						{
							key: "3",
							label: "Báo cáo thống kê",
							style: {
								color:
									selectedMenu === "3"
										? "#ffffff"
										: "#d3d3d3",
							}, // Màu khi được chọn
						},
					]}
					// Tùy chỉnh trạng thái hover và selected
					itemProps={{
						onMouseEnter: ({ domEvent }) => {
							domEvent.currentTarget.style.backgroundColor =
								"rgba(255, 255, 255, 0.1)";
							domEvent.currentTarget.style.color = "#ffffff";
						},
						onMouseLeave: ({ domEvent }) => {
							domEvent.currentTarget.style.backgroundColor =
								"transparent";
							domEvent.currentTarget.style.color =
								selectedMenu === domEvent.currentTarget.key
									? "#ffffff"
									: "#d3d3d3";
						},
					}}
				/>
			</Sider>

			{/* Layout chính với nền sáng */}
			<Layout style={{ padding: "0 24px 24px", background: "#f0f2f5" }}>
				<Content
					style={{
						padding: 24,
						margin: 0,
						background: "#fff", // Nền sáng cho phần Content
						minHeight: "100%",
						width: "100%",
					}}
				>
					{renderContent()}
				</Content>
			</Layout>
		</Layout>
	);
};

export default AdminPage;
