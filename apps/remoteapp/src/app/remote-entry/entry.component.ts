import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NxWelcomeComponent } from './nx-welcome.component';

@Component({
  imports: [CommonModule, NxWelcomeComponent],
  selector: 'rapp-remoteapp-entry',
  template: `<rapp-nx-welcome></rapp-nx-welcome>`,
})
export class RemoteEntryComponent {}
