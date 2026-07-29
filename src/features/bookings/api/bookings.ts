import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createCrudApi } from "@/shared/lib/api-factory";
import { apiClient as api } from "@/shared/lib/axios";
import { components } from "@/shared/types/api";

export type BookingCreate = components["schemas"]["BookingCreate"];
export type BookingUpdate = components["schemas"]["BookingUpdate"];
export type BookingResponse = components["schemas"]["BookingResponse"];

const bookingApi = createCrudApi<
  BookingResponse,
  BookingCreate,
  BookingUpdate
>("/api/v1/bookings");

export const useBookings = (params: { page?: number; page_size?: number; search?: string; status?: string } = {}) => {
  return useQuery({
    queryKey: ["bookings", params],
    queryFn: async () => {
      const response = await api.get("/api/v1/bookings", { params });
      return response.data;
    },
  });
};

export const useBooking = (id: string) => {
  return useQuery({
    queryKey: ["bookings", id],
    queryFn: () => bookingApi.get(id),
    enabled: !!id,
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bookingApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
};

export const useUpdateBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: BookingUpdate }) =>
      bookingApi.update(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["bookings", variables.id] });
    },
  });
};

export const useQuoteBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, amount }: { id: string; amount: number }) => {
      const response = await api.post(`/api/v1/bookings/${id}/quote?quoted_amount=${amount}`);
      return response.data as BookingResponse;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["bookings", data.id] });
    },
  });
};

export const useConfirmBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.post(`/api/v1/bookings/${id}/confirm`);
      return response.data as BookingResponse;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["bookings", data.id] });
    },
  });
};

export const useConvertToTrip = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.post(`/api/v1/bookings/${id}/convert`);
      return response.data as { message: string; trip_id: string };
    },
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["bookings", id] });
      queryClient.invalidateQueries({ queryKey: ["trips"] });
    },
  });
};

export const useCancelBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.post(`/bookings/${id}/cancel`);
      return response.data as BookingResponse;
    },
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["bookings", id] });
    },
  });
};
