import { Component } from "./base-component.js";
import { ProjectItem } from "./project-item.js";
import { DragTarget } from "../models/drag-drop.js";
import { Project, ProjectStatus } from "../models/project.js";
import { autobind } from "../decorators/autobind.js";
import { projState } from "../state/project-state.js";


export class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget{
  
  assignedProjects: Project[];

  constructor(private type: 'active' | 'finished') {
    super('project-list', 'app', false,`${type}-projects`);
    
    this.assignedProjects = [];

    this.configure();
    this.renderContent();
  }

  @autobind
  dragOverHandler(event: DragEvent) {
    if(event.dataTransfer && event.dataTransfer.types[0] === 'text/plain'){
      event.preventDefault();
      const listEl = this.element.querySelector('ul')!;
      listEl.classList.add('droppable');
    } 
    
  }

  @autobind
  dropHandler(event: DragEvent) {
    const prjId = event.dataTransfer!.getData('text/plain');
    projState.moveProject(prjId, this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished)
  }

  @autobind
  dragLeaveHandler(_: DragEvent) {
    const listEl = this.element.querySelector('ul')!;
    listEl.classList.remove('droppable');
  }

  configure(){
    this.element.addEventListener('dragover', this.dragOverHandler);
    this.element.addEventListener('drop', this.dropHandler);
    this.element.addEventListener('dragleave', this.dragLeaveHandler);

    projState.addListener((projects: Project[]) => {
      const relevantProjects = projects.filter(pj => {
        if(this.type === 'active') {
          return pj.status === ProjectStatus.Active;
        }
        return pj.status === ProjectStatus.Finished;
      });
      this.assignedProjects = relevantProjects;
      this.renderProjects();
     })
  }

  private renderProjects(){
    const ListEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
    ListEl.innerHTML = '';
    for (const projItem of this.assignedProjects) {
      new ProjectItem(this.element.querySelector('ul')!.id, projItem);
    }
  }

  renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector('ul')!.id = listId;
    this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + " PROJECTS"; 
  }

}