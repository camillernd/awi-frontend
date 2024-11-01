// src/app/app.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: '',  // On laisse vide pour que les routes définissent le contenu
  standalone: true,
})
export class AppComponent {
  title = 'temp-angular';  // Juste un titre par défaut pour référence
}
