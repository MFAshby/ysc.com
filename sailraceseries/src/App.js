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
            .map((p, i) => {
            if (p.discard) { 
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
            seriesids: [],
            people: [],
            series_list: [],
            sub_select: "",
            n_to_count: -1
        }
        this.doupdateSeries = this.doupdateSeries.bind(this)
        this.doupdateSelection = this.doupdateSelection.bind(this)
        this.doupdateSubSelect = this.doupdateSubSelect.bind(this)
        this.doupdateNtoCount = this.doupdateNtoCount.bind(this)
    }

    async updateSeriesList() {
        this.setState({loading: true})
        let api_select = JSON.stringify({
            order:"weight DESC"
        })
        let series_list = await fetchJson(`${this.props.apiServer}/series?filter=${api_select}`)
        this.setState({
            series_list: series_list,
            loading: false
        })
    }


    async updateSeries (seriesids) {
        this.setState({loading: true})
        let {n_to_count, sub_select} = this.state

        // Fetch completed races for this series, including all linked data
        let api_select_obj = {
            where:{and:[{seriesid:{inq:seriesids}}, {flg:true}]},
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
        }

        if (sub_select.length > 0) {
            api_select_obj.where.and.push({name:{like:'%25' + sub_select + '%25'}})
        }
        let api_select = JSON.stringify(api_select_obj)
        let races = await fetchJson(`${this.props.apiServer}/races?filter=${api_select}`)
        // Parse dates into actual dates
        races.forEach(r => {
            r.racedate = new Date(r.rdate)
            calculatePositions(r)
        })

        // update people list in situ //TODO something cleverer as per races
        let people = calculateSeries(races, n_to_count)

        this.setState({
            races: races,
            people: people,
            loading: false
        })
    }

    doupdateSeries(event) {
        this.updateSeries(this.state.seriesids)
            .catch((e) => console.log(e))
        event.preventDefault()
    }

    doupdateSelection(event) {
        let items = event.target.selectedOptions
        let seriesids = []
        for (var i=0; i<items.length; i++) {
            seriesids.push(items[i].value)
        }
        this.setState({seriesids: seriesids})
    }

    doupdateSubSelect(event) {
        this.setState({sub_select: event.target.value})
    }

    doupdateNtoCount(event) {
        let n_to_count = event.target.value
        if (!(n_to_count > 0)) {
            n_to_count = -1
        }
        this.setState({n_to_count: n_to_count})
    }

    componentDidMount() {
        this.updateSeriesList()
    }

    render() {
        let { races, people, seriesids, loading, series_list } = this.state
        let headList = races
            .map((r, i) => <th key={i}>{r.name}</th>)
        let personList = people
            .map((p, i) => (<Person key={i} person={p}/>))
        let seriesList = series_list
            .map((s, i) => <option key={i} value={s.id}>{s.name}</option>)
        return (
            <div className="App">
                <LoadingIndicator loading={loading}/>
                <form onSubmit={this.doupdateSeries}>
                    <select size="3" multiple onChange={this.doupdateSelection}>
                        {seriesList}
                    </select>
                    Sub-select:<input type="text" size="1" onChange={this.doupdateSubSelect}></input>
                    N-to-count:<input type="text" size="1" onChange={this.doupdateNtoCount}></input>
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
