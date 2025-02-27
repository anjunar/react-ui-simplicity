import React from "react";
import {Wysiwyg} from "react-ui-simplicity";
import {ParagraphProvider} from "react-ui-simplicity/src/components/inputs/wysiwyg/blocks/paragraph/ParagraphProvider";
import {HeaderProvider} from "react-ui-simplicity/src/components/inputs/wysiwyg/blocks/header/HeaderProvider";
import {ImageProvider} from "react-ui-simplicity/src/components/inputs/wysiwyg/blocks/image/ImageProvider";
import {ListProvider} from "react-ui-simplicity/src/components/inputs/wysiwyg/blocks/list/ListProvider";

export default function WysiwygPage() {
    return (
        <div className={"wysiwyg-page"} style={{height : "100%"}}>
            <Wysiwyg style={{height : "99%"}} providers={[new ParagraphProvider(), new HeaderProvider(), new ImageProvider(), new ListProvider()]}/>
        </div>
    )
}