import { BaseComponent } from "./base-component";
import { Draggable } from "../models/drag-drop";
import { Project } from "../models/project";
import { AutoBind } from "../decorators/autobind";

export class ProjectItem extends BaseComponent<HTMLUListElement, HTMLLIElement> implements Draggable {
    private project: Project;
    
    get persons() {
        if (this.project.people === 1){
            return '1 person';
        } else {
            return `${this.project.people} people`;
        }
    }

    constructor(hostId: string, project: Project){
        super('single-project', hostId, false, project.id);
        this.project = project;

        this.configure();
        this.renderContent();
    }

    @AutoBind
    dragStartHandler(event: DragEvent): void {
        event.dataTransfer!.setData('text/plain', this.project.id);
        event.dataTransfer!.effectAllowed = 'move';
    }

    @AutoBind
    dragEndHandler(_: DragEvent): void {
        console.log('drag end');
    }

    configure(): void {
        this.renderingElement.draggable = true;
        this.renderingElement.addEventListener('dragstart', this.dragStartHandler)
        this.renderingElement.addEventListener('dragend', this.dragEndHandler)
    }

    renderContent() {
        this.renderingElement.querySelector('h2')!.textContent = this.project.title;
        this.renderingElement.querySelector('h3')!.textContent = this.persons + ' assigned';
        this.renderingElement.querySelector('p')!.textContent = this.project.description;
    }
}