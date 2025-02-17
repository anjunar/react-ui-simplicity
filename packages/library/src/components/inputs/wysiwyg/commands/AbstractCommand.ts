export abstract class AbstractCommand<E> {

    get range() {
        let selection = window.getSelection();
        if (selection?.rangeCount) {
            return selection.getRangeAt(0)
        }
        return null
    }

    get oldRange() {
        return {
            startOffset : this.range.startOffset,
            endOffset : this.range.endOffset,
            startContainer : this.range.startContainer,
            endContainer : this.range.endContainer
        }
    }

    abstract execute(value : E) : void

}