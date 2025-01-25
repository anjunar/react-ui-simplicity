import "./Toolbar.css"
import React, {CSSProperties} from "react"
import FontSelectStyle from "./toolbar/FontSelectStyle"
import FontStyle from "./toolbar/FontStyle"
import Pages from "../../layout/pages/Pages";
import Page from "../../layout/pages/Page";
import FontInputStyle from "./toolbar/FontInputStyle";

function Toolbar(properties: Toolbar.Attributes) {

    const {editableContent, page, ...rest} = properties

    function rgbToHex(color: string) {
        color = "" + color
        if (!color || color.indexOf("rgb") < 0) {
            return ""
        }

        if (color.charAt(0) === "#") {
            return color
        }

        let nums = /(.*?)rgb[a]?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)/i.exec(color)
        if (nums) {
            let r = parseInt(nums[2], 10).toString(16)
            let g = parseInt(nums[3], 10).toString(16)
            let b = parseInt(nums[4], 10).toString(16)
            let a = parseInt(nums[5], 10).toString(16)

            if (a === "0") {
                return "transparent"
            }

            return (
                "#" +
                ((r.length === 1 ? "0" + r : r) +
                    (g.length === 1 ? "0" + g : g) +
                    (b.length === 1 ? "0" + b : b))
            )
        }
        return ""
    }

    function fontSizeTranslate(css: CSSStyleDeclaration) {
        let regex = /(\d+).*/
        let execArray = regex.exec(css.fontSize as string)
        if (execArray) {
            let number = Number.parseInt(execArray[1])
            switch (number) {
                case 9:
                    return "0"
                case 10:
                    return "1"
                case 13:
                    return "2"
                case 16:
                    return "3"
                case 18:
                    return "4"
                case 32:
                    return "5"
                default:
                    return "none"
            }
        }
        throw new Error("Could not parse fontSize")
    }

    return (
        <div className={"editor-toolbar"} {...rest}>
            <Pages page={page}>
                <Page>
                    <div className={"toolbox"}>
                        <div className={"flex"}>
                            <FontStyle
                                editableContent={editableContent}
                                command={"bold"}
                                callback={css => css.fontWeight === "700"}
                            >
                                format_bold
                            </FontStyle>
                            <FontStyle
                                editableContent={editableContent}
                                command={"italic"}
                                callback={css => css.fontStyle === "italic"}
                            >
                                format_italic
                            </FontStyle>
                            <FontStyle
                                editableContent={editableContent}
                                command={"strikethrough"}
                                callback={css => css.textDecorationLine === "line-through"}
                            >
                                strikethrough_s
                            </FontStyle>
                            <FontStyle
                                editableContent={editableContent}
                                command={"subscript"}
                                callback={css => css.verticalAlign === "sub"}
                            >
                                subscript
                            </FontStyle>
                            <FontStyle
                                editableContent={editableContent}
                                command={"superscript"}
                                callback={css => css.verticalAlign === "super"}
                            >
                                superscript
                            </FontStyle>
                        </div>

                        <FontSelectStyle
                            editableContent={editableContent}
                            command={"fontname"}
                            callback={css => css.fontFamily.replaceAll("\"", "")}
                        >
                            <option value="Georgia, serif">Georgia</option>
                            <option value="Palatino Linotype, serif">Palatino</option>
                            <option value="Times New Roman, serif">Times new Roman</option>
                            <option value="Arial, serif">Arial</option>
                            <option value="Comic Sans MS, serif">Comic Sans MS</option>
                            <option value="Helvetica, serif">Helvetica</option>
                            <option value="Impact, serif">Impact</option>
                            <option value="Lucida, serif">Lucida</option>
                            <option value="Tahoma, serif">Tahoma</option>
                            <option value="Trebuchet MS, serif">Trebuchet</option>
                            <option value="Verdana, serif">Verdana</option>
                            <option value="Courier New, serif">Couria New</option>
                            <option value="Lucida Console, serif">Lucida</option>
                        </FontSelectStyle>
                    </div>
                </Page>
                <Page>
                    <div className={"toolbox"}>
                        <FontSelectStyle
                            editableContent={editableContent}
                            command={"fontSize"}
                            callback={value => fontSizeTranslate(value)}
                        >
                            <option value="0">xx-small</option>
                            <option value="1">x-small</option>
                            <option value="2">small</option>
                            <option value="3">medium</option>
                            <option value="4">large</option>
                            <option value="5">x-large</option>
                            <option value="6">xx-large</option>
                        </FontSelectStyle>

                        <FontSelectStyle editableContent={editableContent} command={"formatBlock"}
                                         callback={(value, element) => element.localName}>
                            <option value="div">Format</option>
                            <option value="h1">H1</option>
                            <option value="h2">H2</option>
                            <option value="h3">H3</option>
                            <option value="h4">H4</option>
                            <option value="h5">H5</option>
                            <option value="h6">H6</option>
                        </FontSelectStyle>

                    </div>
                </Page>
                <Page>
                    <div className={"toolbox"}>

                        <FontInputStyle
                            placeholder={"Schriftfarbe"}
                            command={"foreColor"}
                            editableContent={editableContent}
                            callback={value => rgbToHex(value.color)}>
                        </FontInputStyle>

                        <FontInputStyle
                            placeholder={"Hintergrundfarbe"}
                            command={"backColor"}
                            editableContent={editableContent}
                            callback={value => rgbToHex(value.backgroundColor)}>
                        </FontInputStyle>

                    </div>
                </Page>

                <Page>
                    <div className={"toolbox"}>
                        <div>
                            <FontStyle editableContent={editableContent} command={"copy"}>
                                file_copy
                            </FontStyle>
                            <FontStyle editableContent={editableContent} command={"cut"}>
                                content_cut
                            </FontStyle>
                            <FontStyle editableContent={editableContent} command={"removeFormat"}>
                                delete
                            </FontStyle>
                            <FontStyle editableContent={editableContent} command={"selectALl"}>
                                select_all
                            </FontStyle>
                            <FontStyle editableContent={editableContent} command={"undo"}>
                                undo
                            </FontStyle>
                            <FontStyle editableContent={editableContent} command={"redo"}>
                                redo
                            </FontStyle>
                        </div>
                    </div>
                </Page>

                <Page>
                    <div className={"toolbox"}>
                        <FontStyle
                            editableContent={editableContent}
                            command={"justifyFull"}
                            callback={css => css.textAlign === "justify"}
                        >
                            format_align_justify
                        </FontStyle>

                        <FontStyle
                            editableContent={editableContent}
                            command={"justifyLeft"}
                            callback={css => css.textAlign === "left"}
                        >
                            format_align_left
                        </FontStyle>

                        <FontStyle
                            editableContent={editableContent}
                            command={"justifyRight"}
                            callback={css => css.textAlign === "right"}
                        >
                            format_align_right
                        </FontStyle>

                        <FontStyle
                            editableContent={editableContent}
                            command={"justifyCenter"}
                            callback={css => css.textAlign === "center"}
                        >
                            format_align_center
                        </FontStyle>
                    </div>
                </Page>

                <Page>
                    <div className={"toolbox"}>
                        <button type={"button"} className={"material-icons"}
                                onClick={() => editableContent.current.dispatchEvent(new CustomEvent("action", {detail: "default"}))}>css
                        </button>
                        <button type={"button"} className={"material-icons"}
                                onClick={() => editableContent.current.dispatchEvent(new CustomEvent("action", {detail: "attributes"}))}>settings
                        </button>
                        <button type={"button"} className={"material-icons"}
                                onClick={() => editableContent.current.dispatchEvent(new CustomEvent("action", {detail: "image"}))}>imagesmode
                        </button>
                        <button type={"button"} className={"material-icons"}
                                onClick={() => editableContent.current.dispatchEvent(new CustomEvent("action", {detail: "link"}))}>link
                        </button>
                        <button type={"button"} className={"material-icons"}
                                onClick={() => editableContent.current.dispatchEvent(new CustomEvent("action", {detail: "table"}))}>table
                        </button>
                    </div>
                </Page>

            </Pages>
        </div>
    )
}

namespace Toolbar {
    export interface Attributes {
        editableContent: React.MutableRefObject<HTMLDivElement>
        style: CSSProperties,
        page: number
    }
}

export default Toolbar