import React, {useContext} from "react"
import EditorContext from "./EditorContext";

function EditorInput(properties: EditorInput.Attributes) {

    const {inputRef, inspector} = properties

    const {ast, event, cursor, providers, selection} = useContext(EditorContext)

    function onInput(e: React.FormEvent<HTMLTextAreaElement>) {
        let inputEvent = e.nativeEvent as InputEvent;

        event.currentEvent = {
            handled : false,
            instance : {
                type: inputEvent.inputType,
                data: inputEvent.data
            }
        }

        event.triggerEvent()
    }

    function onKeyDown(e: React.KeyboardEvent) {
        const whiteList = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Delete", "Home", "End"]

        if (whiteList.indexOf(e.key) > -1) {

            event.currentEvent = {
                handled : false,
                instance : {
                    type: e.type,
                    data: e.key
                }
            }

            event.triggerEvent()
        }
    }

    return (
        <textarea ref={inputRef}
                  onKeyDown={onKeyDown}
                  onInput={onInput}
                  disabled={!!inspector.current}
                  style={{position: "absolute", top: "-2000px", opacity: 1}}/>
    )
}

namespace EditorInput {
    export interface Attributes {
        inputRef : React.RefObject<HTMLTextAreaElement>
        inspector : {current : any}
    }
}

export default EditorInput