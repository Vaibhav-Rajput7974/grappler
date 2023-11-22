// // App.js
// import React, { useEffect } from 'react';
// import { connect, disconnect, sendMessage, subscribeToMessages } from './WebSocketService';

// const YourReactComponent = () => {
//     useEffect(() => {
//         connect();

//         // Cleanup WebSocket connection on component unmount
//         return () => disconnect();
//     }, []);

//     const handleSendMessage = () => {
//         sendMessage('Hello, WebSocket!');
//     };

//     useEffect(() => {
//         // Subscribe to WebSocket messages
//         subscribeToMessages((message) => {
//             console.log('Received message:', message);
//         });

//         // Cleanup WebSocket subscription on component unmount
//         return () => disconnect();
//     }, []);

//     return (
//         <div>
//             <h1>WebSocket Example</h1>
//             <button onClick={handleSendMessage}>Send Message</button>
//         </div>
//     );
// };

// export default YourReactComponent;
