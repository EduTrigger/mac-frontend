import { Group, Text, useMantineTheme, rem } from "@mantine/core";
import { IconUpload, IconPhoto, IconX } from "@tabler/icons-react";
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from "@mantine/dropzone";

export default function BaseDemo(props: Partial<DropzoneProps>) {
  const theme = useMantineTheme();

  const uploadFiles = async (files: File[]) => {
    // TODO: Implement authentication
    const formData = new FormData();
    files.forEach((file) => formData.append("file", file));

    const response = await fetch("/api/documents/route", {
      method: "POST",
      body: formData
    });


    if (response.status === 200) {
      // Files uploaded successfully
    } else {
      // Handle error
    }
  };

  return (
    <Dropzone
      onDrop={uploadFiles}
      onReject={(files) => console.log("rejected files", files)}
      maxSize={10 * 1024 ** 2}
      accept={IMAGE_MIME_TYPE}
      {...props}
    >
      <Group
        position="center"
        spacing="xl"
        style={{ minHeight: rem(220), pointerEvents: "none" }}
      >
        <Dropzone.Accept>
          <IconUpload
            size="3.2rem"
            stroke={1.5}
            color={
              theme.colors[theme.primaryColor][
                theme.colorScheme === "dark" ? 4 : 6
              ]
            }
          />
        </Dropzone.Accept>
        <Dropzone.Reject>
          <IconX
            size="3.2rem"
            stroke={1.5}
            color={theme.colors.red[theme.colorScheme === "dark" ? 4 : 6]}
          />
        </Dropzone.Reject>
        <Dropzone.Idle>
          <IconPhoto size="3.2rem" stroke={1.5} />
        </Dropzone.Idle>

        <div>
          <Text size="xl" inline>
            Drag images here or click to select files
          </Text>
          <Text size="sm" color="dimmed" inline mt={7}>
            Attach as many files as you like, each file should not exceed 10mb
          </Text>
        </div>
      </Group>
    </Dropzone>
  );
}
