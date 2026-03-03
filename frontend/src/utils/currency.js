/**
 * Formats price based on language
 * @param {number} amount - Price in VND
 * @param {string} language - 'en' or 'vi'
 * @returns {string} Formatted price string
 */
export const formatPrice = (amount, language) => {
    if (!amount && amount !== 0) return '';

    if (language === 'vi') {
        return new Intl.NumberFormat('vi-VN').format(amount) + ' VNĐ';
    } else {
        // Exchange rate: 1 USD = 25,000 VND
        const usdAmount = amount / 25000;
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(usdAmount);
    }
};

export const EXCHANGE_RATE = 25000;
