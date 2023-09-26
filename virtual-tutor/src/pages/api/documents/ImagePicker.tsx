import { Dropzone, FileWithPath } from "@mantine/dropzone";
import useSWRMutation from "swr/mutation";

async function uploadDocuments(
  url: string,
  { arg }: { arg: { files: FileWithPath[] } }
): Promise<_Object[]> {
  const body = new FormData();
  arg.files.forEach((file) => {
    body.append("file", file, file.name);
  });

  const response = await fetch(url, { method: "POST", body });
  return await response.json();
}

export function ImagePicker() {
  // when uploading a document, there seem to be a slight delay, so wait ~1s
  // before refreshing the list of documents `mutate("/api/documents")`.
  const { trigger } = useSWRMutation("/api/documents", uploadDocuments);

  return (
    <Dropzone
      onDrop={(files) => trigger({ files })}
    >
      <Image src="/images/upload-icon.svg" width="100" height="100" />
      <p style={{ textAlign: "center" }}>Drop your images here</p>
    </Dropzone>
  );
}
