import React from "react";
import {Editor, EditorState, ImageProvider, ListProvider, ParagraphProvider, TableProvider} from "react-ui-simplicity";
import {CodeProvider} from "react-ui-simplicity/src/components/inputs/wysiwyg/blocks/code/CodeProvider";
import DomState from "react-ui-simplicity/src/components/inputs/wysiwyg/contexts/DomState";

export default function WysiwygPage() {
    return (
        <div className={"wysiwyg-page"} style={{height: "100%"}}>
            <EditorState providers={[new ParagraphProvider(), new ListProvider(), new ImageProvider(), new TableProvider(), new CodeProvider()]}>
                <DomState>
                    <Editor style={{height: "99%", maxWidth : "600px"}}/>
                </DomState>
            </EditorState>
        </div>
    )
}