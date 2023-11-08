import { useCallback, useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  AspectRatio,
  Stack,
  Table,
  Text,
  Container,
  AppShell,
  Flex,
  Burger,
  Group,
  Box,
  Space,
  Grid,
  Anchor,
  Button,
} from "@mantine/core";
import AWS from "aws-sdk";
import { useDisclosure } from "@mantine/hooks";
import { Video } from "@/models/video";

const supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey: string = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const awsConfig = {
  accessKeyId: process.env.S3_UPLOAD_KEY,
  secretAccessKey: process.env.S3_UPLOAD_SECRET,
  region: process.env.S3_UPLOAD_REGION,
  bucket: process.env.AMPLIFY_BUCKET,
};

AWS.config.update(awsConfig);
console.log("awsConfig:", awsConfig); // Debug

const defaultVideo: Video = {
  video_name: "Default Video",
  video_url:
    "https://mac-bucket-demo.s3.amazonaws.com/file_example_MP4_1280_10MG.mp4",
  status: "clip_ready",
  id: 0, // Replace with the actual ID you want to use
};

const agent_id = "clgcyi78m0000v8ns3qcb4g2g";

export default function Demo() {
  const NO_SELECTION = -1;
  const [opened, { toggle }] = useDisclosure();

  const [videos, setVideos] = useState<Video[]>([]);

  const [selectedVideoIndex, setSelectedVideoIndex] = useState(NO_SELECTION);
  const selectedVideo = (): Video => {
    if (selectedVideoIndex === NO_SELECTION) {
      return defaultVideo;
    } else {
      return videos[selectedVideoIndex];
    }
  };
  const fetchVideos = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("material")
        .select("video_url, status, id, video_name");

      if (error) {
        console.error("Error fetching videos:", error);
      } else {
        setVideos(data);
        console.log("Fetched data:", data);
      }
    } catch (error) {
      console.error("Error in fetchVideos:", error);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handleRowClick = (index: number) => {
    // Debug: Check environment variables and video object
    // console.log("process.env.AMPLIFY_BUCKET:", process.env.AMPLIFY_BUCKET);
    console.log("video:", index);
    // setSelectedVideoIndex(index);
    // console.log("video.video_url:", video.video_url);

    // You can use the AWS SDK to download the S3 object
    const s3 = new AWS.S3();

    const params = {
      Bucket: process.env.AMPLIFY_BUCKET || "",
      Key: selectedVideo().video_name,
    };

    // console.log("params:", params); // Debug

    s3.getObject(params, (err, data) => {
      if (err) {
        // console.error("Error downloading S3 object:", err);
      } else {
        // Assuming the S3 object contains the URL to the video
        const videoUrl = data.Body?.toString() || "";
        console.log("videoUrl", videoUrl);

        // Update the selected video with the S3 object's URL
        setSelectedVideoIndex(index);
        // setSelectedVideo({ ...video, video_url: videoUrl });
      }
    });
  };

  return (
    <Stack gap="lg">
      {/* <Space h={10} w={20}></Space> */}
      <Grid>
        <Grid.Col span={4}>
          <AspectRatio ratio={1920 / 1080} maw="50%">
            <iframe
              src={selectedVideo().video_url}
              title="Video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ border: 0 }}
              width="100%" // Set the width to 100%
              height="400px" // Set the height to 100%
            />
          </AspectRatio>
        </Grid.Col>
        <Grid.Col span={6}>
          <Container w={100} h={150} c="red"></Container>
          <Table striped>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Material</Table.Th>
                <Table.Th>Status </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {videos.map((video, i) => (
                <Table.Tr key={video.id}>
                  <Table.Td>
                    <Button
                      variant="filled"
                      fullWidth
                      onClick={() => handleRowClick(i)}
                    >
                      {video.video_name}
                    </Button>
                  </Table.Td>
                  <Table.Td>{video.status}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Grid.Col>
      </Grid>
      <Box>
        <iframe
          src={`https://www.agentize.ai/agents/${agent_id}?headerless`}
          width="100%"
          height="600px"
        />
      </Box>
    </Stack>
  );
}
