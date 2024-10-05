export const isLogin = (user) => {
	return !(user === null);
};

export const isApplicant = (user) =>
	isLogin(user) && user.roles.some((role) => role.name === "APPLICANT");

export const isAdmin = (user) =>
	isLogin(user) && user.roles.some((role) => role.name === "ADMIN");

export const isRecruiter = (user) =>
	isLogin(user) && user.roles.some((role) => role.name === "RECRUITER");
