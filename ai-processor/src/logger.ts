// src/utils/errorLogger.ts
import { appendFileSync, mkdirSync, existsSync } from 'fs';
import { resolve } from 'path';

// Function to log errors to a file with a timestamp
const logErrorToFile = (errorMessage: string) => {
  const logDir = resolve(__dirname, './logs'); 
  const logFilePath = resolve(logDir, 'error-log.txt'); 
  if (!existsSync(logDir)) {
    mkdirSync(logDir);
  }

  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] - ERROR: ${errorMessage}\n`;

  appendFileSync(logFilePath, logMessage, 'utf8'); 
};

// Decorator function to log errors from decorated methods
export function LogError(): MethodDecorator {
  return function (
    target: Object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const originalMethod = descriptor.value; // Store the original method

    descriptor.value = async function (...args: any[]) {
      try {
        // Call the original method and return its result
        return await originalMethod.apply(this, args);
      } catch (error) {
        // Type assertion to handle the 'unknown' error type
        if (error instanceof Error) {
          logErrorToFile(`${String(propertyKey)} failed: ${error.message}`);
        } else {
          logErrorToFile(`${String(propertyKey)} failed: An unknown error occurred.`);
        }
        throw error; 
      }
    };

    return descriptor; 
  };
}
