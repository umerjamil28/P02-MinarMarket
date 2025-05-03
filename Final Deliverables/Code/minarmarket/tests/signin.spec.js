import { test, expect } from '@playwright/test';

// Test case for sign-in functionality
test.describe('Sign-in functionality', () => {
  // Test valid credentials and successful redirection
  test('should sign in with valid credentials and redirect to dashboard', async ({ page }) => {
    // Navigate to the signin page
    await page.goto('/signin');
    
    // Wait for the form to be visible
    await page.waitForSelector('form');
    
    // Fill in the email and password fields with valid credentials
    await page.fill('#email', 'buyer@gmail.com');
    await page.fill('#password', 'DZ&zamu99;HeeC?');
    
    // Submit the form
    await page.click('button[type="submit"]');

    // Wait for navigation to complete (should redirect to dashboard)
    await page.waitForURL('**/app/dashboard');
    
    // Verify we reached the dashboard
    expect(page.url()).toContain('/app/dashboard');
    
    // Verify local storage has the token (authentication successful)
    const token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).toBeTruthy();
  });
  
  // Test invalid password handling
  test('should show error message with incorrect password', async ({ page }) => {
    // Navigate to the signin page
    await page.goto('/signin');
    
    // Wait for the form to be visible
    await page.waitForSelector('form');
    
    // Fill in the email with valid email but incorrect password
    await page.fill('#email', 'buyer@gmail.com');
    await page.fill('#password', 'incorrectPassword');
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Wait for error message to appear
    await page.waitForSelector('.text-red-500');
    
    // Verify error message is displayed
    const errorVisible = await page.isVisible('.text-red-500');
    expect(errorVisible).toBe(true);
    
    // Verify we did not navigate away from login page
    expect(page.url()).toContain('/signin');
    
    // Verify local storage does not have a token
    const token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).toBeFalsy();
  });
  
  // Test form validation for empty fields
  test('should validate required fields', async ({ page }) => {
    // Navigate to the signin page
    await page.goto('/signin');
    
    // Submit the form without filling any fields
    await page.click('button[type="submit"]');
    
    // Check HTML5 validation is preventing submission (form should still be on the page)
    const emailInput = await page.$('#email');
    const isEmailInputValid = await emailInput.evaluate(el => el.validity.valid);
    expect(isEmailInputValid).toBe(false);
    
    // Verify we're still on the login page
    expect(page.url()).toContain('/signin');
  });
  
  // Test "show password" functionality
  test('should toggle password visibility when clicking the eye icon', async ({ page }) => {
    // Navigate to the signin page
    await page.goto('/signin');
    
    // Password should be hidden by default
    let inputType = await page.getAttribute('#password', 'type');
    expect(inputType).toBe('password');
    
    // Click the eye icon to show password
    await page.click('button[type="button"]');
    
    // Password should now be visible
    inputType = await page.getAttribute('#password', 'type');
    expect(inputType).toBe('text');
    
    // Click the eye icon again to hide password
    await page.click('button[type="button"]');
    
    // Password should be hidden again
    inputType = await page.getAttribute('#password', 'type');
    expect(inputType).toBe('password');
  });
});