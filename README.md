# Comlink

## Overview

Comlink is a secure, trust-based messaging system for communication between applications and services in the Cyberdeck ecosystem. It provides a standardized way for applications to exchange data, request services, and coordinate activities while maintaining strong security boundaries.

## Key Features

- **Trust-Based Messaging**: Messages are validated based on trust relationships
- **Multi-Layer Communication**: Works across browser contexts, processes, and network boundaries
- **Permission Model**: Fine-grained control over which applications can communicate
- **Message Validation**: Ensures messages conform to expected formats
- **Secure Channels**: Establishes trusted communication channels
- **Origin Verification**: Verifies the origin of messages
- **User Consent**: Requires user approval for communication between untrusted applications

## Architecture

Comlink operates across multiple layers:

1. **Intra-Browser**: Communication between applications in the same browser
2. **Inter-Process**: Communication between the browser and OS services
3. **Network**: Communication between devices over the network

### Trust Levels

Comlink defines different trust levels for communication:

1. **Owned Devices**: Full access between your own devices
2. **Trusted Apps**: Limited access between apps from trusted publishers
3. **Untrusted Apps**: Restricted access requiring explicit permission

### Message Format

Comlink messages follow a standardized format:

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
  "timestamp": 1617979200000
}
```

### Permission Model

Comlink implements a permission model for secure communication:

1. **Origin Verification**: Messages are verified against the sender's origin
2. **Permission Requests**: Apps must request permission to communicate with other apps
3. **User Consent**: Users must approve communication between untrusted apps

## Usage

### Basic Usage

```javascript
// Import Comlink
import { Comlink } from '@webax/comlink';

// Create a Comlink instance
const comlink = new Comlink({
  appId: 'app://example.com/my-app'
});

// Send a message to another app
comlink.send('app://example.com/another-app', {
  action: 'getData',
  query: 'user-profile'
}).then(response => {
  console.log('Received response:', response);
}).catch(error => {
  console.error('Error:', error);
});

// Subscribe to messages from another app
comlink.subscribe('app://example.com/another-app', (data) => {
  console.log('Received data:', data);
});
```

### Trust Management

```javascript
// Check if an app is trusted
const isTrusted = comlink.isTrusted('app://example.com/another-app');

// Set trust level for an app
comlink.setTrustLevel('app://example.com/another-app', Comlink.TrustLevel.TRUSTED);

// Request permission to communicate with an app
comlink.requestPermission('app://example.com/another-app').then(granted => {
  if (granted) {
    console.log('Permission granted');
  } else {
    console.log('Permission denied');
  }
});
```

### Event Broadcasting

```javascript
// Send an event to all subscribed apps
comlink.broadcast({
  action: 'statusChanged',
  status: 'online'
});

// Subscribe to broadcast events
comlink.subscribeToEvents((data, sender) => {
  console.log(`Received broadcast from ${sender}:`, data);
});
```

### Service Discovery

```javascript
// Discover available services
comlink.discoverServices().then(services => {
  console.log('Available services:', services);
});

// Register as a service
comlink.registerService('data-provider', {
  actions: ['getData', 'setData', 'deleteData']
});

// Connect to a service
comlink.connectToService('data-provider').then(service => {
  // Use the service
  service.getData('user-profile').then(data => {
    console.log('User profile:', data);
  });
});
```

## Integration

### WebAX Integration

Comlink integrates with WebAX applications through the WebAX manifest:

```json
{
  "webax": {
    "comlink": {
      "expose": [
        "api.getData",
        "api.sendData"
      ],
      "connect": [
        "storage-service",
        "auth-service"
      ]
    }
  }
}
```

### spaghettiOS Integration

Comlink integrates with spaghettiOS through the Privileged Service Layer:

1. **Comlink Service**: Provides the core Comlink functionality
2. **Message Router**: Routes messages between applications and services
3. **Permission Enforcer**: Enforces messaging permissions
4. **Message Validator**: Validates message contents

### CyberdeckOS Integration

Comlink integrates with CyberdeckOS to enable communication between applications and system services:

1. **System Services**: Expose functionality through Comlink
2. **Permission UI**: Provides a user interface for managing Comlink permissions
3. **Service Discovery**: Enables applications to discover available services

## Security Considerations

When using Comlink, consider the following security aspects:

1. **Trust Verification**: Verify the identity of communication partners
2. **Data Validation**: Validate all data received through Comlink
3. **Permission Management**: Carefully manage permissions for communication
4. **User Consent**: Always obtain user consent for communication between untrusted apps
5. **Secure Storage**: Store trust relationships and permissions securely

## Implementation Status

Comlink is currently in development. The following components are in progress:

- **Core Messaging**: Basic messaging functionality
- **Trust Model**: Trust relationship management
- **Permission System**: Permission management and enforcement
- **WebAX Integration**: Integration with WebAX applications
- **spaghettiOS Integration**: Integration with spaghettiOS

## Getting Started

Documentation for getting started with Comlink will be available as the project progresses.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
