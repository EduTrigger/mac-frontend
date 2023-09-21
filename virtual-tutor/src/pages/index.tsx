import Image from 'next/image'
import { Inter } from 'next/font/google'
import React, { useEffect, useState } from 'react';
import { fetchMessages, deleteMessage, changeMessageVisibility } from './api/hello.ts'; // Import your SQS utility functions

function MessageTable() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Fetch messages when the component mounts
    async function fetchData() {
      const fetchedMessages = await fetchMessages();
      if (fetchedMessages) {
        setMessages(fetchedMessages);
      }
    }
    fetchData();
  }, []); // Empty dependency array ensures this runs only once on mount

  const handleDelete = (receiptHandle) => {
    // Handle message deletion here using the deleteMessage function
    deleteMessage(receiptHandle);
    // Update the state to remove the deleted message from the table
    setMessages((prevMessages) =>
      prevMessages.filter((message) => message.ReceiptHandle !== receiptHandle)
    );
  };

  const handleVisibilityChange = (receiptHandle, visibilityTimeout) => {
    // Handle changing message visibility timeout here
    changeMessageVisibility(receiptHandle, visibilityTimeout);
    // You may want to update the state or perform additional actions here
  };

  return (
    <div>
      <h2>Message Table</h2>
      <table>
        <thead>
          <tr>
            <th>Message ID</th>
            <th>Message Body</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {messages.map((message) => (
            <tr key={message.MessageId}>
              <td>{message.MessageId}</td>
              <td>{message.Body}</td>
              <td>
                <button onClick={() => handleDelete(message.ReceiptHandle)}>
                  Delete
                </button>
                <button
                  onClick={() =>
                    handleVisibilityChange(
                      message.ReceiptHandle,
                      /* newVisibilityTimeout */ 60
                    )
                  }
                >
                  Change Visibility
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MessageTable;