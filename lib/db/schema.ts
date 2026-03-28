import { pgTable, serial, text, integer, timestamp, decimal, varchar, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const landlords = pgTable("landlords", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: varchar("phone", { length: 20 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  landlordId: integer("landlord_id").references(() => landlords.id).notNull(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const tenants = pgTable("tenants", {
  id: serial("id").primaryKey(),
  landlordId: integer("landlord_id").references(() => landlords.id).notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  riskScore: integer("risk_score").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const leases = pgTable("leases", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").references(() => properties.id).notNull(),
  tenantId: integer("tenant_id").references(() => tenants.id).notNull(),
  rentAmount: decimal("rent_amount", { precision: 10, scale: 2 }).notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  leaseId: integer("lease_id").references(() => leases.id).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  dueDate: timestamp("due_date").notNull(),
  paidAt: timestamp("paid_at"),
  status: varchar("status", { length: 20 }).default("pending"), // pending, paid, late
  createdAt: timestamp("created_at").defaultNow(),
});

export const riskAlerts = pgTable("risk_alerts", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").references(() => tenants.id).notNull(),
  type: text("type").notNull(), // late_payment, multiple_delays, etc.
  severity: varchar("severity", { length: 10 }).notNull(), // low, medium, high
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const reminders = pgTable("reminders", {
  id: serial("id").primaryKey(),
  leaseId: integer("lease_id").references(() => leases.id).notNull(),
  type: varchar("type", { length: 10 }).notNull(), // email, sms
  status: varchar("status", { length: 20 }).default("pending"), // pending, sent, failed
  scheduledAt: timestamp("scheduled_at").notNull(),
  sentAt: timestamp("sent_at"),
});

// Relations
export const landlordRelations = relations(landlords, ({ many }) => ({
  properties: many(properties),
  tenants: many(tenants),
}));

export const propertyRelations = relations(properties, ({ one, many }) => ({
  landlord: one(landlords, { fields: [properties.landlordId], references: [landlords.id] }),
  leases: many(leases),
}));

export const tenantRelations = relations(tenants, ({ one, many }) => ({
  landlord: one(landlords, { fields: [tenants.landlordId], references: [landlords.id] }),
  leases: many(leases),
  riskAlerts: many(riskAlerts),
}));

export const leaseRelations = relations(leases, ({ one, many }) => ({
  property: one(properties, { fields: [leases.propertyId], references: [properties.id] }),
  tenant: one(tenants, { fields: [leases.tenantId], references: [tenants.id] }),
  payments: many(payments),
  reminders: many(reminders),
}));

export const paymentRelations = relations(payments, ({ one }) => ({
  lease: one(leases, { fields: [payments.leaseId], references: [leases.id] }),
}));

export const riskAlertRelations = relations(riskAlerts, ({ one }) => ({
  tenant: one(tenants, { fields: [riskAlerts.tenantId], references: [tenants.id] }),
}));

export const reminderRelations = relations(reminders, ({ one }) => ({
  lease: one(leases, { fields: [reminders.leaseId], references: [leases.id] }),
}));
