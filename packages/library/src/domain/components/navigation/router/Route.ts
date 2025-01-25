import Loader from "./Loader";
import {FunctionComponent} from "react";

export interface Route {

    path  : string
    subRouter? : boolean
    component? : FunctionComponent<any>
    children? : Route[]
    loader? : Loader
}