const rawUserData = {
	employment: {
		isWorkdayEmployee: true,
		workdayEmail: "john.smith@workday.com",
		lastManager: "Jane Doe",
		workLocation: "London Office",
		employeeId: "WD12345",
	},
	personalInfo: {
		givenName: "John",
		middleName: "David",
		familyName: "Smith",
		usePreferredName: true,
		preferredName: "John",
	},
	contactInfo: {
		address: {
			line1: "123 Baker Street",
			city: "London",
			country: "United Kingdom",
			postalCode: "324453",
		},
		phone: {
			deviceType: "Mobile",
			countryCode: "+44",
			number: "7123456689",
			extension: "+91",
		},
		email: "sahota.navneet04@gmail.com",
	},
};

function transformUserData(userData) {
	return {
		formFields: {
			workdayEmployment: {
				type: "radio",
				label: "workdayEmployment",
				value: userData.employment.isWorkdayEmployee,
			},
			country: {
				type: "select",
				label: "country",
				value: userData.contactInfo.address.country,
			},
			givenName: {
				type: "text",
				label: "given name",
				value: userData.personalInfo.givenName,
			},
			middleName: {
				type: "text",
				label: "middle name",
				value: userData.personalInfo.middleName,
			},
			familyName: {
				type: "text",
				label: "family name",
				value: userData.personalInfo.familyName,
			},
			preferredName: {
				type: "checkbox",
				label: "preferredName",
				value: userData.personalInfo.usePreferredName,
			},
			addressLine1: {
				type: "text",
				label: "address line 1",
				value: userData.contactInfo.address.line1,
			},
			city: {
				type: "text",
				label: "city",
				value: userData.contactInfo.address.city,
			},
			postalCode: {
				type: "text",
				label: "postal code",
				value: userData.contactInfo.address.postalCode,
			},
			email: {
				type: "email",
				label: "email",
				value: userData.contactInfo.email,
			},
			phoneDeviceType: {
				type: "select",
				label: "phone device type",
				value: userData.contactInfo.phone.deviceType,
			},
			countryCode: {
				type: "select",
				label: "country code",
				value: userData.contactInfo.phone.countryCode,
			},
			phoneNumber: {
				type: "tel",
				label: "phone number",
				value: userData.contactInfo.phone.number,
			},
			phoneExtension: {
				type: "text",
				label: "phone extension",
				value: userData.contactInfo.phone.extension,
			},
		},
		workdayHistory: {
			"workday email": userData.employment.workdayEmail,
			"last manager": userData.employment.lastManager,
			"work location": userData.employment.workLocation,
			"employee id": userData.employment.employeeId,
		},
		preferredName: userData.personalInfo.preferredName,
	};
}

export const mockProfileData = transformUserData(rawUserData);
