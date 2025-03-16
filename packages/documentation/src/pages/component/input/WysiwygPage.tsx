import React from "react";
import {Editor, EditorState, ImageProvider, ListProvider, ParagraphProvider, TableProvider} from "react-ui-simplicity";
import {CodeProvider} from "react-ui-simplicity/src/components/inputs/wysiwyg/shared/blocks/code/CodeProvider";

export default function WysiwygPage() {
    return (
        <div className={"wysiwyg-page"} style={{height: "calc(100% - 20px)", padding: "10px"}}>
            <EditorState providers={[new ParagraphProvider(), new ListProvider(), new ImageProvider(), new TableProvider(), new CodeProvider()]}>
                <Editor style={{height: "100%"}}/>
            </EditorState>
        </div>
    )
}