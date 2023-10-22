// app/api/documents/route.ts
import formidable from 'formidable-serverless';
import { NextRequest, NextResponse } from "next/server";

import {
  S3Client,
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
  try {
	const parseForm = (req) => {
	  return new Promise((resolve, reject) => {
		const form = new formidable.IncomingForm();

		form.parse(req, (err, fields, files) => {
		  if (err) {
			reject(err);
		  } else {
			resolve({ fields, files });
		  }
		});
	  });
	};

    // You can proceed with handling the fields here

  const files = formData.getAll("file") as File[];

	  const response = await Promise.all(
		files.map(async (file) => {
		  // not sure why I have to override the types here
		  const Body = (await file.arrayBuffer()) as Buffer;
		  s3.send(new PutObjectCommand({ Bucket, Key: file.name, Body }));
		})
	  );
	
	

  } catch (err) {
    console.error('Form parsing error:', err);
    res.statusCode = 400;
    res.end('Form parsing error: ' + err.message);
  }
}
