import React, { useState, useEffect } from "react";
import "./UserMaintenance.css";
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserNavbar from "../UserNavbar/UserNavbar";

const initialState = {
    requesterName: "",
    roomNumber: "",
    buildingNumber: "",
    requestHeading: "",
    description: "",
    dateOfIssue: new Date(),
};

const fetchMaintenanceRequests = (userId, setMaintenanceRequests) => {
    fetch(`http://localhost:8083/communityhub/user/maintenance/user/${userId}`)
        .then((response) => response.json())
        .then((data) => {
            setMaintenanceRequests(data.reverse());
        })
        .catch((error) =>
            console.error("Error fetching maintenance requests:", error)
        );
};

const validateRequest = (newRequest) => {
    const errors = {};
    if (!newRequest.requesterName) {
        errors.requesterName = "Please enter requester name.";
    }
    if (!newRequest.roomNumber) {
        errors.roomNumber = "Please enter room number.";
    }
    if (!newRequest.buildingNumber) {
        errors.buildingNumber = "Please enter building number.";
    }
    if (!newRequest.requestHeading) {
        errors.requestHeading = "Please enter request heading.";
    }
    if (!newRequest.description) {
        errors.description = "Please enter description.";
    }
    return errors;
};

const postNewRequest = (newRequest, cookies, setMaintenanceRequests, resetNewRequest) => {
    fetch(`http://localhost:8083/communityhub/user/maintenance/raise`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            ...newRequest,
            userId: cookies.userId,
            userType: "RESIDENT",
        }),
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Failed to raise maintenance request");
            }
        })
        .then((data) => {
            setMaintenanceRequests((prevRequests) => [data, ...prevRequests]);
            resetNewRequest();
            toast.success("Maintenance request raised successfully");
        })
        .catch((error) => {
            console.error("Error raising maintenance request:", error);
            toast.error("Failed to raise maintenance request");
        });
};

const UserMaintenance = () => {
    const [maintenanceRequests, setMaintenanceRequests] = useState([]);
    const [newRequest, setNewRequest] = useState(initialState);
    const [cookies] = useCookies(['userId', 'userType']);
    const navigate = useNavigate();

    useEffect(() => {
        if (cookies.userId === 0 || cookies.userType !== "RESIDENT") {
            navigate('/sign-in');
            return;
        }

        fetchMaintenanceRequests(cookies.userId, setMaintenanceRequests);
    }, [cookies.userId, cookies.userType, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewRequest((prevRequest) => ({
            ...prevRequest,
            [name]: value,
        }));
    };

    const handleRaiseRequest = () => {
        const errors = validateRequest(newRequest);
        if (Object.keys(errors).length === 0) {
            postNewRequest(newRequest, cookies, setMaintenanceRequests, resetNewRequest);
        } else {
            displayErrors(errors);
        }
    };

    const resetNewRequest = () => {
        setNewRequest(initialState);
    };

    const displayErrors = (errors) => {
        Object.values(errors).forEach((errorMsg) => {
            toast.error(errorMsg);
        });
    };

    const handleDeleteRequest = (id) => {
        fetch(`http://localhost:8083/communityhub/user/maintenance/delete/${id}`, {
            method: "DELETE",
        })
            .then((response) => {
                if (response.ok) {
                    setMaintenanceRequests((prevRequests) =>
                        prevRequests.filter((request) => request.id !== id)
                    );
                    toast.success("Maintenance request deleted successfully");
                } else {
                    throw new Error("Failed to delete maintenance request");
                }
            })
            .catch((error) => {
                console.error("Error deleting maintenance request:", error);
                toast.error("Failed to delete maintenance request");
            });
    };

    return (
        <div>
            <UserNavbar />
            <div className="admin-table-container">
                <h2 id="headline_of_maintenance">Maintenance Requests</h2>
                <table aria-label="Maintenance Requests" className="user-table">
                    <thead>
                        <tr>
                            <th>REQUESTER NAME</th>
                            <th>ROOM NUMBER</th>
                            <th>BUILDING NUMBER</th>
                            <th>REQUEST HEADING</th>
                            <th>DESCRIPTION</th>
                            <th>DATE OF ISSUE</th>
                            <th>STATUS</th>
                            <th>ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {maintenanceRequests.map((row) => (
                            <tr key={row.id}>
                                <td>{row.requesterName}</td>
                                <td>{row.roomNumber}</td>
                                <td>{row.buildingNumber}</td>
                                <td>{row.requestHeading}</td>
                                <td>{row.description}</td>
                                <td>{new Date(row.dateOfIssue).toDateString()}</td>
                                <td>{row.status}</td>
                                <td>
                                    <button onClick={() => handleDeleteRequest(row.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                        <tr>
                            <td>
                                <input
                                    type="text"
                                    name="requesterName"
                                    value={newRequest.requesterName}
                                    onChange={handleInputChange}
                                    placeholder="Requester Name"
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    name="roomNumber"
                                    value={newRequest.roomNumber}
                                    onChange={handleInputChange}
                                    placeholder="Room Number"
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    name="buildingNumber"
                                    value={newRequest.buildingNumber}
                                    onChange={handleInputChange}
                                    placeholder="Building Number"
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    name="requestHeading"
                                    value={newRequest.requestHeading}
                                    onChange={handleInputChange}
                                    placeholder="Request Heading"
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    name="description"
                                    value={newRequest.description}
                                    onChange={handleInputChange}
                                    placeholder="Description"
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    value={new Date(newRequest.dateOfIssue).toDateString()} // Render date of issue
                                    disabled // Disable the input field
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    value={newRequest.status} // Render status
                                    disabled // Disable the input field
                                />
                            </td>
                            <td>
                                <button onClick={handleRaiseRequest}>RAISE</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <ToastContainer />
        </div>
    );
}

export default UserMaintenance;
