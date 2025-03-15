import React, {useContext, useEffect} from "react"
import {findSelectedNodes, flattenAST} from "../selection/ASTSelection";
import {EditorContext} from "../../shared/contexts/EditorState";
import {MarkdownContext} from "../../shared/contexts/MarkdownState";

function SelectionManager(properties: SelectionManager.Attributes) {

    const {textareaRef} = properties

    const {ast} = useContext(EditorContext)

    const {selection} = useContext(MarkdownContext)

    useEffect(() => {
        function onSelect(event: Event) {
            let textArea = event.target as HTMLTextAreaElement
            let nodeRanges = flattenAST(ast.root.children);
            selection.currentSelection = findSelectedNodes(nodeRanges, textArea.selectionStart, textArea.selectionEnd)
            selection.triggerSelection()
        }

        textareaRef.current.addEventListener("selectionchange", onSelect)

        return () => {
            textareaRef.current?.removeEventListener("selectionchange", onSelect)
        }

    }, [textareaRef.current, ast]);

    return (
        <></>
    )
}

namespace SelectionManager {
    export interface Attributes {
        textareaRef : React.RefObject<HTMLTextAreaElement>
    }
}

export default SelectionManager