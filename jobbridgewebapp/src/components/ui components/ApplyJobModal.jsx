import React, { useEffect, useState } from "react";
import {
	Modal,
	Button,
	Table,
	Upload,
	Input,
	Typography,
	Radio,
	message,
	Tag,
	Popconfirm,
	Spin,
} from "antd";
import {
	ProfileOutlined,
	FileTextOutlined,
	PhoneOutlined,
	MailOutlined,
} from "@ant-design/icons";
const { Title, Text } = Typography;
import cookie from "react-cookies";
import APIs, { enpoints } from "../../configs/APIs";

const ApplyJobModal = ({ job, isModalVisible, handleCancel }) => {
	const [selectedOption, setSelectedOption] = useState("library"); // 'library' or 'upload'
	const [selectedCV, setSelectedCV] = useState(null);
	const [uploadedFile, setUploadedFile] = useState(null);
	const [phoneNumber, setPhoneNumber] = useState(""); // State for Phone Number
	const [email, setEmail] = useState(""); // State for Email
	const [loading, setLoading] = useState(false);

	const handleOptionChange = (option) => {
		setSelectedOption(option);
		setSelectedCV(null);
		setUploadedFile(null);
	};

	const handleCVSelection = (cvName) => {
		setSelectedCV(cvName);
	};

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
				setUploadedFile(info.file.originFileObj);
			}
		},
		showUploadList: false,
		customRequest: ({ onSuccess }) => {
			setTimeout(() => {
				onSuccess("ok");
			}, 0);
		},
	};

	const handleApply = async (formData) => {
		setLoading(true);
		try {
			if (isModalVisible) {
				const res = await APIs.post(
					enpoints["applicationHandler"],
					formData,
					{
						headers: {
							Authorization: `Bearer ${cookie.load("token")}`,
							"Content-Type": "multipart/form-data",
						},
					},
				);
				message.success("Nộp hồ sơ ứng tuyển thành công!");
				handleCancel();
			}
		} catch (err) {
			message.error("Nộp hồ sơ ứng tuyển thất bại!");
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	const confirm = (e) => {
		handleSubmit();
	};
	const cancel = (e) => {};

	const handleSubmit = () => {
		if (selectedOption === "library" && !selectedCV) {
			message.error("Vui lòng chọn một CV từ thư viện.");
			return;
		}

		if (selectedOption === "upload" && !uploadedFile) {
			message.error("Vui lòng tải lên một CV.");
			return;
		}

		if (!phoneNumber) {
			message.error("Vui lòng nhập số điện thoại.");
			return;
		}

		if (!email) {
			message.error("Vui lòng nhập email.");
			return;
		}

		const coverLetter = document.getElementById("coverLetter").value;

		const submissionData = {
			jobPost: job.id,
			curriculumVitae: selectedCV,
			curriculumVitaeFile: uploadedFile,
			coverLetter: coverLetter,
			hotline: phoneNumber,
			email: email,
		};

		handleApply(submissionData);
	};

	const [cvLibraryData, setCvLibraryData] = useState();

	const loadCvsLibrary = async () => {
		// setLoading(true);
		try {
			const res = await APIs.get(enpoints["getCVsByUser"], {
				headers: {
					Authorization: `Bearer ${cookie.load("token")}`,
				},
			});
			console.log("cv: ", res.data.result);
			setCvLibraryData(res.data.result);
		} catch (err) {
			console.error(err);
		} finally {
			// setLoading(false);
		}
	};
	useEffect(() => {
		loadCvsLibrary();
	}, []);

	const columns = [
		{
			title: "",
			dataIndex: "radio",
			key: "radio",
			render: (text, record) => (
				<>
					<Radio
						checked={selectedCV === record.id}
						onChange={() => handleCVSelection(record.id)}
					/>
				</>
			),
		},
		{ title: "", dataIndex: "name", key: "id" },
		{
			title: "",
			key: "action",
			render: (text, record) => (
				<Button type="link" href={record.filePath} target="_blank">
					Xem
				</Button>
			),
		},
	];

	return (
		<Modal
			title={
				<Tag
					color="processing"
					style={{
						fontWeight: 700,
						textTransform: "uppercase",
						fontSize: "15px",
					}}
				>
					Ứng tuyển cho vị trí {job.jobTitle}
				</Tag>
			}
			open={isModalVisible}
			onCancel={handleCancel}
			footer={[
				<Popconfirm
					title={`Xác nhận ứng tuyển vị trí ${job.jobTitle}!`}
					description="Bạn có chắc chắn ứng tuyển cho vị trí này? Sau khi ứng tuyển bạn sẽ không thể thu hồi hồ sơ của mình!"
					onConfirm={confirm}
					onCancel={cancel}
					okText="Xác nhận"
					cancelText="Hủy"
				>
					<Button
						disabled={loading}
						key="submit"
						type="primary"
						// onClick={handleSubmit}
					>
						Nộp hồ sơ ứng tuyển {loading && <Spin />}
					</Button>
				</Popconfirm>,
			]}
		>
			{/* Choose Option */}
			<div style={{ marginBottom: "20px", paddingTop: 5 }}>
				<Text
					level={4}
					style={{
						display: "block",
						marginBottom: 10,
						fontWeight: 600,
					}}
				>
					<ProfileOutlined style={{ marginRight: "8px" }} />
					Chọn CV để ứng tuyển:
				</Text>

				<Button
					type={selectedOption === "library" ? "primary" : "default"}
					onClick={() => handleOptionChange("library")}
					style={{ marginRight: "10px" }}
				>
					Chọn CV từ thư viện
				</Button>
				<Button
					type={selectedOption === "upload" ? "primary" : "default"}
					onClick={() => handleOptionChange("upload")}
				>
					Tải CV lên từ máy tính
				</Button>
			</div>

			{/* Conditionally Render CV Library or Upload */}
			{selectedOption === "library" ? (
				<Table
					columns={columns}
					dataSource={cvLibraryData}
					pagination={false}
				/>
			) : (
				<Upload.Dragger
					{...props}
					name="files"
					multiple={false}
					style={{
						backgroundColor: "white",
						border: "dashed 2px #d9d9d9",
						padding: "16px",
						textAlign: "center",
						cursor: "pointer",
						borderRadius: "8px",
					}}
				>
					<p style={{ marginBottom: "12px", fontWeight: "bold" }}>
						Tải lên CV từ máy tính
					</p>
					<p style={{ marginBottom: "8px", color: "#8c8c8c" }}>
						Chọn hoặc kéo thả tệp
					</p>
					<p style={{ color: "#8c8c8c" }}>
						Hỗ trợ định dạng pdf dưới 5MB
					</p>
				</Upload.Dragger>
			)}
			{uploadedFile && (
				<Text
					style={{
						display: "block",
						marginTop: "10px",
						color: "#1890ff",
						fontWeight: "bold",
					}}
				>
					File đã chọn: {uploadedFile.name}
				</Text>
			)}

			{/* Phone Number */}
			<Text
				level={4}
				style={{
					display: "block",
					marginBottom: 10,
					fontWeight: 600,
				}}
			>
				<PhoneOutlined style={{ marginRight: "8px" }} />
				Số điện thoại
			</Text>

			<Input
				type="number"
				placeholder="Nhập số điện thoại"
				value={phoneNumber}
				onChange={(e) => setPhoneNumber(e.target.value)}
				style={{ marginBottom: "20px" }}
			/>

			{/* Email */}
			<Text
				level={4}
				style={{
					display: "block",
					marginBottom: 10,
					fontWeight: 600,
				}}
			>
				<MailOutlined style={{ marginRight: "8px" }} />
				Email
			</Text>
			<Input
				type="email"
				placeholder="Nhập email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				style={{ marginBottom: "20px" }}
			/>

			{/* Cover Letter */}
			<Text
				level={4}
				style={{
					display: "block",
					marginBottom: 10,
					fontWeight: 600,
				}}
			>
				<FileTextOutlined style={{ marginRight: "8px" }} />
				Thư ứng tuyển
			</Text>
			<Input.TextArea
				id="coverLetter"
				placeholder="Nhập thư ứng tuyển của bạn"
				autoSize={{ minRows: 4, maxRows: 8 }}
				style={{ marginBottom: "20px" }}
			/>
		</Modal>
	);
};

export default ApplyJobModal;
