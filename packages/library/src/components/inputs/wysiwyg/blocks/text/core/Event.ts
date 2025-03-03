import {GeneralEvent} from "../EditorContext";

export interface EventState {
    handled: boolean
    instance : GeneralEvent
}