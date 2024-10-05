import { Alert, Typography } from "antd";
import JobRecommendationTable from "../ui components/JobRecommendationTable";

const { Title, Paragraph } = Typography;

const JobRecommendationList = () => {
	return (
		<>
			<div
				style={{
					margin: "auto",
					marginBottom: "3rem",
					width: "50%",
				}}
			>
				<Alert
					message={
						<b>
							Đây là những công việc đề xuất phù hợp cho từng hồ
							sơ của bạn trong tuần này!
						</b>
					}
					description={
						<>
							<Paragraph>
								Hồ sơ của bạn đã được phân tích và tính toán một
								cách tự động để đề xuất nhưng công việc phù hợp,
								điều này rút gọn quá trình tìm việc, hãy để
								chúng tôi là cầu nối đến sự thành công của bạn!
							</Paragraph>
						</>
					}
					type="success"
					showIcon
				/>
			</div>
			<JobRecommendationTable />;
		</>
	);
};

export default JobRecommendationList;
