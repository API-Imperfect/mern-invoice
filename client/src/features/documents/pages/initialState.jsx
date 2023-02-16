export const docInitialState = {
	status: "Not Paid",
	additionalInfo: "",
	termsConditions: "",
	total: 0,
	salesTax: 0,
	rates: "",
	currency: "",
	customer: "",
};

export const itemsInitialState = [
	{
		name: "",
		unitPrice: "",
		quantity: "",
		discount: "",
	},
];

export const paymentInitialState = [
	{
		paymentDate: new Date(),
		paidBy: "",
		amountPaid: 0,
		paymentMethod: "",
		additionalInfo: "",
	},
];
