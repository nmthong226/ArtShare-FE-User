import { MEDIA_TYPE } from "@/utils";

export interface Media {
  url: string;
  type: MEDIA_TYPE;
  file: File;
}