import React, {useContext} from "react"

import {EditorContext} from "../EditorState";

function InputManager(properties: EditorInput.Attributes) {

    const {inputRef} = properties

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
                  style={{position: "absolute", left: "-2000px", opacity: 1}}/>
    )
}

namespace EditorInput {
    export interface Attributes {
        inputRef : React.RefObject<HTMLTextAreaElement>
    }
}

export default InputManager