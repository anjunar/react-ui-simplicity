import {v4} from "uuid";

export abstract class AbstractNode<D> {

    id = v4()

    selected : boolean = false

    dom : HTMLElement

    abstract type : string

    abstract data : D

    abstract get isEmpty()

}