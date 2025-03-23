/* global chrome */

/* eslint-disable no-undef */
import React, { useState, useEffect } from "react";
import { mockProfileData } from "../data/profileData";
import "../App.css";

const AutoFiller = () => {
	const [status, setStatus] = useState("Checking page...");
	const [isWorkdayPage, setIsWorkdayPage] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (typeof chrome !== "undefined" && chrome.tabs) {
			chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
				const currentTab = tabs[0];

				chrome.tabs.sendMessage(
					currentTab.id,
					{ action: "checkPage" },
					(response) => {
						if (chrome.runtime.lastError) {
							setIsWorkdayPage(false);
							setStatus("Navigate to a Workday application page");
							return;
						}

						if (response && response.isWorkdayPage) {
							setIsWorkdayPage(true);
							setStatus("Ready to auto-fill your application");
						} else {
							setIsWorkdayPage(false);
							setStatus("Navigate to a Workday application page");
						}
					}
				);
			});
		}
	}, []);

	const handleAutofill = () => {
		setIsLoading(true);
		setStatus("Auto-filling form...");

		if (typeof chrome !== "undefined" && chrome.tabs) {
			chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
				chrome.tabs.sendMessage(
					tabs[0].id,
					{
						action: "autofill",
						profileData: mockProfileData,
					},
					(response) => {
						if (response && response.success) {
							setStatus("Form auto-filling in progress...");
							const handleSubmissionComplete = (message) => {
								if (message.action === "submissionComplete") {
									setIsLoading(false);
									setStatus("Form auto-filled and submitted successfully!");
									chrome.runtime.onMessage.removeListener(
										handleSubmissionComplete
									);
								}

								if (message.action === "submissionFailed") {
									setIsLoading(false);
									setStatus(
										`Error: ${message.error || "Form submission failed"}`
									);
									chrome.runtime.onMessage.removeListener(
										handleSubmissionComplete
									);
								}
							};

							chrome.runtime.onMessage.addListener(handleSubmissionComplete);

							setTimeout(() => {
								setIsLoading(false);
								setStatus(
									"Form auto-filling completed. Check the form for any missing fields."
								);
								chrome.runtime.onMessage.removeListener(
									handleSubmissionComplete
								);
							}, 60000);
						} else {
							setIsLoading(false);
							setStatus(
								`Error: ${
									response ? response.message : "Could not auto-fill form"
								}`
							);
						}
					}
				);
			});
		}
	};

	return (
		<div className="App">
			<div className="auto-filler">
				<h2>Workday Form Auto-Filler</h2>

				<div
					className={`status-message ${isWorkdayPage ? "success" : "error"}`}
				>
					<div className="status-title">
						<span
							className={`page-indicator ${
								isWorkdayPage ? "page-detected" : "page-not-detected"
							}`}
						></span>
						Workday application {isWorkdayPage ? "detected" : "not detected"}
					</div>
					<p>{status}</p>
				</div>

				<div className="actions">
					<button
						onClick={handleAutofill}
						disabled={isLoading || !isWorkdayPage}
						className={`${
							isWorkdayPage ? "primary-button" : "disabled-button"
						} ${isLoading ? "loading-button" : ""}`}
					>
						{isLoading ? " " : "Auto-Fill Form"}
					</button>
				</div>
			</div>

			<div className="footer">
				<p>Workday Form Auto-Filler v1.0</p>
			</div>
		</div>
	);
};

export default AutoFiller;
