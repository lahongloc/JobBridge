import React, { useState } from "react";
import {
	Typography,
	Upload,
	Button,
	Divider,
	Row,
	Col,
	Space,
	Input,
	message,
	Spin,
} from "antd";
import cookie from "react-cookies";
import { UploadOutlined, FilePdfOutlined } from "@ant-design/icons";
import APIs, { enpoints } from "../../configs/APIs";
import ModelsAPIs, { modelEnpoints } from "../../configs/ModelsAPIs";

const { Title, Text } = Typography;

const CVUpload = () => {
	const [file, setFile] = useState(null);
	const [cvName, setCvName] = useState(""); // State để lưu tên CV

	const [loading, setLoading] = useState(false);
	const [messageApi, contextHolder] = message.useMessage();

	const props = {
		beforeUpload: (file) => {
			const isPdf = file.type === "application/pdf";
			if (!isPdf) {
				message.error("Bạn chỉ có thể upload file PDF!");
			}
			const isLt5MB = file.size / 1024 / 1024 < 5;
			if (!isLt5MB) {
				message.error("File phải có dung lượng không quá 5MB!");
			}
			return isPdf && isLt5MB;
		},
		onChange: (info) => {
			if (info.file.status === "done") {
				setFile(info.file.originFileObj);
			}
		},
		showUploadList: false,
		customRequest: ({ onSuccess }) => {
			setTimeout(() => {
				onSuccess("ok");
			}, 0);
		},
	};

	const handleUpload = async () => {
		setLoading(true);
		try {
			const formData = new FormData();
			formData.append("name", cvName);
			formData.append("CVFile", file);
			const res = await APIs.post(enpoints["uploadCV"], formData, {
				headers: {
					Authorization: `Bearer ${cookie.load("token")}`,
					"Content-Type": "multipart/form-data",
				},
			});

			setFile(null);
			setCvName("");
			messageApi.open({
				type: "success",
				content: "Tải lên CV thành công!",
			});
			console.log("thanh cong");
		} catch (err) {
			messageApi.open({
				type: "error",
				content: "Tải lên CV thất bại!",
			});
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div
			style={{
				padding: "40px",
				width: "60%",
				margin: "0 auto",
				backgroundColor: "rgba(255, 255, 255, 0.8)",
				borderRadius: "8px",
				boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
			}}
		>
			{contextHolder}
			<Title
				level={3}
				style={{
					textAlign: "center",
					// backgroundColor: "#09783b",
					// color: "#fff",
					padding: "10px",
					borderRadius: "4px",
					textTransform: "uppercase",
				}}
			>
				Upload CV để các cơ hội việc làm tự tìm đến bạn
				<span
					style={{
						display: "block",
						textAlign: "center",
						marginBottom: "20px",
						fontSize: "15px",
						// color: "#fff",
					}}
				>
					Giảm đến 50% thời gian cần thiết để tìm được một công việc
					phù hợp
				</span>
			</Title>
			<Divider />
			<Text
				style={{
					display: "block",
					textAlign: "center",
					marginBottom: "20px",
				}}
			>
				Bạn đã có sẵn CV của mình, chỉ cần tải CV lên, hệ thống sẽ tự
				động đề xuất CV của bạn tới những nhà tuyển dụng uy tín.
			</Text>
			<Divider />
			<Row justify="center" style={{ marginBottom: "20px" }}>
				<Col span={16}>
					<Input
						placeholder="Nhập tên CV của bạn"
						value={cvName}
						onChange={(e) => setCvName(e.target.value)} // Cập nhật tên CV khi người dùng nhập
					/>
				</Col>
			</Row>
			<Row justify="center">
				<Col span={16}>
					<Upload.Dragger {...props}>
						<Space direction="vertical">
							<FilePdfOutlined
								style={{ fontSize: "48px", color: "#1890ff" }}
							/>
							<div>
								<Typography.Text strong>
									Tải lên CV từ máy tính, chọn kéo hoặc thả
								</Typography.Text>
							</div>
							<Typography.Text type="secondary">
								Hỗ trợ định dạng pdf có kích thước dưới 5MB
							</Typography.Text>
							<Button
								icon={<UploadOutlined />}
								style={{ marginTop: "20px" }}
							>
								Chọn CV
							</Button>
							{file && (
								<Text
									style={{
										display: "block",
										marginTop: "10px",
										color: "#1890ff",
										fontWeight: "bold",
									}}
								>
									File đã chọn: {file.name}
								</Text>
							)}
						</Space>
					</Upload.Dragger>
				</Col>
			</Row>
			<Row justify="center" style={{ marginTop: "20px" }}>
				<Button
					disabled={loading}
					type="primary"
					onClick={handleUpload}
				>
					Tải CV lên
					{loading && <Spin />}
				</Button>
			</Row>
		</div>
	);
};

export default CVUpload;
