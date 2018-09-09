function stToTm(st) {
    // NB requires a properly formatted str HH:MM:SS
    var t = st.split(':');
    return parseInt(t[0], 10) * 3600 + parseInt(t[1], 10) * 60 + parseInt(t[2], 10);
}

function tmToSt(tm) {
    // there has to be a nicer way of doing this!
    var h = Math.floor(tm / 3600);
    var m = Math.floor(tm / 60) % 60;
    var s = Math.floor(tm + 0.5) % 60;
    return "" + h.toString(10).padStart(2, '0') + ":" + m.toString(10).padStart(2, '0') + ":" + s.toString(10).padStart(2, '0');
}

/**
 * 24:00:00 is a special value meaning the entrant retired
 * @param {*} result 
 */
function isRetired(result) {
    return result.rtime === '24:00:00'
}

/**
 * Accepts a Race with result data. 
 * Returns a copy of the race & results, with adjtime and posn populated correctly
 * @param race 
 */
export function calculatePositions(race) {
    // Find the result with the most laps
    let maxlaps = Math.max(...race.result.map(r => r.nlaps))
    let returnResults = race.result
    // Calculate the adjusted time for each using portsmouth yardstick
    .map(r => {
        var pyn = r.individual.boattype.pyn;
        // Don't adjust the time for retirees
        let adjtime = isRetired(r) ? r.rtime : 
            tmToSt(stToTm(r.rtime) * 1200 / pyn / (r.nlaps * race.wholelegs + race.partlegs) * race.wholelegs * maxlaps);
        return Object.assign({}, r, { adjtime: adjtime})
    })
    // Order by adjusted time 
    .sort((a, b) => {
        return a.adjtime > b.adjtime
    })
    // Add the positions. 
    .map((r, ix, arr) => {
        // Retired entrants come 15th, or 1 more than the number of entries
        let posn = isRetired(r) ? 
            Math.max(15, arr.length + 1) :
            ix +1
        return Object.assign({}, r, {posn: posn})
    })
    .sort((a, b) => a.posn > b.posn)
    return Object.assign({}, race, {result: returnResults})
}