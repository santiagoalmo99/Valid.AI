/**
 * Lightweight Validation Utility
 * Provides a chainable API for validating data schemas without external dependencies.
 */

export type ValidationResult = {
  valid: boolean;
  errors: string[];
};

export class Validator<T> {
  private rules: ((value: T) => string | null)[] = [];

  constructor(private label: string) {}

  // Rules
  required(): Validator<T> {
    this.rules.push((val) => {
      if (val === undefined || val === null || val === '') return `${this.label} is required`;
      if (Array.isArray(val) && val.length === 0) return `${this.label} cannot be empty`;
      return null;
    });
    return this;
  }

  minLength(min: number): Validator<T> {
    this.rules.push((val) => {
      if (typeof val === 'string' && val.length < min) return `${this.label} must be at least ${min} characters`;
      if (Array.isArray(val) && val.length < min) return `${this.label} must have at least ${min} items`;
      return null;
    });
    return this;
  }

  maxLength(max: number): Validator<T> {
    this.rules.push((val) => {
      if (typeof val === 'string' && val.length > max) return `${this.label} must be at most ${max} characters`;
      return null;
    });
    return this;
  }

  min(min: number): Validator<T> {
    this.rules.push((val) => {
      if (typeof val === 'number' && val < min) return `${this.label} must be at least ${min}`;
      return null;
    });
    return this;
  }

  max(max: number): Validator<T> {
    this.rules.push((val) => {
      if (typeof val === 'number' && val > max) return `${this.label} must be at most ${max}`;
      return null;
    });
    return this;
  }

  email(): Validator<T> {
    this.rules.push((val) => {
      if (typeof val === 'string' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return `${this.label} must be a valid email`;
      return null;
    });
    return this;
  }

  // Execution
  validate(value: T): string | null {
    for (const rule of this.rules) {
      const error = rule(value);
      if (error) return error;
    }
    return null;
  }
}

export const v = {
  string: (label: string) => new Validator<string>(label),
  number: (label: string) => new Validator<number>(label),
  array: <T>(label: string) => new Validator<T[]>(label),
  any: <T>(label: string) => new Validator<T>(label),
};

export const validateSchema = (data: any, schema: Record<string, Validator<any>>): ValidationResult => {
  const errors: string[] = [];
  
  for (const [key, validator] of Object.entries(schema)) {
    const error = validator.validate(data[key]);
    if (error) errors.push(error);
  }

  return {
    valid: errors.length === 0,
    errors
  };
};
