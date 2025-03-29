import React from "react";
import {CodeNode, CodeProvider, DomState, Editor, EditorState, ImageProvider, ListProvider, ParagraphProvider, RootNode, TableProvider} from "react-ui-simplicity";

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