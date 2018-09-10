import React, { Component } from 'react'
import './App.css'
import { calculatePositions, calculateSeries } from '../../sailracecalculator'

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

class Person extends Component {
    render() {
        let person = this.props.person
        let positions = person.posn_list
        let positionCells = positions
            .map((p, i) => {if (p.discard) { 
                return <td  key={i} className="discard">{p.posn}</td>
            }
            return <td  key={i}>{p.posn}</td>
        })
        let qualified = ""
        if (person.qualified) {
            qualified = "qualified"
        }

        return <tr>
                <td className={qualified}>{person.name}</td>
                <td>{person.fleet}</td>
                <td>{person.tot_qual_score}</td>
                <td>{person.av_posn.toFixed(2)}</td>{positionCells}
            </tr>
    }
}

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            races: [],
            seriesid: 58,
            people: []
        }
        this.doupdateSeries = this.doupdateSeries.bind(this)
        this.doupdateState = this.doupdateState.bind(this)
    }

    async updateSeries (seriesid) {
        this.setState({loading: true})

        // Fetch completed races for this series, including all linked data
        let api_select = JSON.stringify({
            where:{and:[{seriesid:seriesid}, {flg:true}]},
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
            order:["rdate DESC", "name DESC"], // quite good in reverse order actually!
        })

        let races = await fetchJson(`${this.props.apiServer}/races?filter=${api_select}`)
        // Parse dates into actual dates
        races.forEach(r => {
            r.racedate = new Date(r.rdate)
            calculatePositions(r)
        })

        // update people list in situ //TODO something cleverer as per races
        let people = calculateSeries(races)

        this.setState({
            races: races,
            people: people,
            seriesid: seriesid,
            loading: false
        })
    }

    doupdateSeries(event) {
        this.updateSeries(this.state.seriesid)
            .catch((e) => console.log(e))
        event.preventDefault()
    }

    doupdateState(event) {
        this.setState({seriesid: event.target.value})
    }

    componentDidMount() {
        this.updateSeries(this.state.seriesid)
    }

    render() {
        let { races, people, seriesid, loading } = this.state
        let headList = races
            .map((r, i) => <th key={i}>{r.name}</th>)
        let personList = people
            .map((p, i) => (<Person key={i} person={p}/>))
        // TODO the series id should be selected from a multiselect dropdown
        return (
            <div className="App">
                <LoadingIndicator loading={loading}/>
                <form onSubmit={this.doupdateSeries}>
                    <label>
                        Series:<input type="text" value={this.state.seriesid} onChange={this.doupdateState} size="1" />
                    </label>
                    <input type="submit" value="Submit" />
                </form>
                <table>
                    <thead><tr><th>Person</th><th>Fleet</th><th>Score</th><th>Av.Posn</th>
                        {headList}
                    </tr></thead>
                    <tbody>
                        {personList}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default App;
