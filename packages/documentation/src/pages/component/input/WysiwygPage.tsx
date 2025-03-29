import React from "react";
import {CodeProvider, DomState, Editor, EditorState, ImageProvider, ListProvider, ParagraphProvider, TableProvider} from "react-ui-simplicity";
import {RootNode} from "react-ui-simplicity/src/components/inputs/wysiwyg/core/TreeNode";
import {CodeNode} from "react-ui-simplicity/src/components/inputs/wysiwyg/blocks/code/CodeNode";

export default function WysiwygPage() {
    return (
        <div className={"wysiwyg-page"} style={{height: "100%"}}>
            <EditorState providers={[new ParagraphProvider(), new ListProvider(), new ImageProvider(), new TableProvider(), new CodeProvider()]}>
                <DomState>
                    <Editor style={{height: "99%", maxWidth : "600px"}} value={new RootNode([new CodeNode("let i = 2")])}/>
                </DomState>
            </EditorState>
        </div>
    )
}