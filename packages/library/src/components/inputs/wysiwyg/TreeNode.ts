import {v4} from "uuid";

export class TreeNode {
    static counter = 0
    version = TreeNode.counter++

    id: string;
    type: string;
    parent: TreeNode | null = null;
    children: TreeNode[] = [];
    previousSibling: TreeNode | null = null;
    nextSibling: TreeNode | null = null;
    attributes: Record<string, any> = {};
    dom : Node

    constructor(type: string, parent: TreeNode | null = null) {
        this.id = v4()
        this.type = type;
        this.parent = parent;
    }

    get isContainer() {
        return this.type === "p" || this.type === "root"
    }

    appendChild(node: TreeNode) {
        node.parent = this;
        if (this.children.length > 0) {
            const lastChild = this.children[this.children.length - 1];
            node.previousSibling = lastChild;
            lastChild.nextSibling = node;
        }
        this.children.push(node);
    }
    appendChildren(nodes: TreeNode[]) {
        for (const node of nodes) {
            this.appendChild(node)
        }
    }

    removeChild(node: TreeNode) {
        this.children = this.children.filter((child) => child.id !== node.id);
        if (node.previousSibling) node.previousSibling.nextSibling = node.nextSibling;
        if (node.nextSibling) node.nextSibling.previousSibling = node.previousSibling;
        node.parent = null;
    }

    removeAllChildren() {
        for (const child of this.children) {
            this.removeChild(child)
        }
    }

    remove() {
        this.parent.removeChild(this)
    }

    insertAfter(newNode: TreeNode) {
        let referenceNode = this
        if (!referenceNode.parent) return;
        let parent = referenceNode.parent;

        let index = parent.children.indexOf(referenceNode);
        newNode.parent = parent;

        newNode.previousSibling = referenceNode;
        newNode.nextSibling = referenceNode.nextSibling;
        if (referenceNode.nextSibling) referenceNode.nextSibling.previousSibling = newNode;
        referenceNode.nextSibling = newNode;

        parent.children.splice(index + 1, 0, newNode);
    }

    findById(id: string): TreeNode | null {
        if (this.id === id) return this;
        for (let child of this.children) {
            let found = child.findById(id);
            if (found) return found;
        }
        return null;
    }

    splitNode(node: TreeNode) {
        if (!node.parent) return null;

        let oldParent = node.parent;
        let newParent = new TreeNode(oldParent.type, oldParent.parent);

        let index = oldParent.children.indexOf(node);
        let movingNodes = oldParent.children.splice(index);

        movingNodes.forEach((n) => newParent.appendChild(n));

        oldParent.insertAfter(newParent);

        return newParent;
    }

    filter(predicate: (node: TreeNode) => boolean): TreeNode[] {
        let result: TreeNode[] = [];
        if (predicate(this)) result.push(this);

        for (let child of this.children) {
            result.push(...child.filter(predicate));
        }
        return result;
    }

    find(predicate: (node: TreeNode) => boolean): TreeNode {
        return this.filter(predicate)[0]
    }

    findConnectedChunkFromNode(startNode: TreeNode, predicate: (node: TreeNode) => boolean): TreeNode[] {
        let chunk: TreeNode[] = [];
        let visited = new Set<string>();

        const dfs = (node: TreeNode | null) => {
            if (!node || visited.has(node.id) || !predicate(node)) return;
            visited.add(node.id);
            chunk.push(node);

            dfs(node.previousSibling);
            dfs(node.nextSibling);
            dfs(node.parent);
            for (const child of node.children) {
                dfs(child);
            }
        };

        dfs(startNode);
        return chunk;
    }

    search(
        predicate: (node: TreeNode) => boolean,
        maxDepth: number = Infinity,
        currentDepth: number = 0
    ): TreeNode | null {
        if (predicate(this)) return this;
        if (currentDepth >= maxDepth) return null;

        for (let child of this.children) {
            let found = child.search(predicate, maxDepth, currentDepth + 1);
            if (found) return found;
        }
        return null;
    }

    traverse(callback: (node: TreeNode) => void): void {
        callback(this);

        for (let child of this.children) {
            child.traverse(callback);
        }
    }

    cloneDeep(parent: TreeNode | null = null): TreeNode {
        const newNode = new TreeNode(this.type, parent);
        newNode.id = this.id
        newNode.attributes = { ...this.attributes };

        newNode.children = this.children.map(child => {
            return child.cloneDeep(newNode);
        });

        for (let i = 0; i < newNode.children.length; i++) {
            newNode.children[i].previousSibling = i > 0 ? newNode.children[i - 1] : null;
            newNode.children[i].nextSibling = i < newNode.children.length - 1 ? newNode.children[i + 1] : null;
        }

        return newNode;
    }

    cloneShallow(parent: TreeNode | null = null): TreeNode {
        const newNode = new TreeNode(this.type, parent);
        newNode.id = this.id
        newNode.attributes = this.attributes;

        newNode.children = this.children
        for (const child of newNode.children) {
            child.parent = newNode
        }

        return newNode;
    }

    splice(index: number, deleteCount: number, ...newNodes: TreeNode[]): void {
        const removedNodes = this.children.splice(index, deleteCount, ...newNodes);

        newNodes.forEach((node) => {
            node.parent = this;
        });

        for (let i = 0; i < this.children.length; i++) {
            let prev = this.children[i - 1] || null;
            let next = this.children[i + 1] || null;
            this.children[i].previousSibling = prev;
            this.children[i].nextSibling = next;
        }

        removedNodes.forEach((node) => {
            node.parent = null;
            node.previousSibling = null;
            node.nextSibling = null;
        });
    }

    surroundWith(nodes: TreeNode[], wrapper: TreeNode, index : number = -1): void {

        for (const node of nodes) {
            node.parent.removeChild(node)
        }

        wrapper.appendChildren(nodes)

        if (index === -1) {
            this.appendChild(wrapper)
        } else {
            this.splice(index, 0, wrapper)
        }
    }

    traverseBetween(startNode: TreeNode, endNode: TreeNode, callback: (node: TreeNode) => void): void {
        if (!startNode || !endNode) return;

        let currentNode: TreeNode | null = startNode;
        let reachedEnd = false;

        while (currentNode && !reachedEnd) {
            callback(currentNode);

            if (currentNode === endNode) {
                reachedEnd = true;
                break;
            }

            if (currentNode.children.length > 0) {
                currentNode = currentNode.children[0];
                continue;
            }

            while (currentNode && !currentNode.nextSibling) {
                currentNode = currentNode.parent;
            }

            if (currentNode) {
                currentNode = currentNode.nextSibling;
            }
        }
    }

}
