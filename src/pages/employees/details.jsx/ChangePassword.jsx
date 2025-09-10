import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ChangePassword = ({ employeeId }) => {

    const [form, setForm] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const fetchEmployee = async () => {
        if (!employeeId) return;
        try {
            const res = await axios.get(`http://localhost:3000/employee/${employeeId}`);
            setForm(res.data);
        } catch (err) {
            console.error("Error fetching employee password:", err);
            toast.error("Failed to load employee password!");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!employeeId) return toast.error("Employee ID missing");

        try {
            await axios.put(`http://localhost:3000/employee/${employeeId}`, form);
            toast.success("Employee password updated!");
        } catch (err) {
            console.error("Error updating employee password:", err);
            toast.error("Failed to update employee password!");
        }
    };

    useEffect(() => {
        fetchEmployee();
    }, [employeeId]);

    return (
        <div>
            <div className="container-fluid mt-4">
                <form onSubmit={handleSubmit}>
                    <div className="row d-flex">
                        <div className="col-md-6 mb-3 position-relative">
                            <label>Enter New Password</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                className="form-control"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                placeholder="Enter New Password"
                            />
                            <span
                                onClick={() => setShowPassword((prev) => !prev)}
                                style={{
                                    position: "absolute",
                                    right: "20px",
                                    top: "32px", 
                                    cursor: "pointer",
                                    color: "#555",
                                }}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>

                        <div className="col-md-6 mb-3 position-relative">
                            <label>Enter New Confirm Password</label>
                            <input
                                type={showConfirm ? "text" : "password"}
                                className="form-control"
                                value={form.confirmPassword}
                                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                                placeholder="Enter New Confirm Password"
                            />
                            <span
                                onClick={() => setShowConfirm((prev) => !prev)}
                                style={{
                                    position: "absolute",
                                     right: "20px",
                                    top: "32px", 
                                    cursor: "pointer",
                                    color: "#555",
                                }}
                            >
                                {showConfirm ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                    </div>

                    <div className="text-start mb-4">
                        <button type="submit" className="btn btn-sm add-btn">Save</button>
                    </div>
                </form>
            </div>




        </div>

    );
};
export default ChangePassword;