/* global chrome */

/* eslint-disable no-undef */

function notifySubmissionComplete() {
	if (typeof chrome !== "undefined" && chrome.runtime) {
		chrome.runtime.sendMessage({
			action: "submissionComplete",
		});
	}
}

function notifySubmissionFailed(error) {
	if (typeof chrome !== "undefined" && chrome.runtime) {
		chrome.runtime.sendMessage({
			action: "submissionFailed",
			error: error,
		});
	}
}

function isWorkdayApplicationPage() {
	return (
		window.location.href.includes("workday") ||
		window.location.href.includes("myworkdayjobs.com")
	);
}

function findElement(fieldType, fieldName) {
	try {
		let element = document.querySelector(`[name*="${fieldName}" i]`);
		if (element) return element;

		element = document.querySelector(`[id*="${fieldName}" i]`);
		if (element) return element;

		element = document.querySelector(`[placeholder*="${fieldName}" i]`);
		if (element) return element;

		const labels = document.querySelectorAll("label");
		for (let i = 0; i < labels.length; i++) {
			const label = labels[i];
			if (label.textContent.toLowerCase().includes(fieldName.toLowerCase())) {
				const parent = label.parentElement;
				if (parent) {
					const input = parent.querySelector(fieldType);
					if (input) return input;
				}
			}
		}

		return null;
	} catch (error) {
		return null;
	}
}

function handleWorkdayEmploymentQuestion(value) {
	try {
		const questionText =
			"Have you previously worked for or are you currently working for Workday";
		const questionElements = Array.from(
			document.querySelectorAll("div, p, span, label")
		).filter((el) => el.textContent.includes(questionText));

		if (questionElements.length > 0) {
			let container = questionElements[0];
			while (container && !container.querySelector('input[type="radio"]')) {
				container = container.parentElement;
			}

			if (container) {
				const radioButtons = container.querySelectorAll('input[type="radio"]');

				for (let i = 0; i < radioButtons.length; i++) {
					const radio = radioButtons[i];
					const radioLabel = radio.parentElement
						? radio.parentElement.textContent.trim()
						: "";

					if (
						(value === true && radioLabel.includes("Yes")) ||
						(value === false && radioLabel.includes("No"))
					) {
						radio.click();

						if (value === true) {
							setTimeout(fillConditionalFields, 3000);
						}

						return true;
					}
				}
			}
		}

		const allRadios = document.querySelectorAll('input[type="radio"]');
		for (let i = 0; i < allRadios.length; i++) {
			const radio = allRadios[i];
			let radioLabel = "";

			if (radio.id) {
				const label = document.querySelector(`label[for="${radio.id}"]`);
				if (label) {
					radioLabel = label.textContent.trim();
				}
			}

			if (!radioLabel && radio.parentElement) {
				radioLabel = radio.parentElement.textContent.trim();
			}

			if (!radioLabel && radio.nextElementSibling) {
				radioLabel = radio.nextElementSibling.textContent.trim();
			}

			if (!radioLabel) continue;

			if (
				(value === true && radioLabel === "Yes") ||
				(value === false && radioLabel === "No")
			) {
				radio.click();

				if (value === true) {
					setTimeout(fillConditionalFields, 3000);
				}

				return true;
			}
		}

		const allRadioButtons = document.querySelectorAll('input[type="radio"]');

		for (let i = 0; i < allRadioButtons.length; i++) {
			const radio = allRadioButtons[i];

			const container =
				radio.closest('div[role="group"]') || radio.closest("fieldset");
			if (container && container.textContent.includes("worked for Workday")) {
				if (
					(value === true && radio.value.includes("Yes")) ||
					(value === false && radio.value.includes("No"))
				) {
					radio.click();

					if (value === true) {
						setTimeout(fillConditionalFields, 3000);
					}

					return true;
				}
			}
		}

		return false;
	} catch (error) {
		return false;
	}
}

function fillConditionalFields() {
	const profileData = window.currentProfileData;
	if (!profileData) return;

	if (profileData.workdayHistory) {
		Object.entries(profileData.workdayHistory).forEach(([fieldName, value]) => {
			const input = findElement("input", fieldName);
			if (input) {
				input.value = value;
				input.dispatchEvent(new Event("input", { bubbles: true }));
				input.dispatchEvent(new Event("change", { bubbles: true }));
			}
		});
	}
}

function setSelectValue(selectElement, value) {
	try {
		if (!selectElement || !selectElement.options) return false;

		for (let i = 0; i < selectElement.options.length; i++) {
			const option = selectElement.options[i];
			if (option.text.toLowerCase().includes(value.toLowerCase())) {
				selectElement.value = option.value;
				selectElement.dispatchEvent(new Event("change", { bubbles: true }));
				return true;
			}
		}

		return false;
	} catch (error) {
		return false;
	}
}

function handlePreferredNameCheckbox(value) {
	try {
		const selectors = [
			'input[id="name--preferredCheck"]',
			'input[name="preferredCheck"]',
			'input[type="checkbox"][aria-checked]',
			'input[type="checkbox"][id*="preferred" i]',
		];

		let checkbox = null;
		for (const selector of selectors) {
			checkbox = document.querySelector(selector);
			if (checkbox) break;
		}

		if (!checkbox) {
			const preferredLabels = Array.from(
				document.querySelectorAll("label, span")
			).filter((el) => el.textContent.toLowerCase().includes("preferred name"));

			if (preferredLabels.length > 0) {
				const label = preferredLabels[0];
				const container = label.closest("div") || label.parentElement;

				if (container) {
					checkbox = container.querySelector('input[type="checkbox"]');
				}
			}
		}

		if (!checkbox) return false;

		checkbox.checked = value;
		checkbox.setAttribute("aria-checked", value.toString());

		const currentState = checkbox.getAttribute("aria-checked") === "true";
		if (currentState !== value) {
			checkbox.click();
		}

		if (checkbox.id) {
			const label = document.querySelector(`label[for="${checkbox.id}"]`);
			if (label) label.click();
		}

		checkbox.dispatchEvent(new MouseEvent("click", { bubbles: true }));
		checkbox.dispatchEvent(new Event("change", { bubbles: true }));

		if (value) {
			setTimeout(handlePreferredNameInput, 3000);
		}

		return true;
	} catch (error) {
		return false;
	}
}

function handlePreferredNameInput() {
	const profileData = window.currentProfileData;
	if (!profileData || !profileData.preferredName) return;

	const selectors = [
		'input[name*="preferred" i][type="text"]',
		'input[id*="preferred" i][type="text"]',
		'input[placeholder*="preferred" i]',
	];

	let preferredNameInput = null;
	for (const selector of selectors) {
		preferredNameInput = document.querySelector(selector);
		if (preferredNameInput) break;
	}

	if (preferredNameInput) {
		preferredNameInput.value = profileData.preferredName;
		preferredNameInput.dispatchEvent(new Event("input", { bubbles: true }));
		preferredNameInput.dispatchEvent(new Event("change", { bubbles: true }));
	}
}

function clickSaveAndContinue() {
	try {
		const exactButton = document.querySelector(
			'button[data-automation-id="pageFooterNextButton"]'
		);
		if (exactButton) {
			exactButton.click();
			return true;
		}

		const classButton = document.querySelector("button.css-1cgcsv0");
		if (classButton) {
			classButton.click();
			return true;
		}

		const allButtons = document.querySelectorAll("button");
		for (const btn of allButtons) {
			if (btn.textContent && btn.textContent.trim() === "Save and Continue") {
				btn.click();
				return true;
			}
		}

		return false;
	} catch (error) {
		return false;
	}
}

function handleAdditionalSections() {
	const profileData = window.currentProfileData;
	if (!profileData || !profileData.sections) return;

	Object.entries(profileData.sections).forEach(([sectionKey, sectionData]) => {
		if (!sectionData.items || sectionData.items.length === 0) return;

		const headings = Array.from(
			document.querySelectorAll("h1, h2, h3, h4, h5, h6")
		);
		let sectionHeading = null;

		for (const heading of headings) {
			if (heading.textContent.includes(sectionData.label)) {
				sectionHeading = heading;
				break;
			}
		}

		if (!sectionHeading) {
			const divs = Array.from(document.querySelectorAll("div"));
			for (const div of divs) {
				if (div.textContent.trim() === sectionData.label) {
					sectionHeading = div;
					break;
				}
			}
		}

		if (!sectionHeading) {
			return;
		}

		const sectionContainer =
			sectionHeading.closest("div") || sectionHeading.parentElement;
		if (!sectionContainer) {
			return;
		}

		let addButton = null;
		const buttons = sectionContainer.querySelectorAll("button");

		for (const button of buttons) {
			if (button.textContent.includes(sectionData.addButtonText)) {
				addButton = button;
				break;
			}
		}

		if (!addButton) {
			addButton = sectionContainer.querySelector(
				'button[data-automation-id="add-button"]'
			);
		}

		if (!addButton) {
			return;
		}

		sectionData.items.forEach((item, index) => {
			if (index === 0) {
				const sectionHeader = document.querySelector(`#${sectionKey}-section`);
				if (sectionHeader) {
					fillSectionItem(sectionKey, item, index + 1);
					return;
				}
			}

			addButton.click();

			setTimeout(() => {
				fillSectionItem(sectionKey, item, index + 1);
			}, 1000);
		});
	});
}

function fillSectionItem(sectionKey, itemData, index) {
	Object.entries(itemData).forEach(([fieldKey, fieldValue]) => {
		if (
			typeof fieldValue !== "string" &&
			typeof fieldValue !== "number" &&
			typeof fieldValue !== "boolean"
		) {
			return;
		}

		let fieldElement = null;

		const fieldSelectors = [
			`input[id*="${fieldKey}"]`,
			`input[name*="${fieldKey}"]`,
			`input[aria-label*="${fieldKey}"]`,
			`select[id*="${fieldKey}"]`,
			`select[name*="${fieldKey}"]`,
			`select[aria-label*="${fieldKey}"]`,
			`textarea[id*="${fieldKey}"]`,
			`textarea[name*="${fieldKey}"]`,
			`textarea[aria-label*="${fieldKey}"]`,
		];

		for (const selector of fieldSelectors) {
			fieldElement = document.querySelector(selector);
			if (fieldElement) break;
		}

		if (!fieldElement) {
			const labels = document.querySelectorAll("label");
			for (const label of labels) {
				if (label.textContent.toLowerCase().includes(fieldKey.toLowerCase())) {
					const forId = label.getAttribute("for");
					if (forId) {
						fieldElement = document.getElementById(forId);
					} else {
						const container = label.closest("div");
						if (container) {
							fieldElement = container.querySelector("input, select, textarea");
						}
					}
					if (fieldElement) break;
				}
			}
		}

		if (fieldElement) {
			if (fieldElement.tagName === "SELECT") {
				setSelectValue(fieldElement, fieldValue);
			} else if (fieldElement.type === "checkbox") {
				if (fieldElement.checked !== fieldValue) {
					fieldElement.click();
				}
			} else if (fieldElement.type === "radio") {
				if (!fieldElement.checked && fieldValue) {
					fieldElement.click();
				}
			} else {
				fieldElement.value = fieldValue;
				fieldElement.dispatchEvent(new Event("input", { bubbles: true }));
				fieldElement.dispatchEvent(new Event("change", { bubbles: true }));
			}
		}
	});
}

if (isWorkdayApplicationPage()) {
	chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
		if (request.action === "checkPage") {
			sendResponse({
				isWorkdayPage: true,
				url: window.location.href,
			});
		} else if (request.action === "autofill") {
			const profileData = request.profileData;
			window.currentProfileData = profileData;

			const filledFields = [];
			const failedFields = [];

			try {
				if (profileData.formFields) {
					Object.entries(profileData.formFields).forEach(
						([fieldKey, fieldData]) => {
							const { type, label, value } = fieldData;

							switch (type) {
								case "radio":
									if (label === "workdayEmployment") {
										const success = handleWorkdayEmploymentQuestion(value);
										if (success) {
											filledFields.push(label);
										} else {
											failedFields.push(label);
										}
									}
									break;

								case "checkbox":
									if (label === "preferredName") {
										const success = handlePreferredNameCheckbox(value);
										if (success) {
											filledFields.push(label);
										} else {
											failedFields.push(label);
										}
									}
									break;

								case "select":
									const selectElement = findElement("select", label);
									if (selectElement && setSelectValue(selectElement, value)) {
										filledFields.push(label);
									} else {
										failedFields.push(label);
									}
									break;

								case "text":
								case "email":
								case "tel":
								default:
									const inputElement = findElement("input", label);
									if (inputElement) {
										inputElement.value = value;
										inputElement.dispatchEvent(
											new Event("input", { bubbles: true })
										);
										inputElement.dispatchEvent(
											new Event("change", { bubbles: true })
										);
										filledFields.push(label);
									} else {
										failedFields.push(label);
									}
									break;
							}
						}
					);
				}

				setTimeout(() => {
					handleAdditionalSections();

					setTimeout(() => {
						const submitSuccess = clickSaveAndContinue();

						if (submitSuccess) {
							setTimeout(() => {
								notifySubmissionComplete();
							}, 2000);
						} else {
							notifySubmissionFailed(
								"Could not find or click the submit button"
							);
						}
					}, 3000);
				}, 2000);

				sendResponse({
					success: true,
					message: `Form auto-fill successfully started! Filled ${filledFields.length} initial fields.`,
					details: {
						filled: filledFields,
						failed: failedFields,
					},
				});
			} catch (error) {
				notifySubmissionFailed(error.message);

				sendResponse({
					success: false,
					message: "Error during auto-fill: " + error.message,
					details: {
						filled: filledFields,
						failed: failedFields.concat(["Error: " + error.message]),
					},
				});
			}
		} else if (request.action === "submit") {
			try {
				const submitSuccess = clickSaveAndContinue();

				if (submitSuccess) {
					setTimeout(() => {
						notifySubmissionComplete();
					}, 2000);
					sendResponse({ success: true, message: "Form submission initiated" });
				} else {
					notifySubmissionFailed("Could not find or click the submit button");
					sendResponse({
						success: false,
						message: "Could not find or click the submit button",
					});
				}
			} catch (error) {
				notifySubmissionFailed(error.message);
				sendResponse({
					success: false,
					message: "Error submitting form: " + error.message,
				});
			}
		}

		return true;
	});
}
