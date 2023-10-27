import { Group, Text, rem, Progress } from '@mantine/core';
import { IconUpload, IconPhoto, IconX } from '@tabler/icons-react';
import { Dropzone, DropzoneProps, MIME_TYPES } from '@mantine/dropzone';
import { useS3Upload } from "next-s3-upload";

function ImageUploadIcon({ status, ...props }) {
  if (status.accepted) {
    return <UploadIcon {...props} />;
  }

  if (status.rejected) {
    return <CrossCircledIcon {...props} />;
  }

  return <ImageIcon {...props} />;
}

function getIconColor(status, theme) {
  return status.accepted
    ? theme.colors[theme.primaryColor][6]
    : status.rejected
    ? theme.colors.red[6]
    : theme.colorScheme === 'dark'
    ? theme.colors.dark[0]
    : theme.black;
}

export default function BaseDemo(props: Partial<DropzoneProps>) {
  const { uploadToS3, files } = useS3Upload();

  const handleFilesChange = async (files) => {
    for (let index = 0; index < files.length; index++) {
      const file = files[index];
	  // console.log(file);
      const { url } = await uploadToS3(file);
      console.log('Successfully uploaded to S3!', url);
    }
  };

  return (
    <div>
      <Dropzone
        onDrop={(files) => handleFilesChange(files)}
        onReject={(files) => console.log('rejected files', files)}
        maxSize={1024 * 1024 ** 2}
        accept={[MIME_TYPES.mp4]}
        {...props}
      >
        <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: 'none' }}>
          <Dropzone.Accept>
            <IconUpload style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-blue-6)' }} stroke={1.5} />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <IconX style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-red-6)' }} stroke={1.5} />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <IconPhoto style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-dimmed)' }} stroke={1.5} />
          </Dropzone.Idle>

          <div>
            <Text size="xl" inline>
              Drag images here or click to select files
            </Text>
            <Text size="sm" c="dimmed" inline mt={7}>
              Attach as many files as you like, each file should not exceed 1GB
            </Text>
          </div>
        </Group>
      </Dropzone>

      <div className="pt-8" style={{ color: 'white' }}>
        {files.map((file, index) => (
          <div key={index}>
            File {file.file.name} progress: {file.progress}%
            <Progress value={file.progress} />
          </div>        ))}
      </div>
    </div>
  );
}
