import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { AspectRatio, Table, Text } from "@mantine/core";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Demo() {
  const defaultVideoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ?si=Fvl0ZUvH-6flAbdh";

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
    // Fetch data from Supabase table
    async function fetchVideos() {
      const { data, error } = await supabase
        .from("S3_URL")
        .select();
      if (error) {
        console.error("Error fetching videos:", error);
      } else {
        setVideos(data);
        console.log("Fetched data:", data); // Log the data
      }
    }

    fetchVideos();
  }, []);

  const handleRowClick = (video) => {
    setSelectedVideo(video);
  };

  return (
<div className="flex">
  <div className="w-1/2">
    <AspectRatio ratio={1920 / 1080}>
      <iframe
        src={selectedVideo.video_url}
        title="Video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
		allowFullScreen
      />
    </AspectRatio>
  </div>
  <div className="w-1/2">
	<Table className="custom-table">
      <Table.Tbody>
        {videos.map((video) => (
            <Table.Tr onClick={() => handleRowClick(video)}>
              <Table.Td>{video.video_url}</Table.Td>
			                <Table.Td>{video.status}</Table.Td>
            </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  </div>
</div>

  );
}
