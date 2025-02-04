import React, {useEffect, useMemo} from "react";
import {useForm} from "../../../../../hooks/UseFormHook";
import Form from "../../../form/Form";
import FormArray from "../../../form/FormArray";
import {v4} from "uuid";
import SubForm from "../../../form/SubForm";
import Input from "../../../input/Input";
import AutoSuggest from "../../../input/AutoSuggest";

function AttributeNode(properties: AttributeNode.Attributes) {

    const {payload} = properties

    let form = useForm({attributes: []});

    const allAttributes = useMemo(() => {
        let globalAttributes: any[] = AttributeNode.htmlElementAttributes.global
        let elementAttributes: any[] = AttributeNode.htmlElementAttributes[payload.localName];
        return globalAttributes.concat(elementAttributes, AttributeNode.thymeleafAttributes);
    }, [payload]);

    function deleteStyle(style: any) {
        let indexOf = form.attributes.findIndex(entry => entry.key === style.key);
        if (indexOf > -1) {
            form.attributes.splice(indexOf, 1)
            payload.removeAttribute(style.key)
        }
    }

    const suggestions = {
        loader(value: string) {
            return allAttributes.filter(entry => entry.attribute.startsWith(value))
        },
        extractor(value: any) {
            return value.attribute
        }
    }

    useEffect(() => {
        form.attributes.forEach(style => {
            if (allAttributes.findIndex(entry => entry.attribute === style.key) > -1) {
                payload.setAttribute(style.key, style.value)
            }
        })
    }, [form]);

    useEffect(() => {
        form.attributes.length = 0

        payload.getAttributeNames()
            .filter(key => payload.getAttribute(key).length > 0 && key !== "class")
            .forEach(key => form.attributes.push({id: v4(), key: key, value: payload.getAttribute(key)}))
    }, [payload]);

    return (
        <div className={"node-attributes"}>
            <Form value={form} autoComplete={"off"}>
                <FormArray name={"attributes"} onCreate={() => ({id: v4(), key: "", value: ""})}>
                    {
                        (payloads) => payloads.map((payload, index) => (
                            <SubForm index={index} key={payload.id}>
                                <div style={{display: "flex", alignItems: "center"}}>
                                    <AutoSuggest style={{border: "1px solid var(--color-background-secondary)"}} name={"key"}
                                           dynamicWidth={true} autoSuggest={suggestions}>
                                        {
                                            (element) => (
                                                <div>
                                                    <div>{element.attribute}</div>
                                                    <div style={{fontSize: "xx-small"}}>{element.description}</div>
                                                </div>
                                            )
                                        }
                                    </AutoSuggest>
                                    =
                                    <Input style={{border: "1px solid var(--color-background-secondary)", flex: 1}}
                                           name={"value"} type={"text"}/>
                                    <button type={"button"} className={"material-icons"}
                                            onClick={() => deleteStyle(payload)}>delete
                                    </button>
                                </div>
                            </SubForm>
                        ))
                    }
                </FormArray>
            </Form>
        </div>
    )
}

namespace AttributeNode {
    export interface Attributes {
        payload: HTMLElement
    }

    export const thymeleafAttributes = [
        {"attribute": "th:text", "description": "Replaces the content of an element with evaluated text."},
        {"attribute": "th:utext", "description": "Inserts unescaped HTML content."},
        {"attribute": "th:with", "description": "Declares local variables for use within the scope of an element."},

        {"attribute": "th:attr", "description": "Sets one or more attributes dynamically."},
        {"attribute": "th:attrappend", "description": "Appends a value to an existing attribute."},
        {"attribute": "th:attrprepend", "description": "Prepends a value to an existing attribute."},
        {"attribute": "th:classappend", "description": "Appends a class to the `class` attribute."},
        {"attribute": "th:styleappend", "description": "Appends styles to the `style` attribute."},

        {"attribute": "th:if", "description": "Renders the element only if the condition is true."},
        {"attribute": "th:unless", "description": "Renders the element only if the condition is false."},
        {"attribute": "th:remove", "description": "Removes the element based on the specified mode (`all`, `tag`, `body`, etc.)."},

        {"attribute": "th:each", "description": "Iterates over a collection."},
        {"attribute": "th:object", "description": "Sets the context object for child elements."},

        {"attribute": "th:href", "description": "Dynamically sets the `href` attribute for links."},
        {"attribute": "th:src", "description": "Dynamically sets the `src` attribute for resources like images or scripts."},
        {"attribute": "th:replace", "description": "Replaces the content with another template fragment."},
        {"attribute": "th:include", "description": "Includes the content of another template fragment."},

        {"attribute": "th:field", "description": "Binds a form field to a property in a model object."},
        {"attribute": "th:value", "description": "Dynamically sets the value of an input field."},
        {"attribute": "th:action", "description": "Dynamically sets the form action URL."},
        {"attribute": "th:checked", "description": "Dynamically sets the `checked` attribute for checkboxes or radio buttons."},
        {"attribute": "th:disabled", "description": "Dynamically sets the `disabled` attribute."},
        {"attribute": "th:readonly", "description": "Dynamically sets the `readonly` attribute."},

        {"attribute": "th:fragment", "description": "Defines a reusable template fragment."},
        {"attribute": "th:replace", "description": "Replaces the element with a template fragment."},
        {"attribute": "th:include", "description": "Includes a template fragment within the current element."}
    ]

    export const htmlElementAttributes = {
        "global": [
            {"attribute": "id", "description": "Specifies a unique id for an element."},
            {"attribute": "class", "description": "Specifies one or more class names for an element."},
            {"attribute": "contenteditable", "description": "Specifies whether the content of an element is editable or not."},
            {"attribute": "style", "description": "Specifies inline CSS styles for an element."},
            {"attribute": "title", "description": "Specifies extra information about an element."},
            {"attribute": "lang", "description": "Specifies the language of the element's content."},
            {"attribute": "dir", "description": "Specifies the text direction (ltr or rtl)."},
            {"attribute": "hidden", "description": "Specifies that the element is not visible."},
            {"attribute": "tabindex", "description": "Specifies the tabbing order of an element."},
            {"attribute": "accesskey", "description": "Specifies a shortcut key to activate/focus an element."},
            {"attribute": "draggable", "description": "Specifies whether the element is draggable."},
            {"attribute": "spellcheck", "description": "Specifies whether to check spelling for the element."}
        ],
        "a": [
            {"attribute": "href", "description": "Specifies the URL of the link."},
            {"attribute": "target", "description": "Specifies where to open the linked document."},
            {"attribute": "rel", "description": "Specifies the relationship between the current document and the linked document."},
            {"attribute": "type", "description": "Specifies the MIME type of the linked document."},
            {"attribute": "download", "description": "Specifies that the target will be downloaded when clicked."}
        ],
        "abbr": [],
        "address": [],
        "area": [
            {"attribute": "alt", "description": "Specifies alternative text for the area."},
            {"attribute": "coords", "description": "Specifies the coordinates for the area."},
            {"attribute": "shape", "description": "Specifies the shape of the area (rect, circle, poly)."},
            {"attribute": "href", "description": "Specifies the URL of the link for the area."},
            {"attribute": "target", "description": "Specifies where to open the linked document."}
        ],
        "article": [],
        "aside": [],
        "audio": [
            {"attribute": "src", "description": "Specifies the path to the audio file."},
            {"attribute": "controls", "description": "Specifies that audio controls should be displayed."},
            {"attribute": "autoplay", "description": "Specifies that the audio should start automatically."},
            {"attribute": "loop", "description": "Specifies that the audio should loop."},
            {"attribute": "muted", "description": "Specifies that the audio is muted."}
        ],
        "b": [],
        "base": [
            {"attribute": "href", "description": "Specifies the base URL for all relative URLs in the document."},
            {"attribute": "target", "description": "Specifies the default target for all hyperlinks and forms in the document."}
        ],
        "bdi": [],
        "bdo": [
            {"attribute": "dir", "description": "Specifies the text direction."}
        ],
        "blockquote": [
            {"attribute": "cite", "description": "Specifies the source of the quote."}
        ],
        "body": [],
        "br": [],
        "button": [
            {"attribute": "type", "description": "Specifies the button type (button, submit, reset)."},
            {"attribute": "disabled", "description": "Specifies that the button is disabled."},
            {"attribute": "name", "description": "Specifies the name of the button."},
            {"attribute": "value", "description": "Specifies the initial value of the button."}
        ],
        "canvas": [
            {"attribute": "width", "description": "Specifies the width of the canvas."},
            {"attribute": "height", "description": "Specifies the height of the canvas."}
        ],
        "caption": [],
        "cite": [],
        "code": [],
        "col": [
            {"attribute": "span", "description": "Specifies the number of columns a column element should span."}
        ],
        "colgroup": [
            {"attribute": "span", "description": "Specifies the number of columns a column group should span."}
        ],
        "data": [
            {"attribute": "value", "description": "Specifies a machine-readable translation of the content."}
        ],
        "datalist": [],
        "dd": [],
        "del": [
            {"attribute": "cite", "description": "Specifies the source of the quote or change."},
            {"attribute": "datetime", "description": "Specifies the date and time of the change."}
        ],
        "details": [
            {"attribute": "open", "description": "Specifies that the details are visible."}
        ],
        "dfn": [],
        "dialog": [
            {"attribute": "open", "description": "Specifies that the dialog is open."}
        ],
        "div": [],
        "dl": [],
        "dt": [],
        "em": [],
        "embed": [
            {"attribute": "src", "description": "Specifies the source file for the embedded content."},
            {"attribute": "type", "description": "Specifies the MIME type of the embedded content."},
            {"attribute": "width", "description": "Specifies the width of the embedded content."},
            {"attribute": "height", "description": "Specifies the height of the embedded content."}
        ],
        "fieldset": [
            {"attribute": "disabled", "description": "Specifies that the group of related form controls is disabled."},
            {"attribute": "name", "description": "Specifies a name for the fieldset."}
        ],
        "figcaption": [],
        "figure": [],
        "footer": [],
        "form": [
            {"attribute": "action", "description": "Specifies where to send the form data when submitted."},
            {"attribute": "method", "description": "Specifies the HTTP method to use (GET or POST)."},
            {"attribute": "enctype", "description": "Specifies the encoding type for the form data."},
            {
                "attribute": "autocomplete",
                "description": "Specifies whether the form should have autocomplete on or off."
            },
            {
                "attribute": "novalidate",
                "description": "Specifies that the form should not be validated when submitted."
            },
            {
                "attribute": "target",
                "description": "Specifies a name or keyword indicating where to display the response."
            }
        ],
        "h1": [],
        "h2": [],
        "h3": [],
        "h4": [],
        "h5": [],
        "h6": [],
        "head": [],
        "header": [],
        "hgroup": [],
        "hr": [],
        "html": [
            {"attribute": "lang", "description": "Specifies the language of the document."},
            {"attribute": "dir", "description": "Specifies the text direction of the document."}
        ],
        "i": [],
        "iframe": [
            {"attribute": "src", "description": "Specifies the URL of the embedded document."},
            {"attribute": "width", "description": "Specifies the width of the iframe."},
            {"attribute": "height", "description": "Specifies the height of the iframe."},
            {"attribute": "name", "description": "Specifies the name of the iframe."},
            {
                "attribute": "sandbox",
                "description": "Enables an extra set of restrictions for the content in the iframe."
            }
        ],
        "img": [
            {"attribute": "src", "description": "Specifies the path to the image."},
            {"attribute": "alt", "description": "Specifies an alternate text for the image."},
            {"attribute": "width", "description": "Specifies the width of the image."},
            {"attribute": "height", "description": "Specifies the height of the image."},
            {"attribute": "loading", "description": "Specifies if the image should be loaded lazily or eagerly."}
        ],
        "input": [
            {"attribute": "type", "description": "Specifies the type of input (text, password, checkbox, etc.)."},
            {"attribute": "name", "description": "Specifies the name of the input field."},
            {"attribute": "value", "description": "Specifies the initial value of the input field."},
            {"attribute": "placeholder", "description": "Specifies a short hint describing the expected input."},
            {"attribute": "required", "description": "Specifies that the input field is required."},
            {"attribute": "readonly", "description": "Specifies that the input field is read-only."},
            {"attribute": "disabled", "description": "Specifies that the input field is disabled."},
            {"attribute": "maxlength", "description": "Specifies the maximum number of characters allowed."}
        ],
        "ins": [
            {"attribute": "cite", "description": "Specifies the source of the quote or change."},
            {"attribute": "datetime", "description": "Specifies the date and time of the addition."}
        ],
        "kbd": [],
        "label": [
            {"attribute": "for", "description": "Specifies which form element a label is bound to."}
        ],
        "legend": [],
        "li": [
            {"attribute": "value", "description": "Specifies the value of the list item (only for ordered lists)."}
        ],
        "link": [
            {"attribute": "href", "description": "Specifies the location of the linked resource."},
            {"attribute": "rel", "description": "Specifies the relationship between the current document and the linked resource."},
            {"attribute": "type", "description": "Specifies the MIME type of the linked resource."}
        ],
        "main": [],
        "map": [
            {"attribute": "name", "description": "Specifies the name of the image map."}
        ],
        "mark": [],
        "meta": [
            {"attribute": "name", "description": "Specifies the name of the metadata."},
            {"attribute": "content", "description": "Specifies the value of the metadata."},
            {"attribute": "charset", "description": "Specifies the character encoding for the document."},
            {"attribute": "http-equiv", "description": "Provides HTTP headers for the information/value of the content attribute."}
        ],
        "meter": [
            {"attribute": "value", "description": "Specifies the current value of the gauge."},
            {"attribute": "min", "description": "Specifies the minimum value of the gauge."},
            {"attribute": "max", "description": "Specifies the maximum value of the gauge."},
            {"attribute": "low", "description": "Specifies the lower bound of the gauge."},
            {"attribute": "high", "description": "Specifies the upper bound of the gauge."},
            {"attribute": "optimum", "description": "Specifies the optimal value of the gauge."}
        ],
        "nav": [],
        "noscript": [],
        "object": [
            {"attribute": "data", "description": "Specifies the URL of the resource to be used by the object."},
            {"attribute": "type", "description": "Specifies the MIME type of the resource."},
            {"attribute": "width", "description": "Specifies the width of the object."},
            {"attribute": "height", "description": "Specifies the height of the object."},
            {"attribute": "name", "description": "Specifies the name of the object."}
        ],
        "ol": [
            {"attribute": "reversed", "description": "Specifies that the list order should be reversed."},
            {"attribute": "start", "description": "Specifies the start value of the ordered list."},
            {"attribute": "type", "description": "Specifies the kind of marker to use in the list."}
        ],
        "optgroup": [
            {"attribute": "label", "description": "Specifies a label for the group of options."},
            {"attribute": "disabled", "description": "Specifies that the group of options is disabled."}
        ],
        "option": [
            {"attribute": "value", "description": "Specifies the value to be sent to the server."},
            {"attribute": "label", "description": "Specifies an alternative label for the option."},
            {"attribute": "selected", "description": "Specifies that the option is selected by default."},
            {"attribute": "disabled", "description": "Specifies that the option is disabled."}
        ],
        "output": [
            {"attribute": "for", "description": "Specifies the IDs of the elements to which the output is bound."},
            {"attribute": "name", "description": "Specifies the name of the output element."}
        ],
        "p": [],
        "picture": [],
        "pre": [],
        "progress": [
            {"attribute": "value", "description": "Specifies the current value of the progress bar."},
            {"attribute": "max", "description": "Specifies the maximum value of the progress bar."}
        ],
        "q": [
            {"attribute": "cite", "description": "Specifies the source of the quote."}
        ],
        "rb": [],
        "rp": [],
        "rt": [],
        "rtc": [],
        "ruby": [],
        "s": [],
        "samp": [],
        "script": [
            {"attribute": "src", "description": "Specifies the URL of the external script file."},
            {"attribute": "type", "description": "Specifies the MIME type of the script."},
            {"attribute": "async", "description": "Specifies that the script should be executed asynchronously."},
            {
                "attribute": "defer",
                "description": "Specifies that the script execution is deferred until after the document is parsed."
            }
        ],
        "section": [],
        "select": [
            {"attribute": "name", "description": "Specifies the name of the drop-down list."},
            {"attribute": "multiple", "description": "Specifies that multiple options can be selected."},
            {"attribute": "disabled", "description": "Specifies that the drop-down list is disabled."},
            {"attribute": "required", "description": "Specifies that an option must be selected before submitting the form."},
            {"attribute": "size", "description": "Specifies the number of visible options in the drop-down list."}
        ],
        "slot": [
            {"attribute": "name", "description": "Specifies a name for the slot."}
        ],
        "small": [],
        "source": [
            {"attribute": "src", "description": "Specifies the path to the media resource."},
            {"attribute": "type", "description": "Specifies the MIME type of the resource."},
            {"attribute": "media", "description": "Specifies the media query for which the resource is designed."}
        ],
        "span": [],
        "strong": [],
        "style": [
            {"attribute": "type", "description": "Specifies the MIME type of the style tag content."},
            {"attribute": "media", "description": "Specifies the media query for which the styles apply."}
        ],
        "sub": [],
        "summary": [],
        "sup": [],
        "svg": [],
        "table": [
            {"attribute": "border", "description": "Specifies the width of the table's border."}
        ],
        "tbody": [],
        "td": [
            {"attribute": "colspan", "description": "Specifies the number of columns the cell should span."},
            {"attribute": "rowspan", "description": "Specifies the number of rows the cell should span."},
            {"attribute": "headers", "description": "Specifies one or more header cells a cell is related to."}
        ],
        "template": [],
        "textarea": [
            {"attribute": "name", "description": "Specifies the name of the text area."},
            {"attribute": "rows", "description": "Specifies the visible number of lines in the text area."},
            {"attribute": "cols", "description": "Specifies the visible width of the text area."},
            {"attribute": "placeholder", "description": "Specifies a short hint describing the expected input."},
            {"attribute": "readonly", "description": "Specifies that the text area is read-only."},
            {"attribute": "disabled", "description": "Specifies that the text area is disabled."},
            {"attribute": "maxlength", "description": "Specifies the maximum number of characters allowed."},
            {
                "attribute": "required",
                "description": "Specifies that the text area must be filled out before submitting the form."
            }
        ],
        "tfoot": [],
        "th": [
            {"attribute": "colspan", "description": "Specifies the number of columns the header cell should span."},
            {"attribute": "rowspan", "description": "Specifies the number of rows the header cell should span."},
            {"attribute": "scope", "description": "Specifies the scope of the header cell (col, row, etc.)."}
        ],
        "thead": [],
        "time": [
            {"attribute": "datetime", "description": "Specifies the date and time in a machine-readable format."}
        ],
        "title": [],
        "tr": [],
        "track": [
            {"attribute": "src", "description": "Specifies the URL of the track file."},
            {"attribute": "kind", "description": "Specifies the type of text track (subtitles, captions, etc.)."},
            {"attribute": "srclang", "description": "Specifies the language of the text track."},
            {"attribute": "label", "description": "Specifies a label for the track."},
            {"attribute": "default", "description": "Specifies that the track is the default track."}
        ],
        "u": [],
        "ul": [],
        "var": [],
        "video": [
            {"attribute": "src", "description": "Specifies the path to the video file."},
            {"attribute": "controls", "description": "Specifies that video controls should be displayed."},
            {"attribute": "autoplay", "description": "Specifies that the video should play automatically."},
            {"attribute": "loop", "description": "Specifies that the video should loop."},
            {"attribute": "muted", "description": "Specifies that the video is muted."},
            {
                "attribute": "poster",
                "description": "Specifies an image to be shown while the video is downloading or until the user hits play."
            }
        ],
        "wbr": []
    }


}

export default AttributeNode