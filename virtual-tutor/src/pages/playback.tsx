import { AspectRatio } from "@mantine/core";
import useSWR from "swr";
import { Image } from "@mantine/core";
import ImagePicker from "../components/ImagePicker";

const fetcher = (path: string) => fetch(path).then((res) => res.json());

const Images = () => {
  const { data } = useSWR<{ Key?: string }[]>("/api/documents", fetcher)
  return data?.map((image) => <S3Image Key={image.Key} />)
}

const S3Image = ({ Key }: { Key: string }) => {
  const { data } = useSWR<{ src: string }>(`/api/documents/${Key}`, fetcher)
  return <Image src={data.src} />
}

export default function Demo() {
  return (
	<Images />,
	<ImagePicker />,
    <AspectRatio ratio={16 / 9}>
      <iframe
        src="https://www.youtube.com/embed/yU3GUHDf0mk"
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      />
    </AspectRatio>
  );
}
