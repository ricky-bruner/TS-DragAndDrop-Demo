// Project Type
enum ProjectStatus {
    Active, 
    Finished
}

class Project {
    constructor(
        public id: string,
        public title: string, 
        public description: string, 
        public people: number, 
        public status: ProjectStatus
    ) {

    }
}

type Listener<T> = (items: T[]) => void;

class State<T> {
    protected listeners: Listener<T>[] = [];

    addListener(listenerFn: Listener<T>){
        this.listeners.push(listenerFn);
    }
}


// Project State Management Class
class ProjectState extends State<Project> {
    private projects: Project[] = [];
    private static instance: ProjectState;

    private constructor() {
        super();
    }

    //for singleton
    static getInstance() {
        if(this.instance){
            return this.instance;
        }
        this.instance = new ProjectState();
        return this.instance;
    }

    addProject(title: string, desc: string, numOfPeople: number){
        const newProject = new Project(
            Math.random().toString(),
            title,
            desc,
            numOfPeople,
            ProjectStatus.Active
        );

        this.projects.push(newProject);

        for (const listenerFn of this.listeners) {
            //pass a copy, never let external modify the original
            listenerFn(this.projects.slice());
        }
    }
}

const projectState = ProjectState.getInstance();

//Validation
interface Validatable {
    value: string | number,
    required?: boolean,
    minLength?: number,
    maxLength?: number,
    min?: number,
    max?: number
}

function validate(validatableInput: Validatable) {
    let isValid = true;

    if (validatableInput.required) {
        isValid = isValid && validatableInput.value.toString().trim().length !== 0
    }

    if (validatableInput.minLength != null && typeof validatableInput.value === 'string') {
        isValid = isValid && validatableInput.value.trim().length >= validatableInput.minLength;
    }

    if (validatableInput.maxLength != null && typeof validatableInput.value === 'string') {
        isValid = isValid && validatableInput.value.trim().length <= validatableInput.maxLength;
    }

    if (validatableInput.min != null && typeof validatableInput.value === 'number') {
        isValid = isValid && validatableInput.value >= validatableInput.min;
    }

    if (validatableInput.max != null && typeof validatableInput.value === 'number') {
        isValid = isValid && validatableInput.value <= validatableInput.max;
    }

    return isValid;
}


// autobind decorator
function AutoBind(_: any, _2: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const adjDescriptor: PropertyDescriptor = {
        configurable: true,
        get() {
            const boundFn = originalMethod.bind(this);
            return boundFn;
        }
    };
    return adjDescriptor;
}

//base class
abstract class BaseComponent<T extends HTMLElement, U extends HTMLElement> {
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

//ProjectItem Class
class ProjectItem extends BaseComponent<HTMLUListElement, HTMLLIElement> {
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

    configure(): void {
        
    }

    renderContent() {
        this.renderingElement.querySelector('h2')!.textContent = this.project.title;
        this.renderingElement.querySelector('h3')!.textContent = this.persons + ' assigned';
        this.renderingElement.querySelector('p')!.textContent = this.project.description;
    }
}

// ProjectList Class
class ProjectList extends BaseComponent<HTMLDivElement, HTMLElement> {
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

    configure() {
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



// ProjectInput Class
class ProjectInput extends BaseComponent<HTMLDivElement, HTMLFormElement> {

    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLTextAreaElement;
    peopleInputElement: HTMLInputElement;

    constructor() {
        super('project-input', 'app', true, 'user-input');
        this.titleInputElement = this.renderingElement.querySelector('#title') as HTMLInputElement;
        this.descriptionInputElement = this.renderingElement.querySelector('#description') as HTMLTextAreaElement;
        this.peopleInputElement = this.renderingElement.querySelector('#people') as HTMLInputElement;
        this.configure();
    }

    configure() {
        this.renderingElement.addEventListener('submit', this.submitHandler)
    }

    renderContent(){}

    private gatherUserInput(): [string,string,number] | void {
        const enteredTitle = this.titleInputElement.value;
        const enteredDescription = this.descriptionInputElement.value;
        const enteredPeople = this.peopleInputElement.value;

        const titleValidatable: Validatable = {
            value: enteredTitle,
            required: true
        };

        const descriptionValidatable: Validatable = {
            value: enteredDescription,
            required: true,
            minLength: 5
        };

        const peopleValidatable: Validatable = {
            value: +enteredPeople,
            required: true,
            min: 1,
            max: 5
        };

        if (!validate(titleValidatable)){
            alert('Invalid title input, please try again!');
            return;
        } else if(!validate(descriptionValidatable)) {
            alert('Invalid desc input, please try again!');
            return;
        } else if(!validate(peopleValidatable)) {
            alert('Invalid people input, please try again!');
            return;
        } else {
            return [enteredTitle, enteredDescription, +enteredPeople];
        }
    }

    private clearInputs() {
        this.titleInputElement.value = '';
        this.descriptionInputElement.value = '';
        this.peopleInputElement.value = '';
    }

    @AutoBind
    private submitHandler(event: Event) {
        event.preventDefault();
        const userInput = this.gatherUserInput();
        if (Array.isArray(userInput)) {
            const [title, desc, people] = userInput;
            projectState.addProject(title, desc, people);
            this.clearInputs();
        }
    }
}

const projInput = new ProjectInput();
const activeProjList = new ProjectList('active');
const finishedProjList = new ProjectList('finished');