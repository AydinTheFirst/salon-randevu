import { BadRequestException, ValidationError, ValidationPipe } from '@nestjs/common';

export class CustomValidationPipe extends ValidationPipe {
  createExceptionFactory() {
    return (validationErrors: ValidationError[] = []) => {
      const messages = this.flattenValidationErrors(validationErrors);
      return new BadRequestException({
        code: 'VALIDATION_ERROR',
        errors: messages,
        message: 'Validation failed',
        statusCode: 400,
      });
    };
  }

  protected flattenValidationErrors(validationErrors: ValidationError[]): string[] {
    return validationErrors.map((error) => Object.values(error.constraints).join(', '));
  }
}
