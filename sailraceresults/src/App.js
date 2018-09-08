import React, { Component } from 'react'
import './App.css'
import { calculatePositions } from 'sailracecalculator'

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
        calculatePositions(race)
        this.setState({
            loading: false,
            results: race.result
        })
    }

    componentDidMount() {
        this.updateResults()
            .catch((e) => console.log(e))
    }

    render() {
        let { race } = this.props
        let { loading, results } = this.state
        let resultRows = results
            .map(it => <tr key={it.id}><td>{it.posn}</td>
                                       <td>{it.individual.name}</td>
                                       <td>{it.individual.boattype.btype}</td>
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
                        <th>Boat</th>
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

        // Fetch the latest completed races, including all linked data
        let api_select = JSON.stringify({
            where:{flg:true},
            include:[
                {relation:"series"},{
                    relation:"result", scope:{
                        include:{
                            relation:"individual",
                            scope:{
                                include:"boattype"
                            }
                        }
                    }
                }
            ],
            order:["rdate DESC", "name DESC"],
            limit:numRaces
        })

        let races = await fetchJson(`${API_SERVER}/races?filter=${api_select}`)
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
            .catch((e) => console.log(e))
    }

    componentDidMount() {
        this.doUpdateRaces(this.state.numRaces)
    }

    render() {
        let { races, loading, numRaces } = this.state
        let racesList = races
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
