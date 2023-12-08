import { BaseComponent } from "./base-component";
import { DragTarget } from "../models/drag-drop";
import { Project, ProjectStatus } from "../models/project";
import { ProjectItem } from "./project-item";
import { AutoBind } from "../decorators/autobind";
import { projectState } from "../state/project-state";

export class ProjectList extends BaseComponent<HTMLDivElement, HTMLElement> implements DragTarget {
    assignedProjects: Project[];

    constructor(private type: 'active' | 'finished') {
        super('project-list', 'app', false, `${type}-projects`)
        this.assignedProjects = [];
        
        this.configure();
        this.renderContent();
    }

    private renderProjects() {
        const listElement = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
        listElement.innerHTML = '';

        for (const projectItem of this.assignedProjects) {
            new ProjectItem(this.renderingElement.querySelector('ul')!.id, projectItem);
        }
    }

    @AutoBind
    dragOverHandler(event: DragEvent): void {
        if(event.dataTransfer && event.dataTransfer.types[0] === 'text/plain'){
            event.preventDefault(); //js prevents dropping by default
            const listEl = this.renderingElement.querySelector('ul')!
            listEl.classList.add('droppable');
        }
    }

    @AutoBind
    dropHandler(event: DragEvent): void {
        const projectId = event.dataTransfer!.getData('text/plain');
        projectState.moveProject(projectId, this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished);
    }

    @AutoBind
    dragLeaveHander(_: DragEvent): void {
        const listEl = this.renderingElement.querySelector('ul')!
        listEl.classList.remove('droppable');
    }

    configure() {
        this.renderingElement.addEventListener('dragover', this.dragOverHandler);
        this.renderingElement.addEventListener('dragleave', this.dragLeaveHander);
        this.renderingElement.addEventListener('drop', this.dropHandler);

        projectState.addListener((projects: Project[]) => {
            const relevantProjects = projects.filter(prj => {
                if(this.type === 'active'){
                    return prj.status === ProjectStatus.Active;
                }
                return prj.status === ProjectStatus.Finished;
            })
            
            this.assignedProjects = relevantProjects;
            this.renderProjects();
        });
    }

    renderContent() {
        const listId = `${this.type}-projects-list`;
        this.renderingElement.querySelector('ul')!.id = listId;
        this.renderingElement.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS';
    }
}