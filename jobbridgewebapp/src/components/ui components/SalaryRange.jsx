import React, { useState } from "react";
import { InputNumber, Select, Space } from "antd";

const { Option } = Select;

const SalaryRange = ({ onChange, ...props }) => {
	const [customRange, setCustomRange] = useState([null, null]);
	const [isCustom, setIsCustom] = useState(false);

	const handleSelectChange = (value) => {
		if (value === "custom") {
			setIsCustom(true);
			onChange(customRange);
		} else {
			setIsCustom(false);
			onChange(value);
		}
	};

	const handleCustomChange = (index, value) => {
		const newRange = [...customRange];
		newRange[index] = value;
		setCustomRange(newRange);
		onChange(newRange);
	};

	return (
		<Space direction="vertical" style={{ width: "100%" }}>
			<Select
				defaultValue={props.default}
				placeholder="Chọn khoảng lương"
				onChange={handleSelectChange}
				style={{ width: "100%" }}
			>
				<Option value="3-5 triệu VND">3-5 triệu VND</Option>
				<Option value="5-10 triệu VND">5-10 triệu VND</Option>
				<Option value="10-20 triệu VND">10-20 triệu VND</Option>
				<Option value="Lương thỏa thuận">Lương thỏa thuận</Option>
				<Option value="custom">Nhập khoảng lương tùy chỉnh</Option>
			</Select>
			{isCustom && (
				<Space>
					<InputNumber
						min={0}
						value={customRange[0]}
						onChange={(value) => handleCustomChange(0, value)}
						placeholder="Từ (triệu VND)"
					/>
					<InputNumber
						min={0}
						value={customRange[1]}
						onChange={(value) => handleCustomChange(1, value)}
						placeholder="Đến (triệu VND)"
					/>
				</Space>
			)}
		</Space>
	);
};

export default SalaryRange;
