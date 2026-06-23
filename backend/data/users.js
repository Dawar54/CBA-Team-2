import bcrypt from 'bcryptjs';

const users = [
    {
        name: 'Admin Seller',
        email: 'admin@revshop.com',
        password: 'password123', // Will be hashed by model pre-save hook
        role: 'seller',
        businessDetails: 'RevShop Official Store',
        phone: '1234567890',
    },
    {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'buyer',
        address: '123 Main St, New York, NY 10001',
    },
    {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123',
        role: 'buyer',
        address: '456 Oak Ave, San Francisco, CA 94102',
    },
];

export default users;
