import type { Schema, SchemaField, ValidationError } from './types.js';

export interface ISchemaValidator {
  validate(data: any, schema: Schema): ValidationError[];
  validateField(value: any, fieldSchema: SchemaField, path: string): ValidationError[];
}

export class SchemaValidator implements ISchemaValidator {
  validate(data: any, schema: Schema): ValidationError[] {
    const errors: ValidationError[] = [];

    // Check if data is null or undefined
    if (data === null || data === undefined) {
      return [
        {
          type: 'missing_field',
          path: 'root',
          message: 'Response data is null or undefined',
        },
      ];
    }

    // Validate each field in the schema
    for (const [fieldName, fieldSchema] of Object.entries(schema)) {
      const fieldErrors = this.validateField(data[fieldName], fieldSchema, fieldName);
      errors.push(...fieldErrors);
    }

    return errors;
  }

  validateField(value: any, fieldSchema: SchemaField, path: string): ValidationError[] {
    const errors: ValidationError[] = [];

    // Check if required field is missing
    if (fieldSchema.required && (value === undefined || value === null)) {
      errors.push({
        type: 'missing_field',
        path,
        message: `Required field '${path}' is missing`,
      });
      return errors;
    }

    // If field is not required and is missing, skip validation
    if (!fieldSchema.required && (value === undefined || value === null)) {
      return errors;
    }

    // Get actual type
    const actualType = this.getActualType(value);

    // Validate type
    if (actualType !== fieldSchema.type) {
      errors.push({
        type: 'type_mismatch',
        path,
        expected: fieldSchema.type,
        actual: actualType,
        message: `Field '${path}' has incorrect type`,
      });
      return errors; // Don't continue validation if type is wrong
    }

    // Validate nested objects
    if (fieldSchema.type === 'object' && fieldSchema.objectSchema) {
      const nestedErrors = this.validate(value, fieldSchema.objectSchema);
      // Prepend current path to nested errors
      errors.push(
        ...nestedErrors.map((err) => ({
          ...err,
          path: `${path}.${err.path}`,
        }))
      );
    }

    // Validate arrays
    if (fieldSchema.type === 'array' && fieldSchema.arrayItemSchema) {
      if (!Array.isArray(value)) {
        errors.push({
          type: 'type_mismatch',
          path,
          expected: 'array',
          actual: actualType,
          message: `Field '${path}' should be an array`,
        });
        return errors;
      }

      // Validate each array element
      value.forEach((item, index) => {
        const itemErrors = this.validate(item, fieldSchema.arrayItemSchema!);
        errors.push(
          ...itemErrors.map((err) => ({
            ...err,
            path: `${path}[${index}].${err.path}`,
          }))
        );
      });
    }

    return errors;
  }

  private getActualType(value: any): string {
    if (value === null) return 'null';
    if (Array.isArray(value)) return 'array';
    return typeof value;
  }
}
