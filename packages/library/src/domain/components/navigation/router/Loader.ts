import PathParams from "./PathParams";
import QueryParams from "./QueryParams";

export default interface Loader {
    [key : string] : (path : PathParams, query : QueryParams) => Promise<any>
}