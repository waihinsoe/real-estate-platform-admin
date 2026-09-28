"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Loader2, RotateCcw, Upload, X } from "lucide-react";
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment";
import { Button } from "@/components/ui/button";
import { useDeleteImage, useImageUpload } from "@/hooks/use-image-upload";
import { formatErrorMessage } from "@/lib/format/format-error";
import { cn } from "@/lib/utils";
import type { UploadedImage } from "@/types/image-upload";
import { ImagePreview } from "./Image-Preview";

interface ImageUploadProps {
  value: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
  onBusyChange?: (busy: boolean) => void;
  disabled?: boolean;
  /** Defer removal to the owning resource instead of deleting the stored asset. */
  deleteOnRemove?: boolean;
  /** Optional per-file size limit, in bytes. */
  maxSize?: number;
  className?: string;
}

interface UploadItem {
  id: string;
  file: File;
  status: "idle" | "uploading" | "error";
  error?: string;
  invalid?: boolean;
}

// Native images support both local blob previews and uploaded URLs without a host allowlist.
export function ImageUpload({
  value,
  onChange,
  onBusyChange,
  disabled = false,
  deleteOnRemove = true,
  maxSize,
  className,
}: ImageUploadProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<UploadItem[]>([]);
  const [dragging, setDragging] = useState(false);
  const [deletions, setDeletions] = useState<
    Record<string, { pending: boolean; error?: string }>
  >({});
  const queue = useRef<UploadItem[]>([]);
  const running = useRef(false);
  const uploadingId = useRef<string | null>(null);
  const mounted = useRef(false);
  const deletingIds = useRef(new Set<string>());
  const current = useRef({ value, onChange });
  const upload = useImageUpload();
  const remove = useDeleteImage();

  useEffect(() => {
    current.current = { value, onChange };
  }, [value, onChange]);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      queue.current = [];
    };
  }, []);

  const busy =
    items.some((item) => item.status !== "error") ||
    Object.values(deletions).some((item) => item.pending);
  useEffect(() => {
    // Unresolved failures must be retried or dismissed before the owner saves.
    onBusyChange?.(busy || items.length > 0);
  }, [busy, items.length, onBusyChange]);

  function publish(images: UploadedImage[]) {
    current.current.value = images;
    current.current.onChange(images);
  }

  function patchItem(id: string, patch: Partial<UploadItem>) {
    setItems((previous) =>
      previous.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  }

  async function processQueue() {
    if (running.current) return;
    running.current = true;
    try {
      while (mounted.current && queue.current.length) {
        const item = queue.current.shift()!;
        uploadingId.current = item.id;
        patchItem(item.id, { status: "uploading", error: undefined });
        try {
          const response = await upload.mutateAsync(item.file);
          // Publish each success immediately, even when later files fail.
          publish([...current.current.value, response.data]);
          if (mounted.current)
            setItems((previous) =>
              previous.filter((entry) => entry.id !== item.id),
            );
        } catch (error) {
          if (mounted.current)
            patchItem(item.id, {
              status: "error",
              error: formatErrorMessage(error),
            });
        } finally {
          uploadingId.current = null;
        }
      }
    } finally {
      running.current = false;
    }
  }

  function addFiles(files: FileList | File[]) {
    if (disabled) return;
    const added: UploadItem[] = Array.from(files).map((file) => {
      const error = !file.type.startsWith("image/")
        ? "Choose an image file."
        : maxSize !== undefined && file.size > maxSize
          ? `File exceeds ${(maxSize / 1024 / 1024).toFixed(1)} MB.`
          : undefined;
      return {
        id: crypto.randomUUID(),
        file,
        status: error ? "error" : "idle",
        error,
        invalid: !!error,
      };
    });
    setItems((previous) => [...previous, ...added]);
    queue.current.push(...added.filter((item) => !item.invalid));
    void processQueue();
  }

  function retry(item: UploadItem) {
    if (
      disabled ||
      item.invalid ||
      uploadingId.current === item.id ||
      queue.current.some((entry) => entry.id === item.id)
    )
      return;
    patchItem(item.id, { status: "idle", error: undefined });
    queue.current.push(item);
    void processQueue();
  }

  function discard(id: string) {
    queue.current = queue.current.filter((item) => item.id !== id);
    setItems((previous) => previous.filter((item) => item.id !== id));
  }

  async function deleteUploaded(image: UploadedImage) {
    if (disabled || deletingIds.current.has(image.public_id)) return;
    deletingIds.current.add(image.public_id);
    setDeletions((previous) => ({
      ...previous,
      [image.public_id]: { pending: true },
    }));
    try {
      if (deleteOnRemove) await remove.mutateAsync(image.public_id);
      publish(
        current.current.value.filter(
          (entry) => entry.public_id !== image.public_id,
        ),
      );
      if (mounted.current)
        setDeletions((previous) => {
          const next = { ...previous };
          delete next[image.public_id];
          return next;
        });
    } catch (error) {
      if (mounted.current)
        setDeletions((previous) => ({
          ...previous,
          [image.public_id]: {
            pending: false,
            error: formatErrorMessage(error),
          },
        }));
    } finally {
      deletingIds.current.delete(image.public_id);
    }
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div
        className={cn(
          "rounded-xl border-2 border-dashed p-6 text-center",
          dragging && "border-primary bg-primary/5",
          disabled && "opacity-50",
        )}
        onDragOver={(event) => {
          event.preventDefault();
          event.dataTransfer.dropEffect = disabled ? "none" : "copy";
          if (!disabled) setDragging(true);
        }}
        onDragLeave={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null))
            setDragging(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          addFiles(event.dataTransfer.files);
        }}
      >
        <Upload
          className="mx-auto mb-2 size-6 text-muted-foreground"
          aria-hidden="true"
        />
        <p
          id={`${inputId}-hint`}
          className="mb-3 text-sm text-muted-foreground"
        >
          Drag and drop images here. Files upload one at a time.
          {maxSize !== undefined &&
            ` Up to ${(maxSize / 1024 / 1024).toFixed(1)} MB per image.`}
        </p>
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept="image/*"
          multiple
          hidden
          disabled={disabled}
          aria-label="Choose images"
          aria-describedby={`${inputId}-hint`}
          onChange={(event) => {
            if (event.target.files) addFiles(event.target.files);
            event.target.value = "";
          }}
        />
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
        >
          Choose images
        </Button>
      </div>
      <p className="sr-only" role="status">
        {busy
          ? "Images are being processed."
          : `${value.length} images uploaded.`}
      </p>
      {(value.length > 0 || items.length > 0) && (
        <AttachmentGroup className="flex-wrap overflow-visible">
          {value.map((image) => {
            const deletion = deletions[image.public_id];
            return (
              <Attachment
                key={image.public_id}
                state={
                  deletion?.error
                    ? "error"
                    : deletion?.pending
                      ? "processing"
                      : "done"
                }
              >
                <AttachmentMedia variant="image">
                  <ImagePreview url={image.url} />
                </AttachmentMedia>
                <AttachmentContent>
                  <AttachmentTitle>
                    {image.public_id.split("/").pop()}
                  </AttachmentTitle>
                  <AttachmentDescription
                    className="max-w-64 whitespace-normal"
                    role={deletion?.error ? "alert" : undefined}
                  >
                    {deletion?.error ??
                      (deletion?.pending ? "Deleting…" : "Uploaded")}
                  </AttachmentDescription>
                </AttachmentContent>
                <AttachmentActions>
                  <AttachmentAction
                    type="button"
                    disabled={disabled || deletion?.pending}
                    aria-label={`Delete ${image.public_id}`}
                    onClick={() => void deleteUploaded(image)}
                  >
                    {deletion?.pending ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <X />
                    )}
                  </AttachmentAction>
                </AttachmentActions>
              </Attachment>
            );
          })}
          {items.map((item) => (
            <Attachment key={item.id} state={item.status}>
              <AttachmentMedia variant="image">
                <ImagePreview file={item.file} />
              </AttachmentMedia>
              <AttachmentContent>
                <AttachmentTitle className="max-w-64">
                  {item.file.name}
                </AttachmentTitle>
                <AttachmentDescription
                  className="max-w-64 whitespace-normal"
                  role={item.error ? "alert" : undefined}
                >
                  {item.error ??
                    (item.status === "uploading" ? "Uploading…" : "Queued")}
                </AttachmentDescription>
              </AttachmentContent>
              <AttachmentActions>
                {item.status === "uploading" ? (
                  <Loader2
                    className="m-1 size-4 animate-spin"
                    aria-label="Uploading"
                  />
                ) : (
                  <>
                    {item.status === "error" && !item.invalid && (
                      <AttachmentAction
                        type="button"
                        disabled={disabled}
                        aria-label={`Retry ${item.file.name}`}
                        onClick={() => retry(item)}
                      >
                        <RotateCcw />
                      </AttachmentAction>
                    )}
                    <AttachmentAction
                      type="button"
                      disabled={disabled}
                      aria-label={`Remove ${item.file.name}`}
                      onClick={() => discard(item.id)}
                    >
                      <X />
                    </AttachmentAction>
                  </>
                )}
              </AttachmentActions>
            </Attachment>
          ))}
        </AttachmentGroup>
      )}
    </div>
  );
}
