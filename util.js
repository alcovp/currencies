function wrapPreformattedText(text) {
    return "<pre>" + text.replace(new RegExp("\n", 'g'), "</br>") + "</pre>";
}

function formatNumber(number) {
    if (number === -1) {
        return 'NA'
    }
    if (number < 1) {
        return Number(number).toFixed(4)
    }
    return Number(number).toFixed(2)
}

module.exports = {
    wrapPreformattedText,
    formatNumber
}