import React from "react";
import {Wysiwyg} from "react-ui-simplicity";
import {ParagraphProvider} from "react-ui-simplicity/src/components/inputs/wysiwyg/blocks/paragraph/ParagraphProvider";
import {HeaderProvider} from "react-ui-simplicity/src/components/inputs/wysiwyg/blocks/header/HeaderProvider";
import {ImageProvider} from "react-ui-simplicity/src/components/inputs/wysiwyg/blocks/image/ImageProvider";

export default function WysiwygPage() {
    return (
        <div className={"wysiwyg-page"}>
            <Wysiwyg providers={[new ParagraphProvider(), new HeaderProvider(), new ImageProvider()]}/>
        </div>
    )
}