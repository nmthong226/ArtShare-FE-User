import { RowsPhotoAlbum } from "react-photo-album";
import { useMemo } from "react";
import { ImageRenderer } from "@/components/gallery/ImageRenderer";

const posts = [
  {
    id: 1,
    username: "Jade",
    handle: "@itsjade",
    time: "19hr",
    text: "Testtttt",
    image: "/logo_app_v_101.png", // Replace with actual path
  },
  {
    id: 2,
    username: "Jade",
    handle: "@itsjade",
    time: "4d",
    text: "",
    image: "/logo_app_v_101.png",
  },
];

const UserPosts = () => {
  const photos = useMemo(
    () =>
      posts.map((post) => ({
        key: post.id.toString(),
        src: post.image,
        width: 640,
        height: 360,
        title: post.text,
        author: post.username,
        postLength: 1, // or actual length if multiple media
        postId: post.id,
      })),
    [],
  );

  return (
    <RowsPhotoAlbum
      photos={photos}
      spacing={8}
      targetRowHeight={250}
      render={{ image: ImageRenderer }}
    />
  );
};

export default UserPosts;
