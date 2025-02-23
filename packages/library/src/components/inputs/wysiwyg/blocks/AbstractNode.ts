import {v4} from "uuid";

export abstract class AbstractNode<D> {

    id = v4()

    abstract type : string

    abstract data : D

    abstract get isEmpty()

}