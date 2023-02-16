export const statusStyling = (status) => {
	return status === "Paid"
		? {
				border: "solid 1px black",
				backgroundColor: "#76ff03",
				padding: "8px 18px",
				borderRadius: "20px",
		  }
		: status === "Not Fully Paid"
		? {
				border: "solid 1px black",
				backgroundColor: "#b71c1c",
				color: "#FFFFFF",
				padding: "8px 18px",
				borderRadius: "20px",
		  }
		: {
				border: "solid 1px black",
				backgroundColor: "#b71c1c",
				color: "#FFFFFF",
				padding: "8px 18px",
				borderRadius: "20px",
		  };
};

export const DocumentTypeStyling = (documentType) => {
	return documentType === "Receipt"
		? {
				border: "solid 1px black",
				backgroundColor: "#76ff03",
				padding: "8px 18px",
				borderRadius: "20px",
		  }
		: {
				border: "solid 1px black",
				backgroundColor: "#2196f3",
				color: "#FFFFFF",
				padding: "8px 18px",
				borderRadius: "20px",
		  };
};

export const statusColor = (totalAmountReceived, status) => {
	return totalAmountReceived >= document?.total
		? "#ff9100"
		: status === "Paid"
		? "green"
		: status === "Not Paid"
		? "red"
		: "red";
};
