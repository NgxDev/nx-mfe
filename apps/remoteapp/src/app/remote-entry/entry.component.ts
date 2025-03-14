import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NxWelcomeComponent } from './nx-welcome.component';
import { RouterModule } from '@angular/router';

@Component({
  imports: [CommonModule, RouterModule, NxWelcomeComponent],
  selector: 'rapp-remoteapp-entry',
  template: `
    <hr />
    <strong>Remote App Nav:</strong>&nbsp; <a routerLink=".">Remote App</a> |
    <a routerLink="subremoteapp">SubRemote Aapp</a>
    <hr />
    <router-outlet></router-outlet>
    <rapp-nx-welcome></rapp-nx-welcome>
  `,
})
export class RemoteEntryComponent {}
