import {  useState } from "react";
import { api } from "~/utils/api";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@chakra-ui/react";

interface UseFileUploadResult {
  isLoading: boolean;
  handleUpload: (file: File, repo: string) => void;
  data: string | undefined;
}

const useFileUploadV2 = (): UseFileUploadResult => {
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState<string>();

  const toast = useToast()

  const {
    mutate: getPreSignedUrl,
  } = api.s3.getUploadPreSignedUrl.useMutation();
 


  const preSignedUrlSuccess = async (
    data: any,
    baseKey: string,
    file: File,
  ): Promise<void> => {
    const { fields, url } = data[0];


    const formData = new FormData();

    const fileData: Record<string, any> = {
      ...fields,
      "Content-Type": file.type,
      file,
    };

    console.log({ fileData })

    for (const name in fileData) {
      formData.append(name, fileData[name]);
    }
    const resp = await fetch(url as string, {
      method: "POST",
      body: formData,
    });

    if (resp.ok) {
        const key = fields.key as string
        const currKey = key.split(`/`)[1]
        console.log({ key , currKey })
        if (currKey){

            setData(currKey)
            setLoading(false);
        }
        
    } else {
      // Handle HTTP error, show feedback to the user
      console.error("Fetch error:", resp);
      setLoading(false);
      toast({
          title: 'File upload Error',
          description: 'Unable to upload file',
          status: "error",
          duration: 9000,
          isClosable: true,
          
      })
    }
  };

  const handleUpload = (file: File, repo: string): void => {
    if (file) {
      setLoading(true);
      const baseKey = uuidv4();
      const contentType = file.type as string;
      getPreSignedUrl(
        {
          contentType,
          fileNames: [file.name],
          baseKey,
          repo,
          expiration: "36000000",
        },
        {
          onSuccess: (data) => {
            preSignedUrlSuccess(data, baseKey, file);
          },
          onError: (error) => {
            // Handle error, show feedback to the user
            console.error("Get pre-signed URL error:", error);
            setLoading(false);
            toast({
                title: 'File upload Error',
                description: 'Unable to upload file',
                status: "error",
                duration: 9000,
                isClosable: true,
                
            })
           
          },
        }
      );
    }
  };

  return { isLoading, handleUpload, data };
};

export default useFileUploadV2;
