import { Schema } from 'mongoose';

export type TicketCategory = 'cinema' | 'concert' | 'theatre' | 'sport' | 'other';
export type TicketStatus = 'available' | 'reserved' | 'sold' | 'cancelled';

export interface Ticket {
    eventName: string;
    category: TicketCategory;
    venue: string;
    eventDate: string;
    price: number;
    currency: string;
    seat: string;
    status: TicketStatus;
    purchasedBy: string | null;
}

export const ticketSchema = new Schema<Ticket>({
    eventName: { type: String, required: true },
    category: {
        type: String,
        enum: ['cinema', 'concert', 'theatre', 'sport', 'other'],
        required: true,
    },
    venue: { type: String, required: true },
    eventDate: { type: String, required: true },
    price: { type: Number, required: true },
    currency: { type: String, required: true, default: 'DKK' },
    seat: { type: String, required: true },
    status: {
        type: String,
        enum: ['available', 'reserved', 'sold', 'cancelled'],
        required: true,
        default: 'available',
    },
    purchasedBy: { type: String, default: null },
});

