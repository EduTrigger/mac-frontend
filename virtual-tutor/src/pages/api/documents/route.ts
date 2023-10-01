// app/api/documents/route.ts
import formidable from 'formidable-serverless';
import { NextRequest, NextResponse } from "next/server";

import {
  S3Client,
  ListObjectsCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

const Bucket = process.env.AMPLIFY_BUCKET;
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

export default async function handler(req, res) {
  //res.status(200).json({ message: 'Hello from the API route!' });
    const form = new formidable.IncomingForm();

  // Parse the incoming form data
  const parseResult = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
      } else {
        resolve({ fields, files });
      }
    });
  });

  const { files } = parseResult;

  try {
     res = await Promise.all(
      Object.values(files).map(async (file: formidable.File) => {
        // Read the file into a Buffer
        const Body = await new Promise<Buffer>((resolve, reject) => {
          const readStream = require('fs').createReadStream(file.path);

          const chunks: Buffer[] = [];
          readStream.on('data', (chunk: Buffer) => {
            chunks.push(chunk);
          });

          readStream.on('end', () => {
            const fileBuffer = Buffer.concat(chunks);
            resolve(fileBuffer);
          });

          readStream.on('error', (error: any) => {
            reject(error);
          });
        });

        // Upload the file to S3
        await s3.send(new PutObjectCommand({ Bucket, Key: file.name, Body }));

        return { fileName: file.name, uploaded: true };
      })
    );

    return NextResponse.json(res);
  } catch (error) {
    console.error('Error uploading files to S3:', error);
    return NextResponse.error('Failed to upload files', 500);
}
}