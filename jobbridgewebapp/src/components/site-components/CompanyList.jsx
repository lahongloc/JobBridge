import React, { useEffect, useState } from "react";
import APIs, { enpoints } from "../../configs/APIs";
import RecruiterList from "../ui components/RecruiterList";

const CompanyList = () => {
	const [companies, setCompanies] = useState(null);

	const [currentPage, setCurrentPage] = useState(1);

	const handlePageChange = (page) => {
		setCurrentPage(page);
	};

	const loadCompanies = async () => {
		try {
			const res = await APIs.get(
				`${enpoints["getCompanies"]}/pageNumber=${currentPage}`,
			);
			setCompanies(res.data);
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		loadCompanies();
	}, [currentPage]);

	return (
		<>
			<div style={{ width: "80%", margin: "auto" }}>
				{companies !== null && (
					<RecruiterList
						data={companies}
						currentPage={currentPage}
						handlePageChange={handlePageChange}
					/>
				)}
			</div>
		</>
	);
};

export default CompanyList;
