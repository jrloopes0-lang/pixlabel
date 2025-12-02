import { test, expect } from '@playwright/test';

test.describe('API Health & Endpoints', () => {
  test('should have health check endpoint', async ({ request }) => {
    const response = await request.get('http://localhost:3000/health');
    expect(response.status()).toBe(200);
  });

  test('should list items via API', async ({ request }) => {
    const response = await request.get('http://localhost:3000/api/items');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('status');
    expect(data.status).toBe('success');
  });

  test('should create item via API', async ({ request }) => {
    const response = await request.post('http://localhost:3000/api/items', {
      data: {
        code: 'TEST-E2E-001',
        name: 'Test Medication E2E',
        presentation: 'Tablet',
        currentStock: 100,
        monthlyConsumption: 10,
        minStockMonths: 3,
      }
    });
    
    expect([201, 200]).toContain(response.status());
    const data = await response.json();
    expect(data.status).toBe('success');
  });

  test('should list SESI patients via API', async ({ request }) => {
    const response = await request.get('http://localhost:3000/api/sesi/pacientes');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.status).toBe('success');
    expect(Array.isArray(data.data)).toBe(true);
  });

  test('should create SESI patient via API', async ({ request }) => {
    const response = await request.post('http://localhost:3000/api/sesi/pacientes', {
      data: {
        name: 'E2E Test Patient',
        cpf: '98765432109',
        dateOfBirth: '1985-05-15',
        phone: '11987654321',
        address: 'Test Address',
        active: true,
      }
    });
    
    expect([201, 200]).toContain(response.status());
    const data = await response.json();
    expect(data.status).toBe('success');
  });

  test('should retrieve SESI medications', async ({ request }) => {
    const response = await request.get('http://localhost:3000/api/sesi/medicamentos');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.status).toBe('success');
    expect(Array.isArray(data.data)).toBe(true);
  });

  test('should audit log endpoint exist', async ({ request }) => {
    const response = await request.get('http://localhost:3000/api/auditLogs');
    // Pode retornar 401 se não autenticado, mas endpoint deve existir
    expect([200, 401, 403]).toContain(response.status());
  });
});

test.describe('Error Handling', () => {
  test('should return 404 for non-existent item', async ({ request }) => {
    const response = await request.get('http://localhost:3000/api/items/non-existent-id');
    expect(response.status()).toBe(404);
  });

  test('should validate item creation data', async ({ request }) => {
    const response = await request.post('http://localhost:3000/api/items', {
      data: {
        // Missing required fields
        name: 'Invalid Item',
      }
    });
    
    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data.status).toBe('error');
  });
});
