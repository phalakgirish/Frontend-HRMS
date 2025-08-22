import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Navigate } from 'react-router-dom';
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TrainingDetail = () => {

    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const employee = location.state?.employee;
    const [status, setStatus] = useState(employee?.status || "");
    const [description, setDescription] = useState('Approved');
    const [Data, setData] = useState();
    const [employeeData, setEmployeeData] = useState(location.state?.employee || null);




    const [form, setForm] = useState({
        performance: employee?.performance,
        remarks: employee?.remarks || "",
        status: employee?.status,
    });


    const fetchEmployee = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/training-list/${id}`);
            setEmployeeData(res.data);
            setForm({
                performance: res.data.performance || "not-conclude",
                remarks: res.data.remarks || "",
                status: res.data.status || "Pending",
            });
        } catch (err) {
            console.error("Error fetching employee:", err.response?.data || err.message);
        }
    };

    useEffect(() => {
        fetchEmployee();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!employeeData?._id) return;

        try {
            const res = await axios.patch(
                `http://localhost:3000/training-list/${employeeData._id}`,
                {
                    performance: form.performance,
                    remarks: form.remarks,
                    status: form.status,
                }
            );
            setEmployeeData(res.data);
            setForm((prev) => ({ ...prev, status: res.data.status }));
            alert("Updated successfully!");
            navigate("/trainingList", { state: { updatedEmployee: res.data } });
        } catch (err) {
            console.error("Error updating training:", err.response?.data || err.message);
        }
    };


    return (
        <div className="custom-container">
            <h5>Training Details</h5>
            <p style={{ fontSize: '15px', color: 'rgb(98, 98, 98)' }}>
                <span style={{ color: 'red' }}>Home</span> / Training Details
            </p>

            <div className="row">
                <div className="col-md-4 mb-3">
                    <div className="card no-radius">
                        <div className="card-header text-white new-emp-bg fw-bold">Training Details</div>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item">
                                <strong>Training Type: {employeeData?.trainingType}</strong>
                            </li>
                            <li className="list-group-item">
                                <strong>Trainer: {employeeData?.trainer}</strong>
                            </li>

                            <li className="list-group-item">
                                <strong>Training Cost: {employeeData?.trainingCost}</strong>
                            </li>

                            <li className="list-group-item">
                                <strong>Start Date: {employeeData?.startDate}</strong>
                            </li>

                            <li className="list-group-item">
                                <strong>End Date: {employeeData?.endDate}</strong>
                            </li>

                            <li className="list-group-item">
                                <strong>Description: {employeeData?.description}</strong>
                            </li>

                            <li className="list-group-item">
                                <strong>Performance: {employeeData?.performance}</strong>
                            </li>

                            <li className="list-group-item">
                                <strong>Remarks: {employeeData?.remarks}</strong>
                            </li>

                        </ul>
                    </div>
                </div>



                <div className="col-md-4 mb-3">
                    <div className="card no-radius">
                        <div className="card-header text-white new-emp-bg fw-bold">
                            Details
                        </div>
                        <div className="card-body">
                            <h6 className="fw-bold mb-3 border-bottom pb-1">Training Employees</h6>

                            {employee?.employee && employee.employee.length > 0 ? (
                                employee.employee.map((emp, index) => (
                                    <div key={index} className="d-flex align-items-center mb-2">
                                        <img
                                            src="/avatar.png"
                                            alt="avatar"
                                            className="rounded-circle me-2"
                                            width="32"
                                            height="32"
                                        />
                                        <strong>{emp}</strong>
                                    </div>
                                ))
                            ) : (
                                <p className="text-muted">No employees assigned</p>
                            )}
                        </div>
                    </div>

                    <div className="col-md-12 mb-3">
                        <div className="card no-radius">
                            <div className="card-header text-white new-emp-bg fw-bold">
                                Update Status
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="fw-semibold">Status</label>
                                        <select
                                            name="status"
                                            value={form.status}
                                            onChange={(e) => setForm({ ...form, status: e.target.value })}
                                            className="form-control"
                                        >
                                            <option value="">Select Status</option>
                                            <option value="Pending">Pending</option>
                                            <option value="Approved">Approved</option>
                                            <option value="Rejected">Rejected</option>
                                        </select>
                                    </div>
                                    <div className="text-start">
                                        <button type="submit" className="btn btn-sm add-btn">Save</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-4 mb-3">
                    <div className="card no-radius">
                        <div className="card-header text-white new-emp-bg fw-bold">
                            Details
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="fw-semibold">Performance</label>
                                    <select
                                        name="performance"
                                        value={form.performance}
                                        onChange={handleChange}
                                        className="form-control"
                                    >
                                        <option value="not-conclude">Not Concluded</option>
                                        <option value="satisfactory">Satisfactory</option>
                                        <option value="avg">Average</option>
                                        <option value="poor">Poor</option>
                                        <option value="excellent">Excellent</option>
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label className="fw-semibold">Remarks</label>
                                    <textarea
                                        name="remarks"
                                        value={form.remarks}
                                        className="form-control"
                                        rows="4"
                                        placeholder="Remarks"
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="text-start">
                                    <button type="submit" className="btn btn-sm add-btn">Save</button>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>

            </div>


        </div>
    );
};

export default TrainingDetail;
