import { MEDIA_TYPE } from "@/utils/constants";

export interface Media {
  url: string;
  type: MEDIA_TYPE;
  file: File;
}