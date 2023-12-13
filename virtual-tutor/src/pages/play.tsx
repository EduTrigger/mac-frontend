import React, { useEffect, useState, useCallback } from 'react';
import { createClient } from "@supabase/supabase-js";
import {
  AspectRatio,
  Stack,
  Table,
  Text,
  Box,
  Grid,
  Button,
} from "@mantine/core";
import AWS from "aws-sdk";
import { Video } from "@/models/video";
import { mockVideoNames, statusDisplay } from "@/models/mock";
import { IconPlayerPlay } from "@tabler/icons-react";

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
  video_url: "https://mac-bucket-demo.s3.amazonaws.com/file_example_MP4_1280_10MG.mp4",
  status: "clip_ready",
  id: 0, // Replace with the actual ID you want to use
};

const agent_id = "cloqi2ika0000k108ybdirwaa";

const Demo = () => {
  const NO_SELECTION = -1;

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
        setVideos(data.slice(0, 6));
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
    console.log("video:", index);
    setSelectedVideoIndex(index);
  };

  // Function to send a message to the parent window
  const sendIframeMessage = () => {
    // 'parent' refers to the parent window
    // 'message' is the data you want to send
    // '*' can be replaced with the origin of the parent window for added security
    parent.postMessage('message', '*');
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== 'http://localhost.com') // the origin of your iframe
        return;

      console.log('Received message:', event.data);
    };

    window.addEventListener('message', handleMessage);

    // Call the function when the component mounts
    sendIframeMessage();

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <Stack gap="lg" p={20}>
      <Grid grow gutter="md">
        <Grid.Col span={6}>
          <AspectRatio ratio={1920 / 1080}>
            <iframe
              src={selectedVideo().video_url}
              title="Video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ border: 0 }}
              width="100%"
              height="400px"
            />
          </AspectRatio>
        </Grid.Col>
        <Grid.Col span={6}>
          <Box>
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
                      <Text>{mockVideoNames(i)}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Button
                        variant="filled"
                        fullWidth
                        onClick={() => handleRowClick(i)}
                        disabled={video.status !== "clip_processed"}
                        rightSection={<IconPlayerPlay size={14} />}
                      >
                        {statusDisplay(video.status)}
                      </Button>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Box>
        </Grid.Col>
      </Grid>
      <Box>
        <iframe
          allow="microphone;"
          src={`https://www.agentize.ai/agents/${agent_id}?headerless`}
          width="100%"
          height="600px"
          onLoad={() => sendIframeMessage()} // Call the function when the iframe loads
        />
      </Box>
    </Stack>
  );
};

export default Demo;
