import { AspectRatio } from "@mantine/core";

export default function Demo() {
  return (
    <AspectRatio ratio={16 / 9}>
      <iframe
        src="https://www.youtube.com/embed/yU3GUHDf0mk"
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </AspectRatio>
  );
}
