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

    private submitHandler(event: Event) {
        event.preventDefault();
        console.log(this.titleInputElement.value);
    }

    private configure() {
        this.formElement.addEventListener('submit', this.submitHandler.bind(this))
    }

    private attach() {
        this.hostElement.insertAdjacentElement('afterbegin', this.formElement);
    }
}

const projInput = new ProjectInput();