export abstract class BaseComponent<T extends HTMLElement, U extends HTMLElement> {
    templateElement: HTMLTemplateElement;
    hostElement: T;
    renderingElement: U;

    constructor(templateId: string, hostElementId: string, insertAtBeginning: boolean, newElementId?: string) {
        this.templateElement = document.getElementById(templateId)! as HTMLTemplateElement;
        this.hostElement = document.getElementById(hostElementId)! as T;

        const inportedNode = document.importNode(this.templateElement.content, true);
        this.renderingElement = inportedNode.firstElementChild as U;

        if(newElementId){
            this.renderingElement.id = newElementId;
        }

        this.attach(insertAtBeginning);
    }

    private attach(insertAtBeginning: boolean) {
        this.hostElement.insertAdjacentElement(insertAtBeginning ? 'afterbegin' : 'beforeend', this.renderingElement);
    }

    abstract configure(): void;
    abstract renderContent(): void;
}