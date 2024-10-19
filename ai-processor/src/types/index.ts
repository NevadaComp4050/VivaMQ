/**
 * Represents a message object used for communication between services.
 * ```
 * export interface Message {
 *   type: string;
 *   data: any;
 *   uuid: string;
 * }
 * ```
 */
export interface Message {
    type: string;
    data: any;
    uuid: string;
  }