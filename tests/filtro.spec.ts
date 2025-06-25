import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:8080/');
  await page.getByRole('textbox', { name: 'Data Início' }).fill('2022-01-01');
  await page.getByRole('textbox', { name: 'Data Fim' }).fill('2022-12-31');
  await page.getByRole('button', { name: 'Aplicar Filtros' }).click();
  await page.getByText('Nenhum dado disponível para').click();
});
