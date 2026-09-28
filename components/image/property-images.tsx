"use client";

import { ImageUpload } from "./image-upload";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatErrorMessage } from "@/lib/format/format-error";
import type { usePropertyImages } from "@/hooks/use-property-images";

export function PropertyImages({
  editor,
  disabled,
}: {
  editor: ReturnType<typeof usePropertyImages>;
  disabled?: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Property images</CardTitle>
        <CardDescription>Upload images, then save the property to apply your changes.</CardDescription>
      </CardHeader>
      <CardContent>
        {editor.loading ? <p role="status">Loading images…</p> : editor.error ? (
          <div role="alert" className="space-y-2">
            <p>{formatErrorMessage(editor.error)}</p>
            <Button type="button" variant="outline" onClick={editor.retry}>Retry loading images</Button>
          </div>
        ) : (
          <ImageUpload
            value={editor.images}
            onChange={editor.onChange}
            onBusyChange={editor.onBusyChange}
            disabled={disabled}
            deleteOnRemove={false}
          />
        )}
      </CardContent>
    </Card>
  );
}
