import React from "react";
import { Column } from "@ant-design/charts";

const data = [
	{ type: "Loại A", value: 30 },
	{ type: "Loại B", value: 20 },
	{ type: "Loại C", value: 50 },
	{ type: "Loại D", value: 40 },
];

const config = {
	data,
	xField: "type",
	yField: "value",
	columnStyle: { fill: "#5B8FF9" }, // Màu sắc của cột
	label: {
		// Hiển thị giá trị trên các cột
		position: "middle", // Vị trí nhãn
		style: {
			fill: "#FFFFFF", // Màu sắc nhãn
			opacity: 0.6, // Độ trong suốt
		},
	},
};

const Statistic = () => {
	return <Column {...config} />;
};

export default Statistic;
