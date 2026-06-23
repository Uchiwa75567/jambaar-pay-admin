# Résumé de projet — Dashboard Admin Angular

Bref descriptif

- Titre : Dashboard d'administration pour gestion d'entreprises et restaurants
- Nature : Application web front-end d'administration (dashboard)
- Rôle suggéré (à adapter) : Développeur Front‑End / Intégrateur Angular

Stacks & technologies

- Framework : Angular (TypeScript)
- Langages : TypeScript, HTML5, SCSS
- Architecture : composants Angular, services, guards, interceptors
- Gestion réseau : HttpClient, JWT authentication via interceptors
- Outils & runtime : Node.js, npm, Angular CLI
- Déploiement : configuration Vercel (fichier `vercel.json` présent)

Fonctionnalités clés

- Authentification JWT avec `auth.service`, `jwt.interceptor`, `auth.guard`
- Dashboard principal avec KPIs (`kpi-card`) et visualisation des données
- Gestion des entités : entreprises (`companies`), restaurants (`restaurants`)
- Modules : monitoring, audit, settings
- Composants réutilisables : confirm-dialog, status-badge
- Pipes utilitaires : format date et conversion en FCFA

Aspects techniques/architecture

- Code organisé en `features`, `core` et `shared` pour modularité
- Intercepteurs pour gestion centralisée des erreurs et tokens
- Services pour séparation des règles métier et appels API
- SCSS global et variables partagées pour theming et cohérence UI

Comment l'exécuter (local)

1. Installer dépendances : `npm install`
2. Lancer le serveur de dev : `npm start` ou `ng serve`
3. Accéder à l'app : `http://localhost:4200`

Points prêts pour CV (phrases courtes)

- Développé une interface d'administration en Angular (TypeScript, SCSS) pour la gestion d'entreprises et restaurants.
- Implémenté l'authentification JWT, intercepteurs HTTP et garde d'accès (`auth.guard`) pour sécuriser l'application.
- Conçu des composants réutilisables (KPI cards, dialogues de confirmation, badges de statut) pour accélérer le développement.
- Structuré l'application en modules feature/core/shared pour une maintenabilité et scalabilité maximales.
- Préparé la configuration de déploiement (Vercel) et scripts de build.

Personnalise ces éléments selon ton rôle exact (lead/dev/integrator) et ajoute des métriques (ex : temps de développement, nombre d'écrans) si disponibles.
