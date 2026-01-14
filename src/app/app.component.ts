import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/shared/header/header.component';  // ← adjust path if needed

@Component({
  selector: 'app-root',
  standalone: true,                  
  imports: [
    RouterOutlet,
    HeaderComponent,                     // ← import  header here
    // FooterComponent,                  // add later if needed
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'cert-prep';
}