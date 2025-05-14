import * as signalR from '@microsoft/signalr';

const connection = new signalR.HubConnectionBuilder()
  .withUrl('https://best-reads-be.onrender.com/hubs/activity', {
    accessTokenFactory: () => localStorage.getItem('token') || ''
  })
  .withAutomaticReconnect()
  .build();

export default connection;