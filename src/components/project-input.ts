import { BaseComponent } from "./base-component";
import { Validatable, validate } from "../utilities/validation";
import { AutoBind } from "../decorators/autobind";
import { projectState } from "../state/project-state";

export class ProjectInput extends BaseComponent<HTMLDivElement, HTMLFormElement> {

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