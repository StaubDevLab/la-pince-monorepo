# 5.4 Tests

Une stratégie de tests complète est mise en place pour garantir la robustesse et la non-régression du projet « la-pince », organisé en monorepo avec un front-end Next.js et un back-end NestJS.

## Périmètre et outils

- **Front-end (apps/la-pince-front)**
  - **Tests unitaires**: Vitest (environnement node), coverage via @vitest/coverage-v8
  - **Tests E2E**: Cypress (baseUrl = `http://la-pince`)
- **Back-end (apps/la-pince-back)**
  - **Tests unitaires**: Jest + ts-jest
  - **Tests d’intégration/E2E API**: Jest + Supertest (config `test/jest-e2e.json`)
- **Orchestration**: Turborepo (scripts racine `npm run test`, `npm run test:front`, `npm run test:back`)
- **Environnements d’exécution**: Docker Compose (PostgreSQL, Valkey, Mailhog, backend, frontend, Nginx)

## Stratégie de tests

- **Tests Unitaires**
  - **Front (Vitest)**: couvrent la logique isolée (ex. actions/utilitaires). Mocks via `vi.fn()` et `vi.mock()` pour les dépendances (fetch, modules).
  - **Back (Jest)**: couvrent services, guards, pipes, utilitaires NestJS. Mocks avec Jest (`jest.fn()`, `jest.mock()`), et doubles pour les dépendances (clients externes, mailer, cache).
- **Tests d’Intégration (API)**
  - **Back**: démarrent un module Nest Testing, vérifient le chaînage contrôleur → service → couche d’accès aux données (Drizzle). Utilisation de Supertest pour les routes HTTP. Selon les besoins, base de données isolée dédiée aux tests.
- **Tests E2E (Front)**
  - **Cypress**: simule les parcours utilisateurs clés dans un navigateur réel, en s’appuyant sur l’URL `http://la-pince` (Nginx) et le backend démarré.

## Objectifs par type de test

- **Unitaires**: valider chaque fonction/méthode de manière isolée avec mocks sur les dépendances (DB, services externes, HTTP).
- **Intégration**: s’assurer que pipes, guards, decorators NestJS et la persistance fonctionnent correctement ensemble sur les endpoints cibles.
- **E2E**: valider les scénarios bout-en-bout (authentification, parcours transaction/budget, affichage des tableaux et graphiques) dans un contexte proche de la production.

## Couverture et seuils

- **Front (Vitest)**: couverture V8, rapports `text`, `html`, `lcov`, seuils (par défaut du repo) ~ 70–80% sur lignes/fonctions/branches/états.
- **Back (Jest)**: couverture V8, rapports `text`, `lcov`, `json-summary`, seuils globaux 70% (cf. `apps/la-pince-back/jest.json`).

## Données de test et stratégies de mocks

- **Fixtures réalistes**
  - **Back**: scripts `generate`, `migrate`, `seed` (Drizzle) disponibles pour préparer une base de test réaliste. À utiliser avant des suites d’intégration/E2E API.
  - **Front E2E**: Cypress peut s’exécuter contre l’environnement dockerisé (Nginx + backend + DB peuplée) pour refléter des scénarios proches de la prod.
- **Mocks stratégiques**
  - **Front (unitaires)**: `vi.mock()` pour intercepter fetch/clients, et `cy.intercept()` côté Cypress pour les E2E nécessitant des réponses déterministes.
  - **Back**: mocks Jest des services tiers (mailer, clients HTTP), stubs pour cache/queues si nécessaire. L’usage de bibliothèques type `nock` est possible, mais non requis actuellement dans le repo.
- **Isolation DB**
  - Pour l’intégration/E2E API, privilégier une base dédiée aux tests. Suivant les besoins, appliquer un rollback transactionnel par test ou un truncate/snapshot entre tests. Les seeds peuvent être rejoués au setup de la suite.

## Commandes utiles

- **Racine monorepo**
  - `npm run test` — exécute les tests via Turborepo
  - `npm run test:front` — tests Vitest (front)
  - `npm run test:back` — tests Jest (back)
- **Front (apps/la-pince-front)**
  - `npm run test` — Vitest (watch)
  - `npm run test:cov` — Vitest coverage
  - `npm run cy:open` — Cypress en mode interactif
  - `npm run cy:run` — Cypress headless
- **Back (apps/la-pince-back)**
  - `npm run test` — Jest unitaire (config `jest.json`)
  - `npm run test:e2e` — Jest E2E API (config `test/jest-e2e.json`)
  - `npm run generate` / `npm run migrate` / `npm run seed` — gestion DB Drizzle

## Exemples et captures d’écran

- [À insérer] **Exemple de test unitaire du service Budget (Back, Jest)**
- [À insérer] **Exemple de test d’intégration du controller Transaction (Back, Jest + Supertest)**
- [À insérer] **Exemple de test E2E Front (Cypress)**

Astuce: pour Cypress, préférer des tests idempotents (données préparées via seeds), ou isoler par utilisateur/scénario. Ajouter des `data-testid` stables au DOM si nécessaire.

---

# Plan de test E2E (Front)

## Pré-requis

- Stack dockerisée démarrée (`docker compose up -d`) pour Nginx, backend, DB, front.
- Base de test peuplée via `apps/la-pince-back` (`npm run migrate`, `npm run seed`).
- Cypress configuré (`apps/la-pince-front/cypress.config.ts` – baseUrl `http://la-pince`).

## Scénarios prioritaires

- **Authentification**
  - Affichage du formulaire de connexion.
  - Connexion avec identifiants valides → redirection tableau de bord.
  - Erreur affichée pour identifiants invalides.
  - Déconnexion et redirection vers la page de login.

- **Tableau de bord / Accueil**
  - Chargement des widgets principaux (solde, graphiques, listes récentes).
  - États de chargement et d’erreur visibles si API indisponible.

- **Comptes**
  - Affichage de la liste des comptes.
  - Création d’un compte (validation champs, messages d’erreur).
  - Édition et suppression d’un compte.

- **Transactions**
  - Liste paginée/filtrée (période, catégorie, compte).
  - Création d’une transaction (vérifier mise à jour du solde et de la liste).
  - Édition et suppression.
  - Gestion des erreurs (validation serveur, 4xx/5xx).

- **Budgets**
  - Création d’un budget (catégorie/période/limite).
  - Dépenses imputées et calcul du reste à dépenser.
  - Alerte sur dépassement de budget.

- **Recherche/Filtrage global**
  - Recherche par mot-clé et filtres combinés.

- **Accessibilité et navigation**
  - Focus management (modales, menus, tabs).
  - Navigation clavier de bout en bout.

## Données et états à couvrir

- Utilisateur sans données (états vides)
- Utilisateur avec données réalistes (ex. 3 comptes, ~120 transactions sur 3 mois)
- Cas limites: montants élevés, dates frontières, catégories inconnues

## Critères d’acceptation transverses

- Stabilité visuelle (sélecteurs robustes, `data-testid` quand nécessaire)
- Idempotence des scénarios (reset/seeds avant chaque suite)
- Temps d’exécution raisonnable (parcours critique < 2–3 min)

## Observabilité

- Logs de test (Cypress screenshots/vidéos: vidéos désactivées par défaut; activer au besoin)
- Rapports de couverture (Vitest/Jest) publiables en CI

---

# Plan de test API (Back)

## Pré-requis

- Base de test isolée (env de test), migrations et seeds appliqués.
- Démarrage de l’app en mode test ou module Nest Testing.

## Scénarios d’intégration

- **Auth**: inscription, login, refresh token, accès contrôlé par guards.
- **Transactions**: CRUD complet, validation DTO, erreurs, filtrage/pagination.
- **Budgets**: création, mise à jour, calculs agrégés, limites/dépassements.
- **Comptes**: CRUD et agrégations (solde).
- **Courriels**: envoi (mock mailer), mise en file si applicable.

## Isolation et nettoyage

- Stratégie recommandée: transaction par test avec rollback, ou truncate entre tests + reseed.
- Fixtures générées par `seed` pour scénarios réalistes.

---

## Intégration CI (suggestion)

- Jobs séparés: `test:back`, `test:front`, `cy:run` (avec services Docker) et publication des rapports de couverture.
- Cache Turborepo pour accélérer.
