export const createFormData = (
  title: string,
  thumbnailUrl: string,
  thumbnailCropMeta: string,
  description?: string,
  imageFiles?: File[],
  videoUrl?: string,
  initialThumbnail?: string,
  isMature?: boolean,
  aiCreated?: boolean,
  cate_ids?: number[],
) => {
  const formData = new FormData();
  formData.append("title", title);
  if (description) formData.append("description", description);
  // TODO: delete this when we have backend for categories
  // formData.append("ids", JSON.stringify([]));
  if (videoUrl) formData.append("video_url", videoUrl);
  formData.append("thumbnail_url", thumbnailUrl);
  if (imageFiles && imageFiles.length > 0) {
    imageFiles.forEach((file) => formData.append("images", file));
  }
  formData.append("is_mature", String(isMature));
  formData.append("ai_created", String(aiCreated));
  formData.append("cate_ids", JSON.stringify(cate_ids));
  formData.append(
    "thumbnail_crop_meta",
    JSON.stringify({
      ...JSON.parse(thumbnailCropMeta),
      initialThumbnail: initialThumbnail,
    }),
  );

  return formData;
};
