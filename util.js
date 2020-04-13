function wrapPreformattedText(text) {
    return "<pre>" + text.replace(new RegExp("\n", 'g'), "</br>") + "</pre>";
}

function formatNumber(number) {
    return Number(number).toFixed(2);
}

module.exports = {
    wrapPreformattedText,
    formatNumber
}