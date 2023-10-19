import { useEffect, useState } from "react";
// import { createClient } from "@supabase/supabase-js";
import { AspectRatio, Button, Table, Text } from "@mantine/core";

const supabaseUrl = "YOUR_SUPABASE_URL";
const supabaseKey = "YOUR_SUPABASE_KEY";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Demo() {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    // Fetch data from Supabase table
    async function fetchVideos() {
      const { data, error } = await supabase.from("videos").select("*");
      if (error) {
        console.error("Error fetching videos:", error);
      } else {
        setVideos(data);
      }
    }

    fetchVideos();
  }, []);

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
  };

  return (
    <div>
      <div style={{ display: "flex", gap: "20px" }}>
        <Table
          data={videos}
          onRowClick={handleVideoClick}
          rowKey="id"
          columns={[
            { name: "title", title: "Title" },
            { name: "url", title: "URL" },
          ]}
        />
        {selectedVideo && (
          <AspectRatio ratio={16 / 9}>
            <iframe
              src={selectedVideo.url}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </AspectRatio>
        )}
      </div>
    </div>
  );
}
