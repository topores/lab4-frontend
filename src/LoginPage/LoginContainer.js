import React from "react";
import {connect} from "react-redux";

class LoginContainer extends React.Component{
    render() {
        return(
            <div className="main">
                <h1>welcome</h1>
                <h2>Login</h2>
                <input type="text" value={this.props.login}
                       onChange={event => this.props.dispatch({
                           type: "LOGIN_SET_LOGIN",
                           value: event.target.value.replace(" ", "")})}/>
                <h2>Password</h2>
                <input type="password" value={this.props.password}
                       onChange={event => this.props.dispatch({
                           type: "LOGIN_SET_PASSWORD",
                           value: event.target.value})}/>
                <br/>
                <div className={!this.props.error? 'hidden' : 'warn'}>
                    Password and/or Login is incorrect.
                </div>
                <button className="submit-button" disabled={!this.props.formCorrect}
                        onClick={this.sendLoginRequest}>Sign in</button>
                <button className="submit-button" onClick={this.redirectToRegister}>Sign up</button>

            </div>
        )
    }
    sendLoginRequest = ()=>{
        this.props.dispatch({type:"APP_LOGIN", value:{history: this.props.history}})
    };

    redirectToRegister = ()=>{this.props.history.push("/register")};

}

const mapStateToProps = function(store) {
    return {
        user: store.appState.user,
        login: store.loginState.login,
        password: store.loginState.password,
        error: store.loginState.error,
        formCorrect: store.loginState.formCorrect
    }
};
export default connect(mapStateToProps)(LoginContainer)