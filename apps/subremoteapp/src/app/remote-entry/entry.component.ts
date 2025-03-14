import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NxWelcomeComponent } from './nx-welcome.component';

@Component({
  imports: [CommonModule],
  selector: 'srapp-subremoteapp-entry',
  template: `welcome from subremoteapp`,
})
export class RemoteEntryComponent {}
