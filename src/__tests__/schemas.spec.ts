import { describe, it, expect } from 'vitest';
import { insertItemSchema, insertUserSchema, insertSesiPatientSchema } from '@shared/schema';
import { z } from 'zod';

describe('Schema Validation', () => {
  describe('User Schema', () => {
    it('should validate valid user data', () => {
      const validUser = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'admin',
      };
      expect(() => insertUserSchema.parse(validUser)).not.toThrow();
    });

    it('should reject invalid email', () => {
      const invalidUser = {
        email: 'not-an-email',
        firstName: 'John',
        lastName: 'Doe',
      };
      expect(() => insertUserSchema.parse(invalidUser)).toThrow();
    });

    it('should reject missing required fields', () => {
      const incompleteUser = {
        email: 'test@example.com',
        firstName: 'John',
      };
      expect(() => insertUserSchema.parse(incompleteUser)).toThrow();
    });

    it('should use default role if not provided', () => {
      const userWithoutRole = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      };
      const result = insertUserSchema.parse(userWithoutRole);
      expect(result.role).toBe('operator');
    });
  });

  describe('Item Schema', () => {
    it('should validate valid item data', () => {
      const validItem = {
        code: 'MED-001',
        name: 'Aspirina',
        presentation: '500mg',
        monthlyConsumption: 100,
        minStockMonths: 3,
      };
      expect(() => insertItemSchema.parse(validItem)).not.toThrow();
    });

    it('should reject missing code', () => {
      const invalidItem = {
        name: 'Aspirina',
      };
      expect(() => insertItemSchema.parse(invalidItem)).toThrow();
    });

    it('should allow optional fields', () => {
      const minimalItem = {
        code: 'MED-002',
        name: 'Paracetamol',
      };
      expect(() => insertItemSchema.parse(minimalItem)).not.toThrow();
    });
  });

  describe('SESI Patient Schema', () => {
    it('should validate valid SESI patient data', () => {
      const validPatient = {
        name: 'Maria Silva',
        cpf: '12345678901',
        dateOfBirth: new Date('1990-01-15'),
        phone: '11999999999',
        address: 'Rua Teste, 123',
      };
      expect(() => insertSesiPatientSchema.parse(validPatient)).not.toThrow();
    });

    it('should reject invalid CPF (too short)', () => {
      const invalidPatient = {
        name: 'Maria Silva',
        cpf: '123',
      };
      expect(() => insertSesiPatientSchema.parse(invalidPatient)).toThrow();
    });

    it('should accept optional date fields', () => {
      const patientWithoutDOB = {
        name: 'Carlos Santos',
        cpf: '98765432109',
      };
      expect(() => insertSesiPatientSchema.parse(patientWithoutDOB)).not.toThrow();
    });
  });
});
