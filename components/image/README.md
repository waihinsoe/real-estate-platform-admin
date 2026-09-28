```tsx
import { ImageUpload } from "@/components/image-upload/image-upload";
import type { UploadedImage } from "@/types/image-upload";

const [images, setImages] = useState<UploadedImage[]>([]);
const [uploading, setUploading] = useState(false);

<ImageUpload
  value={images}
  onChange={setImages}
  onBusyChange={setUploading}
  maxSize={10 * 1024 * 1024}
/>
```

Use `uploading` to disable submission while uploads or deletions are pending, or failed uploads still need retry or dismissal. Save the returned `url` and `public_id` through the endpoint that owns the image associations. `maxSize` is optional and measured in bytes. Pass existing images through `value` when editing, or use a React Hook Form field's `value` and `onChange` directly.

Each file uploads separately through the `file` multipart field. Successful responses are added to `value` immediately; failures remain visible for individual retry or removal. Removing an uploaded image calls the delete API and only updates `value` after success. Removing a queued or failed file only removes its local entry. Unmounting discards queued files; an upload already in progress finishes and reports its result through `onChange`.


For properties, use `usePropertyImages` with the separate `PropertyImages` component.
The property form only saves property fields. Creation first POSTs the property;
then the image hook GETs `/admin/properties/{id}/images` and PUTs the selected
collection, retaining existing association IDs and assigning `sort_order`.
Editing loads images from that same GET endpoint and uses the same save flow.
The upload endpoint continues to receive the existing multipart `file` contract;
only returned URLs and public IDs go to the property image endpoint.

`PropertyImages` passes `deleteOnRemove={false}` so removal is staged until the
collection is saved, without deleting a stored asset still referenced by a
property. The generic uploader defaults to deleting assets on removal.
If attaching images fails after creation, the create page retains the property
ID and uploaded image values for retry without creating another property.
## Image lightbox

```tsx
import { ImageLightbox } from "@/components/image/image-lightbox";

<ImageLightbox
  label="Property title"
  images={images.map((image) => ({ src: image.image_url, alt: "Property photo" }))}
/>
```

Displays up to three thumbnails, with a light gray `+N` overlay on the third
thumbnail when more images exist (five images show `+2`). Clicking a thumbnail
opens that slide, including the third thumbnail with the overlay. The lightbox
includes the entire collection, a current/total counter, and keyboard and touch
navigation. Empty collections display “No images”. Pass images in their desired
display order.
