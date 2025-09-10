import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BasicInformationForm = ({ employeeId }) => {
    const [form, setForm] = useState({});

    const fetchEmployee = async () => {
        if (!employeeId) return;
        try {
            const res = await axios.get(`http://localhost:3000/employee/${employeeId}`);
            setForm(res.data);
        } catch (err) {
            console.error("Error fetching employee:", err);
            toast.error("Failed to load employee info!");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!employeeId) return toast.error("Employee ID missing");

        try {
            await axios.put(`http://localhost:3000/employee/${employeeId}`, form);
            toast.success("Employee information updated!");
        } catch (err) {
            console.error("Error updating employee:", err);
            toast.error("Failed to update employee info!");
        }
    };

    useEffect(() => {
        fetchEmployee();
    }, [employeeId]);

    const departmentDesignations = {
        "Accounts": ["Trainee"],
        "Administrator": ["System Administrator"],
        "Human Resource": ["HR Manager"],
        "Dealing": ["Asst. Dealer", "Dealer", "Sr. Manager", "AAA"],
        "Digital Marketing": ["Trainee"],
        "IT": ["IT Manager"],
        "Sales": ["Relationship Manager", "Team Leader - Home Loan", "Relationship Manager - Home Loan", "Team Leader - Vehicle Loan",
            "Branch Business Head", "Sales Coordinator",
        ],
        "Management": ["Senior Executive", "Whole Time Director", "Managing Director & CBO", "CFO & Digital Partnership Head", "Compliance Officer & Company Secretory"],
        "Operation": ["Operation Executive"],
        "Admin": [],
    };

    return (
        <div>
            <h6 className="mb-3">Basic Information</h6>
            <div className="container-fluid mt-4">
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-12 mb-3">
                            <label>Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={`${form.firstName || ''} ${form.lastName || ''}`.trim()}
                                readOnly
                                placeholder="Name"
                            />

                        </div>

                        <div className="col-md-4 mb-3">
                            <label>Employee ID</label>
                            <input type="text" className="form-control" value={form.id}
                                onChange={(e) => setForm({ ...form, id: e.target.value })} placeholder="Employee ID" />
                        </div>

                        <div className="col-md-4 mb-3">
                            <label>Username</label>
                            <input type="text" className="form-control" value={form.username}
                                onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="Username" />
                        </div>

                        <div className="col-md-4 mb-3">
                            <label>Email</label>
                            <input type="text" className="form-control" value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" />
                        </div>

                        <div className="col-md-4 mb-3">
                            <label>Department</label>
                            <select id="department" value={form.department}
                                onChange={(e) => {
                                    const { value } = e.target;
                                    setForm({ ...form, department: value });
                                }}
                                className={`form-control`}
                            >
                                <option value="">Select Department</option>
                                {Object.keys(departmentDesignations).map((dept) => (
                                    <option key={dept} value={dept}>
                                        {dept}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-4 mb-3">
                            <label>Designation</label>
                            {departmentDesignations[form.department]?.length > 0 ? (
                                <select id="resignEmployee" value={form.designation}
                                    onChange={(e) => {
                                        const { value } = e.target;
                                        setForm({ ...form, designation: value });
                                    }}
                                    className={`form-control`}
                                >
                                    <option value="">Select Designation</option>
                                    {departmentDesignations[form.department].map((desig, idx) => (
                                        <option key={idx} value={desig}>
                                            {desig}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type="text"
                                    value={form.designation}
                                    onChange={(e) =>
                                        setForm({ ...form, designation: e.target.value })
                                    }
                                    className="form-control"
                                    placeholder="No designation available"
                                    disabled
                                />
                            )}
                        </div>

                        <div className="col-md-4 mb-3">
                            <label>Role</label>
                            <select
                                className="form-select"
                                value={form.role}
                                onChange={(e) => setForm({ ...form, role: e.target.value })}
                            >
                                <option value="">Role</option>
                                <option value="Super Admin">Super Admin</option>
                                <option value="Employee">Employee</option>
                                <option value="Manager">Manager</option>
                            </select>
                        </div>



                        <div className="col-md-4 mb-3">
                            <label>Date of Birth</label>
                            <input type="date" className="form-control" value={form.dateofBirth}
                                onChange={(e) => setForm({ ...form, dateofBirth: e.target.value })} placeholder="Date of Birth" />
                        </div>

                        <div className="col-md-4 mb-3">
                            <label>Date of Joining</label>
                            <input type="date" className="form-control" value={form.joiningDate}
                                onChange={(e) => setForm({ ...form, joiningDate: e.target.value })} placeholder="Date of Joining" />
                        </div>

                        <div className="col-md-4 mb-3">
                            <label>Company</label>
                            <select id="company" value={form.company}
                                onChange={(e) => {
                                    const { value } = e.target;
                                    setForm({ ...form, company: value });
                                }}
                                className={`form-control`}
                            >
                                <option value="">Company</option>
                                <option value="UBI Services Ltd.">UBI Services Ltd.</option>
                            </select>
                        </div>

                        <div className="col-md-4 mb-3">
                            <label>Gender</label>
                            <select
                                className="form-select"
                                value={form.gender}
                                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                            >
                                <option value="">Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>

                        <div className="col-md-4 mb-3">
                            <label>Marital Status</label>
                            <select
                                className="form-select"
                                value={form.maritalStatus}
                                onChange={(e) => setForm({ ...form, maritalStatus: e.target.value })}
                            >
                                <option value="">Marital Status</option>
                                <option value="Single">Single</option>
                                <option value="Married">Married</option>
                            </select>
                        </div>

                        <div className="col-md-4 mb-3">
                            <label>Contact Number</label>
                            <input type="text" className="form-control" value={form.contactNumber}
                                onChange={(e) => setForm({ ...form, contactNumber: e.target.value })} placeholder="Contact Number" />
                        </div>

                        <div className="col-md-4 mb-3">
                            <label>Employee Category</label>
                            <select
                                className="form-select"
                                value={form.employeeCategory}
                                onChange={(e) => setForm({ ...form, employeeCategory: e.target.value })}
                            >
                                <option value="">Employee Category</option>
                                <option value="Management Trainee">Management Trainee</option>
                                <option value="Permanent Employee">Permanent Employee</option>
                            </select>
                        </div>

                        <div className="col-md-4 mb-3">
                            <label>Reporting to</label>
                            <select id="reportingTo" value={form.reportingTo}
                                onChange={(e) => {
                                    const { value } = e.target;
                                    setForm({ ...form, reportingTo: value });
                                }}
                                className={`form-control`}
                            >
                                <option value="">Reporting to</option>
                                <option value="Admin">Admin Admin</option>
                                <option value="Anjali Patle">Anjali Patle</option>
                                <option value="Amit Kumar">Amit Kumar</option>
                                <option value="Aniket Rane">Aniket Rane</option>
                                <option value="Shubham Kadam">Shubham Kadam</option>
                                <option value="Abhijieet Tawate">Abhijieet Tawate</option>
                                <option value="Pravin Bildlan">Pravin Bildlan</option>
                                <option value="Amit Pednekar">Amit Pednekar</option>
                                <option value="Mahendra Chaudhary">Mahendra Chaudhary</option>
                                <option value="Hamsa Dhwjaa">Hamsa Dhwjaa</option>
                                <option value="Manoj Kumar Sinha">Manoj Kumar Sinha</option>
                            </select>
                        </div>

                        <div className="col-md-4 mb-3">
                            <label>Location</label>
                            <select id="locationName" value={form.locationName}
                                onChange={(e) => {
                                    const { value } = e.target;
                                    setForm({ ...form, locationName: value });
                                }}
                                className={`form-control`}
                            >
                                <option value="location">Location</option>
                                <option value="Head Office - Mumbai">Head Office - Mumbai</option>
                                <option value="Bangalore">Bangalore</option>
                            </select>
                        </div>

                        <div className="col-md-4 mb-3">
                            <label>Approval By 1</label>
                            <input type="text" className="form-control" value={form.approvalByOne}
                                onChange={(e) => {
                                    const { value } = e.target;
                                    setForm({ ...form, approvalByOne: value });
                                }}
                                placeholder="Approval By 1" />
                        </div>

                        <div className="col-md-4 mb-3">
                            <label>Approval By 2</label>
                            <input type="text" className="form-control" value={form.approvalByTwo}
                                onChange={(e) => {
                                    const { value } = e.target;
                                    setForm({ ...form, approvalByTwo: value });
                                }}
                                placeholder="Approval By 1" />
                        </div>

                        <div className="col-md-4 mb-3">
                            <label>Approval Status</label>
                            <select id="status" value={form.status}
                                onChange={(e) => {
                                    const { value } = e.target;
                                    setForm({ ...form, status: value });
                                }}
                                className={`form-control`}
                            >
                                <option value="">All</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>



                        <div className="col-md-4 mb-3">
                            <label>Employee CTC</label>
                            <input type="text" className="form-control" value={form.employeeCtc}
                                onChange={(e) => setForm({ ...form, employeeCtc: e.target.value })} placeholder="Employee CTC" />
                        </div>

                        <div className="col-md-4 mb-3">
                            <label>Probation Date</label>
                            <input type="text" className="form-control" value={form.probationDate}
                                onChange={(e) => setForm({ ...form, probationDate: e.target.value })} placeholder="Probation Date" />
                        </div>

                        <div className="col-md-4 mb-3">
                        </div>

                        <div className="col-md-4 mb-3">
                            <label>Confirmation Date</label>
                            <input type="date" className="form-control" value={form.confirmationDate}
                                onChange={(e) => setForm({ ...form, confirmationDate: e.target.value })} placeholder="Confirmation Date" />
                        </div>

                        <div className="col-md-4 mb-3">
                            <label>Blood Group</label>
                            <select id="bloodGroup" value={form.bloodGroup}
                                onChange={(e) => {
                                    const { value } = e.target;
                                    setForm({ ...form, bloodGroup: value });
                                }}
                                className={`form-control`}
                            >
                                <option value="">Blood Group</option>
                                <option value="a+">A+</option>
                                <option value="a-">A-</option>
                                <option value="b+">B+</option>
                                <option value="b-">B-</option>
                                <option value="o+">O+</option>
                                <option value="o-">O-</option>
                                <option value="ab+">AB+</option>
                                <option value="ab-">AB-</option>
                            </select>
                        </div>

                        <div className="col-md-4 mb-3">
                            <label>Religion</label>
                            <select id="religion" value={form.religion}
                                onChange={(e) => {
                                    const { value } = e.target;
                                    setForm({ ...form, religion: value });
                                }}
                                className={`form-control`}
                            >
                                <option value="">Select religion</option>
                                <option value="hindu">Hindu</option>
                                <option value="muslim">Muslim</option>
                                <option value="chistian">Christian</option>
                                <option value="sikh">Sikh</option>
                                <option value="buddhist">Buddhist</option>
                                <option value="jain">Jain</option>
                            </select>
                        </div>

                        <div className="col-md-4 mb-3">
                            <label>Cast</label>
                            <select id="cast" value={form.cast}
                                onChange={(e) => {
                                    const { value } = e.target;
                                    setForm({ ...form, cast: value });
                                }}
                                className={`form-control`}
                            >
                                <option value="">Select Cast/Category</option>
                                <option value="general">General</option>
                                <option value="obc">OBC</option>
                                <option value="sc">SC</option>
                                <option value="st">ST</option>
                            </select>
                        </div>

                        <div className="col-md-6 mb-3">
                            <label>Address</label>
                            <textarea
                                placeholder="Address"
                                className="form-control" value={form.address}
                                onChange={(e) => setForm({ ...form, address: e.target.value })}
                                rows={3}
                            ></textarea>
                        </div>


                        <div className="col-md-6 mb-3">
                            <label>Grade</label>
                            <select id="grade" value={form.grade}
                                onChange={(e) => {
                                    const { value } = e.target;
                                    setForm({ ...form, grade: value });
                                }}
                                className={`form-control`}
                            >
                                <option value="">Employee Grade</option>
                                <option value="1">I</option>
                                <option value="2">II</option>
                            </select>
                        </div>

                    </div>

                    <div className="text-start">
                        <button type="submit" className="btn btn-sm add-btn mb-2">Save</button>
                    </div>

                </form>
            </div>
        </div>

    );
};

export default BasicInformationForm;
