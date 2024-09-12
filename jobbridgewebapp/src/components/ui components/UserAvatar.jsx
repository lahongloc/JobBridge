import React, { useContext } from "react";
import { Avatar, Menu, Dropdown, Button } from "antd";
import {
	UserOutlined,
	SettingOutlined,
	LockOutlined,
	LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { LOGOUT } from "../../reducers/actions";
import { UserContext } from "../../App";
import { paths } from "../../authorizations/paths";

const UserAvatar = ({ icon = <UserOutlined /> }) => {
	const navigate = useNavigate();
	const [user, dispatch] = useContext(UserContext);

	const handleMenuClick = ({ key }) => {
		switch (key) {
			case paths["user-profile"]:
				navigate(paths["user-profile"]); // Replace with your actual route
				break;
			case "changePassword":
				navigate("/change-password"); // Replace with your actual route
				break;
			case "logout":
				dispatch({
					type: LOGOUT,
				});
				console.log("Logging out...");
				break;
			default:
				break;
		}
	};

	const menu = (
		<Menu onClick={handleMenuClick}>
			<Menu.Item key={paths["user-profile"]} icon={<SettingOutlined />}>
				Cài đặt thông tin cá nhân
			</Menu.Item>
			<Menu.Item key="changePassword" icon={<LockOutlined />}>
				Đổi mật khẩu
			</Menu.Item>
			<Menu.Divider />
			<Menu.Item
				style={{ color: "#00b14f" }}
				key="logout"
				icon={<LogoutOutlined />}
			>
				Đăng xuất
			</Menu.Item>
		</Menu>
	);

	return (
		<Dropdown overlay={menu} trigger={["click"]}>
			<Button type="link">
				<Avatar
					style={{ backgroundColor: "#87d068" }}
					icon={typeof icon === "string" ? null : icon}
					src={typeof icon === "string" ? icon : undefined}
				/>
			</Button>
		</Dropdown>
	);
};

export default UserAvatar;
