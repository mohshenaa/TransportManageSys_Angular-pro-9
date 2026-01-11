import { Injectable } from '@angular/core';
import { NgForm, NgModel, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ValidationHelper {
  getMessages(errs: ValidationErrors | null, name: string): string[] {
    let messages: string[] = [];
    if (!errs) return messages;

    for (let errorName in errs) {
      switch (errorName) {
        case 'required':
          messages.push(`You must enter a ${name}`);
          break;
        case 'minlength':
          messages.push(`${name} must be at least ${errs['minlength'].requiredLength} characters`);
          break;
        case 'maxlength':
          messages.push(`${name} must be at most ${errs['maxlength'].requiredLength} characters`);
          break;
        case 'pattern':
          messages.push(`The ${name} contains illegal characters`);
          break;
        case 'email':
          messages.push(`Please enter a valid ${name}`);
          break;
        case 'mismatch':
          messages.push(`${name} do not match`);
          break;
        case 'min':
          messages.push(`${name} must be at least ${errs['min'].min}`);
          break;
        case 'max':
          messages.push(`${name} must be at most ${errs['max'].max}`);
          break;
      }
    }
    return messages;
  }

  getValidationMessages(state: NgModel, label?: string, thingName?: string) {
    let thing: string = state.path?.[0] ?? thingName ?? '';
    label = label ?? thing;
    return this.getMessages(state.errors, label);
  }

  getFormValidationMessages(form: NgForm): string[] {
    let messages: string[] = [];
    Object.keys(form.controls).forEach((k) => {
      this.getMessages(form.controls[k].errors, k).forEach((m) => messages.push(m));
    });
    return messages;
  }
}
