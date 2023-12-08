var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define("components/base-component", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BaseComponent = void 0;
    class BaseComponent {
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
    exports.BaseComponent = BaseComponent;
});
define("utilities/validation", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validate = void 0;
    function validate(validatableInput) {
        let isValid = true;
        if (validatableInput.required) {
            isValid = isValid && validatableInput.value.toString().trim().length !== 0;
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
    exports.validate = validate;
});
define("decorators/autobind", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AutoBind = void 0;
    function AutoBind(_, _2, descriptor) {
        const originalMethod = descriptor.value;
        const adjDescriptor = {
            configurable: true,
            get() {
                const boundFn = originalMethod.bind(this);
                return boundFn;
            }
        };
        return adjDescriptor;
    }
    exports.AutoBind = AutoBind;
});
define("models/project", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Project = exports.ProjectStatus = void 0;
    var ProjectStatus;
    (function (ProjectStatus) {
        ProjectStatus[ProjectStatus["Active"] = 0] = "Active";
        ProjectStatus[ProjectStatus["Finished"] = 1] = "Finished";
    })(ProjectStatus || (exports.ProjectStatus = ProjectStatus = {}));
    class Project {
        constructor(id, title, description, people, status) {
            this.id = id;
            this.title = title;
            this.description = description;
            this.people = people;
            this.status = status;
        }
    }
    exports.Project = Project;
});
define("state/project-state", ["require", "exports", "models/project"], function (require, exports, project_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.projectState = exports.ProjectState = void 0;
    class State {
        constructor() {
            this.listeners = [];
        }
        addListener(listenerFn) {
            this.listeners.push(listenerFn);
        }
    }
    class ProjectState extends State {
        constructor() {
            super();
            this.projects = [];
        }
        static getInstance() {
            if (this.instance) {
                return this.instance;
            }
            this.instance = new ProjectState();
            return this.instance;
        }
        addProject(title, desc, numOfPeople) {
            const newProject = new project_js_1.Project(Math.random().toString(), title, desc, numOfPeople, project_js_1.ProjectStatus.Active);
            this.projects.push(newProject);
            this.updateListeners();
        }
        moveProject(projectId, newStatus) {
            const project = this.projects.find(project => project.id === projectId);
            if (project && project.status !== newStatus) {
                project.status = newStatus;
                this.updateListeners();
            }
        }
        updateListeners() {
            for (const listenerFn of this.listeners) {
                listenerFn(this.projects.slice());
            }
        }
    }
    exports.ProjectState = ProjectState;
    exports.projectState = ProjectState.getInstance();
});
define("components/project-input", ["require", "exports", "components/base-component", "utilities/validation", "decorators/autobind", "state/project-state"], function (require, exports, base_component_js_1, validation_js_1, autobind_js_1, project_state_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProjectInput = void 0;
    class ProjectInput extends base_component_js_1.BaseComponent {
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
            if (!(0, validation_js_1.validate)(titleValidatable)) {
                alert('Invalid title input, please try again!');
                return;
            }
            else if (!(0, validation_js_1.validate)(descriptionValidatable)) {
                alert('Invalid desc input, please try again!');
                return;
            }
            else if (!(0, validation_js_1.validate)(peopleValidatable)) {
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
                project_state_js_1.projectState.addProject(title, desc, people);
                this.clearInputs();
            }
        }
    }
    exports.ProjectInput = ProjectInput;
    __decorate([
        autobind_js_1.AutoBind
    ], ProjectInput.prototype, "submitHandler", null);
});
define("models/drag-drop", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("components/project-item", ["require", "exports", "components/base-component", "decorators/autobind"], function (require, exports, base_component_js_2, autobind_js_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProjectItem = void 0;
    class ProjectItem extends base_component_js_2.BaseComponent {
        get persons() {
            if (this.project.people === 1) {
                return '1 person';
            }
            else {
                return `${this.project.people} people`;
            }
        }
        constructor(hostId, project) {
            super('single-project', hostId, false, project.id);
            this.project = project;
            this.configure();
            this.renderContent();
        }
        dragStartHandler(event) {
            event.dataTransfer.setData('text/plain', this.project.id);
            event.dataTransfer.effectAllowed = 'move';
        }
        dragEndHandler(_) {
            console.log('drag end');
        }
        configure() {
            this.renderingElement.draggable = true;
            this.renderingElement.addEventListener('dragstart', this.dragStartHandler);
            this.renderingElement.addEventListener('dragend', this.dragEndHandler);
        }
        renderContent() {
            this.renderingElement.querySelector('h2').textContent = this.project.title;
            this.renderingElement.querySelector('h3').textContent = this.persons + ' assigned';
            this.renderingElement.querySelector('p').textContent = this.project.description;
        }
    }
    exports.ProjectItem = ProjectItem;
    __decorate([
        autobind_js_2.AutoBind
    ], ProjectItem.prototype, "dragStartHandler", null);
    __decorate([
        autobind_js_2.AutoBind
    ], ProjectItem.prototype, "dragEndHandler", null);
});
define("components/project-list", ["require", "exports", "components/base-component", "models/project", "components/project-item", "decorators/autobind", "state/project-state"], function (require, exports, base_component_js_3, project_js_2, project_item_js_1, autobind_js_3, project_state_js_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProjectList = void 0;
    class ProjectList extends base_component_js_3.BaseComponent {
        constructor(type) {
            super('project-list', 'app', false, `${type}-projects`);
            this.type = type;
            this.assignedProjects = [];
            this.configure();
            this.renderContent();
        }
        renderProjects() {
            const listElement = document.getElementById(`${this.type}-projects-list`);
            listElement.innerHTML = '';
            for (const projectItem of this.assignedProjects) {
                new project_item_js_1.ProjectItem(this.renderingElement.querySelector('ul').id, projectItem);
            }
        }
        dragOverHandler(event) {
            if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
                event.preventDefault();
                const listEl = this.renderingElement.querySelector('ul');
                listEl.classList.add('droppable');
            }
        }
        dropHandler(event) {
            const projectId = event.dataTransfer.getData('text/plain');
            project_state_js_2.projectState.moveProject(projectId, this.type === 'active' ? project_js_2.ProjectStatus.Active : project_js_2.ProjectStatus.Finished);
        }
        dragLeaveHander(_) {
            const listEl = this.renderingElement.querySelector('ul');
            listEl.classList.remove('droppable');
        }
        configure() {
            this.renderingElement.addEventListener('dragover', this.dragOverHandler);
            this.renderingElement.addEventListener('dragleave', this.dragLeaveHander);
            this.renderingElement.addEventListener('drop', this.dropHandler);
            project_state_js_2.projectState.addListener((projects) => {
                const relevantProjects = projects.filter(prj => {
                    if (this.type === 'active') {
                        return prj.status === project_js_2.ProjectStatus.Active;
                    }
                    return prj.status === project_js_2.ProjectStatus.Finished;
                });
                this.assignedProjects = relevantProjects;
                this.renderProjects();
            });
        }
        renderContent() {
            const listId = `${this.type}-projects-list`;
            this.renderingElement.querySelector('ul').id = listId;
            this.renderingElement.querySelector('h2').textContent = this.type.toUpperCase() + ' PROJECTS';
        }
    }
    exports.ProjectList = ProjectList;
    __decorate([
        autobind_js_3.AutoBind
    ], ProjectList.prototype, "dragOverHandler", null);
    __decorate([
        autobind_js_3.AutoBind
    ], ProjectList.prototype, "dropHandler", null);
    __decorate([
        autobind_js_3.AutoBind
    ], ProjectList.prototype, "dragLeaveHander", null);
});
define("app", ["require", "exports", "components/project-input", "components/project-list"], function (require, exports, project_input_js_1, project_list_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    new project_input_js_1.ProjectInput();
    new project_list_js_1.ProjectList('active');
    new project_list_js_1.ProjectList('finished');
});
//# sourceMappingURL=bundle.js.map