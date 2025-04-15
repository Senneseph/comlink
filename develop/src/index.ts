/**
 * Comlink - A secure, trust-based messaging system
 * 
 * Enables communication between applications and services in the Cyberdeck ecosystem.
 */

// Export message types
export enum MessageType {
  REQUEST = 'request',
  RESPONSE = 'response',
  EVENT = 'event',
  ERROR = 'error'
}

// Export trust levels
export enum TrustLevel {
  OWNED = 'owned',
  TRUSTED = 'trusted',
  UNTRUSTED = 'untrusted'
}

// Export Comlink class
export class Comlink {
  private appId: string;
  private trustStore: Map<string, TrustLevel>;
  private debug: boolean;
  
  /**
   * Create a new Comlink instance
   * @param options Configuration options
   */
  constructor(options: {
    appId: string;
    trustStore?: Map<string, TrustLevel>;
    debug?: boolean;
  }) {
    this.appId = options.appId;
    this.trustStore = options.trustStore || new Map();
    this.debug = options.debug || false;
    
    // Initialize with self as OWNED
    this.trustStore.set(this.appId, TrustLevel.OWNED);
  }
  
  /**
   * Send a message to another application
   * @param to Recipient identifier
   * @param data Message data
   * @param action Action to perform
   * @param options Additional options
   * @returns Promise that resolves with the response
   */
  async send(to: string, data: any, action?: string, options?: any): Promise<any> {
    // Implementation will be added in future versions
    return Promise.resolve({ success: true });
  }
  
  /**
   * Set the trust level for an application
   * @param appId Application identifier
   * @param level Trust level
   */
  setTrustLevel(appId: string, level: TrustLevel): void {
    this.trustStore.set(appId, level);
  }
  
  /**
   * Get the trust level for an application
   * @param appId Application identifier
   * @returns Trust level
   */
  getTrustLevel(appId: string): TrustLevel {
    return this.trustStore.get(appId) || TrustLevel.UNTRUSTED;
  }
  
  /**
   * Check if an application is trusted
   * @param appId Application identifier
   * @returns Whether the application is trusted
   */
  isTrusted(appId: string): boolean {
    const level = this.getTrustLevel(appId);
    return level === TrustLevel.OWNED || level === TrustLevel.TRUSTED;
  }
}

// Default export
export default Comlink;
