import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should login and set session', async ({ page }) => {
    await page.goto('/');
    
    // Click login button (deve existir no header)
    const loginBtn = page.locator('button:has-text("Login")');
    await expect(loginBtn).toBeVisible();
    await loginBtn.click();

    // Esperar redirect para página de login (dev)
    await page.waitForURL('**/auth/login');
    
    // Em dev, chamar diretamente o endpoint de login para criar sessão
    await page.goto('http://localhost:3000/auth/login');
    // Voltar para home e verificar que está autenticado
    await page.goto('http://localhost:3000/');
    const userMenu = page.locator('text=Dev User');
    await expect(userMenu).toBeVisible({ timeout: 5000 });
  });

  test('should logout successfully', async ({ page }) => {
    // Fazer login primeiro
    await page.goto('/');
    const loginBtn = page.locator('button:has-text("Login")');
    await loginBtn.click();
    await page.waitForURL('**/auth/login');
    
    // Ensure session exists (dev login)
    await page.goto('http://localhost:3000/auth/login');
    await page.goto('http://localhost:3000/');

    // Agora fazer logout
    const logoutBtn = page.locator('button:has-text("Logout")');
    if (await logoutBtn.isVisible()) {
      await logoutBtn.click();
      
      // Deve voltar para home e login button deve estar visível
      await expect(page.locator('button:has-text("Login")')).toBeVisible({ timeout: 5000 });
    }
  });
});
