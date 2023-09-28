/** @type {import('next').NextConfig} */

module.exports = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Increase the request body size limit to 10MB
    },
  },
  reactStrictMode: true,
};
