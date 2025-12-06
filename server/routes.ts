// Backend routes with Drizzle ORM integration
// This file replaces the in-memory storage approach with actual database queries

import express from "express";
import { eq, desc } from "drizzle-orm";
import {
  users,
  items,
  orders,
  orderItems,
  units,
  suppliers,
  sesiPatients,
  sesiStock,
  sesiDispensations,
  auditLogs,
  insertItemSchema,
  insertOrderSchema,
  insertUnitSchema,
  insertSupplierSchema,
  insertSesiPatientSchema,
  insertSesiStockSchema,
  type Item,
  type Order,
} from "@shared/schema";
import { db } from "./db";

const router = express.Router();

// ============================================
// AUDIT LOGGING HELPER
// ============================================

async function logAudit(
  userId: string | undefined,
  action: string,
  entityType: string,
  entityId: string | null,
  changes: Record<string, any>,
  ipAddress: string | undefined
) {
  if (!userId) return; // Don't log if no user
  try {
    await db.insert(auditLogs).values({
      userId,
      action,
      entityType,
      entityId,
      changes: JSON.stringify(changes),
      ipAddress: ipAddress || "unknown",
      createdAt: new Date(),
    });
  } catch (err) {
    console.error("❌ Audit log failed:", err);
  }
}

// ============================================
// HEALTH CHECK
// ============================================

router.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ============================================
// AUTH ENDPOINTS
// ============================================

router.get("/auth/status", async (req, res) => {
  try {
    const user = (req as any).user;
    
    // Check for demo token (for testing without OAuth)
    const demoToken = req.headers["x-demo-token"];
    if (!user && demoToken === "demo-pixlabel-test") {
      const demoUser = {
        id: "demo-user-123",
        email: "demo@pixlabel.test",
        firstName: "Demo",
        lastName: "User",
        role: "admin" as const,
      };
      return res.json({
        status: "success",
        data: {
          isAuthenticated: true,
          user: demoUser,
        },
      });
    }

    if (!user) {
      return res.json({
        status: "success",
        data: {
          isAuthenticated: false,
          user: null,
        },
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
          role: user.role,
        },
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message, status: "error" });
  }
});

router.get("/auth/demo-login", async (req: any, res) => {
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
        role: "admin",
      },
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ status: "error", error: err.message });
  }
});

// ============================================
// ITEMS ENDPOINTS (Medicamentos)
// ============================================

// GET /api/items - List all medications
router.get("/items", async (_req, res) => {
  try {
    const allItems = await db.select().from(items);
    res.json({
      status: "success",
      data: allItems,
      total: allItems.length,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message, status: "error" });
  }
});

// POST /api/items - Create medication
router.post("/items", async (req, res) => {
  try {
    const data = insertItemSchema.parse(req.body);
    const [newItem] = await db
      .insert(items)
      .values({
        code: data.code,
        name: data.name,
        presentation: data.presentation || null,
        currentStock: 0,
        monthlyConsumption: data.monthlyConsumption ? String(data.monthlyConsumption) : null,
        minStockMonths: data.minStockMonths || 1,
      })
      .returning();
    
    // Log auditoria
    const userId = (req as any).user?.id;
    await logAudit(userId, "create", "item", newItem.id, data, req.ip);
    
    res.status(201).json({ status: "success", data: newItem });
  } catch (err: any) {
    res.status(400).json({ error: err.message, status: "error" });
  }
});

// PATCH /api/items/:id - Update medication
router.patch("/items/:id", async (req, res) => {
  try {
    const [updated] = await db
      .update(items)
      .set({ ...req.body, updatedAt: new Date() })
      .where(eq(items.id, req.params.id))
      .returning();
    
    if (!updated) {
      return res.status(404).json({ error: "Item not found", status: "error" });
    }
    
    // Log auditoria
    const userId = (req as any).user?.id;
    await logAudit(userId, "update", "item", req.params.id, req.body, req.ip);
    
    res.json({ status: "success", data: updated });
  } catch (err: any) {
    res.status(400).json({ error: err.message, status: "error" });
  }
});

// DELETE /api/items/:id - Delete medication
router.delete("/items/:id", async (req, res) => {
  try {
    await db.delete(items).where(eq(items.id, req.params.id));
    
    // Log auditoria
    const userId = (req as any).user?.id;
    await logAudit(userId, "delete", "item", req.params.id, {}, req.ip);
    
    res.json({ status: "success", message: "Item deleted" });
  } catch (err: any) {
    res.status(500).json({ error: err.message, status: "error" });
  }
});

// ============================================
// UNITS ENDPOINTS
// ============================================

router.get("/units", async (_req, res) => {
  try {
    const allUnits = await db.select().from(units);
    res.json({ status: "success", data: allUnits, total: allUnits.length });
  } catch (err: any) {
    res.status(500).json({ error: err.message, status: "error" });
  }
});

router.post("/units", async (req, res) => {
  try {
    const data = insertUnitSchema.parse(req.body);
    const [newUnit] = await db.insert(units).values(data).returning();
    res.status(201).json({ status: "success", data: newUnit });
  } catch (err: any) {
    res.status(400).json({ error: err.message, status: "error" });
  }
});

// ============================================
// SUPPLIERS ENDPOINTS
// ============================================

router.get("/suppliers", async (_req, res) => {
  try {
    const allSuppliers = await db.select().from(suppliers);
    res.json({ status: "success", data: allSuppliers, total: allSuppliers.length });
  } catch (err: any) {
    res.status(500).json({ error: err.message, status: "error" });
  }
});

router.post("/suppliers", async (req, res) => {
  try {
    const data = insertSupplierSchema.parse(req.body);
    const [newSupplier] = await db.insert(suppliers).values(data).returning();
    res.status(201).json({ status: "success", data: newSupplier });
  } catch (err: any) {
    res.status(400).json({ error: err.message, status: "error" });
  }
});

// ============================================
// ORDERS ENDPOINTS
// ============================================

router.get("/orders", async (_req, res) => {
  try {
    const allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt));
    res.json({ status: "success", data: allOrders, total: allOrders.length });
  } catch (err: any) {
    res.status(500).json({ error: err.message, status: "error" });
  }
});

router.post("/orders", async (req, res) => {
  try {
    const data = insertOrderSchema.parse(req.body);
    const [newOrder] = await db
      .insert(orders)
      .values({
        supplierId: data.supplierId,
        status: "draft",
        horizonMonths: data.horizonMonths || 1,
      })
      .returning();
    
    res.status(201).json({ status: "success", data: newOrder });
  } catch (err: any) {
    res.status(400).json({ error: err.message, status: "error" });
  }
});

// PATCH /api/orders/:id - Update order status
router.patch("/orders/:id", async (req, res) => {
  try {
    const [updated] = await db
      .update(orders)
      .set({ status: req.body.status, updatedAt: new Date() })
      .where(eq(orders.id, req.params.id))
      .returning();
    
    if (!updated) {
      return res.status(404).json({ error: "Order not found", status: "error" });
    }
    
    res.json({ status: "success", data: updated });
  } catch (err: any) {
    res.status(400).json({ error: err.message, status: "error" });
  }
});

// ============================================
// SESI PATIENTS ENDPOINTS
// ============================================

router.get("/sesi/pacientes", async (_req, res) => {
  try {
    const allPatients = await db.select().from(sesiPatients).where(eq(sesiPatients.active, 1));
    res.json({ status: "success", data: allPatients, total: allPatients.length });
  } catch (err: any) {
    res.status(500).json({ error: err.message, status: "error" });
  }
});

router.post("/sesi/pacientes", async (req, res) => {
  try {
    const data = insertSesiPatientSchema.parse(req.body);
    const [newPatient] = await db
      .insert(sesiPatients)
      .values({
        name: data.name,
        cpf: data.cpf,
        dateOfBirth: data.dateOfBirth || null,
        phone: data.phone || null,
        address: data.address || null,
      })
      .returning();
    
    res.status(201).json({ status: "success", data: newPatient });
  } catch (err: any) {
    res.status(400).json({ error: err.message, status: "error" });
  }
});

// PATCH /api/sesi/pacientes/:id
router.patch("/sesi/pacientes/:id", async (req, res) => {
  try {
    const [updated] = await db
      .update(sesiPatients)
      .set({ ...req.body, updatedAt: new Date() })
      .where(eq(sesiPatients.id, req.params.id))
      .returning();
    
    if (!updated) {
      return res.status(404).json({ error: "Patient not found", status: "error" });
    }
    
    res.json({ status: "success", data: updated });
  } catch (err: any) {
    res.status(400).json({ error: err.message, status: "error" });
  }
});

// ============================================
// SESI STOCK ENDPOINTS
// ============================================

router.get("/sesi/estoque", async (_req, res) => {
  try {
    const stock = await db.select().from(sesiStock).orderBy(sesiStock.expiryDate);
    res.json({ status: "success", data: stock, total: stock.length });
  } catch (err: any) {
    res.status(500).json({ error: err.message, status: "error" });
  }
});

router.post("/sesi/estoque", async (req, res) => {
  try {
    const data = insertSesiStockSchema.parse(req.body);
    const [newStock] = await db.insert(sesiStock).values(data).returning();
    res.status(201).json({ status: "success", data: newStock });
  } catch (err: any) {
    res.status(400).json({ error: err.message, status: "error" });
  }
});

// ============================================
// SESI MEDICAMENTOS SEARCH
// ============================================

router.get("/sesi/medicamentos", async (req, res) => {
  try {
    const search = (req.query.q as string)?.toLowerCase() || "";
    
    // Get all items
    const foundItems = await db.select().from(items).limit(100);
    
    // Filter by search in-app (safer with in-memory DB)
    const filtered = search
      ? foundItems.filter(
          (item: typeof foundItems[0]) => {
            const name = item.name?.toLowerCase() || "";
            const code = item.code?.toLowerCase() || "";
            return name.includes(search) || code.includes(search);
          }
        )
      : foundItems;
    
    // Enrich with SESI quantities
    const enriched = await Promise.all(
      filtered.slice(0, 20).map(async (item: typeof foundItems[0]) => {
        const stock = await db.select().from(sesiStock).where(eq(sesiStock.itemId, item.id));
        const sesiQuantity = stock.reduce((sum: number, s: typeof stock[0]) => sum + (s.quantity || 0), 0);
        return { ...item, sesiQuantity };
      })
    );
    
    res.json({ status: "success", data: enriched, total: enriched.length });
  } catch (err: any) {
    console.error("❌ Error in /sesi/medicamentos:", err);
    res.status(500).json({ error: err.message, status: "error" });
  }
});

// ============================================
// SESI DISPENSATIONS (CRITICAL FLOW)
// ============================================

router.post("/sesi/dispensacoes", async (req, res) => {
  try {
    const { patientId, medicamentos } = req.body;

    if (!patientId || !medicamentos || !Array.isArray(medicamentos)) {
      return res.status(400).json({
        error: "Invalid payload. Required: patientId (uuid), medicamentos (array)",
        status: "error",
      });
    }

    // Validate patient exists
    const patient = await db.select().from(sesiPatients).where(eq(sesiPatients.id, patientId)).limit(1);
    if (!patient.length) {
      return res.status(404).json({ error: "Patient not found", status: "error" });
    }

    const deductedItems = [];

    // FIFO deduction
    for (const med of medicamentos) {
      if (!med.medicationId || !med.quantity) {
        return res.status(400).json({
          error: "Each medication must have medicationId and quantity",
          status: "error",
        });
      }

      // Get SESI stock ordered by expiry date (FIFO)
      const stock = await db
        .select()
        .from(sesiStock)
        .where(eq(sesiStock.itemId, med.medicationId))
        .orderBy(sesiStock.expiryDate);

      let remaining = med.quantity;

      for (const stockItem of stock) {
        if (remaining <= 0) break;
        if (stockItem.quantity <= 0) continue;
        if (stockItem.expiryDate && new Date(stockItem.expiryDate) < new Date()) continue;

        const deductAmount = Math.min(remaining, stockItem.quantity);
        
        // Update stock
        await db
          .update(sesiStock)
          .set({ quantity: stockItem.quantity - deductAmount })
          .where(eq(sesiStock.id, stockItem.id));

        remaining -= deductAmount;

        deductedItems.push({
          medicationId: med.medicationId,
          quantityDeducted: deductAmount,
          batchNumber: stockItem.batchNumber,
        });
      }

      if (remaining > 0) {
        return res.status(400).json({
          error: `Insufficient stock for medication ${med.medicationId}. Missing: ${remaining}`,
          status: "error",
        });
      }
    }

    // Create dispensation records for each medication
    const dispensationRecords = await Promise.all(
      deductedItems.map(item =>
        db
          .insert(sesiDispensations)
          .values({
            patientId,
            medicationId: item.medicationId,
            quantity: item.quantityDeducted,
            batchNumber: item.batchNumber || null,
            dispensedBy: userId,
          })
          .returning()
      )
    );
    
    const dispensation = dispensationRecords[0]?.[0];

    // Log to audit logs (LGPD compliance)
    const userId = (req as any).user?.id || "anonymous";
    await logAudit(userId, "dispensar", "sesi_dispensation", patientId, {
      medicamentos,
      deductedItems,
      timestamp: new Date(),
    }, req.ip);

    res.status(201).json({
      status: "success",
      data: {
        success: true,
        dispensationId: dispensation.id,
        deductedItems,
        message: "Dispensation completed successfully",
      },
    });
  } catch (err: any) {
    console.error("❌ Dispensation Error:", err);
    const statusCode = err.message?.includes("not found") ? 404 : 400;
    res.status(statusCode).json({ 
      status: "error",
      error: err.message || "Erro ao processar dispensação",
      timestamp: new Date().toISOString()
    });
  }
});

export default router;
