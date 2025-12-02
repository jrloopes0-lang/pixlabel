import express from "express";
import {
  insertItemSchema,
  insertOrderSchema,
  insertOrderItemSchema,
  insertUnitSchema,
  insertSupplierSchema,
  insertSesiPatientSchema,
  insertSesiStockSchema,
  insertSesiDispensationSchema,
  type Item,
  type Order,
  type Unit,
  type Supplier,
  type SesiPatient,
  type SesiStockItem,
} from "@shared/schema";

const router = express.Router();

// ============================================
// TEMPORARY STORAGE (In-Memory - for demo)
// TODO: Replace with PostgreSQL via Drizzle
// ============================================

const storage = {
  items: new Map<string, Item>(),
  orders: new Map<string, Order>(),
  units: new Map<string, Unit>(),
  suppliers: new Map<string, Supplier>(),
  sesiPatients: new Map<string, SesiPatient>(),
  sesiStock: new Map<string, SesiStockItem>(),
};

// Helper: Generate UUID
function uuid() {
  return crypto.randomUUID();
}

// ============================================
// HEALTH CHECK
// ============================================

router.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ============================================
// ITEMS ENDPOINTS
// ============================================

// GET /api/items - List all medications
router.get("/items", (_req, res) => {
  try {
    const items = Array.from(storage.items.values());
    res.json({
      status: "success",
      data: items,
      total: items.length,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message, status: "error" });
  }
});

// POST /api/items - Create medication
router.post("/items", (req, res) => {
  try {
    const data = insertItemSchema.parse(req.body);
    const id = uuid();
    const item: Item = {
      id,
      code: data.code,
      name: data.name,
      presentation: data.presentation || null,
      currentStock: 0,
      monthlyConsumption: data.monthlyConsumption ? String(data.monthlyConsumption) : null,
      minStockMonths: data.minStockMonths || 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    storage.items.set(id, item);
    res.status(201).json({ status: "success", data: item });
  } catch (err: any) {
    res.status(400).json({ error: err.message, status: "error" });
  }
});

// PATCH /api/items/:id - Update medication
router.patch("/items/:id", (req, res) => {
  try {
    const item = storage.items.get(req.params.id);
    if (!item) {
      return res.status(404).json({ error: "Item not found", status: "error" });
    }
    const updated = {
      ...item,
      ...req.body,
      updatedAt: new Date(),
    };
    storage.items.set(req.params.id, updated);
    res.json({ status: "success", data: updated });
  } catch (err: any) {
    res.status(400).json({ error: err.message, status: "error" });
  }
});

// DELETE /api/items/:id - Delete medication
router.delete("/items/:id", (req, res) => {
  try {
    storage.items.delete(req.params.id);
    res.json({ status: "success", message: "Item deleted" });
  } catch (err: any) {
    res.status(500).json({ error: err.message, status: "error" });
  }
});

// ============================================
// UNITS ENDPOINTS
// ============================================

router.get("/units", (_req, res) => {
  try {
    const units = Array.from(storage.units.values());
    res.json({ status: "success", data: units, total: units.length });
  } catch (err: any) {
    res.status(500).json({ error: err.message, status: "error" });
  }
});

router.post("/units", (req, res) => {
  try {
    const data = insertUnitSchema.parse(req.body);
    const id = uuid();
    const unit: Unit = {
      id,
      name: data.name,
      type: data.type,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    storage.units.set(id, unit);
    res.status(201).json({ status: "success", data: unit });
  } catch (err: any) {
    res.status(400).json({ error: err.message, status: "error" });
  }
});

// ============================================
// SUPPLIERS ENDPOINTS
// ============================================

router.get("/suppliers", (_req, res) => {
  try {
    const suppliers = Array.from(storage.suppliers.values());
    res.json({ status: "success", data: suppliers, total: suppliers.length });
  } catch (err: any) {
    res.status(500).json({ error: err.message, status: "error" });
  }
});

router.post("/suppliers", (req, res) => {
  try {
    const data = insertSupplierSchema.parse(req.body);
    const id = uuid();
    const supplier: Supplier = {
      id,
      name: data.name,
      contact: data.contact || null,
      priority: data.priority || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    storage.suppliers.set(id, supplier);
    res.status(201).json({ status: "success", data: supplier });
  } catch (err: any) {
    res.status(400).json({ error: err.message, status: "error" });
  }
});

// ============================================
// ORDERS ENDPOINTS
// ============================================

router.get("/orders", (_req, res) => {
  try {
    const orders = Array.from(storage.orders.values());
    res.json({ status: "success", data: orders, total: orders.length });
  } catch (err: any) {
    res.status(500).json({ error: err.message, status: "error" });
  }
});

router.post("/orders", (req, res) => {
  try {
    const data = insertOrderSchema.parse(req.body);
    const id = uuid();
    const order: Order = {
      id,
      supplierId: data.supplierId,
      status: "draft",
      horizonMonths: data.horizonMonths || 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    storage.orders.set(id, order);
    res.status(201).json({ status: "success", data: order });
  } catch (err: any) {
    res.status(400).json({ error: err.message, status: "error" });
  }
});

// PATCH /api/orders/:id - Update order status
router.patch("/orders/:id", (req, res) => {
  try {
    const order = storage.orders.get(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found", status: "error" });
    }
    const updated = {
      ...order,
      status: req.body.status || order.status,
      updatedAt: new Date(),
    };
    storage.orders.set(req.params.id, updated);
    res.json({ status: "success", data: updated });
  } catch (err: any) {
    res.status(400).json({ error: err.message, status: "error" });
  }
});

// ============================================
// SESI PATIENTS ENDPOINTS
// ============================================

router.get("/sesi/pacientes", (_req, res) => {
  try {
    const patients = Array.from(storage.sesiPatients.values());
    res.json({ status: "success", data: patients, total: patients.length });
  } catch (err: any) {
    res.status(500).json({ error: err.message, status: "error" });
  }
});

router.post("/sesi/pacientes", (req, res) => {
  try {
    const data = insertSesiPatientSchema.parse(req.body);
    const id = uuid();
    const patient: SesiPatient = {
      id,
      name: data.name,
      cpf: data.cpf,
      dateOfBirth: data.dateOfBirth || null,
      phone: data.phone || null,
      address: data.address || null,
      notes: null,
      active: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    storage.sesiPatients.set(id, patient);
    res.status(201).json({ status: "success", data: patient });
  } catch (err: any) {
    res.status(400).json({ error: err.message, status: "error" });
  }
});

// PATCH /api/sesi/pacientes/:id
router.patch("/sesi/pacientes/:id", (req, res) => {
  try {
    const patient = storage.sesiPatients.get(req.params.id);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found", status: "error" });
    }
    const updated = {
      ...patient,
      ...req.body,
      updatedAt: new Date(),
    };
    storage.sesiPatients.set(req.params.id, updated);
    res.json({ status: "success", data: updated });
  } catch (err: any) {
    res.status(400).json({ error: err.message, status: "error" });
  }
});

// ============================================
// SESI STOCK ENDPOINTS
// ============================================

router.get("/sesi/estoque", (_req, res) => {
  try {
    const stock = Array.from(storage.sesiStock.values());
    res.json({ status: "success", data: stock, total: stock.length });
  } catch (err: any) {
    res.status(500).json({ error: err.message, status: "error" });
  }
});

router.post("/sesi/estoque", (req, res) => {
  try {
    const data = insertSesiStockSchema.parse(req.body);
    const id = uuid();
    const stockItem: SesiStockItem = {
      id,
      itemId: data.itemId,
      batchNumber: data.batchNumber,
      expiryDate: data.expiryDate || null,
      quantity: data.quantity,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    storage.sesiStock.set(id, stockItem);
    res.status(201).json({ status: "success", data: stockItem });
  } catch (err: any) {
    res.status(400).json({ error: err.message, status: "error" });
  }
});

// ============================================
// SESI DISPENSATIONS ENDPOINT (Critical Flow)
// ============================================

router.post("/sesi/dispensacoes", (req, res) => {
  try {
    // Validate patient exists
    const { patientId, medicamentos } = req.body;

    if (!patientId || !medicamentos || !Array.isArray(medicamentos)) {
      return res.status(400).json({
        error: "Invalid payload. Required: patientId (uuid), medicamentos (array)",
        status: "error",
      });
    }

    const patient = storage.sesiPatients.get(patientId);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found", status: "error" });
    }

    // FIFO deduction logic
    const deductedItems = [];

    for (const med of medicamentos) {
      if (!med.medicationId || !med.quantity) {
        return res.status(400).json({
          error: "Each medication must have medicationId and quantity",
          status: "error",
        });
      }

      // Find SESI stock by item, ordered by expiry date (FIFO)
      const stockItems = Array.from(storage.sesiStock.values())
        .filter(
          (s) =>
            s.itemId === med.medicationId &&
            s.quantity > 0 &&
            (!s.expiryDate || new Date(s.expiryDate) > new Date())
        )
        .sort(
          (a, b) =>
            (new Date(a.expiryDate || "").getTime() || 0) -
            (new Date(b.expiryDate || "").getTime() || 0)
        );

      let remaining = med.quantity;

      for (const stock of stockItems) {
        if (remaining <= 0) break;

        const deductAmount = Math.min(remaining, stock.quantity);
        stock.quantity -= deductAmount;
        remaining -= deductAmount;

        deductedItems.push({
          medicationId: med.medicationId,
          quantityDeducted: deductAmount,
          batchNumber: stock.batchNumber,
        });
      }

      if (remaining > 0) {
        return res.status(400).json({
          error: `Insufficient stock for medication ${med.medicationId}. Missing: ${remaining}`,
          status: "error",
        });
      }
    }

    // Create dispensation record
    const dispensationId = uuid();
    res.status(201).json({
      status: "success",
      data: {
        success: true,
        dispensationId,
        deductedItems,
        message: "Dispensation completed successfully",
      },
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message, status: "error" });
  }
});

// ============================================
// SEARCH ENDPOINTS
// ============================================

// GET /api/sesi/medicamentos - Search medications in SESI stock only
router.get("/sesi/medicamentos", (req, res) => {
  try {
    const search = (req.query.q as string)?.toLowerCase() || "";
    const sesiItems = Array.from(storage.sesiStock.values());
    const items = Array.from(storage.items.values());

    const filtered = items
      .filter(
        (item) =>
          item.name.toLowerCase().includes(search) ||
          item.code.toLowerCase().includes(search)
      )
      .map((item) => {
        const totalQty = sesiItems
          .filter((s) => s.itemId === item.id)
          .reduce((sum, s) => sum + s.quantity, 0);
        return { ...item, sesiQuantity: totalQty };
      });

    res.json({ status: "success", data: filtered, total: filtered.length });
  } catch (err: any) {
    res.status(500).json({ error: err.message, status: "error" });
  }
});

export default router;
