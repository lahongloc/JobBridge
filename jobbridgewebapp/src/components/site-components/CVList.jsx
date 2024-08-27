import React, { useEffect, useState } from "react";
import {
	Table,
	Button,
	Typography,
	Space,
	Popconfirm,
	message,
	Input,
} from "antd";
import {
	FilePdfOutlined,
	EyeOutlined,
	DeleteOutlined,
} from "@ant-design/icons";
import APIs, { enpoints } from "../../configs/APIs";
import cookie from "react-cookies";

const { Text } = Typography;
const { Search } = Input;

const CVList = () => {
	const [data, setData] = useState(null);
	const [filteredData, setFilteredData] = useState(null);
	const [loading, setLoading] = useState(false);

	const loadData = async () => {
		setLoading(true);
		try {
			const res = await APIs.get(enpoints["getCVsByUser"], {
				headers: {
					Authorization: `Bearer ${cookie.load("token")}`,
				},
			});
			setData(res.data.result);
			setFilteredData(res.data.result);
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadData();
	}, []);

	const handleDelete = async (id) => {
		try {
			const res = await APIs.delete(
				`${enpoints["curriculumVitaeHandler"]}/${id}`,
				{
					headers: {
						Authorization: `Bearer ${cookie.load("token")}`,
					},
				},
			);
			message.success("Xóa CV thành công!");
			loadData();
		} catch (err) {
			message.error("Xóa CV thất bại!");
			console.error(err);
		}
	};

	const handleSearch = (value) => {
		const filtered = data.filter((cv) =>
			cv.name.toLowerCase().includes(value.toLowerCase()),
		);
		setFilteredData(filtered);
	};

	const columns = [
		{
			title: "Tên CV",
			dataIndex: "name",
			key: "name",
			render: (text, record) => (
				<Space>
					<FilePdfOutlined
						style={{ color: "#ff4d4f", fontSize: "18px" }}
					/>
					<Text strong>{text}</Text>
				</Space>
			),
		},
		{
			title: "Tác vụ",
			key: "action",
			render: (_, record) => (
				<Space>
					<Button
						type="link"
						icon={<EyeOutlined />}
						href={record.filePath}
						target="_blank"
						rel="noopener noreferrer"
					>
						Xem
					</Button>
					<Popconfirm
						title="Bạn có chắc chắn muốn xóa CV này không?"
						onConfirm={() => handleDelete(record.id)}
						okText="Xóa"
						cancelText="Hủy"
					>
						<Button type="link" icon={<DeleteOutlined />} danger>
							Xóa CV
						</Button>
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<>
			{filteredData !== null && (
				<>
					<Search
						placeholder="Tìm kiếm CV theo tên"
						onSearch={handleSearch}
						style={{
							width: "80%",
							margin: "20px auto",
							display: "block",
							marginTop: "9rem",
						}}
					/>
					<Table
						columns={columns}
						dataSource={filteredData}
						pagination={{ pageSize: 5 }}
						rowKey="id"
						style={{
							borderRadius: "12px",
							overflow: "hidden",
							boxShadow: "0px 6px 18px rgba(0, 0, 0, 0.1)",
							background: "#fff",
							width: "80%",
							margin: "auto",
							marginTop: "2rem",
						}}
						bordered
						tableLayout="auto"
						loading={loading}
					/>
				</>
			)}
		</>
	);
};

export default CVList;
