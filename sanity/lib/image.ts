import imageUrlBuilder from "@sanity/image-url";
import { client } from "./client";

const builder = imageUrlBuilder(client);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SanityImageSource = any;

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// Helper for responsive images
export function getImageDimensions(image: SanityImageSource) {
  if (!image) return { width: 0, height: 0, aspectRatio: 1 };

  const ref = image?.asset?._ref;
  if (!ref) return { width: 0, height: 0, aspectRatio: 1 };

  const dimensions = ref.split("-")[2];
  const [width, height] = dimensions.split("x").map(Number);

  return {
    width,
    height,
    aspectRatio: width / height,
  };
}
