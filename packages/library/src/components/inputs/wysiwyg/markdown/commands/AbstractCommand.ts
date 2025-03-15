export abstract class AbstractCommand {

    abstract execute(value : boolean, textarea : HTMLTextAreaElement, markdown : {currentMarkdown : string, triggerMarkdown() : void}) : void

}