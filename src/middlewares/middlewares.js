import {applyMiddleware} from "redux";
import loginMiddleware from "./loginMiddleware";
import registerMiddleware from "./registerMiddleware";
import mainMiddleware from "./mainMiddleware";

export default applyMiddleware(loginMiddleware, registerMiddleware, mainMiddleware);