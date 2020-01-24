import React from "react";
import {connect} from "react-redux";
import CanvasComponent from "./CanvasComponent";
import ResultTable from "./ResultTable";
import {Spinner} from 'primereact/spinner';

class MainContainer extends React.Component {
    constructor(props) {
        super(props);
        if (this.props.user === null) this.props.history.push("/login");
        else this.props.dispatch({type: "APP_GET_POINTS", value: {history: this.props.history}})
    }

    render() {
        return (
            <div className="main">
                <h2>Hello, {this.props.user}</h2>
                <CanvasComponent/>
                <h2 className="specialH">Choose X</h2>
                <Spinner value={this.props.x}
                         onChange={(e) => this.props.dispatch({type: "MAIN_SET_X", value: e.value})} min={-5} max={3}/>
                <h2>Input Y</h2>
                <input type="text" value={this.props.y} placeholder="from -5 to 3"
                       onChange={event => this.props.dispatch({
                           type: "MAIN_SET_Y",
                           value: event.target.value.replace(",", ".")
                       })}/>
                <h2>Choose R</h2>
                <Spinner value={this.props.r}
                         onChange={(e) => this.props.dispatch({type: "MAIN_SET_R", value: e.value})} min={0} max={3}
                         step={1}/>
                <br/>
                <button className="submit-button" onClick={() => this.props.dispatch({
                    type: "MAIN_ADD_POINT",
                    value: {x: this.props.x, y: this.props.y, r: this.props.r}
                })} disabled={this.props.y === "" || this.props.y === "-" || this.props.y === "."}>Check</button>
                <button className="submit-button" onClick={this.exit}>Sign out</button>
                <br/>
                <ResultTable/>
            </div>
        )
    }


    exit = () => {
        this.props.dispatch({type: "APP_LOGOUT", value: {history: this.props.history}});
    }
}

const mapStateToProps = function (store) {
    return {
        user: store.appState.user,
        x: store.mainState.xField,
        y: store.mainState.yField,
        r: store.mainState.rField,
    }
};

export default connect(mapStateToProps)(MainContainer);