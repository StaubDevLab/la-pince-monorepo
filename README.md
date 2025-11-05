# La Pince — Guide d’utilisation

Ce document décrit, étape par étape, comment lancer et utiliser l’application en local avec Docker, ainsi que les alternatives en mode développement.

## Prérequis

- Docker Desktop et Docker Compose
- Node.js 20+ et npm (pour scripts utilitaires et mode dev)
- macOS: accès admin pour modifier `/etc/hosts`

## 1) Configuration des hôtes locaux (/etc/hosts)

L’environnement Nginx expose les services via des noms d’hôtes. Ajoutez les entrées suivantes à votre `/etc/hosts`:

```
127.0.0.1   la-pince
127.0.0.1   la-pince-api
127.0.0.1   la-pince-adminer
```

Sur macOS:
- Ouvrez un terminal
- Exécutez: `sudo nano /etc/hosts`
- Ajoutez les lignes ci-dessus, enregistrez, puis quittez

Note: Nginx redirige le port 80 vers 443 (HTTPS). Un certificat auto-signé est fourni dans `nginx/certs`. Vous pouvez avoir à accepter le certificat dans votre navigateur, ou l’ajouter au trousseau (Keychain Access) comme « Always Trust » pour éviter les avertissements.

## 2) Variables d’environnement

Le fichier `compose.yml` lit un fichier `.env` à la racine. Assurez-vous qu’il existe et contient les variables nécessaires au backend et à la base.

Exemple minimal (à adapter selon votre configuration):

```
# Base Postgres (doit correspondre à compose.yml)
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_DB=projet_la_pince_db

# Exemple côté application
# DATABASE_URL=postgres://postgres:password@la-pince-db:5432/projet_la_pince_db
# JWT_SECRET=changeme
# NODE_ENV=development
```

Si un fichier `.env.example` est disponible, copiez-le: `cp .env.example .env` puis adaptez.

## 3) Démarrer l’environnement Docker

Depuis la racine du projet:

```
docker compose up -d --build
```

Ce qui lance:
- Postgres (la-pince-db)
- Valkey (la-pince-cache)
- MailHog (mail)
- Backend NestJS (la-pince-backend)
- Frontend Next.js (la-pince-front)
- Nginx (reverse proxy + TLS)
- Adminer (UI DB)

Vous pouvez vérifier l’état: `docker compose ps`

## 4) Initialiser la base de données (migrations + seeds)

Toujours depuis la racine:

```
npm run migrate:back
npm run seed:back
```

Ces scripts s’appuient sur Drizzle pour appliquer les migrations et insérer des données de démonstration.

## 5) Accéder à l’application

- Application (Front): https://la-pince
- API (Back): https://la-pince-api
- Adminer (DB UI): https://la-pince-adminer

Si votre navigateur affiche un avertissement de sécurité, acceptez le certificat auto-signé ou faites-le « Always Trust » sur macOS (Trousseau d’accès).

## 6) Commandes utiles

- Logs en direct d’un service:
  - `docker compose logs -f la-pince-backend`
  - `docker compose logs -f la-pince-front`
  - `docker compose logs -f la-pince-db`
- Redémarrer un service: `docker compose restart la-pince-backend`
- Arrêter tout: `docker compose down`

## 7) Mode développement (alternative)

Vous pouvez exécuter les services de données via Docker et lancer front/back en local.

- Lancer uniquement DB/Cache/Mail/Nginx (optionnel):

```
docker compose up -d la-pince-db la-pince-cache mail nginx
```

- Lancer les apps en dev (watch) depuis la racine:

```
npm run dev
```

Scripts disponibles (racine):
- `npm run dev`: lance front (Next.js) + back (NestJS) en parallèle
- `npm run start:dev:back`: lance uniquement le back en watch
- `npm run dev:front`: lance uniquement le front

## 8) Tests

Depuis la racine:

- Back (Jest):
  - `npm run test:back`
  - `npm run test:e2e:back`
  - `npm run test:cov:back`
- Front (Vitest/Cypress):
  - `npm run test:front`
  - `npm run test:cov:front`
  - `npm --workspace apps/la-pince-front run cy:open`
  - `npm --workspace apps/la-pince-front run cy:run`

Cypress est configuré avec `baseUrl: http://la-pince` (Nginx effectue une redirection vers HTTPS, ce qui est géré par Cypress). Assurez-vous que les services Docker sont actifs.

## 9) Dépannage

- Certificat non fiable: ajoutez les certificats `nginx/certs/la-pince.crt` au Trousseau (macOS) et marquez comme toujours approuvé.
- Ports occupés: vérifiez l’absence de services locaux sur 80, 443, 3000, 3333, 5432, 6379, 8080.
- DNS local: confirmez la présence des entrées `/etc/hosts`.
- Variables d’env: vérifiez `.env` à la racine pour la base et l’app.
- Santé Postgres/Valkey: `docker compose logs -f la-pince-db` / `la-pince-cache` (healthchecks inclus).

## 10) Structure du monorepo

- `apps/la-pince-front`: Frontend Next.js
- `apps/la-pince-back`: Backend NestJS + Drizzle ORM
- `nginx/`: configuration Nginx + certificats
- `compose.yml`: orchestration Docker Compose
- `docs/tests.md`: stratégie et plan de test

---

Tout est prêt. Après avoir ajouté les entrées `/etc/hosts`, lancé `docker compose up -d --build` et exécuté `npm run migrate:back && npm run seed:back`, accédez à l’application sur https://la-pince.
