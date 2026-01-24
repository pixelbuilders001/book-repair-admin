// Database schema types
export interface DatabaseBooking {
    id: string;
    user_name: string;
    mobile_number: string;
    full_address: string;
    landmark: string | null;
    category_id: string | null;
    issue_id: string | null;
    preferred_time_slot: string | null;
    status: string;
    media_url: string | null;
    secondary_media_url: string | null;
    created_at: string;
    pincode: string;
    order_id: string | null;
    note: string | null;
    referral_code: string | null;
    total_estimated_price: number | null;
    net_inspection_fee: number | null;
    final_amount_paid: number | null;
    technician_id: string | null;
    assigned_at: string | null;
    accepted_at: string | null;
    completed_at: string | null;
    payment_status: string;
    map_url: string | null;
    completion_code: string | null;
    completion_code_used: boolean;
    final_amount_to_be_paid: string | null;
    payment_method: string | null;
    wallet_used_amount: number | null;
    preferred_service_date: string | null;
    issue?: {
        name: string;
        icon_url: string;
    };
    category?: {
        name: string;
    };
    technician?: {
        name: string;
    };
}

// UI display types (for backward compatibility)
export interface Booking {
    id: string;
    customer: string;
    category: string;
    technician: string;
    city: string;
    date: string;
    amount: string;
    status: "Pending" | "In Progress" | "Completed" | "Cancelled";
    customerDetails?: {
        phone: string;
        address: string;
    };
}

export interface Technician {
    id: string;
    name: string;
    skills: string[];
    city: string;
    status: "Active" | "Pending Approval" | "Suspended" | "Inactive";
    rating: number;
    jobsCompleted: number;
    earnings: string;
    joinDate: string;
}

export interface Payment {
    bookingId: string;
    techId: string;
    techName: string;
    totalAmount: number;
    techEarning: number;
    platformComm: number;
    status: "Paid" | "Pending Payout";
    date: string;
}

export interface Referral {
    code: string;
    owner: string;
    ownerName: string;
    usageCount: number;
    bookingsCount: number;
    totalRewards: string;
    status: string;
}

export interface WalletUser {
    mobile: string;
    name: string;
    balance: string;
    lastUsed: string;
}

export interface WalletTransaction {
    id: string;
    mobile: string;
    type: "Credit" | "Debit";
    amount: string;
    reason: string;
    date: string;
}

export interface Profile {
    id: string;
    email: string;
    full_name: string | null;
    role: string;
    phone: string | null;
    onboarding_status: string;
    is_verified: boolean;
    selfie_url: string | null;
    created_at: string | null;
    updated_at: string | null;
}
