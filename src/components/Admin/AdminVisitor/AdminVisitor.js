import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './AdminVisitor.css'; // Reusing the CSS for styling
import AdminNavbar from "../AdminNavbar/AdminNavbar";
import { useCookies } from 'react-cookie';
import axios from 'axios';

export default function AdminVisitor() {
    const [visitorRecords, setVisitorRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cookies] = useCookies(['userId', 'userType']);
    const navigate = useNavigate();

    useEffect(() => {
        if (cookies.userId === 0 || cookies.userType !== "ADMIN") {
            navigate('/sign-in');
        } else {
            axios.get(`http://localhost:8084/communityhub/user/visitors/all`)
                .then(response => {
                    setVisitorRecords(response.data.reverse());
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching visitor records:', error);
                    setLoading(false);
                });
        }
    }, [cookies.userId, cookies.userType, navigate]);

    const columns = [
        { key: "visitorFullName", label: "VISITOR NAME" },
        { key: "buildingNumber", label: "BUILDING NUMBER" },
        { key: "purpose", label: "PURPOSE" },
        { key: "checkInDate", label: "CHECK-IN DATE" },
        { key: "checkOutDate", label: "CHECK-OUT DATE" },
    ];

    return (
        <div>
            <AdminNavbar />
            <div className="admin-visitor-container">
                <h2>Visitors List</h2>
                {loading ? (
                    <p>Loading...</p>
                ) : visitorRecords.length === 0 ? (
                    <p>No visitor records found.</p>
                ) : (
                    <table aria-label="Visitor Records" className="table">
                        <thead>
                            <tr>
                                {columns.map((column) => (
                                    <th key={column.key}>{column.label}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {visitorRecords.map((row, index) => (
                                <tr key={index}>
                                    {columns.map((column) => (
                                        <td key={column.key}>
                                            {column.key === "checkInDate" || column.key === "checkOutDate" ?
                                                <DatePicker
                                                    selected={row[column.key] ? new Date(row[column.key]) : null}
                                                    showTimeSelect
                                                    timeFormat="HH:mm"
                                                    timeIntervals={15}
                                                    dateFormat="MMMM d, yyyy h:mm aa"
                                                    disabled
                                                />
                                                : row[column.key]}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
