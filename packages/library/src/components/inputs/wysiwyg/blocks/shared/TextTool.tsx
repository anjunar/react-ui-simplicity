import React, {useContext} from "react"
import ToolButton from "../../components/ToolButton";
import {Context} from "../../context/Context";
import {BoldCommand} from "../../commands/BoldCommand";
import {ItalicCommand} from "../../commands/ItalicCommand";
import {DeletedCommand} from "../../commands/DeletedCommand";
import {SubCommand} from "../../commands/SubCommand";
import {SupCommand} from "../../commands/SupCommand";

function TextTool(properties: TextTool.Attributes) {

    const {} = properties

    const {ast, providers, trigger} = useContext(Context)

    const node = ast.blocks.find(node => node.selected)

    return (
        <div>
            <ToolButton
                editableContent={node.dom}
                command={new BoldCommand()}
                callback={css => css.fontWeight === "700"}
            >
                format_bold
            </ToolButton>
            <ToolButton
                editableContent={node.dom}
                command={new ItalicCommand()}
                callback={css => css.fontStyle === "italic"}
            >
                format_italic
            </ToolButton>
            <ToolButton
                editableContent={node.dom}
                command={new DeletedCommand()}
                callback={css => css.textDecorationLine === "line-through"}
            >
                strikethrough_s
            </ToolButton>
            <ToolButton
                editableContent={node.dom}
                command={new SubCommand()}
                callback={css => css.verticalAlign === "sub"}
            >
                subscript
            </ToolButton>
            <ToolButton
                editableContent={node.dom}
                command={new SupCommand()}
                callback={css => css.verticalAlign === "super"}
            >
                superscript
            </ToolButton>
        </div>
    )
}

namespace TextTool {
    export interface Attributes {

    }
}

export default TextTool
