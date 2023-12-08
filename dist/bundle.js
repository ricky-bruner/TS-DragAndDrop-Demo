(()=>{"use strict";class e{constructor(e,t,n,r){this.templateElement=document.getElementById(e),this.hostElement=document.getElementById(t);const i=document.importNode(this.templateElement.content,!0);this.renderingElement=i.firstElementChild,r&&(this.renderingElement.id=r),this.attach(n)}attach(e){this.hostElement.insertAdjacentElement(e?"afterbegin":"beforeend",this.renderingElement)}}function t(e){let t=!0;return e.required&&(t=t&&0!==e.value.toString().trim().length),null!=e.minLength&&"string"==typeof e.value&&(t=t&&e.value.trim().length>=e.minLength),null!=e.maxLength&&"string"==typeof e.value&&(t=t&&e.value.trim().length<=e.maxLength),null!=e.min&&"number"==typeof e.value&&(t=t&&e.value>=e.min),null!=e.max&&"number"==typeof e.value&&(t=t&&e.value<=e.max),t}function n(e,t,n){const r=n.value;return{configurable:!0,get(){return r.bind(this)}}}var r;!function(e){e[e.Active=0]="Active",e[e.Finished=1]="Finished"}(r||(r={}));class i{constructor(e,t,n,r,i){this.id=e,this.title=t,this.description=n,this.people=r,this.status=i}}class s{constructor(){this.listeners=[]}addListener(e){this.listeners.push(e)}}class l extends s{constructor(){super(),this.projects=[]}static getInstance(){return this.instance||(this.instance=new l),this.instance}addProject(e,t,n){const s=new i(Math.random().toString(),e,t,n,r.Active);this.projects.push(s),this.updateListeners()}moveProject(e,t){const n=this.projects.find((t=>t.id===e));n&&n.status!==t&&(n.status=t,this.updateListeners())}updateListeners(){for(const e of this.listeners)e(this.projects.slice())}}const a=l.getInstance();class o extends e{constructor(){super("project-input","app",!0,"user-input"),this.titleInputElement=this.renderingElement.querySelector("#title"),this.descriptionInputElement=this.renderingElement.querySelector("#description"),this.peopleInputElement=this.renderingElement.querySelector("#people"),this.configure()}configure(){this.renderingElement.addEventListener("submit",this.submitHandler)}renderContent(){}gatherUserInput(){const e=this.titleInputElement.value,n=this.descriptionInputElement.value,r=this.peopleInputElement.value,i={value:n,required:!0,minLength:5},s={value:+r,required:!0,min:1,max:5};return t({value:e,required:!0})?t(i)?t(s)?[e,n,+r]:void alert("Invalid people input, please try again!"):void alert("Invalid desc input, please try again!"):void alert("Invalid title input, please try again!")}clearInputs(){this.titleInputElement.value="",this.descriptionInputElement.value="",this.peopleInputElement.value=""}submitHandler(e){e.preventDefault();const t=this.gatherUserInput();if(Array.isArray(t)){const[e,n,r]=t;a.addProject(e,n,r),this.clearInputs()}}}!function(e,t,n,r){var i,s=arguments.length,l=s<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(e,t,n,r);else for(var a=e.length-1;a>=0;a--)(i=e[a])&&(l=(s<3?i(l):s>3?i(t,n,l):i(t,n))||l);s>3&&l&&Object.defineProperty(t,n,l)}([n],o.prototype,"submitHandler",null);var d=function(e,t,n,r){var i,s=arguments.length,l=s<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(e,t,n,r);else for(var a=e.length-1;a>=0;a--)(i=e[a])&&(l=(s<3?i(l):s>3?i(t,n,l):i(t,n))||l);return s>3&&l&&Object.defineProperty(t,n,l),l};class c extends e{get persons(){return 1===this.project.people?"1 person":`${this.project.people} people`}constructor(e,t){super("single-project",e,!1,t.id),this.project=t,this.configure(),this.renderContent()}dragStartHandler(e){e.dataTransfer.setData("text/plain",this.project.id),e.dataTransfer.effectAllowed="move"}dragEndHandler(e){console.log("drag end")}configure(){this.renderingElement.draggable=!0,this.renderingElement.addEventListener("dragstart",this.dragStartHandler),this.renderingElement.addEventListener("dragend",this.dragEndHandler)}renderContent(){this.renderingElement.querySelector("h2").textContent=this.project.title,this.renderingElement.querySelector("h3").textContent=this.persons+" assigned",this.renderingElement.querySelector("p").textContent=this.project.description}}d([n],c.prototype,"dragStartHandler",null),d([n],c.prototype,"dragEndHandler",null);var p=function(e,t,n,r){var i,s=arguments.length,l=s<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,n):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)l=Reflect.decorate(e,t,n,r);else for(var a=e.length-1;a>=0;a--)(i=e[a])&&(l=(s<3?i(l):s>3?i(t,n,l):i(t,n))||l);return s>3&&l&&Object.defineProperty(t,n,l),l};class u extends e{constructor(e){super("project-list","app",!1,`${e}-projects`),this.type=e,this.assignedProjects=[],this.configure(),this.renderContent()}renderProjects(){document.getElementById(`${this.type}-projects-list`).innerHTML="";for(const e of this.assignedProjects)new c(this.renderingElement.querySelector("ul").id,e)}dragOverHandler(e){e.dataTransfer&&"text/plain"===e.dataTransfer.types[0]&&(e.preventDefault(),this.renderingElement.querySelector("ul").classList.add("droppable"))}dropHandler(e){const t=e.dataTransfer.getData("text/plain");a.moveProject(t,"active"===this.type?r.Active:r.Finished)}dragLeaveHander(e){this.renderingElement.querySelector("ul").classList.remove("droppable")}configure(){this.renderingElement.addEventListener("dragover",this.dragOverHandler),this.renderingElement.addEventListener("dragleave",this.dragLeaveHander),this.renderingElement.addEventListener("drop",this.dropHandler),a.addListener((e=>{const t=e.filter((e=>"active"===this.type?e.status===r.Active:e.status===r.Finished));this.assignedProjects=t,this.renderProjects()}))}renderContent(){const e=`${this.type}-projects-list`;this.renderingElement.querySelector("ul").id=e,this.renderingElement.querySelector("h2").textContent=this.type.toUpperCase()+" PROJECTS"}}p([n],u.prototype,"dragOverHandler",null),p([n],u.prototype,"dropHandler",null),p([n],u.prototype,"dragLeaveHander",null),new o,new u("active"),new u("finished")})();