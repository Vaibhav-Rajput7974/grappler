import React, { useEffect } from 'react';
import Stomp from 'stompjs';
import SockJS from 'sockjs-client';
import { useDispatch } from 'react-redux';
import { addTicketToStage, timeTicket } from '../slice/ProjectSlice';
const WebSocketComponent = () => {
  const dispatch = useDispatch();
  const socketUrl = 'http://localhost:8080/ws';
  const stompClient = Stomp.over(new SockJS(socketUrl));
  const connect = () => {
    stompClient.connect({}, () => {
      console.log('Connected to WebSocket');
      stompClient.subscribe('/topic/ticket-updates', (ticketData) => {
        var ticket = JSON.parse(ticketData.body);
        console.log('Received message:', ticket);
        dispatch(timeTicket(ticket));
      });
    });
  };
  useEffect(() => {
    connect();
    return () => {
      if (stompClient !== null) {
        stompClient.disconnect();
      }
    };
  }, []);
  // Function to send a message
  const sendMessage = (message) => {
    stompClient.send('/app/chat', {}, JSON.stringify(message));
  };
  
  return (
    <div>
      {/* Your React component content */}
    </div>
  );
};
export default WebSocketComponent;









