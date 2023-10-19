// In your Next.js API route
import axios from "axios";

const lambdaEndpoint = "https://uqx4oihmq2.execute-api.us-east-1.amazonaws.com/default/s3upload";

export default async function handler(req, res) {
  try {
    const fileData = req.body; // Get file data from the request body
	// console.log(fileData);

    // Make a POST request to the Lambda function
    await axios.post(lambdaEndpoint, fileData);

    res.status(200).json({ message: "File uploaded successfully" });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
