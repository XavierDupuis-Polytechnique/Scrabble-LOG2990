import { Directive, HostListener, Input } from '@angular/core';
import { UIInputControllerService } from '@app/GameLogic/actions/uiactions/ui-input-controller.service';
import { InputComponent } from '@app/GameLogic/interface/ui-input';

@Directive({
  selector: '[appClickAndClickout]'
})
export class ClickAndClickoutDirective {

  constructor(private inputController: UIInputControllerService) {}

  private wasInside = false;

  @Input() inputComponent: InputComponent;

  @HostListener('click')
  clickInside() {
    // console.log("clicked inside", this.inputComponent);
    this.wasInside = true;
  }

  @HostListener('document:click')
  clickout() {
    if (!this.wasInside) {
      if (this.inputController.activeComponent === this.inputComponent) {
        this.inputController.activeComponent = InputComponent.Outside
        // console.log("CURRENT WAS", this.inputComponent);
      }
    }
    this.wasInside = false;
    // console.log("CURRENT : ", this.inputController.activeComponent);
  }
}
