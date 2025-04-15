// Comlink Demo App

// Import Comlink (this would normally be imported from the actual library)
import { Comlink, MessageType, TrustLevel } from '../dist/comlink.esm.js';

document.addEventListener('DOMContentLoaded', () => {
  // DOM elements
  const app1Message = document.getElementById('app1-message');
  const app1Send = document.getElementById('app1-send');
  const app1Log = document.getElementById('app1-log');
  
  const app2Message = document.getElementById('app2-message');
  const app2Send = document.getElementById('app2-send');
  const app2Log = document.getElementById('app2-log');
  
  const trustLevel = document.getElementById('trust-level');
  const setTrust = document.getElementById('set-trust');
  const systemLog = document.getElementById('system-log');
  
  // Create Comlink instances
  const app1Comlink = new Comlink({
    appId: 'app://example.com/app1',
    debug: true
  });
  
  const app2Comlink = new Comlink({
    appId: 'app://example.com/app2',
    debug: true
  });
  
  // Log function
  function log(message, type = 'info') {
    const logEntry = document.createElement('div');
    logEntry.className = `log-entry ${type}`;
    logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    systemLog.appendChild(logEntry);
    systemLog.scrollTop = systemLog.scrollHeight;
  }
  
  // Add message to app log
  function addMessage(logElement, message, isSent) {
    const messageElement = document.createElement('div');
    messageElement.className = `message ${isSent ? 'sent' : 'received'}`;
    messageElement.textContent = message;
    logElement.appendChild(messageElement);
    logElement.scrollTop = logElement.scrollHeight;
  }
  
  // Set up event listeners
  app1Send.addEventListener('click', () => {
    const message = app1Message.value.trim();
    if (!message) return;
    
    log(`App1 sending message: "${message}"`);
    
    // In a real implementation, this would use the actual Comlink send method
    // For demo purposes, we'll simulate the message exchange
    setTimeout(() => {
      const isTrusted = trustLevel.value !== 'untrusted';
      
      if (isTrusted) {
        addMessage(app1Log, message, true);
        addMessage(app2Log, message, false);
        log(`Message delivered from App1 to App2`);
      } else {
        log(`Message blocked: App2 does not trust App1`, 'error');
        
        // Show permission request dialog
        if (confirm('App1 wants to send a message to App2. Allow?')) {
          log(`User granted permission for App1 to message App2`);
          trustLevel.value = 'trusted';
          addMessage(app1Log, message, true);
          addMessage(app2Log, message, false);
        } else {
          log(`User denied permission for App1 to message App2`, 'warning');
        }
      }
    }, 500);
    
    app1Message.value = '';
  });
  
  app2Send.addEventListener('click', () => {
    const message = app2Message.value.trim();
    if (!message) return;
    
    log(`App2 sending message: "${message}"`);
    
    // In a real implementation, this would use the actual Comlink send method
    // For demo purposes, we'll simulate the message exchange
    setTimeout(() => {
      const isTrusted = trustLevel.value !== 'untrusted';
      
      if (isTrusted) {
        addMessage(app2Log, message, true);
        addMessage(app1Log, message, false);
        log(`Message delivered from App2 to App1`);
      } else {
        log(`Message blocked: App1 does not trust App2`, 'error');
        
        // Show permission request dialog
        if (confirm('App2 wants to send a message to App1. Allow?')) {
          log(`User granted permission for App2 to message App1`);
          trustLevel.value = 'trusted';
          addMessage(app2Log, message, true);
          addMessage(app1Log, message, false);
        } else {
          log(`User denied permission for App2 to message App1`, 'warning');
        }
      }
    }, 500);
    
    app2Message.value = '';
  });
  
  setTrust.addEventListener('click', () => {
    const level = trustLevel.value;
    log(`Setting trust level to: ${level}`);
    
    // In a real implementation, this would use the actual Comlink setTrustLevel method
    // For demo purposes, we'll just log the change
    switch (level) {
      case 'owned':
        log(`Apps now have full access to each other's APIs`);
        break;
      case 'trusted':
        log(`Apps now have limited access to each other's APIs`);
        break;
      case 'untrusted':
        log(`Apps now have no access to each other's APIs without explicit permission`);
        break;
    }
  });
  
  // Initial log
  log('Comlink Demo initialized');
  log(`App1 ID: app://example.com/app1`);
  log(`App2 ID: app://example.com/app2`);
  log(`Initial trust level: ${trustLevel.value}`);
  
  // Register service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js')
      .then(registration => {
        log('Service worker registered');
      })
      .catch(error => {
        log(`Service worker registration failed: ${error}`, 'error');
      });
  }
});
