import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DocsExampleComponent } from '@docs-components/public-api';
import { RowComponent, ColComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent, ButtonGroupComponent, ButtonDirective, FormCheckLabelDirective, ButtonToolbarComponent, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ThemeDirective, DropdownComponent, DropdownToggleDirective, DropdownMenuDirective, DropdownItemDirective, DropdownDividerDirective } from '@coreui/angular';

@Component({
  selector: 'app-button-groups',
  templateUrl: './button-groups.component.html',
  styleUrls: ['./button-groups.component.scss'],
  imports: [RowComponent, ColComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent, DocsExampleComponent, ButtonGroupComponent, ButtonDirective, RouterLink, ReactiveFormsModule, FormCheckLabelDirective, ButtonToolbarComponent, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ThemeDirective, DropdownComponent, DropdownToggleDirective, DropdownMenuDirective, DropdownItemDirective, DropdownDividerDirective]
})
export class ButtonGroupsComponent {

  formCheck1: UntypedFormGroup; // Declare the form group without initialization
  formRadio1: UntypedFormGroup; // Declare the form group without initialization

  constructor(
    private formBuilder: UntypedFormBuilder
  ) {
    // Initialize the form groups inside the constructor
    this.formCheck1 = this.formBuilder.group({
      checkbox1: false,
      checkbox2: false,
      checkbox3: false
    });

    this.formRadio1 = new UntypedFormGroup({
      radio1: new UntypedFormControl('Radio1')
    });
  }

  setCheckBoxValue(controlName: string) {
    const prevValue = this.formCheck1.get(controlName)?.value;
    const value = this.formCheck1.value;
    value[controlName] = !prevValue;
    this.formCheck1.setValue(value);
  }

  setRadioValue(value: string): void {
    this.formRadio1.setValue({ radio1: value });
  }
}