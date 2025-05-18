import { MEDIA_TYPE } from "@/constants";

export interface Media {
  url: string;
  type: MEDIA_TYPE;
  file: File;
}