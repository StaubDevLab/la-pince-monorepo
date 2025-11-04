"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notifications = exports.notificationLevels = exports.notificationTypes = exports.budgets = exports.categories = exports.transactionRecurringInfo = exports.transactions = exports.userAccounts = exports.currencys = exports.sessions = exports.sessionTypes = exports.users = exports.locales = exports.accountTypes = exports.rawFrequency = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
const locale_1 = require("./constants/locale");
const currency_1 = require("./constants/currency");
exports.rawFrequency = (0, pg_core_1.pgEnum)('raw_frequency', ['weekly', 'biweekly', 'monthly', 'quarterly', 'yearly']);
exports.accountTypes = (0, pg_core_1.pgEnum)('account_type', ['in-app', 'google']);
exports.locales = (0, pg_core_1.pgEnum)('locale', locale_1.locales);
exports.users = (0, pg_core_1.pgTable)('users', {
    id: (0, pg_core_1.uuid)('id').primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    firstName: (0, pg_core_1.varchar)('first_name', { length: 64 }).notNull(),
    lastName: (0, pg_core_1.varchar)('last_name', { length: 64 }).notNull(),
    email: (0, pg_core_1.varchar)('email', { length: 255 }).notNull().unique(),
    password: (0, pg_core_1.varchar)('password', { length: 255 }).notNull(),
    accountType: (0, exports.accountTypes)('account_type').default('in-app').notNull(),
    avatar: (0, pg_core_1.varchar)('avatar', { length: 255 }).default('https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y').notNull(),
    locale: (0, exports.locales)('locale').default('fr-FR').notNull(),
    firstLogin: (0, pg_core_1.boolean)('first_login').notNull().default(true),
    verifiedEmail: (0, pg_core_1.boolean)('verified_email').notNull().default(false),
    createdAt: (0, pg_core_1.timestamp)('created_at').default((0, drizzle_orm_1.sql) `now()`).notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').default((0, drizzle_orm_1.sql) `now()`).notNull(),
}, (t) => ({
    emailIdx: (0, pg_core_1.uniqueIndex)('email_idx').on(t.email),
}));
exports.sessionTypes = (0, pg_core_1.pgEnum)('session_connexion_type', ['in-app', 'google']);
exports.sessions = (0, pg_core_1.pgTable)('sessions', {
    id: (0, pg_core_1.uuid)('id').primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    tokenHash: (0, pg_core_1.varchar)('token_hash', { length: 255 }).notNull(),
    userId: (0, pg_core_1.uuid)('user_id').references(() => exports.users.id).notNull(),
    expiresAt: (0, pg_core_1.timestamp)('expires_at').notNull(),
    isRevoked: (0, pg_core_1.boolean)('is_revoked').notNull().default(false),
    sessionType: (0, exports.sessionTypes)('session_type').default('in-app').notNull(),
    ipAddress: (0, pg_core_1.varchar)('ip_address', { length: 255 }),
    userAgent: (0, pg_core_1.varchar)('user_agent', { length: 255 }),
    createdAt: (0, pg_core_1.timestamp)('created_at').default((0, drizzle_orm_1.sql) `now()`).notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').default((0, drizzle_orm_1.sql) `now()`).notNull(),
}, (t) => ({
    tokenHashIdx: (0, pg_core_1.uniqueIndex)('token_hash_idx').on(t.tokenHash),
    userIdIdx: (0, pg_core_1.index)('session_user_id_idx').on(t.userId),
}));
exports.currencys = (0, pg_core_1.pgEnum)('currency', currency_1.currencys);
exports.userAccounts = (0, pg_core_1.pgTable)('user_accounts', {
    id: (0, pg_core_1.uuid)('id').primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.uuid)('user_id').references(() => exports.users.id).notNull(),
    accountName: (0, pg_core_1.varchar)('account_name', { length: 64 }).notNull(),
    amount: (0, pg_core_1.real)('amount').notNull(),
    currency: (0, exports.currencys)('currency').default('EUR').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').default((0, drizzle_orm_1.sql) `now()`).notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').default((0, drizzle_orm_1.sql) `now()`).notNull(),
}, (t) => ({
    userIdIdx: (0, pg_core_1.index)('user_account_user_id_idx').on(t.userId),
}));
exports.transactions = (0, pg_core_1.pgTable)('transactions', {
    id: (0, pg_core_1.uuid)('id').primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userAccountId: (0, pg_core_1.uuid)('user_account_id').references(() => exports.userAccounts.id).notNull(),
    amount: (0, pg_core_1.real)('amount').notNull(),
    transactionType: (0, pg_core_1.integer)('transaction_type').default(2).notNull(),
    date: (0, pg_core_1.timestamp)('date').notNull(),
    description: (0, pg_core_1.text)('description'),
    categoryId: (0, pg_core_1.uuid)('category_id').references(() => exports.categories.id).notNull(),
    isRecurring: (0, pg_core_1.boolean)('is_recurring').notNull().default(false),
    recurringFrequency: (0, exports.rawFrequency)('recurring_frequency').default('monthly'),
    recurringStartDate: (0, pg_core_1.timestamp)('recurring_start_date'),
    recurringEndDate: (0, pg_core_1.timestamp)('recurring_end_date'),
    recurringParentId: (0, pg_core_1.uuid)('recurring_parent_id'),
    metadata: (0, pg_core_1.json)('metadata').$type().default({}).notNull(),
    isDeleted: (0, pg_core_1.boolean)('is_deleted').notNull().default(false),
    isOrphaned: (0, pg_core_1.boolean)('is_orphaned').notNull().default(false),
    createdAt: (0, pg_core_1.timestamp)('created_at').default((0, drizzle_orm_1.sql) `now()`).notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').default((0, drizzle_orm_1.sql) `now()`).notNull(),
}, (t) => ({
    userAccountIdIdx: (0, pg_core_1.index)('transaction_user_account_id_idx').on(t.userAccountId),
    categoryIdIdx: (0, pg_core_1.index)('transaction_category_id_idx').on(t.categoryId),
    parentReference: (0, pg_core_1.foreignKey)({
        columns: [t.recurringParentId],
        foreignColumns: [t.id],
        name: 'transaction_recurring_parent_fk',
    })
}));
exports.transactionRecurringInfo = (0, pg_core_1.pgTable)('transaction_recurring_info', {
    id: (0, pg_core_1.uuid)('id').primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    transactionParentId: (0, pg_core_1.uuid)('transaction_parent_id').references(() => exports.transactions.id).notNull(),
    lastTransactionDate: (0, pg_core_1.timestamp)('last_transaction_date').notNull(),
    lastTransactionId: (0, pg_core_1.uuid)('last_transaction_id').references(() => exports.transactions.id).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').default((0, drizzle_orm_1.sql) `now()`).notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').default((0, drizzle_orm_1.sql) `now()`).notNull(),
}, (t) => ({
    transactionParentIdIdx: (0, pg_core_1.index)('transaction_recurring_info_transaction_parent_id_idx').on(t.transactionParentId),
    lastTransactionIdIdx: (0, pg_core_1.index)('transaction_recurring_info_last_transaction_id_idx').on(t.lastTransactionId),
}));
exports.categories = (0, pg_core_1.pgTable)('categories', {
    id: (0, pg_core_1.uuid)('id').primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    name: (0, pg_core_1.varchar)('name', { length: 64 }).notNull(),
    userId: (0, pg_core_1.uuid)('user_id').references(() => exports.users.id),
    color: (0, pg_core_1.varchar)('color', { length: 10 }),
    icon: (0, pg_core_1.varchar)('icon', { length: 64 }),
    isDefault: (0, pg_core_1.boolean)('is_default').notNull().default(false),
    isDeleted: (0, pg_core_1.boolean)('is_deleted').notNull().default(false),
    createdAt: (0, pg_core_1.timestamp)('created_at').default((0, drizzle_orm_1.sql) `now()`).notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').default((0, drizzle_orm_1.sql) `now()`).notNull(),
}, (t) => ({
    userIdIdx: (0, pg_core_1.index)('category_user_id_idx').on(t.userId),
}));
exports.budgets = (0, pg_core_1.pgTable)('budgets', {
    id: (0, pg_core_1.uuid)('id').primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.uuid)('user_id').references(() => exports.users.id).notNull(),
    categoryId: (0, pg_core_1.uuid)('category_id').references(() => exports.categories.id).notNull(),
    totalAmount: (0, pg_core_1.real)('total_amount').notNull(),
    actualAmount: (0, pg_core_1.real)('actual_amount').default(0).notNull(),
    recurringFrequency: (0, exports.rawFrequency)('recurring_frequency').notNull().default('monthly'),
    recurringStartDate: (0, pg_core_1.date)('recurring_start_date').default((0, drizzle_orm_1.sql) `now()`).notNull(),
    lastResetDate: (0, pg_core_1.date)('last_reset_date').default((0, drizzle_orm_1.sql) `now()`).notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').default((0, drizzle_orm_1.sql) `now()`).notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').default((0, drizzle_orm_1.sql) `now()`).notNull(),
}, (t) => ({
    userIdIdx: (0, pg_core_1.index)('budget_user_id_idx').on(t.userId),
    categoryIdIdx: (0, pg_core_1.index)('budget_category_id_idx').on(t.categoryId),
}));
exports.notificationTypes = (0, pg_core_1.pgEnum)('notification_type', ['transaction', 'budget', 'reminder']);
exports.notificationLevels = (0, pg_core_1.pgEnum)('notification_level', ['success', 'info', 'warning', 'error']);
exports.notifications = (0, pg_core_1.pgTable)('notifications', {
    id: (0, pg_core_1.uuid)('id').primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    userId: (0, pg_core_1.uuid)('user_id').references(() => exports.users.id).notNull(),
    type: (0, exports.notificationTypes)('type').notNull(),
    message: (0, pg_core_1.text)('message').notNull(),
    level: (0, exports.notificationLevels)('level').notNull().default('info'),
    isRead: (0, pg_core_1.boolean)('is_read').notNull().default(false),
    createdAt: (0, pg_core_1.timestamp)('created_at').default((0, drizzle_orm_1.sql) `now()`).notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').default((0, drizzle_orm_1.sql) `now()`).notNull(),
}, (t) => ({
    userIdIdx: (0, pg_core_1.index)('notification_user_id_idx').on(t.userId),
}));
//# sourceMappingURL=schema.js.map