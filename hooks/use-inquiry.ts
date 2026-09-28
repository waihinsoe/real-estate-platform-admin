"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getInquiries, updateInquiry, createInquiryActivity } from "@/api/inquiry";
import type { InquiryQueryType, UpdateInquiryPayload, CreateInquiryActivityPayload } from "@/types/inquiry";

const inquiryKeys = {
  all: ["inquiries"] as const,
  list: (query: InquiryQueryType) => ["inquiries", query] as const,
};

export const useInquiries = (query: InquiryQueryType) => useQuery({
  queryKey: inquiryKeys.list(query),
  queryFn: () => getInquiries(query),
});

export const useUpdateInquiry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateInquiryPayload }) => updateInquiry(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: inquiryKeys.all }),
  });
};

export const useCreateInquiryActivity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: CreateInquiryActivityPayload }) => createInquiryActivity(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: inquiryKeys.all }),
  });
};
