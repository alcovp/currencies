function wrapPreformattedText(text) {
    return "<pre>" + text.replace(new RegExp("\n", 'g'), "</br>") + "</pre>";
}

function formatNumber(number) {
    if (number === "-1") {
        return 'NA'
    }
    if (number < 1) {
        return Number(number).toFixed(4)
    }
    if (number > 1000) {
        return Number(number).toFixed()
    }
    return Number(number).toFixed(2)
}

function formatDiff(diff) {
    return Number(diff).toFixed(1)
}

module.exports = {
    wrapPreformattedText,
    formatNumber,
    formatDiff,
}