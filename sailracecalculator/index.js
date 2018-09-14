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

/**
 * Accepts a list of sace with result data representing a series. The races should have
 * been previously filled with posn values using calculatePositions() above
 * Returns an array of people/fleet combinations, with data for rendering in correct order 
 * @param races
 */
export function calculateSeries(races, n_to_count=-1) {
    let people = []
    if (n_to_count == -1) {
        n_to_count = races[0].series.ntocount
    }
    races.forEach((race, i) => {
        race.result.forEach(r => {
            let ix = people.findIndex(p => {return (p.name === r.individual.name &&
                                            p.fleet === r.individual.boattype.fleet)})
            if (ix < 0) { // i.e. new entry
                ix = people.length
                people.push({id: r.individualid, name: r.individual.name,
                            boatnum: r.individual.boatnum, fleet: r.individual.boattype.fleet,
                            btype: r.individual.boattype.btype, tot_score: 0, tot_qual_score: 0,
                            splitter: "", av_posn: 0.0, qualified:false, posn_list: []})
            }
            people[ix].posn_list.push({posn: r.posn, laps: r.nlaps, rtime: r.rtime,
                                        adjtime: r.adjtime, discard: false, col: i})
        })
    })

    // now should have populated people array - work out best scores and generate splitter
    people.forEach(p => {
        p.posn_list.sort((a, b) => a.posn > b.posn)
        p.posn_list.forEach((pl, i) => {
            p.tot_score += pl.posn
            if (i < n_to_count) {
                p.tot_qual_score += pl.posn
                pl.discard = false
            } else {
                pl.discard = true
            }
            p.splitter += pl.posn.toString(10).padStart(2, '0')
        })
        p.splitter += "99"

        p.av_posn = p.tot_score / p.posn_list.length
        p.qualified = (p.posn_list.length >= n_to_count) // in races.length == 0 then cant get here...
        p.posn_list.sort((a, b) => a.col > b.col) // put back in original order
        // finally make races line up by filling in spaces
        // this is a bit clunky c.f. a slick `... Array map` construction but I suppose
        // it's clear what's happening
        var j = 0
        let new_posn_list = []
        for (var i = 0; i < races.length; i++) {
            if (i === p.posn_list[j].col) {
                new_posn_list.push(p.posn_list[j])
                if (j < (p.posn_list.length - 1)) {
                    j += 1
                }
            } else {
                new_posn_list.push({col: i}) // needed for key
            }
        }
        p.posn_list = new_posn_list
    })

    // sort into order of overall results
    people.sort((a, b) => {
        if (a.qualified && !b.qualified) return -1 // qualified is lower than not qual
        if (!a.qualified && b.qualified) return 1
        if (a.qualified && b.qualified) {
            let score_diff = a.tot_qual_score - b.tot_qual_score
            if (score_diff == 0) {
                return (a.splitter < b.splitter) ? -1 : 1
            }
            return score_diff 
        }
        return a.av_posn > b.av_posn
    })
    return people
}