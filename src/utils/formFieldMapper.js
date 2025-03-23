export const formFieldMapper = {
	// Previous employment question
	workdayEmployment: {
		selector: 'input[name="workdayPrevious"]',
		value: (data) => (data.workExperience.hasWorkedForWorkday ? "Yes" : "No"),
		type: "radio",
	},
	// Country/Territory
	country: {
		selector: 'select[name="country"]',
		value: (data) => data.personalInfo.country,
		type: "select",
	},
	// Given name
	givenName: {
		selector: 'input[name="legalNameSection.givenName"]',
		value: (data) => data.personalInfo.givenName,
		type: "text",
	},
	// Middle name
	middleName: {
		selector: 'input[name="legalNameSection.middleName"]',
		value: (data) => data.personalInfo.middleName,
		type: "text",
	},
	// Family name
	familyName: {
		selector: 'input[name="legalNameSection.familyName"]',
		value: (data) => data.personalInfo.familyName,
		type: "text",
	},
	// Preferred name checkbox
	preferredName: {
		selector: 'input[type="checkbox"][name="preferredName"]',
		value: (data) => data.personalInfo.preferredName,
		type: "checkbox",
	},
	// Address Line 1
	addressLine1: {
		selector: 'input[name="addressLine1"]',
		value: (data) => data.address.addressLine1,
		type: "text",
	},
	// City or Town
	city: {
		selector: 'input[name="city"]',
		value: (data) => data.address.city,
		type: "text",
	},
	// Postal Code
	postalCode: {
		selector: 'input[name="postalCode"]',
		value: (data) => data.address.postalCode,
		type: "text",
	},
	// Email
	email: {
		selector: 'input[name="email"]',
		value: (data) => data.contactInfo.email,
		type: "text",
	},
	// Phone device type
	phoneDeviceType: {
		selector: 'select[name="phoneDeviceType"]',
		value: (data) => data.contactInfo.phoneDeviceType,
		type: "select",
	},
	// Country code
	phoneCountryCode: {
		selector: 'select[name="phoneCountryCode"]',
		value: (data) => data.contactInfo.countryCode,
		type: "select",
	},
	// Phone number
	phoneNumber: {
		selector: 'input[name="phoneNumber"]',
		value: (data) => data.contactInfo.phoneNumber,
		type: "text",
	},
	// Phone extension
	phoneExtension: {
		selector: 'input[name="phoneExtension"]',
		value: (data) => data.contactInfo.phoneExtension,
		type: "text",
	},
};
