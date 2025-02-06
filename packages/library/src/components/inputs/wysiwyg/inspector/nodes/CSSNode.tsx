import React, {useEffect} from "react";
import Form from "../../../form/Form";
import FormArray from "../../../form/FormArray";
import {v4} from "uuid";
import SubForm from "../../../form/SubForm";
import Input from "../../../input/Input";
import {useForm} from "../../../../../hooks/UseFormHook";
import AutoSuggest from "../../../input/AutoSuggest";

function CSSNode(properties: CSSNode.Attributes) {

    const {payload} = properties

    let form = useForm({styles: []});

    function kebabToCamelCase(str: string) {
        return str
            .replace(/-./g, match => match.charAt(1).toUpperCase())  // Convert hyphen+char to uppercase
            .replace(/^./, match => match.toLowerCase());           // Ensure the first character is lowercase
    }

    function camelToKebabCase(str: string) {
        return str
            .replace(/([a-z0-9])([A-Z])/g, '$1-$2')  // Add hyphen before uppercase letters
            .toLowerCase();                         // Convert the entire string to lowercase
    }

    function deleteStyle(style: any) {
        let indexOf = form.styles.findIndex(item => item.key === style.key);
        if (indexOf > -1) {
            form.styles.splice(indexOf, 1)
            payload.style[style.key] = ""
            if (payload.getAttribute("style") === "") {
                payload.removeAttribute("style")
            }
        }
    }

    const suggestions = {
        loader(value: string) {
            return CSSNode.style.filter(entry => entry.property.startsWith(value))
        },
        extractor(value: any) {
            return value.property
        }
    }

    useEffect(() => {
        form.styles.forEach(style => {
            let key = kebabToCamelCase(style.key);
            if (payload.style[key] !== undefined) {
                payload.style[key] = style.value
            }
        })
    }, [form]);

    useEffect(() => {

        let regex = /[a-zA-Z]+/

        form.styles.length = 0

        Object.entries(payload.style)
            .filter(([key, value]) => value.length > 0 && regex.test(key))
            .forEach(([key, value]) => form.styles.push({id: v4(), key: camelToKebabCase(key), value: value}))
    }, [payload]);

    return (
        <div className={"node-attributes"}>
            <Form value={form} autoComplete={"off"}>
                style: {"{"} <br/>
                <FormArray name={"styles"} onCreate={() => ({id: v4(), key: "", value: ""})}>
                    {
                        (elements) => elements.map((element, index) => (
                            <SubForm index={index} key={element.id}>
                                <div style={{display: "flex", alignItems: "center"}}>
                                    <span>&emsp;</span>
                                    <AutoSuggest style={{border: "1px solid var(--color-background-secondary)"}} name={"key"} dynamicWidth={true} autoSuggest={suggestions}>
                                        {
                                            (element) => (
                                                <div>
                                                    <div>{element.property}</div>
                                                    <div style={{fontSize: "xx-small"}}>{element.description}</div>
                                                </div>
                                            )
                                        }
                                    </AutoSuggest>:
                                    <Input style={{border: "1px solid var(--color-background-secondary)"}} name={"value"} type={"text"} dynamicWidth={true}/>
                                    <span style={{flex: 1}}></span>
                                    <button type={"button"} className={"material-icons"} onClick={() => deleteStyle(element)}>delete</button>
                                </div>
                            </SubForm>
                        ))
                    }
                </FormArray>
                {"}"}
            </Form>
        </div>
    )
}

namespace CSSNode {
    export interface Attributes {
        payload: HTMLElement
    }

    export const style = [
        {"property": "align-content", "description": "Aligns the content of the container when there is extra space in the cross-axis."},
        {"property": "align-items", "description": "Aligns items along the cross-axis of the container."},
        {"property": "align-self", "description": "Allows the alignment of individual items in the cross-axis, overriding the container's alignment."},
        {"property": "all", "description": "Resets all properties (except 'unicode-bidi' and 'direction') to their initial or inherited values."},
        {"property": "animation", "description": "Shorthand for setting all animation properties (name, duration, timing function, delay, iteration count, direction, fill mode, and play state)."},
        {"property": "animation-delay", "description": "Specifies a delay before the animation starts."},
        {"property": "animation-direction", "description": "Defines whether the animation plays in reverse or alternate cycles."},
        {"property": "animation-duration", "description": "Specifies the time duration of the animation."},
        {"property": "animation-fill-mode", "description": "Defines how styles are applied to the element before and after the animation."},
        {"property": "animation-iteration-count", "description": "Specifies how many times the animation will play."},
        {"property": "animation-name", "description": "Specifies the name of the keyframes animation."},
        {"property": "animation-play-state", "description": "Specifies whether the animation is running or paused."},
        {"property": "animation-timing-function", "description": "Specifies the speed curve of the animation, controlling the pacing of the animation."},
        {"property": "backdrop-filter", "description": "Applies graphical effects (like blur or color shift) to the area behind an element."},
        {"property": "backface-visibility", "description": "Defines whether the back face of an element is visible when rotated."},
        {"property": "background", "description": "Shorthand for setting all background properties (color, image, position, size, repeat, origin, and attachment)."},
        {"property": "background-attachment", "description": "Defines whether the background scrolls with the page or is fixed."},
        {"property": "background-blend-mode", "description": "Defines how the background layers should blend together."},
        {"property": "background-clip", "description": "Specifies the painting area of the background, allowing it to be clipped inside or outside the element."},
        {"property": "background-color", "description": "Sets the background color of an element."},
        {"property": "background-image", "description": "Defines the background image of an element."},
        {"property": "background-origin", "description": "Specifies the origin position for the background image."},
        {"property": "background-position", "description": "Defines the position of the background image within the element."},
        {"property": "background-repeat", "description": "Specifies whether the background image should be repeated."},
        {"property": "background-size", "description": "Defines the size of the background image."},
        {"property": "border", "description": "Shorthand for setting all border properties (width, style, and color)."},
        {"property": "border-bottom", "description": "Sets the style, width, and color of the bottom border."},
        {"property": "border-bottom-color", "description": "Sets the color of the bottom border."},
        {"property": "border-bottom-left-radius", "description": "Sets the radius of the bottom-left corner of the border."},
        {"property": "border-bottom-right-radius", "description": "Sets the radius of the bottom-right corner of the border."},
        {"property": "border-bottom-style", "description": "Sets the style of the bottom border."},
        {"property": "border-bottom-width", "description": "Sets the width of the bottom border."},
        {"property": "border-collapse", "description": "Defines whether the borders of table cells collapse into a single border or are separated."},
        {"property": "border-color", "description": "Sets the color of the border."},
        {"property": "border-image", "description": "Specifies an image to be used as the border of an element."},
        {"property": "border-image-outset", "description": "Specifies the amount by which the border image is extended beyond the border box."},
        {"property": "border-image-repeat", "description": "Specifies how the border image should be repeated."},
        {"property": "border-image-slice", "description": "Specifies how the image should be divided into regions for the border."},
        {"property": "border-image-source", "description": "Specifies the source of the image used for the border."},
        {"property": "border-image-width", "description": "Defines the width of the border image."},
        {"property": "border-left", "description": "Sets the style, width, and color of the left border."},
        {"property": "border-left-color", "description": "Sets the color of the left border."},
        {"property": "border-left-style", "description": "Sets the style of the left border."},
        {"property": "border-left-width", "description": "Sets the width of the left border."},
        {"property": "border-radius", "description": "Rounds the corners of an element's border."},
        {"property": "border-right", "description": "Sets the style, width, and color of the right border."},
        {"property": "border-right-color", "description": "Sets the color of the right border."},
        {"property": "border-right-style", "description": "Sets the style of the right border."},
        {"property": "border-right-width", "description": "Sets the width of the right border."},
        {"property": "border-spacing", "description": "Specifies the distance between borders of adjacent table cells."},
        {"property": "border-top", "description": "Sets the style, width, and color of the top border."},
        {"property": "border-top-color", "description": "Sets the color of the top border."},
        {"property": "border-top-left-radius", "description": "Sets the radius of the top-left corner of the border."},
        {"property": "border-top-right-radius", "description": "Sets the radius of the top-right corner of the border."},
        {"property": "border-top-style", "description": "Sets the style of the top border."},
        {"property": "border-top-width", "description": "Sets the width of the top border."},
        {"property": "border-width", "description": "Shorthand for setting the width of all borders (top, right, bottom, and left)."},
        {"property": "bottom", "description": "Specifies the vertical position of a positioned element."},
        {"property": "box-shadow", "description": "Adds shadow effects around an element's frame."},
        {"property": "box-sizing", "description": "Defines how the total width and height of an element are calculated."},
        {"property": "break-after", "description": "Specifies what happens after an element when it breaks across pages or columns."},
        {"property": "break-before", "description": "Specifies what happens before an element when it breaks across pages or columns."},
        {"property": "break-inside", "description": "Specifies what happens inside an element when it breaks across pages or columns."},
        {"property": "caption-side", "description": "Specifies the position of the table's caption."},
        {"property": "caret-color", "description": "Specifies the color of the text cursor (caret)."},
        {"property": "chain", "description": "Not commonly used in CSS, may be a typo or incorrect property."},
        {"property": "clear", "description": "Specifies which sides of an element's box are cleared (left, right, both, or none)."},
        {"property": "clip", "description": "Defines the visible area of an element for clipping paths."},
        {"property": "clip-path", "description": "Defines a clipping path for an element."},
        {"property": "color", "description": "Sets the color of the text."},
        {"property": "columns", "description": "Specifies the number of columns in a multi-column layout."},
        {"property": "column-count", "description": "Specifies the number of columns in a multi-column layout."},
        {"property": "column-gap", "description": "Specifies the gap between columns in a multi-column layout."},
        {"property": "column-rule", "description": "Shorthand for setting all the properties of the rule between columns (style, width, and color)."},
        {"property": "column-rule-color", "description": "Sets the color of the rule between columns."},
        {"property": "column-rule-style", "description": "Sets the style of the rule between columns."},
        {"property": "column-rule-width", "description": "Sets the width of the rule between columns."},
        {"property": "column-span", "description": "Specifies whether an element should span across multiple columns in a multi-column layout."},
        {"property": "column-width", "description": "Specifies the width of columns in a multi-column layout."},
        {"property": "content", "description": "Specifies the content to be inserted by CSS (commonly used with pseudo-elements)."},
        {"property": "counter-increment", "description": "Increments the value of a counter by a specified value."},
        {"property": "counter-reset", "description": "Resets the value of a counter to a specified value."},
        {"property": "cursor", "description": "Specifies the type of cursor to be displayed when the mouse pointer is over an element."},
        {"property": "direction", "description": "Specifies the text direction (left to right or right to left)."},
        {"property": "display", "description": "Defines the display behavior of an element (block, inline, none, etc.)."},
        {"property": "empty-cells", "description": "Specifies whether the borders of empty table cells are visible."},
        {"property": "filter", "description": "Applies graphical effects such as blur or color shifts to an element."},
        {"property": "flex", "description": "Shorthand for defining flex-grow, flex-shrink, and flex-basis in flexbox."},
        {"property": "flex-basis", "description": "Defines the initial main size of a flex item."},
        {"property": "flex-direction", "description": "Specifies the direction of flex items in a flex container."},
        {"property": "flex-flow", "description": "Shorthand for setting both flex-direction and flex-wrap in a flex container."},
        {"property": "flex-grow", "description": "Specifies how much a flex item will grow relative to other items in the flex container."},
        {"property": "flex-shrink", "description": "Specifies how much a flex item will shrink relative to other items in the flex container."},
        {"property": "flex-wrap", "description": "Specifies whether the flex container's items should wrap onto multiple lines."},
        {"property": "float", "description": "Specifies whether an element should float to the left or right within its container."},
        {"property": "font", "description": "Shorthand for setting all font properties (family, size, style, weight, variant, etc.)."},
        {"property": "font-family", "description": "Specifies the font family for text."},
        {"property": "font-feature-settings", "description": "Defines which font features to enable or disable."},
        {"property": "font-kerning", "description": "Controls the spacing between characters (kerning) in the text."},
        {"property": "font-language-override", "description": "Specifies the language-specific adjustments to font rendering."},
        {"property": "font-size", "description": "Specifies the size of the font."},
        {"property": "font-size-adjust", "description": "Adjusts the size of the font to match a specific aspect ratio."},
        {"property": "font-stretch", "description": "Specifies the stretch or condensing of the font."},
        {"property": "font-style", "description": "Specifies whether the font is normal, italic, or oblique."},
        {"property": "font-variant", "description": "Defines the stylistic alternates (such as small caps) for the font."},
        {"property": "font-variant-alternates", "description": "Specifies alternate characters for the font variant."},
        {"property": "font-variant-caps", "description": "Controls the use of capital letters in a font variant."},
        {"property": "font-variant-east-asian", "description": "Specifies character variants for East Asian fonts."},
        {"property": "font-variant-ligatures", "description": "Specifies whether ligatures are used in the font."},
        {"property": "font-variant-numeric", "description": "Defines how numeric characters are displayed in a font."},
        {"property": "font-variant-position", "description": "Controls whether the font should use alternate positioning for characters."},
        {"property": "font-weight", "description": "Specifies the weight (boldness) of the font."},
        {"property": "gap", "description": "Shorthand for setting both row-gap and column-gap in a grid or flex container."},
        {"property": "grid", "description": "Shorthand for setting all grid properties (grid-template-rows, grid-template-columns, etc.)."},
        {"property": "grid-area", "description": "Specifies where a grid item should be placed within the grid."},
        {"property": "grid-auto-columns", "description": "Specifies the size of automatically created grid columns."},
        {"property": "grid-auto-rows", "description": "Specifies the size of automatically created grid rows."},
        {"property": "grid-column", "description": "Specifies how many columns a grid item should span and its position in the grid."},
        {"property": "grid-column-end", "description": "Specifies where the grid item should end along the horizontal axis."},
        {"property": "grid-column-start", "description": "Specifies where the grid item should start along the horizontal axis."},
        {"property": "grid-template", "description": "Shorthand for setting grid-template-columns, grid-template-rows, and grid-template-areas."},
        {"property": "grid-template-areas", "description": "Defines the layout of the grid using named areas."},
        {"property": "grid-template-columns", "description": "Defines the column sizes in a grid container."},
        {"property": "grid-template-rows", "description": "Defines the row sizes in a grid container."},
        {"property": "height", "description": "Specifies the height of an element."},
        {"property": "hyphens", "description": "Controls whether hyphenation should be applied to text."},
        {"property": "image-rendering", "description": "Specifies how images should be rendered (such as with pixelated or smooth scaling)."},
        {"property": "inherit", "description": "Forces an element to inherit the value of a specific property from its parent."},
        {"property": "initial", "description": "Sets a property to its initial value (the default value defined by the CSS specification)."},
        {"property": "inline-size", "description": "Defines the size of an element along the inline axis."},
        {"property": "isolation", "description": "Defines whether an element should create its own stacking context."},
        {"property": "justify-content", "description": "Aligns items along the main axis (in a flex or grid container)."},
        {"property": "justify-items", "description": "Aligns items along the inline axis in a grid container."},
        {"property": "justify-self", "description": "Aligns an individual item along the inline axis in a grid or flex container."},
        {"property": "left", "description": "Specifies the horizontal position of a positioned element."},
        {"property": "letter-spacing", "description": "Specifies the space between characters in the text."},
        {"property": "line-height", "description": "Specifies the height of a line of text."},
        {"property": "list-style", "description": "Shorthand for setting the list-style-type, list-style-position, and list-style-image properties."},
        {"property": "list-style-image", "description": "Specifies an image to be used as the list item marker."},
        {"property": "list-style-position", "description": "Specifies whether the list item marker appears inside or outside the list item box."},
        {"property": "list-style-type", "description": "Specifies the type of list item marker (such as bullet points, numbers, etc.)."},
        {"property": "margin", "description": "Shorthand for setting the margin on all four sides of an element."},
        {"property": "margin-bottom", "description": "Sets the margin on the bottom of an element."},
        {"property": "margin-left", "description": "Sets the margin on the left of an element."},
        {"property": "margin-right", "description": "Sets the margin on the right of an element."},
        {"property": "margin-top", "description": "Sets the margin on the top of an element."},
        {"property": "max-height", "description": "Specifies the maximum height an element can have."},
        {"property": "max-width", "description": "Specifies the maximum width an element can have."},
        {"property": "min-height", "description": "Specifies the minimum height an element can have."},
        {"property": "min-width", "description": "Specifies the minimum width an element can have."},
        {"property": "object-fit", "description": "Defines how the content of an element should fit within its box."},
        {"property": "object-position", "description": "Defines the position of an object within its container."},
        {"property": "opacity", "description": "Defines the transparency level of an element."},
        {"property": "order", "description": "Specifies the order of items within a flex container."},
        {"property": "orphans", "description": "Defines the minimum number of lines of a paragraph that must appear at the top of a page or column."},
        {"property": "outline", "description": "Shorthand for setting all outline properties (color, style, and width)."},
        {"property": "outline-color", "description": "Sets the color of the outline."},
        {"property": "outline-offset", "description": "Specifies the distance of the outline from the element's border."},
        {"property": "outline-style", "description": "Sets the style of the outline."},
        {"property": "outline-width", "description": "Sets the width of the outline."},
        {"property": "overflow", "description": "Specifies how content that overflows the bounds of its container should be handled."},
        {"property": "overflow-x", "description": "Specifies how content overflows horizontally within a container."},
        {"property": "overflow-y", "description": "Specifies how content overflows vertically within a container."},
        {"property": "padding", "description": "Shorthand for setting the padding on all four sides of an element."},
        {"property": "padding-bottom", "description": "Sets the padding on the bottom of an element."},
        {"property": "padding-left", "description": "Sets the padding on the left of an element."},
        {"property": "padding-right", "description": "Sets the padding on the right of an element."},
        {"property": "padding-top", "description": "Sets the padding on the top of an element."},
        {"property": "page-break-after", "description": "Specifies whether a page break should be inserted after the element."},
        {"property": "page-break-before", "description": "Specifies whether a page break should be inserted before the element."},
        {"property": "page-break-inside", "description": "Specifies whether a page break is allowed inside the element."},
        {"property": "perspective", "description": "Defines the perspective from which a 3D element is viewed."},
        {"property": "perspective-origin", "description": "Specifies the position from which a 3D element is viewed."},
        {"property": "place-items", "description": "Shorthand for setting both align-items and justify-items in a grid container."},
        {"property": "place-self", "description": "Shorthand for setting both align-self and justify-self for a grid or flex item."},
        {"property": "pointer-events", "description": "Defines whether or not an element can be the target of pointer events (like clicks)."},
        {"property": "position", "description": "Specifies the positioning method of an element (static, relative, absolute, fixed, or sticky)."},
        {"property": "quotes", "description": "Defines the type of quotation marks to use for quotes."},
        {"property": "resize", "description": "Specifies whether an element can be resized by the user."},
        {"property": "right", "description": "Specifies the horizontal position of a positioned element (relative to its containing element)."},
        {"property": "row-gap", "description": "Specifies the gap between rows in a grid or flex container."},
        {"property": "scroll-behavior", "description": "Defines the smoothness of scrolling."},
        {"property": "scroll-snap-align", "description": "Defines where an element should snap in a scrolling container."},
        {"property": "scroll-snap-type", "description": "Defines the snap behavior of a scrolling container."},
        {"property": "scrollbar-color", "description": "Specifies the color of the scrollbar."},
        {"property": "scrollbar-width", "description": "Specifies the width of the scrollbar."},
        {"property": "shape-image-threshold", "description": "Specifies how much of an image should be shown when it is clipped by the element's shape."},
        {"property": "shape-margin", "description": "Specifies the margin around an element's shape."},
        {"property": "stop-color", "description": "Defines the color of a gradient stop in a gradient."},
        {"property": "stop-opacity", "description": "Defines the opacity of a gradient stop."},
        {"property": "stroke", "description": "Sets the color and width of the stroke for shapes in SVG."},
        {"property": "stroke-dasharray", "description": "Specifies the pattern of dashes and gaps used to stroke paths in SVG."},
        {"property": "stroke-dashoffset", "description": "Specifies the distance to offset the dash pattern in an SVG stroke."},
        {"property": "stroke-linecap", "description": "Specifies the shape of the end of a stroke in SVG."},
        {"property": "stroke-linejoin", "description": "Specifies the shape of the corner where two strokes meet in SVG."},
        {"property": "stroke-miterlimit", "description": "Defines the limit at which the stroke should be clipped in SVG."},
        {"property": "stroke-opacity", "description": "Specifies the opacity of the stroke in SVG."},
        {"property": "stroke-width", "description": "Specifies the width of the stroke in SVG."},
        {"property": "scrollbar-gutter", "description": "Defines the space in the scrollbar container to prevent content from being covered."},
        {"property": "text-align", "description": "Specifies the horizontal alignment of text within an element."},
        {"property": "text-align-last", "description": "Specifies the alignment of the last line of text in a block element."},
        {"property": "text-combine-upright", "description": "Combines vertical text with horizontal text, used primarily for East Asian typography."},
        {"property": "text-decoration", "description": "Shorthand for setting the text-decoration-line, text-decoration-style, and text-decoration-color properties."},
        {"property": "text-decoration-color", "description": "Specifies the color of the text decoration (such as underlining or overlining)."},
        {"property": "text-decoration-line", "description": "Specifies which text decorations should be applied (underline, overline, line-through, or none)."},
        {"property": "text-decoration-style", "description": "Specifies the style of the text decoration (solid, dotted, dashed, etc.)."},
        {"property": "text-indent", "description": "Specifies the indentation of the first line of text in a paragraph."},
        {"property": "text-justify", "description": "Defines how the text in a block element is justified."},
        {"property": "text-overflow", "description": "Specifies how to handle text that overflows its container (ellipsis, clip, etc.)."},
        {"property": "text-shadow", "description": "Applies a shadow effect to text."},
        {"property": "text-transform", "description": "Specifies the capitalization of text (uppercase, lowercase, or capitalize)."},
        {"property": "top", "description": "Specifies the vertical position of a positioned element (relative to its containing element)."},
        {"property": "touch-action", "description": "Specifies how an element should handle touch interactions (e.g., to prevent scrolling or zooming)."},
        {"property": "transform", "description": "Applies a 2D or 3D transformation to an element (such as rotate, scale, or translate)."},
        {"property": "transform-origin", "description": "Specifies the origin point of a transformation on an element."},
        {"property": "transition", "description": "Shorthand for setting all transition properties (duration, timing-function, delay, etc.)."},
        {"property": "transition-delay", "description": "Specifies the delay before the transition starts."},
        {"property": "transition-duration", "description": "Specifies the duration of the transition effect."},
        {"property": "transition-property", "description": "Specifies the CSS property or properties to which the transition effect is applied."},
        {"property": "transition-timing-function", "description": "Specifies the timing function for the transition (such as ease-in, ease-out, etc.)."},
        {"property": "unicode-bidi", "description": "Controls the direction of the text and how it is handled in a bidirectional context."},
        {"property": "user-select", "description": "Specifies whether the user can select text in an element."},
        {"property": "vertical-align", "description": "Specifies the vertical alignment of inline-level elements."},
        {"property": "visibility", "description": "Specifies whether an element is visible or hidden."},
        {"property": "white-space", "description": "Specifies how white spaces inside an element are handled (such as normal, nowrap, pre, etc.)."},
        {"property": "widows", "description": "Defines the minimum number of lines of a paragraph that must appear at the bottom of a page or column."},
        {"property": "width", "description": "Specifies the width of an element."},
        {"property": "word-break", "description": "Specifies how words should break when reaching the end of a line."},
        {"property": "word-spacing", "description": "Specifies the space between words in the text."},
        {"property": "writing-mode", "description": "Defines the direction of text and flow (horizontal or vertical)."},
        {"property": "z-index", "description": "Specifies the stack order of elements (which element should be in front or behind other elements)."},
        {"property": "zoom", "description": "Specifies a scaling factor for an element (primarily used in IE, less common in modern CSS)."},
        {"property": "will-change", "description": "Indicates which properties of an element will likely change, to optimize performance."}
    ]

}

export default CSSNode