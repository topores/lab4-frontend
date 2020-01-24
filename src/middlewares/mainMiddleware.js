import {DEFAULT_URL} from "../index";


const mainMiddleware = store => next => action => {
    switch (action.type) {
        case "APP_LOGOUT": {
            let req = new XMLHttpRequest();
            req.open("GET", `${DEFAULT_URL}/logout`, true);
            req.send();
            window.localStorage.setItem("user", null);
            action.value.history.push("/login");
            return next(action)
        }
        case "APP_GET_POINTS": {
            getPoints(store, action.value.history);
            return next(action)
        }
        case "MAIN_ADD_POINT": {
            addPoint(store, action.value);
            store.dispatch({type: "MAIN_SET_Y", value: ""});
            return next(action)
        }
        case "APP_UPDATE_POINTS_SUCCESS": {
            updateDrawing(store, action.value, store.getState().mainState.rField);
            return next(action);
        }
        case "MAIN_SET_R": {
            updateDrawing(store, store.getState().appState.points, Number(action.value));
            return next(action);
        }
        case "MAIN_SET_CURRENT_POINT": {
            if (action.value.id !== 0) {
                let history = action.value.histories.concat().sort((a, b) => b.date - a.date);
                store.dispatch({type: "MAIN_SET_CHANGE_X", value: "" + history[0].x});
                store.dispatch({type: "MAIN_SET_CHANGE_Y", value: "" + history[0].y})
            } else {
                store.dispatch({type: "MAIN_SET_CHANGE_X", value: ""});
                store.dispatch({type: "MAIN_SET_CHANGE_Y", value: ""})
            }
            return next(action);
        }
        case "MAIN_UPDATE_POINT": {
            let history = action.value.histories.concat().sort((a, b) => b.date - a.date)[0];
            if (Number(store.getState().mainState.xChange) !== Number(history.x) || Number(store.getState().mainState.yChange) !== Number(history.y)) {
                updatePoint(store, {
                    id: store.getState().mainState.currentPoint,
                    x: store.getState().mainState.xChange, y: store.getState().mainState.yChange
                });
            } else {
                store.dispatch({type: "MAIN_SET_CURRENT_POINT", value: {id: 0}})
            }
            return next(action);
        }
        case "MAIN_DELETE_POINT": {
            deletePoint(store, action.value);
            store.dispatch({type: "MAIN_SET_CURRENT_POINT", value: {id: 0}});
            return next(action);
        }
        default:
            return next(action);
    }
};

const updateDrawing = (store, value, r) => {
    let array = [];
    for (let i of value) {
        let x = i.histories.concat().sort((a, b) => b.date - a.date)[0].x;
        let y = i.histories.concat().sort((a, b) => b.date - a.date)[0].y;
        /*let QuadrantI = x >= 0 && y >= 0 && y + 2 * x <= r;
        let QuadrantII = x <= 0 && y >= 0 && x * x + y * y <= r * r / 4;
        let QuadrantIII = x <= 0 && y <= 0 && x >= -r / 2 && y >= -r;
        let QuadrantIV = x >= 0 && y <= 0 && x < 0 && y < 0;*/
        let QuadrantI = x >= 0 && y >= 0 &&  x <= r/2 &&  y <= r;
        let QuadrantII = x <= 0 && y >= 0 && (1/2)*x+1/2*r>=y;
        let QuadrantIII = x <= 0 && y <= 0 && x*x+y*y <= r*r/4;
        let QuadrantIV = x >= 0 && y <= 0 && false;
        array.push({x: x, y: y, ch: QuadrantI || QuadrantII || QuadrantIII || QuadrantIV});
    }
    store.dispatch({type: "APP_UPDATE_DRAWING_SUCCESS", value: array});
};

const getPoints = (store, history) => {
    let req = new XMLHttpRequest();
    req.open("GET", `${DEFAULT_URL}/get`, true);
    req.onload = () => handleUpdate(req.responseText, store, history);
    req.onerror = () => alert("Server is unavailable.0___0");
    req.send();
};

const addPoint = (store, value) => {
    let req = new XMLHttpRequest();
    req.open("POST", `${DEFAULT_URL}/add`, true);
    req.onload = () => handleUpdate(req.responseText, store);
    req.onerror = () => alert("Server is unavailable.0___0");
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify(value));
};

const updatePoint = (store, value) => {
    let req = new XMLHttpRequest();
    req.open("POST", `${DEFAULT_URL}/update`, true);
    req.onload = () => {
        handleUpdate(req.responseText, store);
        store.dispatch({type: "MAIN_SET_CURRENT_POINT", value: {id: 0}})
    };
    req.onerror = () => alert("Server is unavailable.0___0");
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify(value));
};

const deletePoint = (store, value) => {
    let req = new XMLHttpRequest();
    req.open("POST", `${DEFAULT_URL}/delete`, true);
    req.onload = () => {
        handleUpdate(req.responseText, store);
        store.dispatch({type: "MAIN_SET_CURRENT_POINT", value: {id: 0}})
    };
    req.onerror = () => alert("Server is unavailable.0___0");
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify({id: value.id}));
};


const handleUpdate = (text, store, history = null) => {
    if (text.startsWith("{")) {
        let response = JSON.parse(text);
        if (response.status === 200) {
            store.dispatch({type: "APP_UPDATE_POINTS_SUCCESS", value: response.answer})
        } else if (history) {
            alert(history);
            store.dispatch({type: "APP_LOGOUT", value: {history: history}})
        }
    } else store.dispatch({type: "APP_LOGOUT", value: {history: history}})
};


export default mainMiddleware;