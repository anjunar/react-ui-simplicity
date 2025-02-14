export abstract class AbstractCommand<E> {

    get range() {
        let selection = window.getSelection();
        if (selection?.rangeCount) {
            return selection.getRangeAt(0)
        }
        return null
    }

    abstract execute(value : E) : void

}