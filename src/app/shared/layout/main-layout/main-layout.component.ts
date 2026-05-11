import { Component } from '@angular/core';
import { RouterOutlet, NavigationEnd, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter, map } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopbarComponent } from '../topbar/topbar.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, TopbarComponent],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent {
  pageTitle = 'Dashboard Global';
  pageSubtitle = "Vue d'ensemble de la plateforme Jambaar Pay";

  private readonly routeMeta: Record<string, { title: string; subtitle: string }> = {
    '/dashboard': { title: 'Dashboard Global', subtitle: "Vue d'ensemble de la plateforme Jambaar Pay" },
    '/companies': { title: 'Gestion des Entreprises', subtitle: 'Gérer toutes les entreprises partenaires' },
    '/restaurants': { title: 'Gestion des Restaurants', subtitle: 'Gérer tous les restaurants partenaires' },
    '/restaurants/add': { title: 'Gestion des Restaurants', subtitle: 'Gérer tous les restaurants partenaires' },
    '/monitoring': { title: 'Monitoring', subtitle: 'Suivi des performances de la plateforme' },
    '/audit': { title: "Journal d'Audit", subtitle: 'Historique des actions administrateurs' },
  };

  constructor(private router: Router) {
    this.router.events
      .pipe(
        filter(e => e instanceof NavigationEnd),
        map(e => (e as NavigationEnd).urlAfterRedirects),
        takeUntilDestroyed(),
      )
      .subscribe(url => {
        const meta = this.routeMeta[url];
        this.pageTitle = meta?.title ?? 'Jambaar Pay';
        this.pageSubtitle = meta?.subtitle ?? '';
      });
  }
}
