import MarkDown from "../MarkDown";
import ImageStore = MarkDown.FileStore;
import {RefObject} from "react";

export default class NewImageCommand {

    constructor(store : ImageStore, inputRef : RefObject<HTMLInputElement>, textAreaRef : RefObject<HTMLTextAreaElement>) {

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

                        store.files.push({
                            name : file.name,
                            type : file.type,
                            data : reader.result as string,
                            lastModified : file.lastModified
                        })

                        let pre = textArea.value.substring(0, selectionStart);
                        let post = textArea.value.substring(selectionEnd);

                        textArea.value = `${pre}![Bild](${file.name})${post}`

                    }
                }
                reader.readAsDataURL(file)
            }
        })

        input.click()



    }
}