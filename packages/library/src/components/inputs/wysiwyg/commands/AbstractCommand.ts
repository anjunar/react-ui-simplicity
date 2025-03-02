import {Context} from "../components/EditorContext";

export abstract class AbstractCommand<E> {
    abstract execute(value : E, context : Context) : void;
}