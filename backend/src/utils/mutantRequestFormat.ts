
/**
 * Little helper function so the mutation of the request is 
 * well behaved.
 * @param data The final data to be sent back
 * @param httpCode Self explanatory
 * @param message The message that goes along with the response
 * @returns 
 */
export const formatResponse = (data: any, httpCode: number, message: string) => ({
    data,
    message,
    httpCode,
});


/** Cookie Cutter to remove uneeded data so prisma is happy */
/**
 * Cookie Cutter to remove uneeded data so prisma is happy 
 * @param data Any request JSON object
 * @param allowedFields The cookie cutter shape
 * @returns A cookie
 * 
 * @example 
 * // Ridiculous Typescript use this to get a shape
 * // const allowedFields = Object.keys({} as Unit) as (keyof Unit)[];
 * const allowedFields = 
 * ["name" , "id" , "year" , "convenorId"] as (keyof Unit)[];
 * 
 * const arg = filterFields<Unit>(arg,allowedFields);
 * const unit = await this.unitService.create(arg);
 * 
 */
export function filterFields<T>(data: any, allowedFields: (keyof T)[]): Partial<T> {
    const result: Partial<T> = {};
    allowedFields.forEach((field) => {
      if (data[field] !== undefined) {
        result[field] = data[field];
      }
    });
    return result;
  }