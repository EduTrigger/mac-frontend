import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { AspectRatio, Table, Text } from "@mantine/core";
import AWS from "aws-sdk";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const awsConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.S3_UPLOAD_REGION,
  bucket: process.env.AMPLIFY_BUCKET,
};

const supabase = createClient(supabaseUrl, supabaseAnonKey);

AWS.config.update(awsConfig);
console.log("awsConfig:", awsConfig); // Debug

export default function Demo() {
  const defaultVideoUrl =
    "https://mac-bucket-demo.s3.amazonaws.com/file_example_MP4_1280_10MG.mp4";

  const [videos, setVideos] = useState([
    {
      title: "Default Video",
      video_url: defaultVideoUrl,
      status: "clip_ready",
      id: 0, // Replace with the actual ID you want to use
    },
  ]);

  const [selectedVideo, setSelectedVideo] = useState(videos[0]);

  useEffect(() => {
    async function fetchVideos() {
      const { data, error } = await supabase
        .from("material")
        .select("video_url, status");
      if (error) {
        console.error("Error fetching videos:", error);
      } else {
        setVideos(data);
        console.log("Fetched data:", data);
      }
    }

    fetchVideos();
  }, []);

  const handleRowClick = (video) => {
    // Debug: Check environment variables and video object
    // console.log("process.env.AMPLIFY_BUCKET:", process.env.AMPLIFY_BUCKET);
    // console.log("video:", video);
    // console.log("video.video_url:", video.video_url);

    // You can use the AWS SDK to download the S3 object
    const s3 = new AWS.S3();

    const params = {
      Bucket: process.env.AMPLIFY_BUCKET,
      Key: video.video_name,
    };

    // console.log("params:", params); // Debug

    s3.getObject(params, (err, data) => {
      if (err) {
        // console.error("Error downloading S3 object:", err);
      } else {
        // Assuming the S3 object contains the URL to the video
        const videoUrl = data.Body.toString();
        console.log(videoUrl);

        // Update the selected video with the S3 object's URL
        setSelectedVideo({ ...video, video_url: videoUrl });
      }
    });
  };

  return (
    <>
      <div className="flex">
        <div className="w-1/2">
          <AspectRatio ratio={1920 / 1080}>
            <iframe
              src={selectedVideo.video_url}
              title="Video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              width="100%" // Set the width to 100%
              height="400px" // Set the height to 100%
            />
          </AspectRatio>
        </div>
        <div className="w-1/2">
          <Table className="custom-table">
            <Table.Tbody>
              {videos.map((video) => (
                <Table.Tr onClick={() => handleRowClick(video)}>
                  <Table.Td>{video.video_name}</Table.Td>
                  <Table.Td>{video.video_url}</Table.Td>
                  <Table.Td>{video.status}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </div>
      </div>

      <div className="flex">
        <iframe
          src={
            "https://www.agentize.ai/agents/clgcyi78m0000v8ns3qcb4g2g?headerless"
          }
          width="100%"
          height="600px"
        />
      </div>
    </>
  );
}
