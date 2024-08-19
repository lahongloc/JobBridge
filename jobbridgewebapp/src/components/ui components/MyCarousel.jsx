import React from "react";
import { Carousel } from "antd";
const contentStyle = {
	height: "160px",
	color: "#fff",
	lineHeight: "160px",
	textAlign: "center",
	background: "#364d79",
};
const MyCarousel = () => (
	<Carousel autoplay>
		<div>
			<img src="https://s.pro.vn/yTaz" />
		</div>
		<div>
			<img src="https://s.pro.vn/g9Bx" />
		</div>
		<div>
			<h3 style={contentStyle}>3</h3>
		</div>
		<div>
			<h3 style={contentStyle}>4</h3>
		</div>
	</Carousel>
);
export default MyCarousel;
