import "./Toolbar.css"
import React, {CSSProperties} from "react"
import Select from "./components/Select"
import Button from "./components/Button"
import Pages from "../../../layout/pages/Pages";
import Page from "../../../layout/pages/Page";
import Color from "./components/Color";
import {BoldCommand} from "../commands/BoldCommand";
import {ItalicCommand} from "../commands/ItalicCommand";
import {FontSizeCommand} from "../commands/FontSizeCommand";
import Input from "./components/Input";
import {FontFamilyCommand} from "../commands/FontFamilyCommand";
import {DeletedCommand} from "../commands/DeletedCommand";
import {SubCommand} from "../commands/SubCommand";
import {SupCommand} from "../commands/SupCommand";

function Toolbar(properties: Toolbar.Attributes) {

    const {contentEditable, page, ...rest} = properties

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
                            <Button
                                editableContent={contentEditable}
                                command={new BoldCommand()}
                                callback={css => css.fontWeight === "700"}
                            >
                                format_bold
                            </Button>
                            <Button
                                editableContent={contentEditable}
                                command={new ItalicCommand()}
                                callback={css => css.fontStyle === "italic"}
                            >
                                format_italic
                            </Button>
                            <Button
                                editableContent={contentEditable}
                                command={new DeletedCommand()}
                                callback={css => css.textDecorationLine === "line-through"}
                            >
                                strikethrough_s
                            </Button>
                            <Button
                                editableContent={contentEditable}
                                command={new SubCommand()}
                                callback={css => css.verticalAlign === "sub"}
                            >
                                subscript
                            </Button>
                            <Button
                                editableContent={contentEditable}
                                command={new SupCommand()}
                                callback={css => css.verticalAlign === "super"}
                            >
                                superscript
                            </Button>
                        </div>
                    </div>
                </Page>
                <Page>
                    <div className={"toolbox"}>
                        <Select
                            editableContent={contentEditable}
                            command={new FontFamilyCommand()}
                            callback={css => css.fontFamily.replaceAll("\"", "")}
                        >
                            <option value="Georgia, serif">Georgia</option>
                            <option value="Palatino Linotype, serif">Palatino</option>
                            <option value="Arial, serif">Arial</option>
                            <option value="Comic Sans MS, serif">Comic Sans</option>
                            <option value="Helvetica, serif">Helvetica</option>
                            <option value="Impact, serif">Impact</option>
                            <option value="Lucida, serif">Lucida</option>
                            <option value="Tahoma, serif">Tahoma</option>
                            <option value="Trebuchet MS, serif">Trebuchet</option>
                            <option value="Verdana, serif">Verdana</option>
                            <option value="Courier New, serif">Couria New</option>
                            <option value="Lucida Console, serif">Lucida</option>
                        </Select>

                        <Input
                            command={new FontSizeCommand()}
                            editableContent={contentEditable}
                            callback={node => {
                                let regex = /(\d+)px/
                                let exec = regex.exec(node.fontSize);
                                return  exec[1]
                            }}
                            placeholder={"px"}
                        >
                        </Input>

                    </div>
                </Page>
                <Page>
                    <div className={"toolbox"}>

                        <Color
                            placeholder={"Schriftfarbe"}
                            command={"foreColor"}
                            editableContent={contentEditable}
                            callback={value => rgbToHex(value.color)}>
                        </Color>

                        <Color
                            placeholder={"Hintergrundfarbe"}
                            command={"backColor"}
                            editableContent={contentEditable}
                            callback={value => rgbToHex(value.backgroundColor)}>
                        </Color>

                    </div>
                </Page>

                <Page>
                    <div className={"toolbox"}>
                        <div>
                            <Button editableContent={contentEditable} command={"copy"}>
                                file_copy
                            </Button>
                            <Button editableContent={contentEditable} command={"cut"}>
                                content_cut
                            </Button>
                            <Button editableContent={contentEditable} command={"removeFormat"}>
                                delete
                            </Button>
                            <Button editableContent={contentEditable} command={"selectALl"}>
                                select_all
                            </Button>
                            <Button editableContent={contentEditable} command={"undo"}>
                                undo
                            </Button>
                            <Button editableContent={contentEditable} command={"redo"}>
                                redo
                            </Button>
                        </div>
                    </div>
                </Page>

                <Page>
                    <div className={"toolbox"}>
                        <Button
                            editableContent={contentEditable}
                            command={"justifyFull"}
                            callback={css => css.textAlign === "justify"}
                        >
                            format_align_justify
                        </Button>

                        <Button
                            editableContent={contentEditable}
                            command={"justifyLeft"}
                            callback={css => css.textAlign === "left"}
                        >
                            format_align_left
                        </Button>

                        <Button
                            editableContent={contentEditable}
                            command={"justifyRight"}
                            callback={css => css.textAlign === "right"}
                        >
                            format_align_right
                        </Button>

                        <Button
                            editableContent={contentEditable}
                            command={"justifyCenter"}
                            callback={css => css.textAlign === "center"}
                        >
                            format_align_center
                        </Button>
                    </div>
                </Page>

                <Page>
                    <div className={"toolbox"}>
                        <button type={"button"} className={"material-icons"}
                                onClick={() => contentEditable.current.dispatchEvent(new CustomEvent("action", {detail: {command : "default"}}))}>css
                        </button>
                        <button type={"button"} className={"material-icons"}
                                onClick={() => contentEditable.current.dispatchEvent(new CustomEvent("action", {detail: {command : "attributes"}}))}>edit_attributes
                        </button>
                        <button type={"button"} className={"material-icons"}
                                onClick={() => contentEditable.current.dispatchEvent(new CustomEvent("action", {detail: {command : "insert"}}))}>variable_insert
                        </button>
                    </div>
                </Page>

            </Pages>
        </div>
    )
}

namespace Toolbar {
    export interface Attributes {
        contentEditable: React.RefObject<HTMLDivElement>
        style?: CSSProperties,
        page: number
    }
}

export default Toolbar