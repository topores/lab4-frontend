import React from 'react';
import {Route, Switch} from "react-router-dom";
import "./static/styles/style.scss"
import LoginPage from "./LoginPage/LoginPage";
import MainPage from "./MainPage/MainPage";
import RegisterPage from "./RegisterPage/RegisterPage";


class App extends React.Component {
    render() {
        return (
            <div className="App">
                <Header/>
                <Switch>
                    <Route exact path="/login" component={LoginPage}/>
                    <Route exact path="/register" component={RegisterPage}/>
                    <Route path="/" component={MainPage}/>
                </Switch>
            </div>
        );
    }
}


const Header = () => {
    return (<div className="head">
        <span id="title">
            Lab 4. Вариант 100005
            <p><a href="https://github.com/topores" target="_blank" rel="noopener noreferrer">Давыдов Ростислав, P3214</a>
            </p>
            </span>


        {/*<a href="http://se.ifmo.ru" target="_blank" rel="noopener noreferrer"> <img  className="App-logo" src={logo} alt="logo"/></a><br/>*/}

    </div>)
};


export default App;
