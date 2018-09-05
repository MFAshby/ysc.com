import React, { Component } from 'react'
import './App.css'

const API_SERVER = process.env.REACT_APP_API_SERVER 

async function fetchJson(target) {
    let response = await fetch(target)
    return await response.json()
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
        let results = await fetchJson(`${API_SERVER}/results?filter[where][raceid]=${race.id}&filter[order]=posn&filter[include][individual]=boattype`)

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
            .map(it => <tr key={it.id}><td>{it.posn}</td><td>{it.individual.name}</td></tr>)

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
            .sort((a, b) => b.racedate.valueOf() - a.racedate.valueOf())
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
