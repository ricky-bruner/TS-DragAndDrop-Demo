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

// ProjectInput Class
class ProjectInput {
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    formElement: HTMLFormElement;
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLTextAreaElement;
    peopleInputElement: HTMLInputElement;

    constructor() {
        this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement;
        this.hostElement = document.getElementById('app')! as HTMLDivElement;
        const inportedNode = document.importNode(this.templateElement.content, true);
        this.formElement = inportedNode.firstElementChild as HTMLFormElement;
        this.formElement.id = 'user-input';
        this.titleInputElement = this.formElement.querySelector('#title') as HTMLInputElement;
        this.descriptionInputElement = this.formElement.querySelector('#description') as HTMLTextAreaElement;
        this.peopleInputElement = this.formElement.querySelector('#people') as HTMLInputElement;
        this.configure();
        this.attach();
    }

    private gatherUserInput(): [string,string,number] | void {
        const enteredTitle = this.titleInputElement.value;
        const enteredDescription = this.descriptionInputElement.value;
        const enteredPeople = this.peopleInputElement.value;

        if (
            enteredTitle.trim().length === 0 ||
            enteredDescription.trim().length === 0 ||
            enteredPeople.trim().length === 0
        ) {
            alert('Invalid input, please try again!');
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
            console.log(title, desc, people);
            this.clearInputs();
        }
    }

    private configure() {
        this.formElement.addEventListener('submit', this.submitHandler)
    }

    private attach() {
        this.hostElement.insertAdjacentElement('afterbegin', this.formElement);
    }
}

const projInput = new ProjectInput();