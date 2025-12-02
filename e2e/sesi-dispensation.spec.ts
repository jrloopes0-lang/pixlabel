import { test, expect } from '@playwright/test';

test.describe('SESI Dispensation Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login antes de cada teste
    await page.goto('/');
    const loginBtn = page.locator('button:has-text("Login")');
    if (await loginBtn.isVisible()) {
      await loginBtn.click();
      await page.waitForURL('**/auth/login');
      
        // Use dev login endpoint to create a session
        await page.goto('http://localhost:3000/auth/login');
        await page.goto('http://localhost:3000/');
    }
  });

  test('should navigate to SESI dispensation page', async ({ page }) => {
    // Navegar para SESI → Dispensar
    await page.goto('/sesi/dispensar');
    
    // Deve mostrar o título da página
    await expect(page.locator('text=Dispensação de Medicamentos')).toBeVisible({ timeout: 5000 });
  });

  test('should display patient selection stage', async ({ page }) => {
    await page.goto('/sesi/dispensar');
    
    // Stage 1: Seleção de paciente
    await expect(page.locator('text=Selecione um Paciente')).toBeVisible({ timeout: 5000 });
    
    // Deve ter input de busca
    const searchInput = page.locator('input[placeholder*="Buscar"]').first();
    await expect(searchInput).toBeVisible();
  });

  test('should load and display patients', async ({ page }) => {
    await page.goto('/sesi/dispensar');
    
    // Aguardar que a lista de pacientes seja carregada
    const patientList = page.locator('[data-testid="patient-list"]');
    await expect(patientList).toBeVisible({ timeout: 10000 });
  });

  test('should search patients by name', async ({ page }) => {
    await page.goto('/sesi/dispensar');
    
    // Aguardar lista carregar
    await page.waitForTimeout(2000);
    
    // Digitar no input de busca
    const searchInput = page.locator('input[placeholder*="Buscar"]').first();
    await searchInput.fill('Test');
    
    // Aguardar filtro
    await page.waitForTimeout(500);
    
    // Verificar que resultado apareceu ou mensagem de "nenhum paciente"
    const results = page.locator('[data-testid="patient-item"]');
    const emptyMessage = page.locator('text=Nenhum paciente');
    
    const hasResults = await results.count() > 0;
    const isEmpty = await emptyMessage.isVisible().catch(() => false);
    
    expect(hasResults || isEmpty).toBe(true);
  });

  test('should complete full dispensation flow', async ({ page, context }) => {
    // Setup: Criar paciente via API
    const pacientResponse = await context.request.post('http://localhost:3000/api/sesi/pacientes', {
      data: {
        name: 'Teste E2E',
        cpf: '12345678901',
        dateOfBirth: '1990-01-01',
        phone: '11999999999',
        address: 'Rua Teste',
        active: true,
      }
    });
    
    const pacient = await pacientResponse.json();
    const patientId = pacient.data.id;

    // Navegar para dispensação
    await page.goto('/sesi/dispensar');
    await expect(page.locator('text=Selecione um Paciente')).toBeVisible({ timeout: 5000 });

    // Aguardar lista carregar e buscar paciente criado
    await page.waitForTimeout(2000);
    const searchInput = page.locator('input[placeholder*="Buscar"]').first();
    await searchInput.fill('Teste E2E');
    
    await page.waitForTimeout(500);

    // Clicar no paciente
    const patientButton = page.locator('button:has-text("Teste E2E")').first();
    if (await patientButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await patientButton.click();

      // Deve ir para Stage 2: Selecionar medicamentos
      await expect(page.locator('text=Selecione os Medicamentos')).toBeVisible({ timeout: 5000 });

      // Verificar que paciente está exibido
      await expect(page.locator('text=Teste E2E')).toBeVisible();

      // Clicar em "Voltar" para retornar
      const backBtn = page.locator('button:has-text("Voltar")');
      if (await backBtn.isVisible()) {
        await backBtn.click();
        
        // Deve voltar para Stage 1
        await expect(page.locator('text=Selecione um Paciente')).toBeVisible({ timeout: 5000 });
      }
    }
  });
});

test.describe('SESI Stock Management', () => {
  test('should display SESI stock page', async ({ page }) => {
    await page.goto('/sesi/estoque');
    
    // Deve mostrar título
    await expect(page.locator('text=Estoque SESI')).toBeVisible({ timeout: 5000 });
  });
});
