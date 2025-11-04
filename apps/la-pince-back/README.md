## Deployment

Build the app (if needed):
```bash
npm run build
```

Start all docker compose with production file :
```bash
docker-compose -f docker-compose.prod.yml up -d
```

Make migrations in backend container :
```bash
docker exec -it backend_container_id sh
npm run generate
npm run migrate
npm run seed
```

Enjoy !