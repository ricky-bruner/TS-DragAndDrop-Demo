export class BaseComponent {
    constructor(templateId, hostElementId, insertAtBeginning, newElementId) {
        this.templateElement = document.getElementById(templateId);
        this.hostElement = document.getElementById(hostElementId);
        const inportedNode = document.importNode(this.templateElement.content, true);
        this.renderingElement = inportedNode.firstElementChild;
        if (newElementId) {
            this.renderingElement.id = newElementId;
        }
        this.attach(insertAtBeginning);
    }
    attach(insertAtBeginning) {
        this.hostElement.insertAdjacentElement(insertAtBeginning ? 'afterbegin' : 'beforeend', this.renderingElement);
    }
}
//# sourceMappingURL=base-component.js.map