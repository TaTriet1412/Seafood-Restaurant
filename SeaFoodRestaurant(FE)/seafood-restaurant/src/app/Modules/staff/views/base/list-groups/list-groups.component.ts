import { Component } from '@angular/core';
import { UntypedFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { DocsExampleComponent } from '@docs-components/public-api';
import { RowComponent, ColComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent, ListGroupDirective, ListGroupItemDirective, BadgeComponent, FormDirective, FormCheckComponent, FormCheckInputDirective, FormCheckLabelDirective, ButtonDirective } from '@coreui/angular';

@Component({
  selector: 'app-list-groups',
  templateUrl: './list-groups.component.html',
  styleUrls: ['./list-groups.component.scss'],
  imports: [RowComponent, ColComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent, DocsExampleComponent, ListGroupDirective, ListGroupItemDirective, BadgeComponent, ReactiveFormsModule, FormDirective, FormCheckComponent, FormCheckInputDirective, FormCheckLabelDirective, ButtonDirective]
})
export class ListGroupsComponent {

  readonly breakpoints: (string | boolean)[] = [true, 'sm', 'md', 'lg', 'xl', 'xxl'];
  readonly colors: string[] = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'];

  readonly sampleList: string[] = [
    'Cras justo odio',
    'Dapibus ac facilisis in',
    'Morbi leo risus',
    'Porta ac consectetur ac',
    'Vestibulum at eros'
  ];

  checkBoxes: any; // Declare the form group without initialization

  constructor(
    private formBuilder: UntypedFormBuilder
  ) {
    // Initialize the form group inside the constructor
    this.checkBoxes = this.formBuilder.group({
      one: false,
      two: false,
      three: true,
      four: true,
      five: { value: false, disabled: true }
    });
  }

  setValue(controlName: string) {
    const prevValue = this.checkBoxes.get(controlName)?.value;
    const value = this.checkBoxes.getRawValue();
    value[controlName] = !prevValue;
    this.checkBoxes.setValue(value);
  }

  logValue() {
    console.log(this.checkBoxes.value);
    this.checkBoxes.reset();
  }

  getValue(controlName: string) {
    return this.checkBoxes.get(controlName);
  }
}