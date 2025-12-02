import { describe, it, expect } from 'vitest';

/**
 * Lógica de Validação - FIFO para dispensações SESI
 * Testa deduções por data de validade (mais antigo primeiro)
 */

interface StockItem {
  id: string;
  batchNumber: string;
  expiryDate: Date;
  quantity: number;
}

function deductByFIFO(stock: StockItem[], quantityNeeded: number): { deducted: StockItem[], remaining: number } {
  const deducted: StockItem[] = [];
  let remaining = quantityNeeded;

  // Ordenar por expiryDate (mais antigo primeiro)
  const sorted = [...stock].sort((a, b) => {
    if (!a.expiryDate) return 1;
    if (!b.expiryDate) return -1;
    return a.expiryDate.getTime() - b.expiryDate.getTime();
  });

  for (const item of sorted) {
    if (remaining <= 0) break;

    const toDeduct = Math.min(item.quantity, remaining);
    deducted.push({
      ...item,
      quantity: toDeduct,
    });
    remaining -= toDeduct;
  }

  return { deducted, remaining };
}

describe('FIFO Deduction Logic', () => {
  it('should deduct from oldest batch first', () => {
    const stock: StockItem[] = [
      { id: '1', batchNumber: 'LOTE-2025-001', expiryDate: new Date('2025-12-31'), quantity: 50 },
      { id: '2', batchNumber: 'LOTE-2025-002', expiryDate: new Date('2025-06-30'), quantity: 100 },
    ];

    const result = deductByFIFO(stock, 75);

    expect(result.remaining).toBe(0);
    expect(result.deducted).toHaveLength(1);
    expect(result.deducted[0].batchNumber).toBe('LOTE-2025-002'); // Older (June 30)
    expect(result.deducted[0].quantity).toBe(75); // Fully deducted from oldest batch
  });

  it('should handle partial deduction from first batch', () => {
    const stock: StockItem[] = [
      { id: '1', batchNumber: 'LOTE-001', expiryDate: new Date('2025-03-15'), quantity: 100 },
      { id: '2', batchNumber: 'LOTE-002', expiryDate: new Date('2025-12-31'), quantity: 50 },
    ];

    const result = deductByFIFO(stock, 60);

    expect(result.remaining).toBe(0);
    expect(result.deducted).toHaveLength(1);
    expect(result.deducted[0].quantity).toBe(60);
  });

  it('should use multiple batches if needed', () => {
    const stock: StockItem[] = [
      { id: '1', batchNumber: 'LOTE-001', expiryDate: new Date('2025-01-31'), quantity: 20 },
      { id: '2', batchNumber: 'LOTE-002', expiryDate: new Date('2025-06-30'), quantity: 30 },
      { id: '3', batchNumber: 'LOTE-003', expiryDate: new Date('2025-12-31'), quantity: 50 },
    ];

    const result = deductByFIFO(stock, 75);

    expect(result.remaining).toBe(0);
    expect(result.deducted).toHaveLength(3);
    expect(result.deducted[0].quantity).toBe(20); // First batch fully deducted
    expect(result.deducted[1].quantity).toBe(30); // Second batch fully deducted
    expect(result.deducted[2].quantity).toBe(25); // Third batch partially deducted
  });

  it('should report remaining quantity if insufficient stock', () => {
    const stock: StockItem[] = [
      { id: '1', batchNumber: 'LOTE-001', expiryDate: new Date('2025-06-30'), quantity: 30 },
    ];

    const result = deductByFIFO(stock, 100);

    expect(result.remaining).toBe(70);
    expect(result.deducted).toHaveLength(1);
    expect(result.deducted[0].quantity).toBe(30);
  });

  it('should handle batches without expiry date (treat as recent)', () => {
    const stock: StockItem[] = [
      { id: '1', batchNumber: 'LOTE-001', expiryDate: new Date('2025-03-15'), quantity: 50 },
      { id: '2', batchNumber: 'LOTE-002', expiryDate: undefined as any, quantity: 50 }, // No expiry
    ];

    const result = deductByFIFO(stock, 75);

    expect(result.deducted[0].batchNumber).toBe('LOTE-001'); // With expiry deducted first
    expect(result.deducted[1].batchNumber).toBe('LOTE-002'); // Without expiry deducted second
  });

  it('should handle empty stock', () => {
    const stock: StockItem[] = [];
    const result = deductByFIFO(stock, 100);

    expect(result.remaining).toBe(100);
    expect(result.deducted).toHaveLength(0);
  });
});
