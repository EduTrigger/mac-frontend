import {
  Group,
  Text,
  rem,
  Progress,
  Container,
  Stack,
  Button,
} from "@mantine/core";
import { Dropzone, DropzoneProps, MIME_TYPES } from "@mantine/dropzone";
import { useS3Upload } from "next-s3-upload";
import { IconUpload, IconPhoto, IconX } from "@tabler/icons-react";
import { useRouter } from "next/router";

export default function BaseDemo(props: Partial<DropzoneProps>) {
  const { uploadToS3, files } = useS3Upload();
  const router = useRouter();

  const handleFilesChange = async (files) => {
    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      const { url } = await uploadToS3(file);
      console.log("Successfully uploaded to S3!", url);
    }
  };
  const onClick = () => {
    router.push("/play");
  };
  return (
    <Stack w="60%" p={20}>
      <Dropzone
        styles={{
          root: {
            border: "1px dashed #868e96", // Custom border here
            borderRadius: 10, // Custom border radius here
          },
        }}
        onDrop={(files) => handleFilesChange(files)}
        onReject={(files) => console.log("rejected files", files)}
        maxSize={1024 * 1024 ** 2}
        accept={[MIME_TYPES.mp4]}
        {...props}
      >
        <Group
          justify="center"
          gap="xl"
          mih={220}
          style={{ pointerEvents: "none" }}
        >
          <Dropzone.Accept>
            <IconUpload
              style={{
                width: rem(52),
                height: rem(52),
                color: "var(--mantine-color-blue-6)",
              }}
              stroke={1.5}
            />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <IconX
              style={{
                width: rem(52),
                height: rem(52),
                color: "var(--mantine-color-red-6)",
              }}
              stroke={1.5}
            />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <IconPhoto
              style={{
                width: rem(52),
                height: rem(52),
                color: "var(--mantine-color-dimmed)",
              }}
              stroke={1.5}
            />
          </Dropzone.Idle>

          <div>
            <Text size="xl" inline>
              Drag images here or click to select files
            </Text>
            <Text size="sm" c="dimmed" inline mt={7}>
              Attach as many files as you like, each file should not exceed 5mb
            </Text>
          </div>
        </Group>
      </Dropzone>

      <div
        className="pt-8"
        style={{ color: "white", display: "flex", flexDirection: "column" }}
      >
        {files.map((file, index) => (
          <div
            key={index}
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <div>
              File #{index}: {file.file.name}
            </div>
            <div>
              Progress: {file.progress}%
              <div style={{ width: "1000px" }}>
                {" "}
                {/* Adjust the width as needed */}
                <Progress value={file.progress} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <Button onClick={onClick}>Go Play List</Button>
    </Stack>
  );
}
