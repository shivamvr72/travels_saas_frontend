import React, { useState } from "react";
import { useBookings, useUpdateBooking, useQuoteBooking, useConfirmBooking, useConvertToTrip, useCancelBooking, BookingResponse } from "../api/bookings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { MapPin, Calendar, Users, DollarSign, Clock, MoreVertical, ArrowRight } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const STATUS_COLORS: Record<string, string> = {
  enquiry: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  quoted: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  confirmed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  converted: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  cancelled: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300",
};

export const BookingPipeline = () => {
  const { data: bookings = [], isLoading } = useBookings();
  const quoteMutation = useQuoteBooking();
  const confirmMutation = useConfirmBooking();
  const convertMutation = useConvertToTrip();
  const cancelMutation = useCancelBooking();

  const [quoteDialog, setQuoteDialog] = useState<{ open: boolean; bookingId: string | null }>({ open: false, bookingId: null });
  const [quoteAmount, setQuoteAmount] = useState("");

  if (isLoading) return <div className="flex h-full items-center justify-center text-slate-500">Loading pipeline...</div>;

  const handleQuoteSubmit = () => {
    if (quoteDialog.bookingId && quoteAmount) {
      quoteMutation.mutate(
        { id: quoteDialog.bookingId, amount: Number(quoteAmount) },
        {
          onSuccess: () => {
            toast.success("Quote sent successfully");
            setQuoteDialog({ open: false, bookingId: null });
            setQuoteAmount("");
          },
          onError: () => toast.error("Failed to submit quote")
        }
      );
    }
  };

  const handleConvert = (id: string) => {
    toast.promise(convertMutation.mutateAsync(id), {
      loading: 'Converting to trip...',
      success: 'Successfully converted to trip',
      error: 'Failed to convert to trip'
    });
  };

  const renderColumn = (title: string, status: string) => {
    const items: BookingResponse[] = Array.isArray(bookings) ? bookings : (bookings as any).items || [];
    const columnBookings = items.filter((b) => b.status === status);

    return (
      <div className="flex flex-col w-[350px] shrink-0 bg-slate-50/50 dark:bg-slate-900/50 rounded-xl p-3 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between px-2 py-3 mb-2">
          <h3 className="font-semibold text-sm tracking-wide text-slate-700 dark:text-slate-300 uppercase flex items-center gap-2">
            {title}
            <Badge variant="secondary" className="rounded-full px-2 py-0.5 text-xs font-normal">
              {columnBookings.length}
            </Badge>
          </h3>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-3 px-1 pb-2 scrollbar-thin">
          {columnBookings.map((booking) => (
            <Card key={booking.id} className="cursor-grab hover:ring-2 ring-primary/20 transition-all shadow-sm border-slate-200 dark:border-slate-800">
              <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between space-y-0">
                <div className="flex flex-col">
                  <span className="font-bold text-sm text-slate-900 dark:text-slate-100">{booking.booking_number}</span>
                  <span className="text-xs text-slate-500">{booking.booking_date ? new Date(booking.booking_date).toLocaleDateString() : 'No date'}</span>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger className="h-8 w-8 p-0 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-slate-100 dark:hover:bg-slate-800">
                    <span className="sr-only">Open menu</span>
                    <MoreVertical className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {status === "enquiry" && (
                      <DropdownMenuItem onClick={() => setQuoteDialog({ open: true, bookingId: booking.id })}>
                        Send Quote
                      </DropdownMenuItem>
                    )}
                    {status === "quoted" && (
                      <DropdownMenuItem onClick={() => confirmMutation.mutate(booking.id)}>
                        Confirm Booking
                      </DropdownMenuItem>
                    )}
                    {status === "confirmed" && (
                      <DropdownMenuItem onClick={() => handleConvert(booking.id)}>
                        Convert to Trip
                      </DropdownMenuItem>
                    )}
                    {["enquiry", "quoted"].includes(status) && (
                      <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => cancelMutation.mutate(booking.id)}>
                        Cancel Booking
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 mb-3">
                  <div className="flex flex-col gap-1 w-full">
                    <div className="flex items-center gap-1.5 font-medium">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      <span className="truncate">{booking.pickup_location || 'TBD'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-medium text-slate-500">
                      <ArrowRight className="h-3.5 w-3.5" />
                      <span className="truncate">{booking.drop_location || 'TBD'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400 mt-4">
                  {booking.booking_date && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3 w-3" />
                      {new Date(booking.booking_date).toLocaleDateString()}
                    </div>
                  )}
                  {booking.pickup_time && (
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3 w-3" />
                      {booking.pickup_time}
                    </div>
                  )}
                  {booking.no_of_passengers && (
                    <div className="flex items-center gap-1.5">
                      <Users className="h-3 w-3" />
                      {booking.no_of_passengers} Pax
                    </div>
                  )}
                  {booking.quoted_amount ? (
                    <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400 font-medium">
                      <DollarSign className="h-3 w-3" />
                      {booking.quoted_amount.toLocaleString()}
                    </div>
                  ) : null}
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                {status === "enquiry" && (
                  <Button size="sm" className="w-full text-xs h-8" variant="outline" onClick={() => setQuoteDialog({ open: true, bookingId: booking.id })}>
                    Prepare Quote
                  </Button>
                )}
                {status === "quoted" && (
                  <Button size="sm" className="w-full text-xs h-8" onClick={() => confirmMutation.mutate(booking.id)}>
                    Confirm
                  </Button>
                )}
                {status === "confirmed" && (
                  <Button size="sm" className="w-full text-xs h-8 bg-purple-600 hover:bg-purple-700 text-white" onClick={() => handleConvert(booking.id)}>
                    Create Trip
                  </Button>
                )}
                {status === "converted" && (
                  <Badge variant="outline" className="w-full justify-center h-8 bg-slate-50 text-slate-500 cursor-default">
                    Converted
                  </Badge>
                )}
              </CardFooter>
            </Card>
          ))}
          {columnBookings.length === 0 && (
            <div className="flex flex-col items-center justify-center p-8 text-slate-400 border-2 border-dashed rounded-lg border-slate-200 dark:border-slate-800">
              <span className="text-sm">No bookings</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="flex h-full gap-4 overflow-x-auto pb-4">
        {renderColumn("Enquiries", "enquiry")}
        {renderColumn("Quoted", "quoted")}
        {renderColumn("Confirmed", "confirmed")}
        {renderColumn("Converted", "converted")}
      </div>

      <Dialog open={quoteDialog.open} onOpenChange={(open) => !open && setQuoteDialog({ open: false, bookingId: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Provide Quote</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Quoted Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount (e.g. 1500)"
                value={quoteAmount}
                onChange={(e) => setQuoteAmount(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setQuoteDialog({ open: false, bookingId: null })}>Cancel</Button>
            <Button onClick={handleQuoteSubmit} disabled={!quoteAmount || quoteMutation.isPending}>
              {quoteMutation.isPending ? "Sending..." : "Send Quote"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
