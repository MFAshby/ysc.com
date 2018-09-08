function stToTm(st) { // NB requires a properly formatted str HH:MM:SS
    let t = st.split(':');
    return parseInt(t[0], 10) * 3600 + parseInt(t[1], 10) * 60 + parseInt(t[2], 10);
}

function tmToSt(tm) { // there has to be a nicer way of doing this!
    let h = Math.floor(tm / 3600);
    let m = Math.floor(tm / 60) % 60;
    let s = Math.floor(tm + 0.5) % 60
    return "" + h.toString(10).padStart(2, '0') +
          ":" + m.toString(10).padStart(2, '0') +
          ":" + s.toString(10).padStart(2, '0');
}

export function calculatePositions(race) {
    let maxlaps = race.result.reduce((max, r) => (r.nlaps > max) ? r.nlaps : max,
                                            race.result[0].nlaps)
    race.result.forEach(r => {
        if (r.rtime === '24:00:00') {
            r.adjtime = '24:00:00'
        } else {
            let pyn = r.individual.boattype.pyn;
            r.adjtime = tmToSt(stToTm(r.rtime) * 1200 / pyn /
                        (r.nlaps * race.wholelegs + race.partlegs) *
                        race.wholelegs * maxlaps)
        }
    })
    race.result.sort((a, b) => a.adjtime > b.adjtime); // should work for string sorting
    var seq_num = 1;
    race.result.forEach(r => {
        if (r.adjtime === '24:00:00') {
            r.posn = Math.max(15, seq_num + 1)
        } else {
            r.posn = seq_num
            seq_num += 1
        }
    })
}