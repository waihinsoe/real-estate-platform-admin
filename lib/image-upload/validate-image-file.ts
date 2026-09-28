interface ValidateImageFileOptions {
  maxSize?: number;
}

export function validateImageFile(
  file: File,
  { maxSize }: ValidateImageFileOptions = {},
): string | undefined {
  if (!file.type.startsWith("image/")) {
    return "Choose an image file.";
  }

  if (maxSize !== undefined && file.size > maxSize) {
    const maxSizeInMb = maxSize / 1024 / 1024;

    return `File exceeds ${maxSizeInMb.toFixed(1)} MB.`;
  }

  return undefined;
}
