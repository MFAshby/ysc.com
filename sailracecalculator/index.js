'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.calculatePositions = calculatePositions;
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

function calculatePositions(race) {
    var maxlaps = race.result.reduce(function (max, r) {
        return r.nlaps > max ? r.nlaps : max;
    }, race.result[0].nlaps);
    race.result.forEach(function (r) {
        if (r.rtime === '24:00:00') {
            r.adjtime = '24:00:00';
        } else {
            var pyn = r.individual.boattype.pyn;
            r.adjtime = tmToSt(stToTm(r.rtime) * 1200 / pyn / (r.nlaps * race.wholelegs + race.partlegs) * race.wholelegs * maxlaps);
        }
    });
    race.result.sort(function (a, b) {
        return a.adjtime > b.adjtime;
    }); // should work for string sorting
    var seq_num = 1;
    race.result.forEach(function (r) {
        if (r.adjtime === '24:00:00') {
            r.posn = Math.max(15, seq_num + 1);
        } else {
            r.posn = seq_num;
            seq_num += 1;
        }
    });
}