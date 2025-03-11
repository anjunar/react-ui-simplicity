import React from "react";
import {Editor, FlexProvider, ImageProvider, ListProvider, ParagraphProvider, TableProvider} from "react-ui-simplicity";
import EditorState from "react-ui-simplicity/src/components/inputs/wysiwyg/EditorState";

export default function WysiwygPage() {
    return (
        <div className={"wysiwyg-page"} style={{height : "calc(100% - 20px)", padding : "10px"}}>
            <EditorState providers={[new ParagraphProvider(), new ListProvider(), new ImageProvider(), new TableProvider(), new FlexProvider()]}>
                <Editor style={{height : "100%"}}/>
            </EditorState>
        </div>
    )
}