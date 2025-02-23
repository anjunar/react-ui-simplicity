import {AbstractNode} from "../AbstractNode";

export class ImageData {
    url: string

    constructor(url: string) {
        this.url = url;
    }
}

export class ImageNode extends AbstractNode<ImageData> {

    data: ImageData;

    type: string = "image"

    get isEmpty(): any {
        return this.data.url.length === 0
    }

    constructor(data: ImageData) {
        super();
        this.data = data;
    }
}