"use client";

import { useId, type ReactNode } from "react";
import {
  Controller,
  useForm,
  useWatch,
  type FieldPathByValue,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";

import {
  PropertySchema,
  type PropertyFormValues,
} from "@/lib/validation/property.schema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Field, FieldError, FieldLabel, FieldSet } from "@/components/ui/field";

import { AmenitySelect } from "@/components/input/amenity-select";
import { RegionSelect } from "@/components/native-select/region-select";
import { TownshipSelect } from "@/components/native-select/township-select";
import { ListingTypeSelect } from "@/components/native-select/listing-type-select";
import { PropertyTypeSelect } from "@/components/native-select/property-type-select";
import { PropertyStatusSelect } from "@/components/select/property-status-select";

type PropertyFormProps = {
  children?: ReactNode;
  defaultValues?: Partial<PropertyFormValues>;
  onSubmit: (payload: PropertyFormValues) => Promise<void>;
  submitLabel: string;
  pendingLabel: string;
  pending: boolean;
  submitDisabled?: boolean;
};

type SectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

function Section({ title, description, children }: SectionProps) {
  return (
    <Card className="w-full min-w-0 overflow-hidden">
      <CardHeader className="border-b bg-muted/30">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>

        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>

      <CardContent className="space-y-5 pt-6">{children}</CardContent>
    </Card>
  );
}

export function PropertyForm({
  children,
  submitDisabled = false,
  defaultValues,
  onSubmit,
  submitLabel,
  pendingLabel,
  pending,
}: PropertyFormProps) {
  const id = useId();

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(PropertySchema),

    defaultValues: {
      region_id: 0,
      township_id: 0,

      title: "",
      subtitle: "",
      description: "",

      listing_type: "SALE",
      property_type: "HOUSE",
      status: "DRAFT",

      price_lakhs: 0,
      price_label: "",
      property_size: "",
      property_features: "",

      local_area: "",
      street: "",
      landmark: "",
      address_detail: "",

      latitude: null,
      longitude: null,

      contact_phone: "",
      contact_viber: "",
      contact_telegram: "",

      is_featured: false,

      amenity_ids: [],

      ...defaultValues,

      detail: {
        land_info: "",
        ownership_info: "",
        building_info: "",
        room_info: "",
        road_info: "",
        extra_info: "",
        ...defaultValues?.detail,
      },
    },
  });

  const regionId = useWatch({
    control: form.control,
    name: "region_id",
  });

  const saving = pending || form.formState.isSubmitting;

  function textField(
    name: FieldPathByValue<PropertyFormValues, string | null | undefined>,
    label: string,
    multiline = false,
    placeholder?: string,
    type = "text",
  ) {
    return (
      <Controller
        key={name}
        name={name}
        control={form.control}
        render={({ field, fieldState }) => {
          const fieldId = `${id}-${name}`;

          const props = {
            ...field,
            value: field.value ?? "",
            id: fieldId,
            placeholder,
            "aria-invalid": fieldState.invalid,
            "aria-describedby": fieldState.invalid
              ? `${fieldId}-error`
              : undefined,
          };

          return (
            <Field className="min-w-0" data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={fieldId}>{label}</FieldLabel>

              {multiline ? (
                <Textarea {...props} rows={3} className="min-h-24 resize-y" />
              ) : (
                <Input {...props} type={type} />
              )}

              <FieldError id={`${fieldId}-error`} errors={[fieldState.error]} />
            </Field>
          );
        }}
      />
    );
  }

  function numberField(
    name: "price_lakhs" | "latitude" | "longitude",
    label: string,
    min: number,
    max?: number,
    placeholder?: string,
  ) {
    return (
      <Controller
        name={name}
        control={form.control}
        render={({ field, fieldState }) => {
          const fieldId = `${id}-${name}`;

          return (
            <Field className="min-w-0" data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={fieldId}>{label}</FieldLabel>

              <Input
                {...field}
                id={fieldId}
                value={field.value ?? ""}
                type="number"
                step="any"
                min={min}
                max={max}
                placeholder={placeholder}
                onChange={(event) =>
                  field.onChange(
                    event.target.value === ""
                      ? name === "price_lakhs"
                        ? 0
                        : null
                      : event.target.valueAsNumber,
                  )
                }
                aria-invalid={fieldState.invalid}
                aria-describedby={
                  fieldState.invalid ? `${fieldId}-error` : undefined
                }
              />

              <FieldError id={`${fieldId}-error`} errors={[fieldState.error]} />
            </Field>
          );
        }}
      />
    );
  }

  return (
    <form
      className="w-full min-w-0"
      noValidate
      aria-busy={saving}
      onSubmit={form.handleSubmit(async (values) => {
        if (!pending && !submitDisabled) {
          await onSubmit(values);
        }
      })}
    >
      <FieldSet disabled={saving} className="min-w-0 gap-0">
        <div className="space-y-6 rounded-xl bg-muted/30 p-3 sm:p-5 lg:p-6">
          {/* ============================= */}
          {/* Listing Information */}
          {/* ============================= */}

          <Section
            title="Listing information"
            description="Enter the basic information that will identify and describe this property listing."
          >
            <div className="grid gap-5 md:grid-cols-2">
              {textField("title", "Title", false, "Property title")}

              {textField("subtitle", "Subtitle", false, "Short subtitle")}
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <Controller
                name="listing_type"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="min-w-0" data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={`${id}-listing_type`}>
                      Listing type
                    </FieldLabel>

                    <ListingTypeSelect
                      {...field}
                      id={`${id}-listing_type`}
                      aria-invalid={fieldState.invalid}
                    />

                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />

              <Controller
                name="property_type"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="min-w-0" data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={`${id}-property_type`}>
                      Property type
                    </FieldLabel>

                    <PropertyTypeSelect
                      {...field}
                      id={`${id}-property_type`}
                      aria-invalid={fieldState.invalid}
                    />

                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />

              <Controller
                name="status"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="min-w-0" data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={`${id}-status`}>Status</FieldLabel>

                    <PropertyStatusSelect
                      name={field.name}
                      value={field.value}
                      onValueChange={field.onChange}
                      onBlur={field.onBlur}
                      ref={field.ref}
                      disabled={field.disabled}
                      id={`${id}-status`}
                      aria-invalid={fieldState.invalid}
                    />

                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
            </div>

            {textField(
              "description",
              "Description",
              true,
              "Write a detailed description of the property...",
            )}

            <Controller
              name="is_featured"
              control={form.control}
              render={({ field }) => (
                <div className="rounded-lg border bg-muted/20 p-4">
                  <Field orientation="horizontal" className="justify-between">
                    <div className="space-y-1">
                      <FieldLabel
                        htmlFor={`${id}-featured`}
                        className="text-sm font-medium"
                      >
                        Featured property
                      </FieldLabel>

                      <p className="text-sm text-muted-foreground">
                        Highlight this property in featured listing areas.
                      </p>
                    </div>

                    <Switch
                      id={`${id}-featured`}
                      name={field.name}
                      ref={field.ref}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      onBlur={field.onBlur}
                      disabled={saving}
                    />
                  </Field>
                </div>
              )}
            />
          </Section>

          {/* ============================= */}
          {/* Price & Size */}
          {/* ============================= */}

          <Section
            title="Price & size"
            description="Enter the selling or rental price, property dimensions and main property features."
          >
            <div className="grid gap-5 md:grid-cols-3">
              {numberField("price_lakhs", "Price (lakhs)", 0, undefined, "0")}

              {textField("price_label", "Price label", false, "Negotiable")}

              {textField("property_size", "Property size", false, "40 x 60 ft")}
            </div>

            {textField(
              "property_features",
              "Property features",
              true,
              "Describe the main features of the property...",
            )}
          </Section>

          {/* ============================= */}
          {/* Location */}
          {/* ============================= */}

          <Section
            title="Location"
            description="Specify the region, township and detailed location of the property."
          >
            <div className="grid gap-5 md:grid-cols-2">
              <Controller
                name="region_id"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="min-w-0" data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={`${id}-region`}>Region</FieldLabel>

                    <RegionSelect
                      {...field}
                      id={`${id}-region`}
                      aria-invalid={fieldState.invalid}
                      onChange={(event) => {
                        field.onChange(Number(event.target.value));

                        form.setValue("township_id", 0, {
                          shouldDirty: true,
                          shouldValidate: form.formState.isSubmitted,
                        });
                      }}
                    />

                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />

              <Controller
                name="township_id"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="min-w-0" data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={`${id}-township`}>Township</FieldLabel>

                    <TownshipSelect
                      {...field}
                      regionId={regionId}
                      id={`${id}-township`}
                      aria-invalid={fieldState.invalid}
                      onChange={(event) =>
                        field.onChange(Number(event.target.value))
                      }
                    />

                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {textField("local_area", "Local area", false, "e.g. 8 Mile")}

              {textField("street", "Street", false, "Street name")}

              {textField("landmark", "Landmark", false, "Nearby landmark")}

              <div className="md:col-span-2">
                {textField(
                  "address_detail",
                  "Address detail",
                  true,
                  "Building number, ward, street details, nearby places...",
                )}
              </div>
            </div>

            <div className="rounded-lg border bg-muted/20 p-4">
              <div className="mb-4">
                <h3 className="text-sm font-medium">Map coordinates</h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  Optional latitude and longitude coordinates for accurate map
                  positioning.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {numberField("latitude", "Latitude", -90, 90, "16.8409")}

                {numberField("longitude", "Longitude", -180, 180, "96.1735")}
              </div>
            </div>
          </Section>

          {/* ============================= */}
          {/* Property Details */}
          {/* ============================= */}

          <Section
            title="Amenities"
            description="Select the amenities available at this property."
          >
            <Controller
              name="amenity_ids"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={`${id}-amenities`}>Amenities</FieldLabel>
                  <AmenitySelect
                    {...field}
                    id={`${id}-amenities`}
                    value={field.value ?? []}
                    disabled={saving}
                    aria-invalid={fieldState.invalid}
                    aria-describedby={fieldState.invalid ? `${id}-amenities-error` : undefined}
                  />
                  <FieldError id={`${id}-amenities-error`} errors={[fieldState.error]} />
                </Field>
              )}
            />
          </Section>

          <Section
            title="Property details"
            description="Provide more detailed information about the land, ownership, building, rooms and road access."
          >
            <div className="grid gap-5 md:grid-cols-2">
              {textField(
                "detail.land_info",
                "Land",
                true,
                "Land size, shape and other land information...",
              )}

              {textField(
                "detail.ownership_info",
                "Ownership",
                true,
                "Ownership type and documentation...",
              )}

              {textField(
                "detail.building_info",
                "Building",
                true,
                "Building type, floors, construction information...",
              )}

              {textField(
                "detail.room_info",
                "Rooms",
                true,
                "Bedrooms, bathrooms and other rooms...",
              )}

              {textField(
                "detail.road_info",
                "Road access",
                true,
                "Road width, access type and road condition...",
              )}

              {textField(
                "detail.extra_info",
                "Additional details",
                true,
                "Any other useful property information...",
              )}
            </div>
          </Section>

          {/* ============================= */}
          {/* Contact */}
          {/* ============================= */}

          <Section
            title="Contact information"
            description="Enter the contact methods that buyers or renters can use to make an inquiry."
          >
            <div className="grid gap-5 md:grid-cols-3">
              {textField("contact_phone", "Phone", false, "+95...", "tel")}

              {textField("contact_viber", "Viber", false, "+95...", "tel")}

              {textField("contact_telegram", "Telegram", false, "@username")}
            </div>
          </Section>

          {/* ============================= */}
          {/* Submit */}
          {/* ============================= */}

          {children}

          <div className="sticky bottom-0 z-10 rounded-xl border bg-background/95 p-4 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/80">
            <div className="flex items-center justify-between gap-4">
              <p className="hidden text-sm text-muted-foreground sm:block">
                Review the property information before saving.
              </p>

              <Button
                type="submit"
                disabled={saving || submitDisabled}
                className="w-full sm:w-auto"
              >
                {saving ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Save className="size-4" />
                )}

                {saving ? pendingLabel : submitLabel}
              </Button>
            </div>
          </div>
        </div>
      </FieldSet>
    </form>
  );
}
