import React, { useContext, useEffect, useState } from "react";
import { Form, Input, Button, Typography, Divider } from "antd";
import {
	MailOutlined,
	LockOutlined,
	GoogleOutlined,
	FacebookOutlined,
} from "@ant-design/icons";
import APIs, { enpoints } from "../../configs/APIs";
import { useNavigate } from "react-router-dom";
import { paths } from "../../authorizations/paths";
import { message, Space, Spin } from "antd";
import {
	save as saveCookie,
	load,
	remove as removeCookie,
} from "react-cookies";
import { UserContext } from "../../App";
import { LOGIN } from "../../reducers/actions";
import { roles } from "../../authorizations/roleAuth";

const { Title } = Typography;

const LoginForm = () => {
	const [user, dispatch] = useContext(UserContext);
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);

	const [messageApi, contextHolder] = message.useMessage();

	const onFinish = async (user) => {
		setLoading(true);
		try {
			const res = await APIs.post(enpoints["login"], user);
			if (res.status === 200) {
				const user = res.data.result;
				saveCookie("token", user.token, {
					path: "/",
					domain: window.location.hostname,
				});

				const currentUser = await APIs.get(enpoints["currentUser"], {
					headers: {
						Authorization: `Bearer ${user.token}`,
					},
				});

				saveCookie("user", currentUser.data.result, {
					path: "/",
					domain: window.location.hostname,
				});
				dispatch({
					type: LOGIN,
					payload: currentUser.data.result,
				});

				console.log("user: ", currentUser.data.result);

				if (currentUser.data.result.roles[0].name === roles.ADMIN) {
					navigate(paths["admin-page"]);
				}
				if (currentUser.data.result.roles[0].name === roles.APPLICANT) {
					navigate(`${paths.home}?user=true`);
				}

				if (currentUser.data.result.roles[0].name === roles.RECRUITER) {
					navigate(paths["posted-jobs"]);
				}
			}
		} catch (err) {
			messageApi.open({
				type: "error",
				content: "Email hoặc mật khẩu không chính xác!",
			});
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	const handleSocialLogin = (provider) => {
		// Thay đổi logic ở đây để xử lý đăng nhập với provider
		console.log(`Đăng nhập bằng ${provider}`);
	};

	return (
		<div
			style={{
				maxWidth: 400,
				margin: "auto",
				padding: "20px",
				border: "1px solid #ccc",
				borderRadius: "8px",
				background: "#fff",
				marginTop: 100,
				marginBottom: "5rem",
			}}
		>
			{contextHolder}
			<Title level={2} style={{ textAlign: "center" }}>
				Đăng Nhập
			</Title>

			<Form
				name="login"
				initialValues={{ remember: true }}
				onFinish={onFinish}
			>
				<Form.Item
					name="email"
					rules={[
						{
							required: true,
							type: "email",
							message: "Vui lòng nhập Email hợp lệ!",
						},
					]}
				>
					<Input prefix={<MailOutlined />} placeholder="Email" />
				</Form.Item>

				<Form.Item
					name="password"
					rules={[
						{ required: true, message: "Vui lòng nhập Mật khẩu!" },
					]}
				>
					<Input.Password
						prefix={<LockOutlined />}
						placeholder="Mật khẩu"
					/>
				</Form.Item>

				<Form.Item>
					<Button
						disabled={loading}
						type="primary"
						htmlType="submit"
						block
					>
						Đăng Nhập
						{loading && <Spin />}
					</Button>
				</Form.Item>

				<Divider>Hoặc</Divider>

				<Form.Item>
					<Button
						icon={<GoogleOutlined />}
						style={{
							marginBottom: 8,
							backgroundColor: "#4285F4",
							color: "#fff",
						}}
						block
						onClick={() => handleSocialLogin("Google")}
					>
						Đăng nhập bằng Google
					</Button>
					<Button
						icon={<FacebookOutlined />}
						style={{ backgroundColor: "#3b5998", color: "#fff" }}
						block
						onClick={() => handleSocialLogin("Facebook")}
					>
						Đăng nhập bằng Facebook
					</Button>
				</Form.Item>

				<Form.Item style={{ textAlign: "center" }}>
					<a href="#">Quên mật khẩu?</a>
				</Form.Item>
			</Form>
		</div>
	);
};

export default LoginForm;
