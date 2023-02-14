export function addCurrencyCommas(currency) {
	if (currency) {
		return currency.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}
}
