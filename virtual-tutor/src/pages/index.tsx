import { Image } from "@mantine/core";
//import ImagePicker from "../components/ImagePicker";

const fetcher = (path: string) => fetch(path).then((res) => res.json());

export default function Home() {
  return (
    <div>
      <Images />
    </div>
  );
}