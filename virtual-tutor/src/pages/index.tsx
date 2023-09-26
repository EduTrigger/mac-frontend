import useSWR from "swr";
import { Image } from "@mantine/core";
//import ImagePicker from "../components/ImagePicker";

const fetcher = (path: string) => fetch(path).then((res) => res.json());

const Images = () => {
  const { data } = useSWR<{ Key?: string }[]>("/api/documents", fetcher)
  return data?.map((image) => <S3Image Key={image.Key} />)
}

const S3Image = ({ Key }: { Key: string }) => {
  const { data } = useSWR<{ src: string }>(`/api/documents/${Key}`, fetcher)
  return <Image src={data.src} />
}

export default function Home() {
  return (
    <div>
      <Images />
    </div>
  );
}