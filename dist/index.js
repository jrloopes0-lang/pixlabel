var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index-prod.ts
import express4 from "express";
import path from "path";
import { fileURLToPath } from "url";
import { existsSync, statSync } from "fs";
import passport2 from "passport";

// server/middleware/session.ts
import session from "express-session";
import ConnectPgSimple from "connect-pg-simple";
import { Pool } from "@neondatabase/serverless";
function createSessionMiddleware() {
  if (!process.env.DATABASE_URL) {
    console.warn("\u26A0\uFE0F  DATABASE_URL n\xE3o configurada. Usando session em-mem\xF3ria (N\xC3O use em produ\xE7\xE3o)");
    return session({
      secret: process.env.SESSION_SECRET || "dev-secret-unsafe",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 1e3 * 60 * 60 * 24
        // 24 horas
      }
    });
  }
  const pgPool = new Pool({ connectionString: process.env.DATABASE_URL });
  const PostgresqlStore = ConnectPgSimple(session);
  return session({
    store: new PostgresqlStore({ pool: pgPool }),
    secret: process.env.SESSION_SECRET || "dev-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 1e3 * 60 * 60 * 24
    }
  });
}

// server/oauth/provider.ts
import { Strategy as OAuth2Strategy } from "passport-oauth2";
import { randomUUID } from "crypto";
var createOAuthStrategy = (authorizationURL, tokenURL, userInfoURL, clientID, clientSecret, callbackURL, providerName = "oauth") => {
  const strategy = new OAuth2Strategy(
    {
      authorizationURL,
      tokenURL,
      clientID,
      clientSecret,
      callbackURL,
      state: true
    },
    async (accessToken, refreshToken, _profile, done) => {
      try {
        if (!userInfoURL) {
          const user2 = {
            id: randomUUID(),
            email: `${randomUUID()}@${providerName}.oauth`,
            firstName: providerName,
            lastName: "User",
            role: "operator",
            externalProvider: providerName
          };
          return done(null, user2);
        }
        const userResponse = await fetch(userInfoURL, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        if (!userResponse.ok) {
          throw new Error("Failed to fetch user profile from provider");
        }
        const userData = await userResponse.json();
        const user = {
          id: userData.id || randomUUID(),
          email: userData.email || `${userData.username || userData.id}@${providerName}.oauth`,
          firstName: userData.displayName || userData.username || providerName,
          lastName: providerName,
          role: "operator",
          externalId: userData.id,
          externalProvider: providerName,
          accessToken,
          refreshToken
        };
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  );
  strategy.userProfile = async (accessToken, done) => {
    try {
      if (!userInfoURL) return done(null, {});
      const response = await fetch(userInfoURL, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (!response.ok) throw new Error("Failed to fetch user profile");
      const profile = await response.json();
      done(null, profile);
    } catch (err) {
      done(err);
    }
  };
  return strategy;
};

// server/middleware/security.ts
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
var corsMiddleware = express.json({ limit: "10mb" });
var helmetMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      // unsafe-eval needed for Vite HMR
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "ws:", "wss:"],
      // Allow WebSocket for Vite HMR
      fontSrc: ["'self'", "data:"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: process.env.NODE_ENV === "production" ? [] : null
    }
  },
  frameguard: { action: "deny" },
  xssFilter: true,
  noSniff: true,
  referrerPolicy: { policy: "strict-origin-when-cross-origin" }
});
var apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1e3,
  // 15 minutes
  max: 100,
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false
});
var loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1e3,
  max: 5,
  skipSuccessfulRequests: false,
  message: "Too many login attempts, please try again later.",
  standardHeaders: true,
  legacyHeaders: false
});
var oauthLimiter = rateLimit({
  windowMs: 5 * 60 * 1e3,
  max: 10,
  message: "Too many OAuth attempts, please try again later.",
  standardHeaders: true,
  legacyHeaders: false
});
var createLimiter = rateLimit({
  windowMs: 60 * 60 * 1e3,
  max: 10,
  message: "Too many items created, please try again later.",
  standardHeaders: true,
  legacyHeaders: false
});
var dispensationLimiter = rateLimit({
  windowMs: 60 * 60 * 1e3,
  max: 50,
  message: "Too many dispensations, please try again later.",
  standardHeaders: true,
  legacyHeaders: false
});
var requestIdMiddleware = (req, res, next) => {
  const requestId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  req.id = requestId;
  res.setHeader("X-Request-ID", requestId);
  next();
};
var securityHeadersMiddleware = (req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader(
    "Permissions-Policy",
    "geolocation=(), microphone=(), camera=(), payment=()"
  );
  next();
};
var sanitizationMiddleware = (req, res, next) => {
  const sanitize = (value) => {
    if (typeof value === "string") {
      return value.replace(/[<>]/g, "").replace(/javascript:/gi, "").trim();
    }
    if (typeof value === "object" && value !== null) {
      return Object.keys(value).reduce((acc, key) => {
        acc[key] = sanitize(value[key]);
        return acc;
      }, Array.isArray(value) ? [] : {});
    }
    return value;
  };
  if (req.body) {
    req.body = sanitize(req.body);
  }
  next();
};
var loggingMiddleware = (req, res, next) => {
  const start = Date.now();
  const requestId = req.id;
  res.on("finish", () => {
    const duration = Date.now() - start;
    const log = {
      requestId,
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userId: req.user?.id,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
    if (res.statusCode >= 400) {
      console.error("[ERROR]", log);
    } else {
      console.log("[INFO]", log);
    }
  });
  next();
};

// server/routes.ts
import express2 from "express";
import { eq, desc } from "drizzle-orm";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  AUDIT_ACTIONS: () => AUDIT_ACTIONS,
  ORDER_STATUSES: () => ORDER_STATUSES,
  ROLES: () => ROLES,
  auditLogs: () => auditLogs,
  importHistory: () => importHistory,
  insertAuditLogSchema: () => insertAuditLogSchema,
  insertItemSchema: () => insertItemSchema,
  insertOrderItemSchema: () => insertOrderItemSchema,
  insertOrderSchema: () => insertOrderSchema,
  insertSesiDispensationSchema: () => insertSesiDispensationSchema,
  insertSesiPatientSchema: () => insertSesiPatientSchema,
  insertSesiStockSchema: () => insertSesiStockSchema,
  insertSupplierSchema: () => insertSupplierSchema,
  insertUnitSchema: () => insertUnitSchema,
  insertUserSchema: () => insertUserSchema,
  items: () => items,
  orderItems: () => orderItems,
  orders: () => orders,
  selectAuditLogSchema: () => selectAuditLogSchema,
  selectItemSchema: () => selectItemSchema,
  selectOrderItemSchema: () => selectOrderItemSchema,
  selectOrderSchema: () => selectOrderSchema,
  selectSesiDispensationSchema: () => selectSesiDispensationSchema,
  selectSesiPatientSchema: () => selectSesiPatientSchema,
  selectSesiStockSchema: () => selectSesiStockSchema,
  selectSupplierSchema: () => selectSupplierSchema,
  selectUnitSchema: () => selectUnitSchema,
  selectUserSchema: () => selectUserSchema,
  sesiDispensations: () => sesiDispensations,
  sesiPatients: () => sesiPatients,
  sesiStock: () => sesiStock,
  suppliers: () => suppliers,
  units: () => units,
  users: () => users
});
import { pgTable, text, uuid, timestamp, integer, decimal, uniqueIndex, index } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
var ROLES = ["admin", "operator"];
var ORDER_STATUSES = ["draft", "generated", "sent", "authorized", "committed", "received"];
var AUDIT_ACTIONS = ["create", "update", "delete", "dispensar", "import", "login", "logout"];
var users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull(),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    role: text("role").notNull().default("operator"),
    // enum value as text
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow()
  },
  (table) => [
    uniqueIndex("users_email_idx").on(table.email)
  ]
);
var units = pgTable(
  "units",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    type: text("type").notNull(),
    // "centro_saude", "hospital", etc
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow()
  }
);
var suppliers = pgTable(
  "suppliers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    contact: text("contact"),
    priority: integer("priority").default(0),
    // 0=low, 1=medium, 2=high
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow()
  }
);
var items = pgTable(
  "items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    code: text("code").notNull(),
    name: text("name").notNull(),
    presentation: text("presentation"),
    // "500mg comprimido", etc
    currentStock: integer("current_stock").notNull().default(0),
    monthlyConsumption: decimal("monthly_consumption", { precision: 10, scale: 2 }),
    minStockMonths: integer("min_stock_months").default(1),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow()
  },
  (table) => [
    uniqueIndex("items_code_idx").on(table.code),
    index("items_name_idx").on(table.name)
  ]
);
var orders = pgTable(
  "orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    supplierId: uuid("supplier_id").notNull(),
    status: text("status").notNull().default("draft"),
    // enum value as text
    horizonMonths: integer("horizon_months").default(1),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow()
  },
  (table) => [
    index("orders_supplier_idx").on(table.supplierId),
    index("orders_status_idx").on(table.status)
  ]
);
var orderItems = pgTable(
  "order_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderId: uuid("order_id").notNull(),
    itemId: uuid("item_id").notNull(),
    quantity: integer("quantity").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow()
  },
  (table) => [
    index("order_items_order_idx").on(table.orderId),
    index("order_items_item_idx").on(table.itemId)
  ]
);
var importHistory = pgTable(
  "import_history",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    fileName: text("file_name").notNull(),
    itemsCount: integer("items_count"),
    createdAt: timestamp("created_at").notNull().defaultNow()
  }
);
var auditLogs = pgTable(
  "audit_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id"),
    action: text("action").notNull(),
    // enum value as text
    entityId: uuid("entity_id"),
    entityType: text("entity_type"),
    // "item", "order", "dispensacao", etc
    changes: text("changes"),
    // JSON stringified
    ipAddress: text("ip_address"),
    createdAt: timestamp("created_at").notNull().defaultNow()
  },
  (table) => [
    index("audit_logs_user_idx").on(table.userId),
    index("audit_logs_entity_idx").on(table.entityId),
    index("audit_logs_created_idx").on(table.createdAt)
  ]
);
var sesiPatients = pgTable(
  "sesi_patients",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    cpf: text("cpf").notNull(),
    // Será criptografado em aplicação
    dateOfBirth: timestamp("date_of_birth"),
    phone: text("phone"),
    address: text("address"),
    notes: text("notes"),
    active: integer("active").notNull().default(1),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow()
  },
  (table) => [
    uniqueIndex("sesi_patients_cpf_idx").on(table.cpf),
    index("sesi_patients_name_idx").on(table.name)
  ]
);
var sesiStock = pgTable(
  "sesi_stock",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    itemId: uuid("item_id").notNull(),
    batchNumber: text("batch_number").notNull(),
    expiryDate: timestamp("expiry_date"),
    quantity: integer("quantity").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow()
  },
  (table) => [
    index("sesi_stock_item_idx").on(table.itemId),
    index("sesi_stock_expiry_idx").on(table.expiryDate)
  ]
);
var sesiDispensations = pgTable(
  "sesi_dispensations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    patientId: uuid("patient_id").notNull(),
    medicationId: uuid("medication_id").notNull(),
    quantity: integer("quantity").notNull(),
    batchNumber: text("batch_number"),
    dispensedBy: uuid("dispensed_by"),
    // userId
    notes: text("notes"),
    createdAt: timestamp("created_at").notNull().defaultNow()
  },
  (table) => [
    index("sesi_dispensations_patient_idx").on(table.patientId),
    index("sesi_dispensations_medication_idx").on(table.medicationId),
    index("sesi_dispensations_created_idx").on(table.createdAt)
  ]
);
var selectUserSchema = createSelectSchema(users);
var insertUserSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: z.enum(["admin", "operator"]).default("operator")
});
var selectItemSchema = createSelectSchema(items);
var insertItemSchema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  presentation: z.string().optional(),
  monthlyConsumption: z.number().optional(),
  minStockMonths: z.number().default(1)
});
var selectOrderSchema = createSelectSchema(orders);
var insertOrderSchema = z.object({
  supplierId: z.string().uuid(),
  horizonMonths: z.number().default(1)
});
var selectOrderItemSchema = createSelectSchema(orderItems);
var insertOrderItemSchema = z.object({
  orderId: z.string().uuid(),
  itemId: z.string().uuid(),
  quantity: z.number().int().positive()
});
var selectUnitSchema = createSelectSchema(units);
var insertUnitSchema = z.object({
  name: z.string().min(1),
  type: z.string().min(1)
});
var selectSupplierSchema = createSelectSchema(suppliers);
var insertSupplierSchema = z.object({
  name: z.string().min(1),
  contact: z.string().optional(),
  priority: z.number().default(0)
});
var selectSesiPatientSchema = createSelectSchema(sesiPatients);
var insertSesiPatientSchema = z.object({
  name: z.string().min(1),
  cpf: z.string().min(11).max(14),
  // CPF format
  dateOfBirth: z.coerce.date().optional(),
  phone: z.string().optional(),
  address: z.string().optional()
});
var selectSesiStockSchema = createSelectSchema(sesiStock);
var insertSesiStockSchema = z.object({
  itemId: z.string().uuid(),
  batchNumber: z.string().min(1),
  expiryDate: z.coerce.date().optional(),
  quantity: z.number().int().positive()
});
var selectSesiDispensationSchema = createSelectSchema(sesiDispensations);
var insertSesiDispensationSchema = z.object({
  patientId: z.string().uuid(),
  medicationId: z.string().uuid(),
  quantity: z.number().int().positive(),
  batchNumber: z.string().optional(),
  notes: z.string().optional()
});
var selectAuditLogSchema = createSelectSchema(auditLogs);
var insertAuditLogSchema = z.object({
  userId: z.string().uuid().optional(),
  action: z.enum(["create", "update", "delete", "dispensar", "import", "login", "logout"]),
  entityId: z.string().uuid().optional(),
  entityType: z.string().optional(),
  changes: z.string().optional(),
  ipAddress: z.string().optional()
});

// server/db.ts
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { randomUUID as randomUUID2 } from "crypto";
var getTableName = (table) => {
  return table?.name || table?.$name || table?.__name || (table && typeof table === "string" ? table : String(table)) || "unknown";
};
var createInMemoryDb = () => {
  const storage = {};
  const ensureTable = (name) => {
    if (!storage[name]) storage[name] = /* @__PURE__ */ new Map();
    return storage[name];
  };
  const matchPredicate = (row, predicate) => {
    if (!predicate) return true;
    if (typeof predicate === "function") return predicate(row);
    try {
      const left = predicate.left || predicate.lhs || (Array.isArray(predicate) ? predicate[0] : void 0);
      const right = predicate.right || predicate.rhs || (Array.isArray(predicate) ? predicate[1] : predicate.value);
      if (left && typeof left === "object") {
        const key = left.name || left.columnName || left._name || left.$name || left.field || left.propertyName;
        const val = right && right.value !== void 0 ? right.value : right;
        if (key && val !== void 0) return String(row[key]) === String(val);
      }
    } catch (e) {
    }
    if (typeof predicate === "object") {
      for (const k of Object.keys(predicate)) {
        if (String(row[k]) !== String(predicate[k])) return false;
      }
      return true;
    }
    return false;
  };
  const makeThenable = (value) => {
    const obj = {
      returning: async () => [value],
      rows: [value]
    };
    obj.then = (resolve) => {
      resolve(value);
      return Promise.resolve(value);
    };
    return obj;
  };
  return {
    select: () => ({
      from: (table) => ({
        where: (predicate) => {
          const name = getTableName(table);
          const tbl = ensureTable(name);
          const rows = Array.from(tbl.values()).filter((r) => matchPredicate(r, predicate));
          return Promise.resolve(rows);
        },
        orderBy: (_col) => ({
          where: (predicate) => {
            const name = getTableName(table);
            const tbl = ensureTable(name);
            const rows = Array.from(tbl.values()).filter((r) => matchPredicate(r, predicate));
            return Promise.resolve(rows);
          },
          limit: (n) => Promise.resolve(Array.from(ensureTable(getTableName(table)).values()).slice(0, n))
        }),
        limit: (n) => Promise.resolve(Array.from(ensureTable(getTableName(table)).values()).slice(0, n))
      })
    }),
    insert: (table) => ({
      values: (data) => {
        const name = getTableName(table);
        const tbl = ensureTable(name);
        const id = data.id || randomUUID2();
        const now = /* @__PURE__ */ new Date();
        const saved = { id, ...data, createdAt: data.createdAt || now, updatedAt: data.updatedAt || now };
        tbl.set(id, saved);
        return makeThenable(saved);
      }
    }),
    update: (table) => ({
      set: (payload) => ({
        where: (predicate) => {
          const name = getTableName(table);
          const tbl = ensureTable(name);
          const matched = [];
          for (const [id, row] of tbl.entries()) {
            if (matchPredicate(row, predicate)) {
              const updated = { ...row, ...payload, updatedAt: /* @__PURE__ */ new Date() };
              tbl.set(id, updated);
              matched.push(updated);
            }
          }
          return Promise.resolve(matched);
        }
      })
    }),
    execute: async (_sql) => ({ success: true })
  };
};
var db;
if (process.env.DATABASE_URL) {
  try {
    const sql = neon(process.env.DATABASE_URL);
    db = drizzle(sql, { schema: schema_exports });
    console.log("\u2705 Database connected via Drizzle ORM (Neon Serverless)");
    console.log(`\u{1F4CA} Database: ${process.env.DATABASE_URL.split("@")[1]?.split("/")[0] || "configured"}`);
  } catch (error) {
    console.error("\u274C Database connection failed:", error);
    console.warn("\u26A0\uFE0F Falling back to in-memory storage for development");
    db = createInMemoryDb();
  }
} else {
  db = createInMemoryDb();
  console.warn("\u26A0\uFE0F DATABASE_URL n\xE3o configurada. Usando fallback em mem\xF3ria para desenvolvimento.");
  console.warn("\u26A0\uFE0F Configure DATABASE_URL para persist\xEAncia de dados.");
}

// server/routes.ts
var router = express2.Router();
async function logAudit(userId, action, entityType, entityId, changes, ipAddress) {
  if (!userId) return;
  try {
    await db.insert(auditLogs).values({
      userId,
      action,
      entityType,
      entityId,
      changes: JSON.stringify(changes),
      ipAddress: ipAddress || "unknown",
      createdAt: /* @__PURE__ */ new Date()
    });
  } catch (err) {
    console.error("\u274C Audit log failed:", err);
  }
}
router.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
});
router.get("/auth/status", async (req, res) => {
  try {
    const user = req.user;
    const demoToken = req.headers["x-demo-token"];
    if (!user && demoToken === "demo-pixlabel-test") {
      const demoUser = {
        id: "demo-user-123",
        email: "demo@pixlabel.test",
        firstName: "Demo",
        lastName: "User",
        role: "admin"
      };
      return res.json({
        status: "success",
        data: {
          isAuthenticated: true,
          user: demoUser
        }
      });
    }
    if (!user) {
      return res.json({
        status: "success",
        data: {
          isAuthenticated: false,
          user: null
        }
      });
    }
    res.json({
      status: "success",
      data: {
        isAuthenticated: true,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        }
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message, status: "error" });
  }
});
router.get("/auth/demo-login", async (req, res) => {
  try {
    res.json({
      status: "success",
      message: "Demo login successful",
      demoToken: "demo-pixlabel-test",
      user: {
        id: "demo-user-123",
        email: "demo@pixlabel.test",
        firstName: "Demo",
        lastName: "User",
        role: "admin"
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", error: err.message });
  }
});
router.get("/items", async (_req, res) => {
  try {
    const allItems = await db.select().from(items);
    res.json({
      status: "success",
      data: allItems,
      total: allItems.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message, status: "error" });
  }
});
router.post("/items", async (req, res) => {
  try {
    const data = insertItemSchema.parse(req.body);
    const [newItem] = await db.insert(items).values({
      code: data.code,
      name: data.name,
      presentation: data.presentation || null,
      currentStock: 0,
      monthlyConsumption: data.monthlyConsumption ? String(data.monthlyConsumption) : null,
      minStockMonths: data.minStockMonths || 1
    }).returning();
    const userId = req.user?.id;
    await logAudit(userId, "create", "item", newItem.id, data, req.ip);
    res.status(201).json({ status: "success", data: newItem });
  } catch (err) {
    res.status(400).json({ error: err.message, status: "error" });
  }
});
router.patch("/items/:id", async (req, res) => {
  try {
    const [updated] = await db.update(items).set({ ...req.body, updatedAt: /* @__PURE__ */ new Date() }).where(eq(items.id, req.params.id)).returning();
    if (!updated) {
      return res.status(404).json({ error: "Item not found", status: "error" });
    }
    const userId = req.user?.id;
    await logAudit(userId, "update", "item", req.params.id, req.body, req.ip);
    res.json({ status: "success", data: updated });
  } catch (err) {
    res.status(400).json({ error: err.message, status: "error" });
  }
});
router.delete("/items/:id", async (req, res) => {
  try {
    await db.delete(items).where(eq(items.id, req.params.id));
    const userId = req.user?.id;
    await logAudit(userId, "delete", "item", req.params.id, {}, req.ip);
    res.json({ status: "success", message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message, status: "error" });
  }
});
router.get("/units", async (_req, res) => {
  try {
    const allUnits = await db.select().from(units);
    res.json({ status: "success", data: allUnits, total: allUnits.length });
  } catch (err) {
    res.status(500).json({ error: err.message, status: "error" });
  }
});
router.post("/units", async (req, res) => {
  try {
    const data = insertUnitSchema.parse(req.body);
    const [newUnit] = await db.insert(units).values(data).returning();
    res.status(201).json({ status: "success", data: newUnit });
  } catch (err) {
    res.status(400).json({ error: err.message, status: "error" });
  }
});
router.get("/suppliers", async (_req, res) => {
  try {
    const allSuppliers = await db.select().from(suppliers);
    res.json({ status: "success", data: allSuppliers, total: allSuppliers.length });
  } catch (err) {
    res.status(500).json({ error: err.message, status: "error" });
  }
});
router.post("/suppliers", async (req, res) => {
  try {
    const data = insertSupplierSchema.parse(req.body);
    const [newSupplier] = await db.insert(suppliers).values(data).returning();
    res.status(201).json({ status: "success", data: newSupplier });
  } catch (err) {
    res.status(400).json({ error: err.message, status: "error" });
  }
});
router.get("/orders", async (_req, res) => {
  try {
    const allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt));
    res.json({ status: "success", data: allOrders, total: allOrders.length });
  } catch (err) {
    res.status(500).json({ error: err.message, status: "error" });
  }
});
router.post("/orders", async (req, res) => {
  try {
    const data = insertOrderSchema.parse(req.body);
    const [newOrder] = await db.insert(orders).values({
      supplierId: data.supplierId,
      status: "draft",
      horizonMonths: data.horizonMonths || 1
    }).returning();
    res.status(201).json({ status: "success", data: newOrder });
  } catch (err) {
    res.status(400).json({ error: err.message, status: "error" });
  }
});
router.patch("/orders/:id", async (req, res) => {
  try {
    const [updated] = await db.update(orders).set({ status: req.body.status, updatedAt: /* @__PURE__ */ new Date() }).where(eq(orders.id, req.params.id)).returning();
    if (!updated) {
      return res.status(404).json({ error: "Order not found", status: "error" });
    }
    res.json({ status: "success", data: updated });
  } catch (err) {
    res.status(400).json({ error: err.message, status: "error" });
  }
});
router.get("/sesi/pacientes", async (_req, res) => {
  try {
    const allPatients = await db.select().from(sesiPatients).where(eq(sesiPatients.active, 1));
    res.json({ status: "success", data: allPatients, total: allPatients.length });
  } catch (err) {
    res.status(500).json({ error: err.message, status: "error" });
  }
});
router.post("/sesi/pacientes", async (req, res) => {
  try {
    const data = insertSesiPatientSchema.parse(req.body);
    const [newPatient] = await db.insert(sesiPatients).values({
      name: data.name,
      cpf: data.cpf,
      dateOfBirth: data.dateOfBirth || null,
      phone: data.phone || null,
      address: data.address || null
    }).returning();
    res.status(201).json({ status: "success", data: newPatient });
  } catch (err) {
    res.status(400).json({ error: err.message, status: "error" });
  }
});
router.patch("/sesi/pacientes/:id", async (req, res) => {
  try {
    const [updated] = await db.update(sesiPatients).set({ ...req.body, updatedAt: /* @__PURE__ */ new Date() }).where(eq(sesiPatients.id, req.params.id)).returning();
    if (!updated) {
      return res.status(404).json({ error: "Patient not found", status: "error" });
    }
    res.json({ status: "success", data: updated });
  } catch (err) {
    res.status(400).json({ error: err.message, status: "error" });
  }
});
router.get("/sesi/estoque", async (_req, res) => {
  try {
    const stock = await db.select().from(sesiStock).orderBy(sesiStock.expiryDate);
    res.json({ status: "success", data: stock, total: stock.length });
  } catch (err) {
    res.status(500).json({ error: err.message, status: "error" });
  }
});
router.post("/sesi/estoque", async (req, res) => {
  try {
    const data = insertSesiStockSchema.parse(req.body);
    const [newStock] = await db.insert(sesiStock).values(data).returning();
    res.status(201).json({ status: "success", data: newStock });
  } catch (err) {
    res.status(400).json({ error: err.message, status: "error" });
  }
});
router.get("/sesi/medicamentos", async (req, res) => {
  try {
    const search = req.query.q?.toLowerCase() || "";
    const foundItems = await db.select().from(items).limit(100);
    const filtered = search ? foundItems.filter(
      (item) => {
        const name = item.name?.toLowerCase() || "";
        const code = item.code?.toLowerCase() || "";
        return name.includes(search) || code.includes(search);
      }
    ) : foundItems;
    const enriched = await Promise.all(
      filtered.slice(0, 20).map(async (item) => {
        const stock = await db.select().from(sesiStock).where(eq(sesiStock.itemId, item.id));
        const sesiQuantity = stock.reduce((sum, s) => sum + (s.quantity || 0), 0);
        return { ...item, sesiQuantity };
      })
    );
    res.json({ status: "success", data: enriched, total: enriched.length });
  } catch (err) {
    console.error("\u274C Error in /sesi/medicamentos:", err);
    res.status(500).json({ error: err.message, status: "error" });
  }
});
router.post("/sesi/dispensacoes", async (req, res) => {
  try {
    const { patientId, medicamentos } = req.body;
    if (!patientId || !medicamentos || !Array.isArray(medicamentos)) {
      return res.status(400).json({
        error: "Invalid payload. Required: patientId (uuid), medicamentos (array)",
        status: "error"
      });
    }
    const patient = await db.select().from(sesiPatients).where(eq(sesiPatients.id, patientId)).limit(1);
    if (!patient.length) {
      return res.status(404).json({ error: "Patient not found", status: "error" });
    }
    const deductedItems = [];
    for (const med of medicamentos) {
      if (!med.medicationId || !med.quantity) {
        return res.status(400).json({
          error: "Each medication must have medicationId and quantity",
          status: "error"
        });
      }
      const stock = await db.select().from(sesiStock).where(eq(sesiStock.itemId, med.medicationId)).orderBy(sesiStock.expiryDate);
      let remaining = med.quantity;
      for (const stockItem of stock) {
        if (remaining <= 0) break;
        if (stockItem.quantity <= 0) continue;
        if (stockItem.expiryDate && new Date(stockItem.expiryDate) < /* @__PURE__ */ new Date()) continue;
        const deductAmount = Math.min(remaining, stockItem.quantity);
        await db.update(sesiStock).set({ quantity: stockItem.quantity - deductAmount }).where(eq(sesiStock.id, stockItem.id));
        remaining -= deductAmount;
        deductedItems.push({
          medicationId: med.medicationId,
          quantityDeducted: deductAmount,
          batchNumber: stockItem.batchNumber
        });
      }
      if (remaining > 0) {
        return res.status(400).json({
          error: `Insufficient stock for medication ${med.medicationId}. Missing: ${remaining}`,
          status: "error"
        });
      }
    }
    const dispensationRecords = await Promise.all(
      deductedItems.map(
        (item) => db.insert(sesiDispensations).values({
          patientId,
          medicationId: item.medicationId,
          quantity: item.quantityDeducted,
          batchNumber: item.batchNumber || null,
          dispensedBy: userId
        }).returning()
      )
    );
    const dispensation = dispensationRecords[0]?.[0];
    const userId = req.user?.id || "anonymous";
    await logAudit(userId, "dispensar", "sesi_dispensation", patientId, {
      medicamentos,
      deductedItems,
      timestamp: /* @__PURE__ */ new Date()
    }, req.ip);
    res.status(201).json({
      status: "success",
      data: {
        success: true,
        dispensationId: dispensation.id,
        deductedItems,
        message: "Dispensation completed successfully"
      }
    });
  } catch (err) {
    console.error("\u274C Dispensation Error:", err);
    const statusCode = err.message?.includes("not found") ? 404 : 400;
    res.status(statusCode).json({
      status: "error",
      error: err.message || "Erro ao processar dispensa\xE7\xE3o",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  }
});
var routes_default = router;

// server/routes/auth.ts
import express3 from "express";
import passport from "passport";
import { eq as eq2 } from "drizzle-orm";
var router2 = express3.Router();
async function saveOrUpdateUser(user) {
  try {
    if (!user?.email) return null;
    const found = await db.select().from(users).where(eq2(users.email, user.email));
    if (found.length > 0) {
      const existing = found[0];
      await db.update(users).set({
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role || existing.role
      }).where(eq2(users.email, user.email));
      const refreshed = await db.select().from(users).where(eq2(users.email, user.email));
      return refreshed[0];
    } else {
      await db.insert(users).values({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role || "operator"
      });
      const created = await db.select().from(users).where(eq2(users.email, user.email));
      return created[0] || null;
    }
  } catch (err) {
    console.error("Error saving user:", err);
    return null;
  }
}
router2.get("/login", (req, res, next) => {
  const provider = process.env.OAUTH_PROVIDER_NAME || (process.env.OAUTH_CLIENT_ID ? "oauth" : "dev-oauth");
  if (process.env.OAUTH_CLIENT_ID && process.env.OAUTH_CLIENT_SECRET) {
    return passport.authenticate(provider)(req, res, next);
  }
  res.redirect("/login");
});
router2.get(
  "/callback",
  passport.authenticate("replit", { failureRedirect: "/" }),
  async (req, res) => {
    try {
      const oauthUser = req.user;
      if (!oauthUser) {
        return res.status(400).json({ status: "error", error: "No user returned from provider" });
      }
      const saved = await saveOrUpdateUser(oauthUser);
      if (saved && req.session) {
        req.session.userId = saved.id;
        req.user = saved;
      }
      try {
        if (saved) {
          await db.insert(auditLogs).values({
            userId: saved.id,
            action: "login",
            entityType: "user",
            entityId: saved.id,
            changes: JSON.stringify({ method: process.env.OAUTH_PROVIDER_NAME || "oauth" }),
            ipAddress: req.ip || "unknown",
            createdAt: /* @__PURE__ */ new Date()
          });
        }
      } catch (err) {
        console.error("Failed to write audit log:", err);
      }
      if ((req.headers.accept || "").includes("text/html")) {
        return res.redirect("/");
      }
      res.json({ status: "success", message: "OAuth callback processed", user: saved });
    } catch (err) {
      console.error(err);
      res.status(500).json({ status: "error", error: err.message });
    }
  }
);
router2.get("/logout", async (req, res) => {
  try {
    const userId = req.user?.id;
    if (userId) {
      await db.insert(auditLogs).values({
        userId,
        action: "logout",
        entityType: "user",
        entityId: userId,
        changes: JSON.stringify({}),
        ipAddress: req.ip || "unknown",
        createdAt: /* @__PURE__ */ new Date()
      });
    }
    if (req.logout) {
      req.logout((err) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        if (req.session) {
          req.session.destroy((err2) => {
            if (err2) {
              return res.status(500).json({ error: err2.message });
            }
            res.json({ status: "success", message: "Logged out" });
          });
        } else {
          res.json({ status: "success", message: "Logged out" });
        }
      });
    } else {
      if (req.session) {
        req.session.destroy((err) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          res.json({ status: "success", message: "Logged out" });
        });
      } else {
        res.json({ status: "success", message: "Logged out" });
      }
    }
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
});
router2.get("/status", async (req, res) => {
  try {
    const user = req.user;
    const demoToken = req.headers["x-demo-token"];
    if (!user && demoToken === "demo-pixlabel-test") {
      const demoUser = {
        id: "demo-user-123",
        email: "demo@pixlabel.test",
        firstName: "Demo",
        lastName: "User",
        role: "admin"
      };
      return res.json({
        status: "success",
        data: {
          isAuthenticated: true,
          user: demoUser
        }
      });
    }
    if (!user) {
      return res.json({
        status: "success",
        data: {
          isAuthenticated: false,
          user: null
        }
      });
    }
    res.json({
      status: "success",
      data: {
        isAuthenticated: true,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        }
      }
    });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
});
router2.get("/demo-login", async (req, res) => {
  if (process.env.NODE_ENV === "production" && !process.env.ALLOW_DEMO_LOGIN) {
    return res.status(403).json({ status: "error", error: "Demo login not allowed" });
  }
  try {
    const demoUser = {
      email: "demo@pixlabel.test",
      firstName: "Demo",
      lastName: "User",
      role: "admin"
    };
    const saved = await saveOrUpdateUser(demoUser);
    if (saved && req.session) {
      req.session.userId = saved.id;
      req.user = saved;
    }
    res.setHeader("X-Demo-Token", "demo-pixlabel-test");
    res.json({
      status: "success",
      message: "Demo login successful",
      user: saved,
      demoToken: "demo-pixlabel-test"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", error: err.message });
  }
});
var auth_default = router2;

// server/index-prod.ts
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var app = express4();
app.use(helmetMiddleware);
app.use(requestIdMiddleware);
app.use(securityHeadersMiddleware);
app.use(loggingMiddleware);
app.use(express4.json({ limit: "10mb" }));
app.use(express4.urlencoded({ limit: "10mb", extended: true }));
app.use(sanitizationMiddleware);
app.use("/api", apiLimiter);
app.use("/auth/login", loginLimiter);
app.use("/api/items", createLimiter);
app.use("/api/sesi/dispensacoes", dispensationLimiter);
if (process.env.DATABASE_URL) {
  app.use(createSessionMiddleware());
  app.use(passport2.initialize());
  app.use(passport2.session());
  if (process.env.OAUTH_CLIENT_ID && process.env.OAUTH_CLIENT_SECRET && process.env.OAUTH_CALLBACK_URL && process.env.OAUTH_AUTH_URL && process.env.OAUTH_TOKEN_URL) {
    const providerName = process.env.OAUTH_PROVIDER_NAME || "oauth";
    const strategy = createOAuthStrategy(
      process.env.OAUTH_AUTH_URL,
      process.env.OAUTH_TOKEN_URL,
      process.env.OAUTH_USERINFO_URL || "",
      process.env.OAUTH_CLIENT_ID,
      process.env.OAUTH_CLIENT_SECRET,
      process.env.OAUTH_CALLBACK_URL,
      providerName
    );
    passport2.use(providerName, strategy);
  }
  passport2.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport2.deserializeUser((id, done) => {
    const user = {
      id,
      email: `${id}@pixlabel.app`,
      firstName: "User",
      lastName: "Name",
      role: "operator"
    };
    done(null, user);
  });
}
app.use((req, _res, next) => {
  const demoToken = req.headers["x-demo-token"];
  if (demoToken === "demo-pixlabel-test") {
    req.user = {
      id: "demo-user-123",
      email: "demo@pixlabel.test",
      firstName: "Demo",
      lastName: "User",
      role: "admin"
    };
  }
  next();
});
app.use("/auth", auth_default);
app.use("/api", routes_default);
var publicDir = (() => {
  const possiblePaths = [
    path.resolve(__dirname, "../public"),
    path.resolve(__dirname, "../../dist/public"),
    path.resolve(process.cwd(), "dist/public")
  ];
  console.log("\n\u{1F50D} Looking for public directory...");
  console.log(`   Current __dirname: ${__dirname}`);
  console.log(`   Current cwd: ${process.cwd()}
`);
  for (const dir of possiblePaths) {
    try {
      const exists = existsSync(dir);
      const isDir = exists && statSync(dir).isDirectory();
      if (isDir) {
        console.log(`\u2705 Found public directory: ${dir}`);
        return dir;
      } else {
        console.log(`\u274C Not found: ${dir} (exists: ${exists}, isDir: ${isDir})`);
      }
    } catch (e) {
      console.log(`\u274C Error checking ${dir}: ${e.message}`);
    }
  }
  console.warn(`\u26A0\uFE0F Public directory not found, using default: ${possiblePaths[2]}`);
  return possiblePaths[2];
})();
app.use(express4.static(publicDir, {
  maxAge: "1h",
  etag: false,
  extensions: ["html", "js", "css", "json"]
}));
app.get("*", (req, res) => {
  if (path.extname(req.path)) {
    console.warn(`\u{1F4C1} File not found: ${req.path}`);
    return res.status(404).send("Not found");
  }
  const indexPath = path.join(publicDir, "index.html");
  if (!existsSync(indexPath)) {
    console.error(`\u274C index.html not found at: ${indexPath}`);
    console.error(`\u{1F4C2} publicDir contents:`, existsSync(publicDir) ? "exists" : "MISSING");
    return res.status(500).json({
      error: "Application index not found",
      path: indexPath,
      publicDirExists: existsSync(publicDir)
    });
  }
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error(`\u274C Error serving index.html:`, err.message);
      res.status(500).json({ error: "Failed to serve application" });
    }
  });
});
app.use("/api", (err, _req, res, _next) => {
  console.error("\u274C API Error:", {
    message: err.message,
    stack: err.stack,
    name: err.name
  });
  res.status(err.status || 500).json({
    status: "error",
    error: err.message || "Internal server error",
    ...process.env.NODE_ENV === "development" && { stack: err.stack }
  });
});
app.use((err, _req, res, _next) => {
  console.error("\u274C Global Error:", {
    message: err.message,
    stack: err.stack,
    name: err.name
  });
  res.status(500).json({
    error: "Internal server error",
    message: process.env.NODE_ENV === "development" ? err.message : void 0
  });
});
var PORT = parseInt(process.env.PORT || "3000", 10);
var HOST = process.env.HOST || "0.0.0.0";
if (!isValidPort(PORT)) {
  console.error(`\u274C Invalid PORT: ${PORT}`);
  process.exit(1);
}
function isValidPort(port) {
  return port > 0 && port < 65536 && Number.isInteger(port);
}
var server = app.listen(PORT, HOST, () => {
  const diagnostics = {
    "Server Status": "\u2705 STARTED",
    "URL": `http://${HOST}:${PORT}`,
    "Environment": process.env.NODE_ENV || "production",
    "Port": PORT,
    "Host": HOST,
    "Static Files": publicDir,
    "Node Version": process.version,
    "Memory": `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
    "Database": process.env.DATABASE_URL ? "\u{1F517} Connected" : "\u{1F4BE} In-Memory (Dev Mode)"
  };
  console.log(`
\u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557
\u2551  \u2705 PixelLab Production Server Started    \u2551
\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255D
  `);
  Object.entries(diagnostics).forEach(([key, value]) => {
    console.log(`${key}: ${value}`);
  });
  console.log(`
\u{1F3E5} Health Check: GET http://${HOST}:${PORT}/api/health
\u{1F4CA} API Routes: /api/*
\u{1F4C1} Static Serving: ${publicDir}
  `);
});
var gracefulShutdown = (signal) => {
  console.log(`
\u{1F4DB} ${signal} received, gracefully shutting down...`);
  server.close(() => {
    console.log("\u2705 Server closed");
    process.exit(0);
  });
  setTimeout(() => {
    console.error("\u274C Forced shutdown after timeout");
    process.exit(1);
  }, 3e4);
};
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("uncaughtException", (err) => {
  console.error("\u274C Uncaught Exception:", err);
  process.exit(1);
});
process.on("unhandledRejection", (reason, promise) => {
  console.error("\u274C Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});
