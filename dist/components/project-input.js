var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { BaseComponent } from "./base-component.js";
import { validate } from "../utilities/validation.js";
import { AutoBind } from "../decorators/autobind.js";
import { projectState } from "../state/project-state.js";
export class ProjectInput extends BaseComponent {
    constructor() {
        super('project-input', 'app', true, 'user-input');
        this.titleInputElement = this.renderingElement.querySelector('#title');
        this.descriptionInputElement = this.renderingElement.querySelector('#description');
        this.peopleInputElement = this.renderingElement.querySelector('#people');
        this.configure();
    }
    configure() {
        this.renderingElement.addEventListener('submit', this.submitHandler);
    }
    renderContent() { }
    gatherUserInput() {
        const enteredTitle = this.titleInputElement.value;
        const enteredDescription = this.descriptionInputElement.value;
        const enteredPeople = this.peopleInputElement.value;
        const titleValidatable = {
            value: enteredTitle,
            required: true
        };
        const descriptionValidatable = {
            value: enteredDescription,
            required: true,
            minLength: 5
        };
        const peopleValidatable = {
            value: +enteredPeople,
            required: true,
            min: 1,
            max: 5
        };
        if (!validate(titleValidatable)) {
            alert('Invalid title input, please try again!');
            return;
        }
        else if (!validate(descriptionValidatable)) {
            alert('Invalid desc input, please try again!');
            return;
        }
        else if (!validate(peopleValidatable)) {
            alert('Invalid people input, please try again!');
            return;
        }
        else {
            return [enteredTitle, enteredDescription, +enteredPeople];
        }
    }
    clearInputs() {
        this.titleInputElement.value = '';
        this.descriptionInputElement.value = '';
        this.peopleInputElement.value = '';
    }
    submitHandler(event) {
        event.preventDefault();
        const userInput = this.gatherUserInput();
        if (Array.isArray(userInput)) {
            const [title, desc, people] = userInput;
            projectState.addProject(title, desc, people);
            this.clearInputs();
        }
    }
}
__decorate([
    AutoBind
], ProjectInput.prototype, "submitHandler", null);
//# sourceMappingURL=project-input.js.map