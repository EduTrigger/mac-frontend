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
import { Video } from "@/models/video";
import { mockVideoNames, statusDisplay } from "@/models/mock";
import { IconPlayerPlay } from "@tabler/icons-react";

const supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey: string = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const awsConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.S3_UPLOAD_REGION,
  bucket: process.env.AMPLIFY_BUCKET,
};

AWS.config.update(awsConfig);
console.log("awsConfig:", awsConfig); // Debug

const defaultVideo: Video = {
  video_name: "Default Video",
  video_url:
    "https://mac-project.s3.amazonaws.com/test-0402.mp4",
  status: "clip_ready",
  id: 0,
  agentize_id: "cloqi2ika0000k108ybdirwaa"
};

export default function Demo() {
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
        .select("video_url, status, id, video_name, agentize_id");

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
    // Debug: Check environment variables and video object
    // console.log("process.env.AMPLIFY_BUCKET:", process.env.AMPLIFY_BUCKET);
    console.log("video:", index);
    setSelectedVideoIndex(index);
  };

  return (
    <Stack gap="lg" p={20}>
      {/* <Space h={10} w={20}></Space> */}
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
              width="100%" // Set the width to 100%
              height="400px" // Set the height to 100%
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
                      <Text>{(video.video_name)}</Text>
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
          src={`https://www.agentize.ai/agents/${selectedVideo().agentize_id}?headerless`}
          width="100%"
          height="600px"
        />
      </Box>
    </Stack>
  );
}
