"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_postgres_1 = require("drizzle-orm/node-postgres");
const categories_seeder_1 = require("./seeders/categories.seeder");
const db = (0, node_postgres_1.drizzle)(process.env.DATABASE_URL ?? "");
async function seed() {
    console.log('\x1b[1m\x1b[32mStart seeding...\x1b[0m');
    await (0, categories_seeder_1.seedCategories)(db);
    console.log('\x1b[1m\x1b[32mSeed completed\x1b[0m');
}
seed().catch((error) => {
    console.error('\x1b[1m\x1b[31m[Seed]\x1b[0m Error seeding:', error);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map