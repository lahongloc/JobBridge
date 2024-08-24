import React, { useState } from "react";
import { Button, Dropdown, Menu, Space, Popconfirm } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { paths } from "../../authorizations/paths";

const FabMenu = ({ jobPostId }) => {
	const [visible, setVisible] = useState(false);

	const handleVisibleChange = (flag) => {
		setVisible(flag);
	};

	const navigate = useNavigate();

	const menu = (
		<Menu>
			<Menu.Item
				onClick={() =>
					navigate(
						`${paths["update-jobPost"]}?jobPostId=${jobPostId}`,
					)
				}
				key="edit"
				icon={<EditOutlined />}
			>
				Chỉnh sửa
			</Menu.Item>
			<Popconfirm
				title="Bạn có chắc chắn muốn xóa bài tuyển dụng này không?"
				onConfirm={() => console.log("delete")}
				okText="Xóa"
				cancelText="Hủy"
			>
				<Menu.Item key="delete" icon={<DeleteOutlined />}>
					Xóa
				</Menu.Item>
			</Popconfirm>
		</Menu>
	);

	return (
		<div style={{ position: "fixed", bottom: 50, right: 50 }}>
			<Dropdown
				overlay={menu}
				trigger={["click"]}
				onVisibleChange={handleVisibleChange}
				visible={visible}
			>
				<Button
					type="primary"
					shape="circle"
					icon={<PlusOutlined />}
					size="large"
				/>
			</Dropdown>
		</div>
	);
};

export default FabMenu;
