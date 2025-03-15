import React, {useContext, useEffect} from "react"

import {WysiwygContext} from "../../shared/contexts/WysiwygState";
import {EditorContext} from "../../shared/contexts/EditorState";

let isComposing = false

function InputManager(properties: EditorInput.Attributes) {

    const {inputRef} = properties

    const {event, cursor} = useContext(WysiwygContext)

    const {ast} = useContext(EditorContext)

    function onInput(e: React.FormEvent<HTMLTextAreaElement>) {
        let inputEvent = e.nativeEvent as InputEvent;

        if (Reflect.has(window, "ontouchmove") || ! (inputEvent.inputType === "deleteContentBackward")) {
            event.currentEvent = {
                queue : [],
                instance : {
                    type: inputEvent.inputType,
                    data: inputEvent.data
                }
            }

            event.triggerEvent()
        }

    }

    function onKeyDown(e: React.KeyboardEvent) {
        const whiteList = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Delete", "Home", "End", "Backspace"]

        if (whiteList.indexOf(e.key) > -1) {

            event.currentEvent = {
                queue : [],
                instance : {
                    type: e.key,
                    data: e.key
                }
            }

            event.triggerEvent()

        }
    }

    function onCompositionUpdate(compositionEvent : React.CompositionEvent) {
        event.currentEvent = {
            queue : [],
            instance : {
                type: "compositionUpdate",
                data: compositionEvent.data
            }
        }

        event.triggerEvent()
    }

    useEffect(() => {

        for (const command of event.currentEvent.queue) {
            command.handle()
        }

        ast.triggerAST()
        cursor.triggerCursor()

    }, [event.currentEvent.queue]);

    return (
        <textarea ref={inputRef}
                  onKeyDown={onKeyDown}
                  onInput={(event) => {
                      if (isComposing) return;
                      onInput(event);
                  }}
                  onCompositionStart={() => isComposing = true}
                  onCompositionUpdate={(event) => {
                      if (!isComposing) return
                      onCompositionUpdate(event)
                  }}
                  onCompositionEnd={() => isComposing = false}
                  style={{position: "absolute", right: "0px", top : "0px", height : "1px", width : "1px", opacity: 1}}/>
    )
}

namespace EditorInput {
    export interface Attributes {
        inputRef : React.RefObject<HTMLTextAreaElement>
    }
}

export default InputManager