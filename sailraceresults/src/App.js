import React, { Component } from 'react'
import './App.css'

const API_SERVER = process.env.REACT_APP_API_SERVER 

async function fetchJson(target) {
    let response = await fetch(target)
    return await response.json()
}

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

class LoadingIndicator extends Component {
    render() {
        let { loading }= this.props
        return (loading && <div className="lds-dual-ring">Loading...</div>)
    }
}

class RaceResult extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            results: []
        }
    }

    updateResults = async () => {
        this.setState({loading: true})
        let { race } = this.props

        // Fetch the results for this race
        let api_select = JSON.stringify({
            where:{raceid:race.id},
            include:{
                relation:"individual",
                scope:{include:"boattype"}
            }
        });
        //var results = await fetchJson(`${API_SERVER}/results?filter={"where":{"raceid":${race.id}},"include":{"relation":"individual", "scope":{"include":"boattype"}}}`)
        var results = await fetchJson(`${API_SERVER}/results?filter=${api_select}`)
        let maxlaps = results.reduce((max, r) => (r.nlaps > max) ? r.nlaps : max, results[0].nlaps);
        results.forEach(r => {
            if (r.rtime === '24:00:00') {
                r.adjtime = '24:00:00';
            } else {
                let pyn = r.individual.boattype.pyn;
                r.adjtime = tmToSt(stToTm(r.rtime) * 1200 / pyn /
                         (r.nlaps * race.wholelegs + race.partlegs) *
                         race.wholelegs * maxlaps);
            }
        });
        results.sort((a, b) => a.adjtime > b.adjtime); // should work for string sorting
        var seq_num = 1;
        results.forEach(r => {
            if (r.adjtime === '24:00:00') {
                r.posn = Math.max(15, seq_num + 1);
            } else {
                r.posn = seq_num;
                seq_num += 1;
            }
        });
        this.setState({
            loading: false,
            results: results
        })
    }

    componentDidMount() {
        this.updateResults()
            .then(() => console.log("Got results for race ") + this.props.race)
            .catch((e) => console.log(e))
    }

    render() {
        let { race } = this.props
        let { loading, results } = this.state
        let resultRows = results
            .map(it => <tr key={it.id}><td>{it.posn}</td>
                                       <td>{it.individual.name}</td>
                                       <td>{it.adjtime}</td>
                        </tr>)

        return <div>
            <h2>{race.name}</h2>
            <p>{race.racedate.toDateString()}</p>
            <LoadingIndicator loading={loading}/>
            { resultRows.length === 0 ?
                <h3>No results</h3> :
                <table>
                    <thead>
                    <tr>
                        <th>Position</th>
                        <th>Name</th>
                        <th>Adjusted Time</th>
                    </tr>
                    </thead>
                    <tbody>
                    {resultRows}
                    </tbody>
                </table>
            }
        </div>
    }
}

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            numRaces: 10,
            series: [],
            races: []
        }
    }

    updateRaces = async (numRaces) => {
        this.setState({loading: true, numRaces: numRaces})
        let races = await fetchJson(`${API_SERVER}/races?filter[where][flg]=true&filter[include]=series&filter[limit]=${numRaces}&filter[order]=rdate DESC`)

        // Parse dates into actual dates
        races.forEach(r => {
            r.racedate = new Date(r.rdate)
        })

        this.setState({
            races:races,
            loading: false
        })
    }

    doUpdateRaces = (numRaces) => {
        this.updateRaces(numRaces)
            .then(() => console.log("Updated series"))
            .catch((e) => console.log(e))
    }

    componentDidMount() {
        this.doUpdateRaces(this.state.numRaces)
    }

    render() {
        let { races, loading, numRaces } = this.state
        let racesList = races
            .sort((a, b) => b.racedate.valueOf() >= a.racedate.valueOf() &&
                            b.name > a.name)
            .map(r => (<RaceResult key={r.id} race={r}/>))

        return (
            <div className="App">
                <LoadingIndicator loading={loading}/>
                {racesList}
                <button
                    onClick={ () => this.doUpdateRaces(numRaces + 10)}>
                    Show more
                </button>
            </div>
        )
    }
}

export default App;
