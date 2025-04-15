# Comlink Technical Specification

## 1. Introduction

### 1.1 Purpose

This document specifies the Comlink messaging system, a secure, trust-based communication protocol for applications and services in the Cyberdeck ecosystem. Comlink enables applications to exchange data, request services, and coordinate activities while maintaining strong security boundaries.

### 1.2 Scope

This specification covers:

- The Comlink messaging protocol
- Trust relationships and levels
- Message format and validation
- Permission model and enforcement
- Communication layers and channels
- API and implementation guidelines

### 1.3 Terminology

- **Comlink**: The messaging system specified in this document
- **Message**: A unit of communication between applications
- **Channel**: A communication pathway between applications
- **Trust Level**: The level of trust between applications
- **Permission**: Authorization to communicate with another application
- **Origin**: The source of a message, typically an application identifier
- **Endpoint**: An application or service that can send or receive messages

## 2. Architecture

### 2.1 Overview

Comlink is designed as a layered architecture that enables communication across different contexts:

```
+---------------------------------------------------------------+
|                        Applications                           |
+---------------------------------------------------------------+
|                       Comlink API                             |
+---------------------------------------------------------------+
|                     Trust Manager                             |
+---------------------------------------------------------------+
|                    Permission Manager                         |
+---------------------------------------------------------------+
|                     Message Router                            |
+---------------------------------------------------------------+
|                    Transport Layers                           |
| +-------------+ +-------------+ +-------------+ +-------------+|
| |Intra-Browser| |Inter-Process| |   Network   | |  Bluetooth  ||
| +-------------+ +-------------+ +-------------+ +-------------+|
+---------------------------------------------------------------+
```

### 2.2 Components

#### 2.2.1 Comlink API

The Comlink API provides a simple, consistent interface for applications to send and receive messages. It abstracts the underlying transport mechanisms and handles trust and permission management.

#### 2.2.2 Trust Manager

The Trust Manager maintains trust relationships between applications and enforces trust levels. It provides mechanisms for establishing, verifying, and revoking trust.

#### 2.2.3 Permission Manager

The Permission Manager enforces the permission model, ensuring that applications can only communicate with other applications for which they have permission. It handles permission requests, grants, and revocations.

#### 2.2.4 Message Router

The Message Router is responsible for routing messages between applications. It determines the appropriate transport layer to use and ensures that messages are delivered to the correct recipient.

#### 2.2.5 Transport Layers

The Transport Layers provide the actual communication mechanisms. Comlink supports multiple transport layers:

- **Intra-Browser**: Communication between applications in the same browser (e.g., BroadcastChannel, postMessage)
- **Inter-Process**: Communication between processes on the same device (e.g., IPC, shared memory)
- **Network**: Communication between devices over the network (e.g., WebSockets, WebRTC)
- **Bluetooth**: Communication between devices over Bluetooth (e.g., Web Bluetooth)

### 2.3 Communication Layers

Comlink operates across multiple communication layers:

#### 2.3.1 Intra-Browser Layer

The Intra-Browser Layer enables communication between applications running in the same browser. It uses browser-specific mechanisms such as BroadcastChannel and postMessage.

Key features:
- High performance
- Same-origin policy enforcement
- Automatic serialization/deserialization
- Support for structured cloning

#### 2.3.2 Inter-Process Layer

The Inter-Process Layer enables communication between processes on the same device. It uses operating system mechanisms such as IPC and shared memory.

Key features:
- Process isolation
- Permission enforcement
- Resource control
- Secure message passing

#### 2.3.3 Network Layer

The Network Layer enables communication between devices over the network. It uses web technologies such as WebSockets and WebRTC.

Key features:
- Secure connections (TLS/DTLS)
- Peer discovery
- NAT traversal
- Connection management

#### 2.3.4 Bluetooth Layer

The Bluetooth Layer enables communication between devices over Bluetooth. It uses the Web Bluetooth API.

Key features:
- Device discovery
- Service discovery
- Connection management
- Characteristic reading/writing

## 3. Trust Model

### 3.1 Trust Levels

Comlink defines three trust levels:

1. **OWNED**: The highest trust level, for applications on devices owned by the same user. Applications with OWNED trust have full access to each other's APIs.

2. **TRUSTED**: A medium trust level, for applications from trusted publishers. Applications with TRUSTED trust have limited access to each other's APIs, based on explicit permissions.

3. **UNTRUSTED**: The lowest trust level, for applications from unknown or untrusted publishers. Applications with UNTRUSTED trust have no access to each other's APIs without explicit user consent.

### 3.2 Trust Establishment

Trust can be established in several ways:

1. **User Configuration**: Users can manually configure trust relationships between applications.

2. **Publisher Verification**: Applications from the same verified publisher can automatically establish TRUSTED relationships.

3. **Certificate Verification**: Applications can present certificates that verify their identity and establish trust.

4. **Trust Transitivity**: Trust can be transitive in certain cases, where if A trusts B and B trusts C, then A may trust C.

### 3.3 Trust Verification

Trust is verified during message exchange:

1. **Origin Verification**: The origin of a message is verified against the sender's claimed identity.

2. **Trust Level Check**: The trust level between the sender and recipient is checked.

3. **Permission Check**: The sender's permission to communicate with the recipient is checked.

4. **User Consent**: For UNTRUSTED relationships, user consent is required before communication can proceed.

### 3.4 Trust Revocation

Trust can be revoked in several ways:

1. **User Revocation**: Users can manually revoke trust relationships.

2. **Automatic Revocation**: Trust can be automatically revoked if security conditions change.

3. **Expiration**: Trust relationships can have an expiration time.

4. **Publisher Revocation**: Publishers can revoke trust for their applications.

## 4. Message Format

### 4.1 Message Structure

Comlink messages are JSON objects with the following structure:

```json
{
  "from": "app://example.com/my-app",
  "to": "app://example.com/another-app",
  "id": "msg-123456",
  "type": "request",
  "action": "getData",
  "data": {
    "query": "user-profile"
  },
  "timestamp": 1617979200000,
  "responseToId": null,
  "ttl": 30000,
  "flags": {
    "urgent": false,
    "encrypted": false
  }
}
```

### 4.2 Message Fields

| Field | Type | Description |
|-------|------|-------------|
| `from` | String | The sender's identifier |
| `to` | String | The recipient's identifier |
| `id` | String | A unique identifier for the message |
| `type` | String | The message type (request, response, event, error) |
| `action` | String | The action to perform (for requests) |
| `data` | Object | The message payload |
| `timestamp` | Number | The message creation timestamp (milliseconds since epoch) |
| `responseToId` | String | The ID of the message this is a response to (for responses) |
| `ttl` | Number | Time-to-live in milliseconds (optional) |
| `flags` | Object | Additional message flags (optional) |

### 4.3 Message Types

Comlink defines four message types:

1. **request**: A request for an action to be performed. Requires a response.

2. **response**: A response to a request. Contains the result of the requested action.

3. **event**: A notification of an event. Does not require a response.

4. **error**: An error response to a request. Contains error information.

### 4.4 Message Validation

Messages are validated before processing:

1. **Schema Validation**: Messages must conform to the Comlink message schema.

2. **Field Validation**: Message fields must contain valid values.

3. **Origin Validation**: The `from` field must match the actual sender's origin.

4. **Timestamp Validation**: The `timestamp` must be within an acceptable range.

5. **TTL Validation**: Messages with an expired TTL are discarded.

## 5. Permission Model

### 5.1 Permission Types

Comlink defines several permission types:

1. **Send**: Permission to send messages to an application.

2. **Receive**: Permission to receive messages from an application.

3. **Action**: Permission to request specific actions from an application.

4. **Event**: Permission to receive specific events from an application.

### 5.2 Permission Scope

Permissions can have different scopes:

1. **Application**: Permission applies to the entire application.

2. **Action**: Permission applies to specific actions.

3. **Event**: Permission applies to specific events.

4. **Data**: Permission applies to specific data fields.

### 5.3 Permission Requests

Applications can request permissions:

1. **Explicit Requests**: Applications can explicitly request permissions.

2. **Manifest Declarations**: Applications can declare required permissions in their manifest.

3. **Implicit Requests**: Permissions can be implicitly requested when sending a message.

### 5.4 Permission Grants

Permissions can be granted in several ways:

1. **User Grants**: Users can manually grant permissions.

2. **Automatic Grants**: Permissions can be automatically granted based on trust level.

3. **Temporary Grants**: Permissions can be granted temporarily for a specific session.

4. **Conditional Grants**: Permissions can be granted with conditions (e.g., only when the app is in the foreground).

### 5.5 Permission Enforcement

Permissions are enforced during message exchange:

1. **Send Enforcement**: The sender must have permission to send messages to the recipient.

2. **Receive Enforcement**: The recipient must have permission to receive messages from the sender.

3. **Action Enforcement**: The sender must have permission to request the specific action.

4. **Event Enforcement**: The recipient must have permission to receive the specific event.

## 6. API

### 6.1 Core API

#### 6.1.1 Constructor

```javascript
/**
 * Create a new Comlink instance
 * @param {Object} options - Configuration options
 * @param {string} options.appId - The application identifier
 * @param {Object} options.trustStore - Initial trust store
 * @param {boolean} options.debug - Enable debug logging
 * @returns {Comlink} A new Comlink instance
 */
const comlink = new Comlink({
  appId: 'app://example.com/my-app',
  trustStore: new Map(),
  debug: false
});
```

#### 6.1.2 Sending Messages

```javascript
/**
 * Send a message to another application
 * @param {string} to - The recipient's identifier
 * @param {Object} data - The message data
 * @param {string} action - The action to perform
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} A promise that resolves with the response
 */
comlink.send(to, data, action, options);

/**
 * Send an event to another application
 * @param {string} to - The recipient's identifier
 * @param {Object} data - The event data
 * @param {string} action - The event action
 * @param {Object} options - Additional options
 */
comlink.sendEvent(to, data, action, options);

/**
 * Broadcast an event to all subscribed applications
 * @param {Object} data - The event data
 * @param {string} action - The event action
 * @param {Object} options - Additional options
 */
comlink.broadcast(data, action, options);
```

#### 6.1.3 Receiving Messages

```javascript
/**
 * Subscribe to messages from an application
 * @param {string} appId - The application identifier
 * @param {Function} callback - The callback function
 */
comlink.subscribe(appId, callback);

/**
 * Unsubscribe from messages from an application
 * @param {string} appId - The application identifier
 */
comlink.unsubscribe(appId);

/**
 * Subscribe to broadcast events
 * @param {Function} callback - The callback function
 */
comlink.subscribeToEvents(callback);

/**
 * Unsubscribe from broadcast events
 */
comlink.unsubscribeFromEvents();
```

#### 6.1.4 Trust Management

```javascript
/**
 * Set the trust level for an application
 * @param {string} appId - The application identifier
 * @param {TrustLevel} level - The trust level
 */
comlink.setTrustLevel(appId, level);

/**
 * Get the trust level for an application
 * @param {string} appId - The application identifier
 * @returns {TrustLevel} The trust level
 */
comlink.getTrustLevel(appId);

/**
 * Check if an application is trusted
 * @param {string} appId - The application identifier
 * @returns {boolean} Whether the application is trusted
 */
comlink.isTrusted(appId);

/**
 * Request permission to communicate with an application
 * @param {string} appId - The application identifier
 * @returns {Promise<boolean>} A promise that resolves with whether permission was granted
 */
comlink.requestPermission(appId);
```

#### 6.1.5 Service Discovery

```javascript
/**
 * Discover available services
 * @returns {Promise<Array<Object>>} A promise that resolves with the available services
 */
comlink.discoverServices();

/**
 * Register as a service
 * @param {string} serviceId - The service identifier
 * @param {Object} serviceInfo - Information about the service
 */
comlink.registerService(serviceId, serviceInfo);

/**
 * Connect to a service
 * @param {string} serviceId - The service identifier
 * @returns {Promise<Object>} A promise that resolves with the service proxy
 */
comlink.connectToService(serviceId);
```

### 6.2 Advanced API

#### 6.2.1 Channel Management

```javascript
/**
 * Create a dedicated channel for communication with an application
 * @param {string} appId - The application identifier
 * @param {Object} options - Channel options
 * @returns {Promise<Channel>} A promise that resolves with the channel
 */
comlink.createChannel(appId, options);

/**
 * Close a channel
 * @param {Channel} channel - The channel to close
 */
comlink.closeChannel(channel);
```

#### 6.2.2 Encryption

```javascript
/**
 * Enable end-to-end encryption for communication with an application
 * @param {string} appId - The application identifier
 * @returns {Promise<boolean>} A promise that resolves with whether encryption was enabled
 */
comlink.enableEncryption(appId);

/**
 * Disable end-to-end encryption for communication with an application
 * @param {string} appId - The application identifier
 */
comlink.disableEncryption(appId);
```

#### 6.2.3 Message Filtering

```javascript
/**
 * Add a message filter
 * @param {Function} filter - The filter function
 * @returns {string} The filter ID
 */
comlink.addFilter(filter);

/**
 * Remove a message filter
 * @param {string} filterId - The filter ID
 */
comlink.removeFilter(filterId);
```

#### 6.2.4 Debugging

```javascript
/**
 * Enable debug logging
 */
comlink.enableDebug();

/**
 * Disable debug logging
 */
comlink.disableDebug();

/**
 * Get debug logs
 * @returns {Array<Object>} The debug logs
 */
comlink.getDebugLogs();
```

## 7. Security Considerations

### 7.1 Origin Verification

Comlink verifies the origin of messages to prevent spoofing:

1. **Browser Context**: In browser contexts, the origin is verified using the same-origin policy.

2. **Process Context**: In process contexts, the process ID and credentials are verified.

3. **Network Context**: In network contexts, TLS certificates and WebRTC identity are verified.

### 7.2 Message Integrity

Comlink ensures message integrity:

1. **Transport Security**: Messages are transmitted over secure channels (TLS, DTLS).

2. **Message Signing**: Messages can be signed to verify their integrity.

3. **Tamper Detection**: Message tampering is detected through integrity checks.

### 7.3 Message Confidentiality

Comlink protects message confidentiality:

1. **Transport Encryption**: Messages are encrypted during transmission.

2. **End-to-End Encryption**: Messages can be end-to-end encrypted for sensitive data.

3. **Key Management**: Encryption keys are securely managed and rotated.

### 7.4 Denial of Service Protection

Comlink protects against denial of service attacks:

1. **Rate Limiting**: Message rates are limited to prevent flooding.

2. **Message Size Limits**: Message sizes are limited to prevent resource exhaustion.

3. **TTL Enforcement**: Messages with expired TTLs are discarded.

### 7.5 Permission Abuse Prevention

Comlink prevents permission abuse:

1. **Permission Review**: Users can review and revoke permissions.

2. **Permission Monitoring**: Unusual permission usage is monitored and flagged.

3. **Permission Isolation**: Permissions are isolated by origin and context.

## 8. Implementation Guidelines

### 8.1 Browser Implementation

For browser implementations:

1. **Use BroadcastChannel**: For communication between tabs/windows from the same origin.

2. **Use postMessage**: For communication between frames from different origins.

3. **Use WebRTC**: For peer-to-peer communication between browsers.

4. **Use WebSockets**: For client-server communication.

### 8.2 Native Implementation

For native implementations:

1. **Use IPC**: For communication between processes on the same device.

2. **Use Shared Memory**: For high-performance communication between processes.

3. **Use Network Sockets**: For communication between devices.

4. **Use Bluetooth**: For communication between nearby devices.

### 8.3 Hybrid Implementation

For hybrid implementations:

1. **Use WebViews**: For communication between web and native components.

2. **Use JavaScript Bridges**: For calling native functions from web components.

3. **Use Native Messaging**: For communication between browsers and native applications.

### 8.4 Performance Optimization

For optimal performance:

1. **Message Batching**: Batch multiple messages into a single transmission.

2. **Message Compression**: Compress messages to reduce bandwidth usage.

3. **Connection Pooling**: Reuse connections for multiple messages.

4. **Lazy Initialization**: Initialize components only when needed.

## 9. Integration

### 9.1 WebAX Integration

Comlink integrates with WebAX applications:

1. **Manifest Integration**: WebAX manifests can declare Comlink permissions and exposed APIs.

2. **WebAX-Lib Integration**: Comlink is available as a module in WebAX-Lib.

3. **WebAX Launcher Integration**: The WebAX Launcher manages Comlink permissions.

### 9.2 spaghettiOS Integration

Comlink integrates with spaghettiOS:

1. **Privileged Service Layer**: Comlink is integrated with the Privileged Service Layer.

2. **Permission Enforcement**: spaghettiOS enforces Comlink permissions.

3. **Process Isolation**: Comlink respects process isolation boundaries.

### 9.3 CyberdeckOS Integration

Comlink integrates with CyberdeckOS:

1. **System Services**: CyberdeckOS exposes system services through Comlink.

2. **Permission UI**: CyberdeckOS provides a UI for managing Comlink permissions.

3. **Service Discovery**: CyberdeckOS enables service discovery through Comlink.

## 10. Future Considerations

### 10.1 Federation

Future versions of Comlink may support federation:

1. **Federated Identity**: Support for federated identity providers.

2. **Federated Trust**: Support for federated trust relationships.

3. **Federated Services**: Support for federated service discovery.

### 10.2 Mesh Networking

Future versions of Comlink may support mesh networking:

1. **Peer Discovery**: Automatic discovery of peers on the local network.

2. **Message Routing**: Routing messages through intermediate peers.

3. **Offline Operation**: Operation without internet connectivity.

### 10.3 Quantum Resistance

Future versions of Comlink may be quantum-resistant:

1. **Post-Quantum Cryptography**: Use of quantum-resistant cryptographic algorithms.

2. **Hybrid Encryption**: Combination of classical and quantum-resistant encryption.

3. **Key Agility**: Ability to quickly switch to new cryptographic algorithms.

## Appendix A: Message Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Comlink Message",
  "type": "object",
  "properties": {
    "from": {
      "type": "string",
      "format": "uri"
    },
    "to": {
      "type": "string",
      "format": "uri"
    },
    "id": {
      "type": "string"
    },
    "type": {
      "type": "string",
      "enum": ["request", "response", "event", "error"]
    },
    "action": {
      "type": "string"
    },
    "data": {
      "type": "object"
    },
    "timestamp": {
      "type": "number"
    },
    "responseToId": {
      "type": ["string", "null"]
    },
    "ttl": {
      "type": "number"
    },
    "flags": {
      "type": "object",
      "properties": {
        "urgent": {
          "type": "boolean"
        },
        "encrypted": {
          "type": "boolean"
        }
      }
    }
  },
  "required": ["from", "to", "id", "type", "timestamp"],
  "additionalProperties": false
}
```

## Appendix B: Error Codes

| Code | Name | Description |
|------|------|-------------|
| 1000 | UNKNOWN_ERROR | An unknown error occurred |
| 1001 | PERMISSION_DENIED | Permission to perform the action was denied |
| 1002 | INVALID_MESSAGE | The message format is invalid |
| 1003 | TIMEOUT | The request timed out |
| 1004 | RECIPIENT_UNAVAILABLE | The recipient is unavailable |
| 1005 | ACTION_NOT_FOUND | The requested action was not found |
| 1006 | INVALID_PARAMETERS | The parameters for the action are invalid |
| 1007 | INTERNAL_ERROR | An internal error occurred in the recipient |
| 1008 | TRUST_ERROR | A trust-related error occurred |
| 1009 | ENCRYPTION_ERROR | An encryption-related error occurred |
| 1010 | RATE_LIMIT_EXCEEDED | The rate limit for messages was exceeded |
