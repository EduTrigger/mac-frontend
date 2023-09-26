// components/Images.tsx
import useSWR from "swr";
import { Image } from "@mantine/core";

const fetcher = (path: string) => fetch(path).then((res) => res.json());

const Images = () => {
  const { data } = useSWR<{ Key?: string }[]>("/api/documents", fetcher);
  return data?.map((image) => <S3Image Key={image.Key} />);
};

export default Images;
