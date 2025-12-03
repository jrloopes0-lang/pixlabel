import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "@shared/schema";
import { randomUUID } from "crypto";

type TableMap = Map<string, any>;

const getTableName = (table: any) => {
  return table?.name || table?.$name || table?.__name || (table && typeof table === 'string' ? table : String(table)) || "unknown";
};

const createInMemoryDb = () => {
  const storage: Record<string, TableMap> = {};

  const ensureTable = (name: string) => {
    if (!storage[name]) storage[name] = new Map<string, any>();
    return storage[name];
  };

  const matchPredicate = (row: any, predicate: any): boolean => {
    if (!predicate) return true;
    if (typeof predicate === "function") return predicate(row);

    // Try to extract left/right (drizzle eq style)
    try {
      const left = predicate.left || predicate.lhs || (Array.isArray(predicate) ? predicate[0] : undefined);
      const right = predicate.right || predicate.rhs || (Array.isArray(predicate) ? predicate[1] : predicate.value);
      if (left && typeof left === 'object') {
        const key = left.name || left.columnName || left._name || left.$name || left.field || left.propertyName;
        const val = right && right.value !== undefined ? right.value : right;
        if (key && val !== undefined) return String(row[key]) === String(val);
      }
    } catch (e) {
      // ignore
    }

    // If predicate is a plain object { key: val }
    if (typeof predicate === 'object') {
      for (const k of Object.keys(predicate)) {
        if (String(row[k]) !== String(predicate[k])) return false;
      }
      return true;
    }

    return false;
  };

  const makeThenable = (value: any) => {
    const obj: any = {
      returning: async () => [value],
      rows: [value],
    };
    obj.then = (resolve: any) => {
      resolve(value);
      return Promise.resolve(value);
    };
    return obj;
  };

  return {
    select: () => ({
      from: (table: any) => ({
        where: (predicate?: any) => {
          const name = getTableName(table);
          const tbl = ensureTable(name);
          const rows = Array.from(tbl.values()).filter((r) => matchPredicate(r, predicate));
          return Promise.resolve(rows);
        },
        orderBy: (_col: any) => ({
          where: (predicate?: any) => {
            const name = getTableName(table);
            const tbl = ensureTable(name);
            const rows = Array.from(tbl.values()).filter((r) => matchPredicate(r, predicate));
            return Promise.resolve(rows);
          },
          limit: (n: number) => Promise.resolve(Array.from(ensureTable(getTableName(table)).values()).slice(0, n)),
        }),
        limit: (n: number) => Promise.resolve(Array.from(ensureTable(getTableName(table)).values()).slice(0, n)),
      }),
    }),

    insert: (table: any) => ({
      values: (data: any) => {
        const name = getTableName(table);
        const tbl = ensureTable(name);
        const id = data.id || randomUUID();
        const now = new Date();
        const saved = { id, ...data, createdAt: data.createdAt || now, updatedAt: data.updatedAt || now };
        tbl.set(id, saved);
        return makeThenable(saved);
      },
    }),

    update: (table: any) => ({
      set: (payload: any) => ({
        where: (predicate: any) => {
          const name = getTableName(table);
          const tbl = ensureTable(name);
          const matched: any[] = [];
          for (const [id, row] of tbl.entries()) {
            if (matchPredicate(row, predicate)) {
              const updated = { ...row, ...payload, updatedAt: new Date() };
              tbl.set(id, updated);
              matched.push(updated);
            }
          }
          return Promise.resolve(matched);
        },
      }),
    }),

    execute: async (_sql: string) => ({ success: true }),
  };
};

let db: any;

if (process.env.DATABASE_URL) {
  try {
    // Neon serverless driver for Railway/Neon PostgreSQL
    const sql = neon(process.env.DATABASE_URL);
    db = drizzle(sql, { schema });
    console.log("✅ Database connected via Drizzle ORM (Neon Serverless)");
    console.log(`📊 Database: ${process.env.DATABASE_URL.split('@')[1]?.split('/')[0] || 'configured'}`);
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    console.warn("⚠️ Falling back to in-memory storage for development");
    db = createInMemoryDb();
  }
} else {
  db = createInMemoryDb();
  console.warn("⚠️ DATABASE_URL não configurada. Usando fallback em memória para desenvolvimento.");
  console.warn("⚠️ Configure DATABASE_URL para persistência de dados.");
}

export { db };
export default db;
