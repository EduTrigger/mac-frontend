// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { SQS } from 'aws-sdk';

type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({ name: 'John Doe' })
}

const sqs = new SQS();

const queueUrl = 'https://sqs.us-east-1.amazonaws.com/223738476687/My_Queue';

// Fetching messages from SQS
export const fetchMessages = async (): Promise<SQS.MessageList | undefined> => {
  try {
    const response = await sqs.receiveMessage({
      QueueUrl: queueUrl,
      MaxNumberOfMessages: 1,
      VisibilityTimeout: 30,
      WaitTimeSeconds: 20,
    }).promise();

    return response.Messages;
  } catch (error) {
    console.error('Error fetching messages:', error);
  }
};

// Deleting a message from SQS
export const deleteMessage = async (receiptHandle: string): Promise<void> => {
  try {
    await sqs.deleteMessage({
      QueueUrl: queueUrl,
      ReceiptHandle: receiptHandle,
    }).promise();
  } catch (error) {
    console.error('Error deleting message:', error);
  }
};

// Changing the visibility timeout of a message
export const changeMessageVisibility = async (receiptHandle: string, visibilityTimeout: number): Promise<void> => {
  try {
    await sqs.changeMessageVisibility({
      QueueUrl: queueUrl,
      ReceiptHandle: receiptHandle,
      VisibilityTimeout: visibilityTimeout,
    }).promise();
  } catch (error) {
    console.error('Error changing message visibility:', error);
  }
};