import React, {useContext} from "react"
import Pages from "../../../layout/pages/Pages";
import Page from "../../../layout/pages/Page";
import {Context} from "../context/Context";
import {AbstractProvider} from "../blocks/AbstractProvider";

function Toolbar(properties: Toolbar.Attributes) {

    const {page} = properties

    const {ast, providers, trigger} = useContext(Context)

    function onProviderClick(provider : AbstractProvider<any, any, any>) {

        let index = ast.blocks.findIndex(node => node.selected);

        ast.blocks.splice(index + 1, 0, new provider.factory())

        trigger()

    }

    function onDeleteClick() {
        let index = ast.blocks.findIndex(node => node.selected);
        ast.blocks.splice(index, 1)
        trigger()
    }

    function onArrowUpClick() {
        let index = ast.blocks.findIndex(node => node.selected);

        let block = ast.blocks.splice(index, 1)[0];

        ast.blocks.splice(index - 1, 0, block)

        trigger()
    }

    function onArrowDownClick() {
        let index = ast.blocks.findIndex(node => node.selected);

        let block = ast.blocks.splice(index, 1)[0];

        ast.blocks.splice(index + 1, 0, block)

        trigger()
    }

    function createToolbox() {
        let block = ast.blocks.find(block => block.selected);
        let provider = providers.find(provider => block instanceof provider.factory);
        if (provider) {
            return React.createElement(provider.tool)
        }
        return <div style={{lineHeight : "28px", verticalAlign : "middle"}}>Select a Block</div>
    }

    const isArrowDownDisabled = ast.blocks[ast.blocks.length - 1].selected
    const isArrowUpDisabled = ast.blocks[0].selected
    const isDeleteDisabled = ast.blocks.length === 1

    return (
        <div className={"wysiwyg-toolbar"}>
            <Pages page={page}>
                <Page>
                    <div style={{display : "flex", alignItems : "center", justifyContent : "center"}}>
                        {
                            providers.map(provider => (
                                <button key={provider.title}
                                        onClick={() => onProviderClick(provider)}
                                        className={"material-icons"}>
                                    {provider.icon}
                                </button>
                            ))
                        }
                    </div>
                </Page>
                <Page>
                    <div style={{display : "flex", alignItems : "center", justifyContent : "center"}}>
                        <button className={"material-icons"} disabled={isDeleteDisabled} onClick={onDeleteClick}>delete</button>
                        <button className={"material-icons"} disabled={isArrowUpDisabled} onClick={onArrowUpClick}>arrow_upward</button>
                        <button className={"material-icons"} disabled={isArrowDownDisabled} onClick={onArrowDownClick}>arrow_downward</button>
                    </div>
                </Page>
                <Page>
                    <div style={{display : "flex", alignItems : "center", justifyContent : "center"}}>
                        {
                            createToolbox()
                        }
                    </div>
                </Page>
            </Pages>
        </div>
    )
}

namespace Toolbar {
    export interface Attributes {
        page : number
    }
}

export default Toolbar