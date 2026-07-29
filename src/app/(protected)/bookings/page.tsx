"use client";

import { BookingPipeline } from "@/features/bookings/components/BookingPipeline";

export default function BookingsPage() {
  return (
    <div className="flex flex-col h-full space-y-4 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Booking & Enquiry Pipeline
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            Manage your incoming enquiries and upcoming bookings.
          </p>
        </div>
      </div>
      <div className="flex-1 overflow-auto rounded-lg">
        <BookingPipeline />
      </div>
    </div>
  );
}
