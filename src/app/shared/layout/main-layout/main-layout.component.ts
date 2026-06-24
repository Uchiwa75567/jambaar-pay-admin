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
    '/enterprise-dashboard': { title: 'Dashboard Entreprise', subtitle: "Vue d'ensemble de votre espace entreprise" },
    '/enterprise-employees': { title: 'Gestion des salariés', subtitle: 'Gérer les salariés et leurs soldes' },
    '/enterprise-employees/add': { title: 'Ajouter un salarié', subtitle: 'Gérer les salariés et leurs soldes' },
    '/enterprise-history': { title: 'Historique des transaction', subtitle: 'Consultez toutes les transactions' },
    '/companies':       { title: 'Gestion des Entreprises',   subtitle: 'Gérer toutes les entreprises partenaires'        },
    '/companies/add':   { title: 'Gestion des Entreprises',   subtitle: 'Gérer toutes les entreprises partenaires'        },
    '/restaurants':     { title: 'Gestion des Restaurants',   subtitle: 'Gérer tous les restaurants partenaires'          },
    '/restaurants/add': { title: 'Gestion des Restaurants',   subtitle: 'Gérer tous les restaurants partenaires'          },
    '/monitoring':      { title: 'Monitoring des transaction', subtitle: 'Surveillez toutes les transactions en temps réel' },
    '/audit':           { title: "Journal d'Audit",           subtitle: "Consultez l'historique des actions système"      },
    '/settings':        { title: 'Parametre du système',      subtitle: 'Gérer toutes les entreprises partenaires'        },
  };

  constructor(private router: Router) {
    this.updatePageMeta(this.router.url);

    this.router.events
      .pipe(
        filter(e => e instanceof NavigationEnd),
        map(e => (e as NavigationEnd).urlAfterRedirects),
        takeUntilDestroyed(),
      )
      .subscribe(url => this.updatePageMeta(url));
  }

  private updatePageMeta(url: string): void {
    const path = url.split('?')[0];
    const meta = this.routeMeta[path];
    this.pageTitle = meta?.title ?? 'Jambaar Pay';
    this.pageSubtitle = meta?.subtitle ?? '';
  }
}
