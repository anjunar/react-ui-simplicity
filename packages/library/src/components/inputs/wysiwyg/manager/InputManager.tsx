import React, { useContext, useEffect, useState } from "react";
import { EditorContext } from "../contexts/EditorState";
import { DomContext } from "../contexts/DomState";

const allowedKeys = new Set(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Delete", "Home", "End", "Backspace"]);

let isComposing = false

function InputManager(properties: EditorInput.Attributes) {

    const { ast, event, cursor } = useContext(EditorContext);

    const { inputRef } = useContext(DomContext);

    function triggerEditorEvent(type: string, data: any) {
        event.currentEvent = {
            queue: [],
            instance: { type, data }
        };

        event.triggerEvent();
    }

    function onInput(e: React.FormEvent<HTMLTextAreaElement>) {
        const inputEvent = e.nativeEvent as InputEvent;
        if (! inputEvent.isComposing) {
            triggerEditorEvent(inputEvent.inputType, inputEvent.data);
        }
    }

    function onKeyDown(e: React.KeyboardEvent) {
        if (allowedKeys.has(e.key)) {
            triggerEditorEvent(e.key, e.key);
        }
    }

    function onCompositionUpdate(e: React.CompositionEvent) {
        triggerEditorEvent("compositionUpdate", e.data);
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
                  style={{position: "absolute", right: "0px", top: "0px", height: "1px", width: "1px", opacity: 1}}/>
    )
}

namespace EditorInput {
    export interface Attributes {}
}

export default InputManager;
