import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  constructor(private authService:AuthService) { }

  ngOnInit(): void {
  }

  datosMenu= {
    'titulo': 'Tienda de ropa',
    'icon': 'fas fa-band-aid',
    'subtitulo':'Saber mas',
    'salir':'salir'
  }

  logout(){
    this.authService.logout()
  }
  
}
