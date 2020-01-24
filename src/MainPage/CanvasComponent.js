import React from "react";
import {connect} from "react-redux";

class CanvasComponent extends React.Component {
    render() {
        return (
            <div className="canvas-div">
                <canvas ref="canvas" height="400px" width="400px" onClick={(event => this.handleClick(event))}/>
            </div>
        )
    }

    componentDidMount() {
        this.canvas = this.refs.canvas;
        this.i = Math.min(this.canvas.height, this.canvas.width) / 10 - 5;
        console.log(this.canvas.height, this.canvas.width, this.i, Math.min(this.canvas.height + this.canvas.width) / 10);
        this.updateCanvas();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.updateCanvas();
    }

    updateCanvas() {
        this.clear(this.canvas);
        this.draw(this.i, this.canvas);
        for (let point of this.props.points) {
            this.drawPoint(point.x, point.y, point.ch ? '#73fc62' : '#fc6161', this.i, this.canvas)
        }
    }


    draw(i, canvas) {
        const ctx = canvas.getContext('2d');
        let height = canvas.height;
        let width = canvas.width;
        this.drawArea(ctx, i, width, height);
        this.drawGraph(this.props.r, this.i, this.canvas);
        this.drawAxises(ctx, i, width, height);

    }

    drawAxises(ctx, i, width, height) {
        ctx.lineWidth = 1;
        ctx.strokeStyle = "black";
        ctx.beginPath();
        //AxisY
        ctx.moveTo(width / 2, height);
        ctx.lineTo(width / 2, 0);
        ctx.lineTo(width / 2 + 3, 7);
        ctx.moveTo(width / 2, 0);
        ctx.lineTo(width / 2 - 3, 7);
        //AxisX
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.lineTo(width - 7, height / 2 + 3);
        ctx.moveTo(width, height / 2);
        ctx.lineTo(width - 7, height / 2 - 3);
        //Markers
        this.drawMarkersX(ctx, i, width, height);
        this.drawMarkersY(ctx, i, width, height);
        ctx.stroke();
    }

    drawArea(ctx, i, width, height) {
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.strokeStyle = "#fce4ff";
        ctx.fillStyle = "#ffc5fa";
        ctx.moveTo(width / 2 - 5 * i, height / 2 - 3 * i);
        ctx.lineTo(width / 2 + 3 * i, height / 2 - 3 * i);
        ctx.lineTo(width / 2 + 3 * i, height / 2 + 5 * i);
        ctx.lineTo(width / 2 - 5 * i, height / 2 + 5 * i);
        ctx.lineTo(width / 2 - 5 * i, height / 2 - 3 * i);
        ctx.fill();
    }

    drawMarkersX(ctx, i, width, height) {
        let t = width / 2;
        for (let j = 0; j < 5; j++) {
            t += i;
            ctx.moveTo(t, height / 2 + 3);
            ctx.lineTo(t, height / 2 - 3)
        }
        t = width / 2;
        for (let j = 0; j < 5; j++) {
            t -= i;
            ctx.moveTo(t, height / 2 + 3);
            ctx.lineTo(t, height / 2 - 3)
        }
    }

    drawMarkersY(ctx, i, width, height) {
        let t = height / 2;
        for (let j = 0; j < 5; j++) {
            t += i;
            ctx.moveTo(width / 2 + 3, t);
            ctx.lineTo(width / 2 - 3, t);
        }
        t = height / 2;
        for (let j = 0; j < 5; j++) {
            t -= i;
            ctx.moveTo(width / 2 + 3, t);
            ctx.lineTo(width / 2 - 3, t);
        }
    }

    drawGraph(r, i, canvas) {
        const ctx = canvas.getContext('2d');
        let height = canvas.height;
        let width = canvas.width;
        ctx.strokeStyle = "#fa52fc";
        ctx.fillStyle = "#fc4cf9";
        ctx.beginPath();
        ctx.moveTo(width / 2, height / 2);
        ctx.lineTo(width / 2 + r / 2 * i, height / 2);
        ctx.lineTo(width / 2 + r / 2 * i, height / 2-r*i);
        ctx.lineTo(width / 2, height / 2-r*i);
        ctx.lineTo(width / 2 , height / 2-r/2*i);
        ctx.lineTo(width / 2-r*i, height / 2);
        ctx.lineTo(width / 2, height / 2);
        ctx.arc(width / 2, height / 2, r / 2 * i, Math.PI / 2 * 3-Math.PI / 2, Math.PI * 3-Math.PI / 2, true);

        ctx.fill();
    }

    clear(canvas) {
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    }

    handleClick(event) {
        let obj = event.target;
        let x = Number(((event.pageX - window.pageXOffset - obj.getBoundingClientRect().x - obj.width / 2) / this.i).toFixed(2));
        let y = Number((-(event.pageY - window.pageYOffset - obj.getBoundingClientRect().y - obj.height / 2) / this.i).toFixed(2));
        if (!(x < -5 || x > 3 || y < -5 || y > 3)) {
            this.props.dispatch({type: "MAIN_ADD_POINT", value: {x: x, y: y, r: this.props.r}})
        }
    }

    drawPoint(x, y, color, i, canvas) {
        let ctx = canvas.getContext('2d');
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(canvas.width / 2 + x * i, canvas.height / 2 - y * i, 3, 0, Math.PI * 2, true);
        ctx.fill();
    }
}

const mapStateToProps = function (store) {
    return {
        points: store.appState.drawing,
        r: store.mainState.rField,
    }
};

export default connect(mapStateToProps)(CanvasComponent);