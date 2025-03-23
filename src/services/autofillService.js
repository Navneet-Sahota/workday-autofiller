import { formFieldMapper } from "../utils/formFieldMapper";

export const autofillForm = (profileData) => {
	Object.entries(formFieldMapper).forEach(([key, config]) => {
		const { selector, value, type } = config;
		const elements = document.querySelectorAll(selector);

		if (elements.length === 0) {
			console.warn(`No element found for selector: ${selector}`);
			return;
		}

		elements.forEach((element) => {
			const dataValue = value(profileData);

			switch (type) {
				case "text":
				case "email":
				case "tel":
					element.value = dataValue;
					element.dispatchEvent(new Event("input", { bubbles: true }));
					break;

				case "select":
					const options = Array.from(element.options);
					const option = options.find(
						(opt) => opt.text === dataValue || opt.value === dataValue
					);

					if (option) {
						element.value = option.value;
						element.dispatchEvent(new Event("change", { bubbles: true }));
					}
					break;

				case "checkbox":
					element.checked = dataValue;
					element.dispatchEvent(new Event("change", { bubbles: true }));
					break;

				case "radio":
					if (
						(element.value === "yes" && dataValue === true) ||
						(element.value === "no" && dataValue === false) ||
						element.value === dataValue
					) {
						element.checked = true;
						element.dispatchEvent(new Event("change", { bubbles: true }));
					}
					break;

				default:
					console.warn(`Unsupported input type: ${type}`);
			}
		});
	});
};
