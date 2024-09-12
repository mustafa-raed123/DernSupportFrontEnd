// src/CustomerList.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CustomerList = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await axios.get('https://localhost:7121/api/Customers');
                setCustomers(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, []);

    if (loading) return <p>Loading customers...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h1>Customer List</h1>
            <ul>
                {customers.map(customer => (
                    <li key={customer.CustomerId}>
                        <h2>{customer.Name}</h2>
                        <p>Contact Info: {customer.ContactInfo}</p>
                        <p>Type: {customer.CustomerType}</p>
                        <p>Location: {customer.Location}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CustomerList;