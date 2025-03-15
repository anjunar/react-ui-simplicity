import React, {useContext, useEffect, useState} from "react"
import {AbstractCommand} from "../../commands/AbstractCommand";
import {MarkdownContext} from "../../../shared/contexts/MarkdownState";
import {AbstractNode, TextNode} from "../../../shared/core/TreeNode";
import {NodeRange} from "../../selection/ASTSelection";

function FormatButton(properties: FormatButton.Attributes) {

    const {children, command, textArea, isActiveCallback, isDisabledCallback} = properties

    const {markdown, selection : {currentSelection}} = useContext(MarkdownContext)

    const [active, setActive] = useState(false)

    const [disabled, setDisabled] = useState(false)

    function onClick() {
        command.execute(! active, textArea, markdown);
        markdown.triggerMarkdown()
    }

    useEffect(() => {
        setActive(isActiveCallback(currentSelection))

        setDisabled(isDisabledCallback(currentSelection))

    }, [currentSelection]);

    return (
        <button disabled={disabled} className={`material-icons${active ? " active" : ""}`} onClick={onClick}>{children}</button>
    )
}

namespace FormatButton {
    export interface Attributes {
        children: React.ReactNode
        command: AbstractCommand
        textArea: HTMLTextAreaElement,
        isActiveCallback : (node : NodeRange[]) => boolean
        isDisabledCallback : (node : NodeRange[]) => boolean
    }
}

export default FormatButton