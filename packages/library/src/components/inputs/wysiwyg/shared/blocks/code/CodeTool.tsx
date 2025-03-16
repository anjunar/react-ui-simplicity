import React, {useContext, useEffect, useRef, useState} from "react"
import {CodeNode} from "./CodeNode";
import {EditorContext} from "../../contexts/EditorState";

function CodeTool(properties: CodeTool.Attributes) {

    const {node} = properties

    const [text, setText] = useState(node.source)

    const {ast : {triggerAST}} = useContext(EditorContext)

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        function handlePaste(event: ClipboardEvent) {
            event.preventDefault(); // Standardverhalten verhindern

            const pastedText = event.clipboardData.getData("text");
            let currentTarget = event.currentTarget as HTMLTextAreaElement;

            const { selectionStart, selectionEnd } = currentTarget;

            // Füge den Text korrekt in den State ein
            const newText =
                text.substring(0, selectionStart) +
                pastedText +
                text.substring(selectionEnd);

            setText(newText); // State aktualisieren

            // Cursor-Position nach dem Einfügen setzen
            requestAnimationFrame(() => {
                currentTarget.setSelectionRange(selectionStart + pastedText.length, selectionStart + pastedText.length);
            });
        }

        const textarea = textareaRef.current;
        if (textarea) {
            textarea.addEventListener("paste", handlePaste);
        }

        return () => {
            if (textarea) {
                textarea.removeEventListener("paste", handlePaste);
            }
        };
    }, []);
    useEffect(() => {
        node.source = text
        triggerAST()
    }, [text]);

    return (
        <div style={{overflow : "auto", width : "200px"}}>
            <textarea ref={textareaRef} style={{width : "1200px", height : "200px", fontFamily: "monospace"}} spellCheck={false}
                      value={text}
                      onChange={event => setText(event.target.value)}>
            </textarea>
        </div>
    )
}

namespace CodeTool {
    export interface Attributes {
        node : CodeNode
    }
}

export default CodeTool