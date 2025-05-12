import MarkDown from "../MarkDown";
import {RefObject} from "react";
import EditorModel = MarkDown.EditorModel;

export default class NewImageCommand {

    constructor(model: EditorModel, inputRef: RefObject<HTMLInputElement>, textAreaRef: RefObject<HTMLTextAreaElement>) {

        let input = inputRef.current;
        let textArea = textAreaRef.current;

        let selectionStart = textArea.selectionStart;
        let selectionEnd = textArea.selectionEnd

        input.addEventListener("change", (event) => {
            if (input.files) {
                let file = input.files[0]
                let reader = new FileReader()
                reader.onload = e => {
                    if (reader.result) {

                        model.store.files.push({
                            name: file.name,
                            type: file.type,
                            data: reader.result as string,
                            lastModified: file.lastModified
                        })

                        let pre = textArea.value.substring(0, selectionStart);
                        let post = textArea.value.substring(selectionEnd);

                        textArea.value = `${pre}![Picture](${file.name})${post}`

                        const event = new Event('input', {bubbles: true, cancelable: true})

                        textArea.dispatchEvent(event);

                    }
                }
                reader.readAsDataURL(file)
            }
        })

        input.click()


    }
}