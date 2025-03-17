import React from "react";
import {Editor, EditorState, ImageProvider, ListProvider, ParagraphProvider, TableProvider} from "react-ui-simplicity";
import {CodeProvider} from "react-ui-simplicity/src/components/inputs/wysiwyg/blocks/code/CodeProvider";

export default function WysiwygPage() {
    return (
        <div className={"wysiwyg-page"} style={{height: "100%"}}>
            <EditorState providers={[new ParagraphProvider(), new ListProvider(), new ImageProvider(), new TableProvider(), new CodeProvider()]}>
                <Editor style={{height: "100%", maxWidth : "600px"}}/>
            </EditorState>
        </div>
    )
}