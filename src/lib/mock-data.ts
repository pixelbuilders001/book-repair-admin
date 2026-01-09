export const dashboardStats = [
    {
        title: "Total Bookings",
        value: "1,284",
        description: "+12.5% from last month",
        trend: "up",
    },
    {
        title: "Total Revenue",
        value: "₹4,25,800",
        description: "+8.2% from last month",
        trend: "up",
    },
    {
        title: "Platform Comm.",
        value: "₹63,870",
        description: "+10.1% from last month",
        trend: "up",
    },
    {
        title: "Active Techs",
        value: "142",
        description: "+4 new this week",
        trend: "up",
    },
];

export const bookingData = [
    { name: "Mon", bookings: 42, revenue: 12000 },
    { name: "Tue", bookings: 38, revenue: 11000 },
    { name: "Wed", bookings: 54, revenue: 15000 },
    { name: "Thu", bookings: 48, revenue: 13500 },
    { name: "Fri", bookings: 72, revenue: 21000 },
    { name: "Sat", bookings: 85, revenue: 24000 },
    { name: "Sun", bookings: 68, revenue: 19000 },
];

export const recentBookings = [
    {
        id: "BK-8291",
        customer: "Amit Sharma",
        category: "AC Repair",
        technician: "Vikram Singh",
        status: "In Progress",
        amount: "₹1,200",
        city: "Patna",
        date: "2026-01-09",
    },
    {
        id: "BK-8290",
        customer: "Priya Gupta",
        category: "Washing Machine",
        technician: "Unassigned",
        status: "Pending",
        amount: "₹450",
        city: "Patna",
        date: "2026-01-09",
    },
    {
        id: "BK-8289",
        customer: "Rajesh Kumar",
        category: "Refrigerator",
        technician: "Suresh P.",
        status: "Completed",
        amount: "₹2,800",
        city: "Jaipur",
        date: "2026-01-08",
    },
    {
        id: "BK-8288",
        customer: "Sanjay Verma",
        category: "AC Repair",
        technician: "Vikram Singh",
        status: "Completed",
        amount: "₹1,500",
        city: "Patna",
        date: "2026-01-08",
    },
    {
        id: "BK-8287",
        customer: "Meena Devi",
        category: "Electrician",
        technician: "Bobby J.",
        status: "Cancelled",
        amount: "₹0",
        city: "Lucknow",
        date: "2026-01-07",
    },
];

export const allBookings = [
    ...recentBookings,
    {
        id: "BK-8286",
        customer: "Karan Johar",
        category: "Geyser",
        technician: "Ramesh K.",
        status: "Completed",
        amount: "₹1,800",
        city: "Jaipur",
        date: "2026-01-08",
    },
    {
        id: "BK-8285",
        customer: "Sonia Gandhi",
        category: "Microwave",
        technician: "Unassigned",
        status: "Pending",
        amount: "₹600",
        city: "Lucknow",
        date: "2026-01-09",
    },
    {
        id: "BK-8284",
        customer: "Rahul Bose",
        category: "AC Repair",
        technician: "Vikram Singh",
        status: "Completed",
        amount: "₹2,200",
        city: "Patna",
        date: "2026-01-07",
    },
    {
        id: "BK-8283",
        customer: "Anjali Singh",
        category: "Washing Machine",
        technician: "Suresh P.",
        status: "In Progress",
        amount: "₹1,100",
        city: "Indore",
        date: "2026-01-09",
    },
    {
        id: "BK-8282",
        customer: "Deepak Chaurasia",
        category: "Electrician",
        technician: "Bobby J.",
        status: "Completed",
        amount: "₹450",
        city: "Bhopal",
        date: "2026-01-08",
    },
];

export const technicians = [
    {
        id: "TECH-1001",
        name: "Vikram Singh",
        skills: ["AC Repair", "Refrigerator"],
        city: "Patna",
        status: "Active",
        rating: 4.8,
        jobsCompleted: 142,
        earnings: "₹1,24,000",
        joinDate: "2025-10-12",
    },
    {
        id: "TECH-1002",
        name: "Suresh Prasad",
        skills: ["Washing Machine", "Microwave"],
        city: "Jaipur",
        status: "Active",
        rating: 4.6,
        jobsCompleted: 98,
        earnings: "₹82,500",
        joinDate: "2025-11-05",
    },
    {
        id: "TECH-1003",
        name: "Bobby Jha",
        skills: ["Electrician", "Geyser"],
        city: "Lucknow",
        status: "Pending Approval",
        rating: 0,
        jobsCompleted: 0,
        earnings: "₹0",
        joinDate: "2026-01-05",
    },
    {
        id: "TECH-1004",
        name: "Ramesh Kumar",
        skills: ["Geyser", "Plumbing"],
        city: "Indore",
        status: "Active",
        rating: 4.9,
        jobsCompleted: 210,
        earnings: "₹1,86,000",
        joinDate: "2025-08-20",
    },
    {
        id: "TECH-1005",
        name: "Amit Kumar",
        skills: ["AC Repair"],
        city: "Bhopal",
        status: "Suspended",
        rating: 3.2,
        jobsCompleted: 15,
        earnings: "₹8,400",
        joinDate: "2025-12-15",
    },
];

export const payments = [
    {
        bookingId: "BK-8289",
        techId: "TECH-1004",
        techName: "Ramesh Kumar",
        totalAmount: 2800,
        techEarning: 2380,
        platformComm: 420,
        status: "Paid",
        date: "2026-01-08",
    },
    {
        bookingId: "BK-8288",
        techId: "TECH-1001",
        techName: "Vikram Singh",
        totalAmount: 1500,
        techEarning: 1275,
        platformComm: 225,
        status: "Paid",
        date: "2026-01-08",
    },
    {
        bookingId: "BK-8284",
        techId: "TECH-1001",
        techName: "Vikram Singh",
        totalAmount: 2200,
        techEarning: 1870,
        platformComm: 330,
        status: "Paid",
        date: "2026-01-07",
    },
    {
        bookingId: "BK-8282",
        techId: "TECH-1003",
        techName: "Bobby Jha",
        totalAmount: 450,
        techEarning: 382.5,
        platformComm: 67.5,
        status: "Pending Payout",
        date: "2026-01-08",
    },
];

export const walletTransactions = [
    {
        id: "TXN-001",
        mobile: "9876543210",
        type: "Credit",
        amount: "₹500",
        reason: "Referral Bonus",
        date: "2026-01-09",
    },
    {
        id: "TXN-002",
        mobile: "9876543210",
        type: "Debit",
        amount: "₹199",
        reason: "Booking Inspection Fee",
        date: "2026-01-08",
    },
];

export const referrals = [
    {
        code: "FIXIT100",
        owner: "9876543210",
        ownerName: "Amit Sharma",
        usageCount: 12,
        bookingsCount: 8,
        totalRewards: "₹800",
        status: "Active",
    },
    {
        code: "VIKRAM50",
        owner: "9823456789",
        ownerName: "Vikram Singh",
        usageCount: 45,
        bookingsCount: 32,
        totalRewards: "₹1,600",
        status: "Active",
    },
    {
        code: "SAVE20",
        owner: "Admin",
        ownerName: "Platform",
        usageCount: 154,
        bookingsCount: 120,
        totalRewards: "₹0",
        status: "Expired",
    },
];

export const walletUsers = [
    {
        mobile: "9876543210",
        name: "Amit Sharma",
        balance: "₹1,250",
        lastUsed: "2026-01-09",
    },
    {
        mobile: "9823456789",
        name: "Vikram Singh",
        balance: "₹4,800",
        lastUsed: "2026-01-08",
    },
    {
        mobile: "9988776655",
        name: "Priya Gupta",
        balance: "₹150",
        lastUsed: "2026-01-05",
    },
];

export const categoryDetails = [
    {
        id: "CAT-01",
        name: "AC Repair",
        baseFee: 299,
        issues: [
            { id: "ISS-01", name: "Not Cooling", minPrice: 800, maxPrice: 2500 },
            { id: "ISS-02", name: "Loud Noise", minPrice: 400, maxPrice: 1200 },
            { id: "ISS-03", name: "Water Leakage", minPrice: 500, maxPrice: 1500 },
        ],
        status: "Active",
    },
    {
        id: "CAT-02",
        name: "Washing Machine",
        baseFee: 199,
        issues: [
            { id: "ISS-04", name: "Drum Not Rotating", minPrice: 1200, maxPrice: 4500 },
            { id: "ISS-05", name: "Vibration Issues", minPrice: 300, maxPrice: 1000 },
        ],
        status: "Active",
    },
];

export const cityConfigs = [
    {
        name: "Patna",
        multiplier: 1.0,
        status: "Active",
        bookings: 542,
    },
    {
        name: "Jaipur",
        multiplier: 1.2,
        status: "Active",
        bookings: 320,
    },
    {
        name: "Lucknow",
        multiplier: 1.1,
        status: "Active",
        bookings: 284,
    },
    {
        name: "Indore",
        multiplier: 1.15,
        status: "Disabled",
        bookings: 142,
    },
];

export const categories = ["AC Repair", "Washing Machine", "Refrigerator", "Electrician", "Geyser", "Microwave"];
export const cities = ["Patna", "Jaipur", "Lucknow", "Indore", "Bhopal", "Ranchi"];
export const statuses = ["Pending", "In Progress", "Completed", "Cancelled"];
export const techStatuses = ["Active", "Pending Approval", "Suspended", "Inactive"];
