import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NxWelcomeComponent } from './nx-welcome.component';

@Component({
  imports: [CommonModule, NxWelcomeComponent],
  selector: 'srapp-subremoteapp-entry',
  template: `<srapp-nx-welcome></srapp-nx-welcome>`,
})
export class RemoteEntryComponent {}
