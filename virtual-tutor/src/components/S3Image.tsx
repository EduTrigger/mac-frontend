// components/S3Image.tsx
import useSWR from "swr";
import { Image } from "@mantine/core";

const fetcher = (path: string) => fetch(path).then((res) => res.json());

const S3Image = ({ Key }: { Key: string }) => {
  const { data } = useSWR<{ src: string }>(`/api/documents/${Key}`, fetcher);
  return <Image src={data.src} />;
};

export default S3Image;
