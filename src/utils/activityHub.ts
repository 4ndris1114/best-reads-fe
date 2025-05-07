import * as signalR from '@microsoft/signalr';

const connection = new signalR.HubConnectionBuilder()
  .withUrl('http://localhost:5001/hubs/activity', {
    accessTokenFactory: () => localStorage.getItem('token') || ''
  })
  .withAutomaticReconnect()
  .build();

export default connection;