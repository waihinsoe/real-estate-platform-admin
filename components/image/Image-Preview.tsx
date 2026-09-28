import { ImageIcon } from "lucide-react";
import { useEffect, useRef } from "react";

export function ImagePreview({ file, url }: { file?: File; url?: string }) {
  const imageRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    if (!file || !file.type.startsWith("image/")) return;
    const objectUrl = URL.createObjectURL(file);
    if (imageRef.current) imageRef.current.src = objectUrl;
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  if (!url && !file?.type.startsWith("image/"))
    return <ImageIcon aria-hidden="true" />;
  // eslint-disable-next-line @next/next/no-img-element
  return <img ref={imageRef} src={url} alt="" />;
}
