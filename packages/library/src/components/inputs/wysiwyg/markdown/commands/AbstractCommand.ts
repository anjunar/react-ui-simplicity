export abstract class AbstractCommand {

    abstract execute(textarea : HTMLTextAreaElement, markdown : {currentMarkdown : string, triggerMarkdown() : void}) : void

}