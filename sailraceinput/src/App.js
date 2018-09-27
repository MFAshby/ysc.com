import React, { Component } from 'react'
import './App.css'
import { calculatePositions, calculateSeries } from '../../sailracecalculator'

async function fetchJson(target, init_data) {
    let response = await fetch(target, init_data)
    return await response.json()
}

class LoadingIndicator extends Component {
    render() {
        let { loading }= this.props
        return (loading && <div className="lds-dual-ring">Loading...</div>)
    }
}

class RaceResult extends Component {
    render() {
        let race_results = calculatePositions(this.props.race_results)
        let results = race_results.result
        let resultRows = results
            .map(r => <tr key={r.id}><td>{r.posn}</td>
                                       <td>{r.individual.name}</td>
                                       <td>{r.individual.boatnum}</td>
                                       <td>{r.individual.boattype.btype}</td>
                                       <td>{r.nlaps}</td>
                                       <td>{r.rtime}</td>
                                       <td>{r.adjtime}</td>
                        </tr>)

        return <div>
            <h3>{race_results.name}</h3>
            { resultRows.length === 0 ?
                <h3>No results</h3> :
                <table>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Sail No.</th>
                        <th>Boat</th>
                        <th>Laps</th>
                        <th>Time</th>
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
            // for race details
            race_list: [],
            selected_race: -1,
            // for result details
            individual_list: [],
            individual_filter: "",
            individual_id: -1,
            result: {nlaps:"", rtime:"", crew:""},
            race_results: {},
            // individual details
            name: "",
            name_list: [],
            boattypeid: -1,
            boattype_list: [],
            boatnum: "",
            boatnum_list: [],
        }
        this.indivFilter = React.createRef()

        this.doupdateRace = this.doupdateRace.bind(this)
        this.doupdateRaceSelection = this.doupdateRaceSelection.bind(this)
        this.dosaveSelectedRace = this.dosaveSelectedRace.bind(this)

        this.doupdateResult = this.doupdateResult.bind(this)
        this.dosaveResult = this.dosaveResult.bind(this)
        this.doupdateIndividualFilter = this.doupdateIndividualFilter.bind(this)
        this.doupdateIndividualSelection = this.doupdateIndividualSelection.bind(this)

        this.dosaveIndividual = this.dosaveIndividual.bind(this)
        this.doupdateStateValue = this.doupdateStateValue.bind(this)
    }

    async updateIndividualList() {
        //TODO this should be order desc (date of latest race linked via result table)
        // this will probably have to be saved as extra field in individual table
        this.setState({loading: true})
        let api_select = JSON.stringify({
            include:"boattype"
        })
        let individual_list = await fetchJson(`${this.props.apiServer}/individuals?filter=${api_select}`)
        
        let name_list = Array.from(new Set(individual_list.map(i => i.name)).values())
        let boatnum_list = Array.from(new Set(individual_list.map(i => i.boatnum)).values())
        let boattype_list = await fetchJson(`${this.props.apiServer}/boattypes`)
        name_list.sort()
        boatnum_list.sort()
        boattype_list.sort((a, b) => a.btype > b.btype)

        this.setState({
            name_list: name_list,
            boatnum_list: boatnum_list,
            boattype_list: boattype_list,
            individual_list: individual_list,
            loading: false
        })
    }

    async updateRaceList() {
        this.setState({loading: true})
        let {selected_race} = this.state
        let api_select = JSON.stringify({
            order:["rdate DESC", "name DESC"],
        })
        let race_list = await fetchJson(`${this.props.apiServer}/races?filter=${api_select}`)

        if (selected_race == -1) {
            selected_race = 0
            let dt_now = new Date()
            for (var i=0; i<race_list.length; i++) { // traditional for loop alows break
                let race_date = new Date(race_list[i].rdate)
                if (dt_now > race_date) {
                    break
                }
                if (race_list[i].flg) {
                    // i.e. will stop at the nearest race after or equal to today that hasn't been
                    // flagged as entered
                    selected_race = i
                }
            }
        }
        this.setState({
            race_list: race_list,
            selected_race: selected_race,
            loading: false
        })
    }

    async saveSelectedRace () {
        this.setState({loading: true})
        let {race_list, selected_race} = this.state
        if (selected_race < 0 || selected_race >= race_list.length) {
            return // should never get here but don't try and save this
        }
        let race = race_list[selected_race]

        let init_data = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(race)
        }
        let response = await fetchJson(`${this.props.apiServer}/races/${race.id}`,
            init_data)

        this.setState({
            loading: false
        })
    }

    /* use upsertwithwhere to overwrite existing record if exists, otherwise create
     * a new one
     * */
    async saveResult(result) {
        this.setState({loading: true})
        let where_json = JSON.stringify({
            and:[{raceid: result.raceid},
                {individualid: result.individualid}]
            })
        let init_data = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(result)
        }
        let response = await fetchJson(`${this.props.apiServer}/Results/upsertWithWhere?where=${where_json}`,
            init_data)
        // update results has to wait for the result to be saved so do in this async fn
        this.updateRaceResult(result.raceid)

        this.setState({
            loading: false
        })
    }

    async updateRaceResult(raceid) {
        this.setState({loading: true})
        let api_select = JSON.stringify({
            include: {
                relation:"result", scope:{
                    include:{
                        relation:"individual",
                        scope:{
                            include:"boattype"
                        }
                    }
                }
            }
        })

        let race_results = await fetchJson(`${this.props.apiServer}/races/${raceid}?filter=${api_select}`)
        calculatePositions(race_results)
        race_results.racedate = new Date(race_results.rdate)
        this.setState({
            loading: false,
            race_results: race_results
        })
    }

    async saveIndividual(individual) {
        this.setState({loading: true})
        let init_data = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(individual)
        }
        let response = await fetchJson(`${this.props.apiServer}/Individuals/`,
            init_data)
        // update individuals list has to wait for above to be saved so do in this async fn
        this.updateIndividualList()

        this.setState({
            loading: false
        })
    }

    /*
    * non async function...
    * 1. race updates
    */
    dosaveSelectedRace(event) {
        let {race_list, selected_race} = this.state
        this.saveSelectedRace() // write changes to db
        // then load race_results..
        this.updateRaceResult(race_list[selected_race].id)
        event.preventDefault()
        this.indivFilter.current.focus()
    }

    doupdateRace(event) {
        let {race_list, selected_race} = this.state
        if (selected_race < 0 || selected_race >= race_list.length) {
            return // should never get here but don't try and save this
        }
        race_list[selected_race][event.target.name] = event.target.value
        this.setState({
            race_list: race_list,
        })
    }

    doupdateRaceSelection(event) {
        let {race_list} = this.state
        this.updateRaceResult(race_list[event.target.value].id)
        this.setState({selected_race: event.target.value})
    }

    /*
    * 2. result entering
    */
    doupdateResult(event) {
        let {result} = this.state
        result[event.target.name] = event.target.value
        this.setState({
            result: result
        })
    }

    dosaveResult(event) {
        //check result and put time in correct format HH:MM:SS
        let { result, individual_id, race_list, selected_race } = this.state
        if (result.nlaps === undefined || result.rtime === undefined) {
            return
        }
        if (result.rtime.length == 4) {
            result.rtime = "00" + result.rtime
        }
        if (result.rtime.length != 6) {
            return
        }
        var h = result.rtime.slice(0, 2)
        var m = result.rtime.slice(2, 4)
        var s = result.rtime.slice(4, 6)
        h = Math.floor(m / 60) + (h * 1)
        m = m % 60
        result.rtime = h.toString(10).padStart(2, '0') + ":" + m.toString(10).padStart(2, '0') + ":" + s;
        result.individualid = individual_id
        result.raceid = race_list[selected_race].id
        this.saveResult(result)
        this.indivFilter.current.focus()
        result.rtime = ""
        result.nlaps = ""
        result.crew = ""
        this.setState({
            individual_filter: "",
            result: result
        })
        event.preventDefault()
    }

    doupdateIndividualSelection(event) {
        this.setState({individual_id: event.target.value})
    }

    doupdateIndividualFilter(event) {
        let k = event.key
        let {individual_filter} = this.state
        if (k == "Backspace" || k == "Delete") {
            individual_filter = ""
        } else if (k != "ArrowDown" && k != "ArrowUp" && k != "Enter" ) {
            individual_filter = individual_filter + k
        }
        this.setState({individual_filter: individual_filter})
    }

    /*
    * 3. adding new individual functions
    */
    dosaveIndividual(event) {
        let {name, boattypeid, boatnum} = this.state
        let individual = {
            name: name,
            boattypeid: boattypeid,
            boatnum: boatnum
        }
        if (name.length > 0 && boatnum.length > 0 && boattypeid > -1) {
            this.saveIndividual(individual)
        }
        event.preventDefault()
    }

    doupdateStateValue(event) {
        this.setState({
            [event.target.name]: event.target.value,
        })
    }


    /*
    ************************************************
    */
    componentDidMount() {
        this.updateIndividualList()
        this.updateRaceList()
    }

    render() {
        let { loading, individual_list, individual_filter, race_list, selected_race,
              race_results, result, name_list, boatnum_list, boattype_list, name,
              boattypeid, boatnum } = this.state
        // for race selection
        let raceList = race_list
            .map((r, i) => <option key={r.id} value={i}>{r.name}</option>)
        var r = {wholelegs:0, partlegs:0, ood:"TBA", aood:"TBA"}
        if (race_list.length > 0) {
            r = race_list[selected_race]
        }
        // for individual selection entering results
        let individualList = individual_list
        .filter(ind => {
            if (individual_filter.length < 1 ||
                ind.name.toLowerCase().includes(individual_filter.toLowerCase()) ||
                ind.boatnum.includes(individual_filter)) {
                    return true
                }
            return false
        })
        .map(ind => <option key={ind.id} value={ind.id}>{ind.name + " " + ind.boatnum + " " + ind.boattype.btype}</option>)
        // list of matching names when entering new individuals
        var n_names = 0
        let filteredNameList = name_list.filter(n => {
            if ((name.length < 1 ||
                n.toLowerCase().includes(name.toLowerCase())) && n_names < 8) {
                    n_names += 1
                    return true
                }
            return false
        })
        .map((n, ix) => <li key={ix}>{n}</li>)
        var boatTypeLlist = boattype_list.map(b => <option key={b.id} value={b.id}>{b.btype}</option>)
        var n_nums = 0
        let filteredBoatNumList = boatnum_list.filter(n => {
            if ((boatnum.length < 1 ||
                n.toLowerCase().includes(boatnum.toLowerCase())) && n_nums < 8) {
                    n_nums += 1
                    return true
                }
            return false
        })
        .map((n, ix) => <li key={ix}>{n}</li>)

        return (
            <div className="App">
                <LoadingIndicator loading={loading}/>
                <form onSubmit={this.dosaveSelectedRace}>
                    <table><tbody><tr>
                        <td>
                            <select size="8"  value={selected_race} onChange={this.doupdateRaceSelection}>
                                {raceList}
                            </select>
                        </td>
                        <td className="input_cell">
                            Legs in whole lap:<input type="text" name="wholelegs" value={r.wholelegs} size="1" onChange={this.doupdateRace}></input><br />
                            Legs in part lap:<input type="text" name="partlegs" value={r.partlegs} size="1" onChange={this.doupdateRace}></input><br />
                            OOD:<input type="text" name="ood" value={(r.ood==null) ? "" : r.ood} size="10" onChange={this.doupdateRace}></input><br />
                            AOOD:<input type="text" name="aood" value={(r.aood==null) ? "" : r.aood} size="10" onChange={this.doupdateRace}></input>
                        </td>
                        <td className="input_cell">
                            Wind direction (i.e. NW):<input type="text" name="winddir" value={(r.winddir==null) ? "" : r.winddir} size="1" onChange={this.doupdateRace}></input><br />
                            Wind strength (knots i.e. 5-20):<input type="text" name="windstr" value={(r.windstr==null) ? "" : r.windstr} size="1" onChange={this.doupdateRace}></input><br />
                            Comments:<input type="text" name="comments" value={(r.comments==null) ? "" : r.comments} size="25" onChange={this.doupdateRace}></input><br />
                            <input type="submit" value="SAVE CHANGES" />
                        </td>
                    </tr></tbody></table>
                </form>

                <form onSubmit={this.dosaveResult}>
                    <table><tbody><tr>
                        <td className="input_cell">
                            Filter:<input type="text" name="individual_filter" value={individual_filter}
                                    size="1" onChange={this.doupdateStateValue} ref={this.indivFilter}></input><br />
                            <select size="8" onChange={this.doupdateIndividualSelection}>
                                {individualList}
                            </select>
                        </td>
                        <td className="input_cell">
                            Number of full laps:<input type="text" name="nlaps" value={result.nlaps} size="1" onChange={this.doupdateResult}></input><br />
                            Time as HHMMSS or MMSS:<input type="text" name="rtime" value={result.rtime} size="1" onChange={this.doupdateResult}></input><br />
                            Crew:<input type="text" name="crew" value={result.crew} size="2" onChange={this.doupdateResult}></input><br />
                            <input type="submit" value="INSERT RESULT" />
                        </td>
                    </tr></tbody></table>
                </form>
                <div>{ (race_results.result != undefined) ?
                <RaceResult race_results={race_results}/> :
                <p>need to enter results</p>
                }</div>
                <div>
                <h3>Make sure there isn`t already an entry for this Name + Sail number combination</h3>
                <form onSubmit={this.dosaveIndividual}>
                    <table><tbody><tr>
                        <td className="input_cell">
                        Name:<input type="text" name="name" size="5" onChange={this.doupdateStateValue}></input><br />
                        <ul>{filteredNameList}</ul>
                        </td>
                        <td className="input_cell">
                            <select size="8" name="boattypeid" onChange={this.doupdateStateValue}>
                            {boatTypeLlist}
                            </select>
                        </td>
                        <td className="input_cell">
                        Sail Number:<input type="text" name="boatnum" size="3" onChange={this.doupdateStateValue}></input><br />
                        <ul>{filteredBoatNumList}</ul>
                        <input type="submit" value="INSERT INDIVIDUAL" />
                        </td>
                    </tr></tbody></table>
                </form>
                </div>
            </div>
        )
    }
}

export default App;
