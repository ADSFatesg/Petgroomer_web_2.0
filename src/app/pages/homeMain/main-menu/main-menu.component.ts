import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from "@angular/material/sidenav";

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrl: './main-menu.component.scss'
})
export class MainMenuComponent implements OnInit{
  @ViewChild('sidenav') sidenav!: MatSidenav;

  ngOnInit(): void {
    this.checkScreenSize();
  }

  // Método para fechar o sidenav ao clicar em um link
  closeSidenav(sidenav: MatSidenav): void {
    sidenav.close();
  }

  // Listener para redimensionamento da tela
  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.checkScreenSize();
  }

  // Verifica o tamanho da tela e fecha o sidenav em telas maiores
  private checkScreenSize(): void {
    if (window.innerWidth >= 768 && this.sidenav.opened) {
      this.sidenav.close();
    }
  }
}
