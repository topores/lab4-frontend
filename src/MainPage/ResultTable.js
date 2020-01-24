import React from "react";
import {connect} from "react-redux";

class ResultTable extends React.Component {

    render() {
        let result = [];
        let points = this.props.points.concat().sort((a, b) => b.date - a.date);
        for (let item of points) {
            let history = item.histories.concat().sort((a, b) => b.date - a.date);
            result.push(
                <tr key={item.id}>
                    {/*<td>{this.props.currentPoint === item.id ? this.xChange() : history[0].x}</td>*/}
                    {/*<td>{this.props.currentPoint === item.id ? this.yChange() : history[0].y}</td>*/}
                    <td>{history[0].x}</td>
                    <td>{history[0].y}</td>
                    <td>{item.r}</td>
                    <td>{history[0].check ? "Yeap" : "Nope"}</td>
                    <td>{formatDate(new Date(item.date))}</td>
                    <td>{this.deleteButton(item)}</td>
                    {/*<td>{this.props.currentPoint === item.id ? this.saveButton(item) : formatDate(new Date(item.date))}</td>*/}
                    {/*<td>{this.props.currentPoint === item.id ? this.deleteButton(item) : this.changeButton(item)}</td>*/}
                </tr>
            )
        }
        return (
            <div>
                <h1 className="reqH">History Table</h1>
                <table className="result-table">
                    <thead>
                    <tr>
                        <th>x</th>
                        <th>y</th>
                        <th>R</th>
                        <th>isInArea</th>
                        <th>Time</th>
                        <th>Edit</th>
                    </tr>
                    </thead>
                    <tbody>{result}</tbody>
                </table>
            </div>
        )
    }

    changeButton = (item) => (<button className="r-button" onClick={event => {
        this.props.dispatch({
            type: "MAIN_SET_CURRENT_POINT",
            value: item
        })
    }}>Edit</button>);

    saveButton = (item) => (<button className="r-button" onClick={event => {
        this.props.dispatch({type: "MAIN_UPDATE_POINT", value: item})
    }}>Save</button>);

    deleteButton = (item) => (<button className="r-button" onClick={event => {
        this.props.dispatch({type: "MAIN_DELETE_POINT", value: item})
    }}>Delete</button>);

    xChange = () => (<input type="text" className="change-input" value={this.props.x}
                            onChange={event => this.props.dispatch({
                                type: "MAIN_SET_CHANGE_X",
                                value: event.target.value
                            })}/>);
    yChange = () => (<input type="text" className="change-input" value={this.props.y}
                            onChange={event => this.props.dispatch({
                                type: "MAIN_SET_CHANGE_Y",
                                value: event.target.value
                            })}/>);
}

const mapStateToProps = function (store) {
    return {
        points: store.appState.points,
        currentPoint: store.mainState.currentPoint,
        x: store.mainState.xChange,
        y: store.mainState.yChange
    }
};


const formatDate = (date) => {
    return `${toDoubleDigits(date.getDay())}.${toDoubleDigits(date.getMonth())}.${toDoubleDigits(date.getFullYear())},\n
     ${toDoubleDigits(date.getHours())}:${toDoubleDigits(date.getMinutes())}:${toDoubleDigits(date.getSeconds())}`
};
const toDoubleDigits = (item) => {
    return Number(item) < 10 ? "0" + item : "" + item;
};

export default connect(mapStateToProps)(ResultTable)