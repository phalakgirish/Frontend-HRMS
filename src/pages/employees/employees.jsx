import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import './employees.css';
import { useNavigate } from 'react-router-dom';
import { getEmployee, createEmployee, updateEmployee, deleteEmployee } from '../../api/employeeApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as XLSX from "xlsx";
import axios from "axios";

const Employees = () => {

    const [employees, setEmployees] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editId, setEditId] = useState(null);
    const [departmentFilter, setDepartmentFilter] = useState("");
    const [locationNameFilter, setLocationNameFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    //from backend
    const [Employee, setEmployee] = useState([]);
    const [paginated, setPaginated] = useState([]);


    const [form, setForm] = useState({
        id: '',
        firstName: '',
        lastName: '',
        company: '',
        username: '',
        email: '',
        designation: '',
        role: '',
        employeeCtc: '',
        monthlyCtc: '',
        status: '',
        department: '',
        dateofBirth: '',
        joiningDate: '',
        gender: '',
        maritalStatus: '',
        contactNumber: '',
        employeeCategory: '',
        reportingTo: '',
        probationDate: '',
        confirmationDate: '',
        approvalByOne: '',
        approvalByTwo: '',
        bloodGroup: '',
        religion: '',
        cast: '',
        address: '',
        grade: '',
        password: '',
        confirmPassword: '',
        locationName: ''
    });

    const [errors, setErrors] = useState({});
    const validateForm = () => {
        let newErrors = {};
        let isValid = true;

        Object.keys(form).forEach((field) => {
            const error = validateField(field, form[field]);
            if (error) {
                newErrors[field] = error;
                isValid = false;
            }
        });

        setErrors(newErrors);
        return isValid;
    };


    const validateField = (fieldName, value = "") => {
        let error = "";

        let displayName = fieldName
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, str => str.toUpperCase());

        value = value.toString();

        switch (fieldName) {
            case "id":
            case "firstName":
            case "lastName":
            case "company":
            case "username":
            // case "email":
            case "designation":
            case "role":
            case "employeeCtc":
            case "monthlyCtc":
            case "status":
            case "department":
            case "dateofBirth":
            case "joiningDate":
            case "gender":
            case "maritalStatus":
            case "password":
            case "confirmPassword":
            // case "contactNumber":
            case "employeeCategory":
            case "reportingTo":
            case "probationDate":
            case "confirmationDate":
            case "bloodGroup":
            case "religion":
            case "cast":
            case "address":
            case "locationName":
            case "grade":
                if (!value.trim()) error = `${displayName} is required`;
                break;

            case "contactNumber":
                if (!value.trim()) error = "Phone number is required";
                else if (!/^\d+$/.test(value)) error = "Phone must be numeric";
                else if (value.length !== 10) error = "Phone must be exactly 10 digits";
                break;

            case "email":
                if (!value || !value.toString().trim()) {
                    error = "Email is required";
                } else {
                    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailPattern.test(value)) {
                        error = "Invalid email format";
                    }
                }
                break;

            default:
                break;
        }

        setErrors(prev => ({ ...prev, [fieldName]: error }));
        return error;
    };

    const emptyForm = {
        id: '',
        firstName: '',
        lastName: '',
        company: '',
        username: '',
        email: '',
        designation: '',
        role: '',
        employeeCtc: '',
        monthlyCtc: '',
        status: '',
        department: '',
        dateofBirth: '',
        joiningDate: '',
        gender: '',
        maritalStatus: '',
        contactNumber: '',
        employeeCategory: '',
        reportingTo: '',
        probationDate: '',
        confirmationDate: '',
        bloodGroup: '',
        religion: '',
        cast: '',
        address: '',
        grade: '',
        password: '',
        confirmPassword: '',
        locationName: ''
    };

    const resetForm = () => {
        setForm(emptyForm);
        setEditId(null);
        setShowEditModal(false);
    };

    useEffect(() => {
        fetchEmployee();
    }, []);

    const fetchEmployee = async () => {
        try {
            const response = await getEmployee();
            setEmployee(response.data);
            paginate(response.data, currentPage);
        } catch (error) {
            console.error('Error fetching Employee:', error);
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            console.log("Validation failed:", errors);
            //     return;
            // }

            try {
                if (editId) {
                    await updateEmployee(editId, form);
                    toast.success("Employee updated successfully!");

                    setEditId(null);
                } else {
                    await createEmployee(form);
                    toast.success("Employee saved successfully!");

                }
                fetchEmployee();
                setForm({
                    id: '',
                    firstName: '',
                    lastName: '',
                    company: '',
                    username: '',
                    email: '',
                    designation: '',
                    role: '',
                    employeeCtc: '',
                    monthlyCtc: '',
                    status: '',
                    department: '',
                    dateofBirth: '',
                    joiningDate: '',
                    gender: '',
                    maritalStatus: '',
                    contactNumber: '',
                    employeeCategory: '',
                    reportingTo: '',
                    probationDate: '',
                    confirmationDate: '',
                    bloodGroup: '',
                    religion: '',
                    cast: '',
                    address: '',
                    grade: '',
                    locationName: '',
                    password: '',
                    confirmPassword: '',
                    locationName: ''
                });
                setEditId("");
                setShowEditModal(false);
            } catch (err) {
                console.error("Error saving Employee:", err);
                toast.error("Employee failed to save!");

            }
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this Employee?");
        if (!confirmDelete) return;
        try {
            await deleteEmployee(id);
            fetchEmployee();
        } catch (err) {
            console.error("Error deleting Employee:", err);
        }
    };

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
    const navigate = useNavigate();


    const columns = [
        {
            name: 'Action',
            cell: (row) => (
                <div className="d-flex">
                    <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => navigate(`/empDetails/${row.id}`, { state: { employee: row, mode: "view" } })}
                    >
                        <i className="fas fa-arrow-right"></i>
                    </button>
                    <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => navigate(`/empDetails/${row.id}`, { state: { employee: row, mode: "edit" } })}
                    >
                        <i className="fas fa-edit"></i>
                    </button>
                    <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(row._id)}
                    >
                        <i className="fas fa-trash-alt text-white"></i>
                    </button>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
        {
            name: 'ID',
            cell: (row) => (
                <span style={{ cursor: 'pointer' }}>
                    {row.id}
                </span>
            ),
            selector: row => row.id,
            wrap: true,
            maxWidth: '200px',
        },

        {
            name: 'Name',
            selector: row => `${row.firstName} ${row.lastName}`,
            wrap: true,
            maxWidth: '200px',
        },

        {
            name: 'Company', selector: row => row.company,
            wrap: true, maxWidth: '200px',
        },
        { name: 'Username', selector: row => row.username },
        {
            name: 'Email', selector: row => row.email,
            wrap: true, maxWidth: '200px',
        },
        { name: 'Role', selector: row => row.role },
        {
            name: 'Designation', selector: row => row.designation,
            wrap: true, maxWidth: '200px',
        },
        { name: 'Employee CTC', selector: row => row.employeeCtc },
        { name: 'Monthly CTC', selector: row => row.monthlyCtc },
        { name: 'Status', selector: row => row.status },

    ];

    const customStyles = {
        headCells: {
            style: {
                backgroundColor: '#2b528c',
                color: 'white',
                fontSize: '14px',
                whiteSpace: 'nowrap',
            },
        },
        cells: {
            style: {
                fontSize: '14px',
                whiteSpace: 'normal',
                wordBreak: 'break-word',
            },
        },
    };


    const conditionalRowStyles = [
        {
            when: (row, index) => index % 2 === 0,
            style: {
                backgroundColor: 'white',
                minHeight: '60px',
                paddingTop: '10px',
                paddingBottom: '10px',
                whiteSpace: 'normal',
                wordBreak: 'break-word',
            },
        },
        {
            when: (row, index) => index % 2 !== 0,
            style: {
                backgroundColor: '#f8f9fa',
                minHeight: '60px',
                paddingTop: '10px',
                paddingBottom: '10px',
                whiteSpace: 'normal',
                wordBreak: 'break-word',
            },
        },
    ];


    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const totalEntries = Employee.length;
    const totalPages = Math.ceil(totalEntries / rowsPerPage);
    // console.log('Paginated data:', paginated);

    const paginate = (data, page) => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        setPaginated(data.slice(start, end));
        setCurrentPage(page);
    };

    const startEntry = (currentPage - 1) * rowsPerPage + 1;
    const endEntry = Math.min(currentPage * rowsPerPage, totalEntries);

    const [showAddForm, setShowAddForm] = useState(false);

    const toggleAddForm = () => {
        setShowAddForm((prev) => !prev);
    };

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const res = await axios.get("http://localhost:3000/employee");
                console.log("Fetched employees:", res.data);
                setEmployees(res.data);
            } catch (err) {
                console.error("Error fetching employees:", err);
            }
        };

        fetchEmployees();
    }, []);

    const filteredEmployees = employees.filter(emp =>
        (departmentFilter === "" || emp.department?.toLowerCase() === departmentFilter.toLowerCase()) &&
        (locationNameFilter === "" || emp.locationName?.toLowerCase() === locationNameFilter.toLowerCase()) &&
        (statusFilter === "" || emp.status?.toLowerCase() === statusFilter.toLowerCase())
    );

    const handleExport = () => {
        console.log(filteredEmployees);
        console.log("Employees:", employees);
        console.log("Filtered:", filteredEmployees);

        const ws = XLSX.utils.json_to_sheet(filteredEmployees);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Employees");
        XLSX.writeFile(wb, "filtered_employees.xlsx");
    };

    return (
        <div className="custom-container">
            <h5>Employees</h5>
            <p style={{ fontSize: '15px', color: 'rgb(98, 98, 98)' }}>
                <span style={{ color: 'red' }}>Home</span> / Employees
            </p>


            {showAddForm && (
                <div className="card mb-3 form-slide-container">
                    <div className="card-header d-flex justify-content-between align-items-center text-white new-emp-bg">
                        <span>Add New Employee</span>
                        <button className="btn btn-sm add-btn" onClick={toggleAddForm}>
                            - Hide
                        </button>
                    </div>

                    <div className="container mt-4">
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                {/* Left Column */}
                                <div className="col-md-6">
                                    <div className='row'>
                                        <div className="col-md-6 mb-3">
                                            <label>First Name</label>
                                            <input type="text" value={form.firstName} placeholder='First Name'
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, firstName: value });
                                                    validateField("firstName", value);
                                                }}
                                                className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
                                                onBlur={(e) => validateField("firstName", e.target.value)}

                                            />
                                            {errors.firstName && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.firstName}</p>
                                            )}
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label>Last Name</label>
                                            <input type="text" value={form.lastName} placeholder='Last Name'
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, lastName: value });
                                                    validateField("lastName", value);
                                                }}
                                                className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
                                                onBlur={(e) => validateField("lastName", e.target.value)}

                                            />
                                            {errors.lastName && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.lastName}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className="col-md-6 mb-3">
                                            <label>Department</label>
                                            <select id="department" value={form.department}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, department: value });
                                                    validateField("department", value);
                                                }}
                                                className={`form-control ${errors.department ? "is-invalid" : ""}`}
                                                onBlur={(e) => validateField("department", e.target.value)}
                                            >
                                                <option value="">Select Department</option>
                                                {Object.keys(departmentDesignations).map((dept) => (
                                                    <option key={dept} value={dept}>
                                                        {dept}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Designation */}
                                        <div className="col-md-6 mb-3">
                                            <label>Designation</label>
                                            {departmentDesignations[form.department]?.length > 0 ? (
                                                <select id="resignEmployee" value={form.designation}
                                                    onChange={(e) => {
                                                        const { value } = e.target;
                                                        setForm({ ...form, designation: value });
                                                        validateField("designation", value);
                                                    }}
                                                    className={`form-control ${errors.designation ? "is-invalid" : ""}`}
                                                    onBlur={(e) => validateField("designation", e.target.value)}
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
                                    </div>

                                    <div className='row'>
                                        <div className="col-md-6 mb-3">
                                            <label>Username</label>
                                            <input type="text" value={form.username} placeholder='Username'
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, username: value });
                                                    validateField("username", value);
                                                }}
                                                className={`form-control ${errors.username ? "is-invalid" : ""}`}
                                                onBlur={(e) => validateField("username", e.target.value)}

                                            />
                                            {errors.username && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.username}</p>
                                            )}
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label>Email</label>
                                            <input type="text" value={form.email} placeholder='Email ID'
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, email: value });
                                                    validateField("email", value);
                                                }}
                                                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                                                onBlur={(e) => validateField("email", e.target.value)}

                                            />
                                            {errors.email && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.email}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className="col-md-6 mb-3">
                                            <label>Date of Birth</label>
                                            <input type="date" value={form.dateofBirth}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, dateofBirth: value });
                                                    validateField("dateofBirth", value);
                                                }}
                                                className={`form-control ${errors.dateofBirth ? "is-invalid" : ""}`}
                                                onBlur={(e) => validateField("dateofBirth", e.target.value)}

                                            />
                                            {errors.dateofBirth && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.dateofBirth}</p>
                                            )}
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label>Contact Number</label>
                                            <input type="text" value={form.contactNumber} placeholder='Contact Number'
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, contactNumber: value });
                                                    validateField("contactNumber", value);
                                                }}
                                                className={`form-control ${errors.contactNumber ? "is-invalid" : ""}`}
                                                onBlur={(e) => validateField("contactNumber", e.target.value)}

                                            />
                                            {errors.contactNumber && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.contactNumber}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className="col-md-6 mb-3">
                                            <label>Reporting to</label>
                                            <select id="reportingTo" value={form.reportingTo}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, reportingTo: value });
                                                    validateField("reportingTo", value);
                                                }}
                                                className={`form-control ${errors.reportingTo ? "is-invalid" : ""}`}
                                                onBlur={(e) => validateField("reportingTo", e.target.value)}
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
                                            {errors.reportingTo && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.reportingTo}</p>
                                            )}
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label>Employee Category</label>
                                            <select id="employeeCategory" value={form.employeeCategory}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, employeeCategory: value });
                                                    validateField("employeeCategory", value);
                                                }}
                                                className={`form-control ${errors.employeeCategory ? "is-invalid" : ""}`}
                                                onBlur={(e) => validateField("employeeCategory", e.target.value)}
                                            >
                                                <option value="">Employee Category</option>
                                                <option value="trainee">Management Trainee</option>
                                                <option value="employee">Permanent Employee</option>
                                            </select>
                                            {errors.employeeCategory && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.employeeCategory}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className="col-md-6 mb-3">
                                            <label>Probation Date</label>
                                            <input type="date" value={form.probationDate}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, probationDate: value });
                                                    validateField("probationDate", value);
                                                }}
                                                className={`form-control ${errors.probationDate ? "is-invalid" : ""}`}
                                                onBlur={(e) => validateField("probationDate", e.target.value)}

                                            />
                                            {errors.probationDate && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.probationDate}</p>
                                            )}
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label>Blood Group</label>
                                            <select id="bloodGroup" value={form.bloodGroup}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, bloodGroup: value });
                                                    validateField("bloodGroup", value);
                                                }}
                                                className={`form-control ${errors.bloodGroup ? "is-invalid" : ""}`}
                                                onBlur={(e) => validateField("bloodGroup", e.target.value)}
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
                                            {errors.bloodGroup && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.bloodGroup}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className="col-md-12 mb-3">
                                            <label htmlFor="address">Address</label>
                                            <textarea
                                                className={`form-control ${errors.address ? "is-invalid" : ""}`}
                                                value={form.address}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, address: value });
                                                    validateField("address", value);
                                                }}
                                                onBlur={(e) => validateField("address", e.target.value)}
                                                id="address"
                                                rows="3"
                                            ></textarea>
                                            {errors.address && (
                                                <p className="text-danger mb-0" style={{ fontSize: "13px" }}>
                                                    {errors.address}
                                                </p>
                                            )}
                                        </div>

                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="col-md-6">

                                    <div className='row'>
                                        <div className="col-md-6 mb-3">
                                            <label>Employee ID</label>
                                            <input type="text" value={form.id} placeholder='Employee ID'
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, id: value });
                                                    validateField("id", value);
                                                }}
                                                className={`form-control ${errors.id ? "is-invalid" : ""}`}
                                                onBlur={(e) => validateField("id", e.target.value)}

                                            />
                                            {errors.id && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.id}</p>
                                            )}
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label>Date of Joining</label>
                                            <input type="date" value={form.joiningDate}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, joiningDate: value });
                                                    validateField("joiningDate", value);
                                                }}
                                                className={`form-control ${errors.joiningDate ? "is-invalid" : ""}`}
                                                onBlur={(e) => validateField("joiningDate", e.target.value)}

                                            />
                                            {errors.joiningDate && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.joiningDate}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className="col-md-6 mb-3">
                                            <label>Role</label>
                                            <select id="role" value={form.role}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, role: value });
                                                    validateField("role", value);
                                                }}
                                                className={`form-control ${errors.role ? "is-invalid" : ""}`}
                                                onBlur={(e) => validateField("role", e.target.value)}
                                            >
                                                <option value="">Role</option>
                                                <option value="super admin">Super Admin</option>
                                                <option value="employee">Employee</option>
                                                <option value="manager">Manager</option>
                                            </select>
                                            {errors.role && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.role}</p>
                                            )}
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label>Gender</label>
                                            <select id="gender" value={form.gender}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, gender: value });
                                                    validateField("gender", value);
                                                }}
                                                className={`form-control ${errors.gender ? "is-invalid" : ""}`}
                                                onBlur={(e) => validateField("gender", e.target.value)}
                                            >
                                                <option value="">Gender</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                            </select>
                                            {errors.gender && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.gender}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className="col-md-6 mb-3">
                                            <label>Religion</label>
                                            <select id="religion" value={form.religion}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, religion: value });
                                                    validateField("religion", value);
                                                }}
                                                className={`form-control ${errors.religion ? "is-invalid" : ""}`}
                                                onBlur={(e) => validateField("religion", e.target.value)}
                                            >
                                                <option value="">Select religion</option>
                                                <option value="hindu">Hindu</option>
                                                <option value="muslim">Muslim</option>
                                                <option value="chistian">Christian</option>
                                                <option value="sikh">Sikh</option>
                                                <option value="buddhist">Buddhist</option>
                                                <option value="jain">Jain</option>
                                            </select>
                                            {errors.religion && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.religion}</p>
                                            )}
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label>Cast/Category</label>
                                            <select id="cast" value={form.cast}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, cast: value });
                                                    validateField("cast", value);
                                                }}
                                                className={`form-control ${errors.cast ? "is-invalid" : ""}`}
                                                onBlur={(e) => validateField("cast", e.target.value)}
                                            >
                                                <option value="">Select Cast/Category</option>
                                                <option value="general">General</option>
                                                <option value="obc">OBC</option>
                                                <option value="sc">SC</option>
                                                <option value="st">ST</option>
                                            </select>
                                            {errors.cast && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.cast}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className="col-md-6 mb-3">
                                            <label>Password</label>
                                            <input type="password" value={form.password} placeholder='Password'
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, password: value });
                                                    validateField("password", value);
                                                }}
                                                className={`form-control ${errors.password ? "is-invalid" : ""}`}
                                                onBlur={(e) => validateField("password", e.target.value)}

                                            />
                                            {errors.password && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.password}</p>
                                            )}
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label>Confirm Password</label>
                                            <input type="password" value={form.confirmPassword} placeholder='Confirm Password'
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, confirmPassword: value });
                                                    validateField("confirmPassword", value);
                                                }}
                                                className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                                                onBlur={(e) => validateField("confirmPassword", e.target.value)}

                                            />
                                            {errors.confirmPassword && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.confirmPassword}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className="col-md-6 mb-3">
                                            <label>Employee CTC</label>
                                            <input type="text" value={form.employeeCtc} placeholder='Employee CTC'
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, employeeCtc: value });
                                                    validateField("employeeCtc", value);
                                                }}
                                                className={`form-control ${errors.employeeCtc ? "is-invalid" : ""}`}
                                                onBlur={(e) => validateField("employeeCtc", e.target.value)}

                                            />
                                            {errors.employeeCtc && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.employeeCtc}</p>
                                            )}
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label>Monthly CTC</label>
                                            <input type="text" value={form.monthlyCtc} placeholder='Monthly CTC'
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, monthlyCtc: value });
                                                    validateField("monthlyCtc", value);
                                                }}
                                                className={`form-control ${errors.monthlyCtc ? "is-invalid" : ""}`}
                                                onBlur={(e) => validateField("monthlyCtc", e.target.value)}

                                            />
                                            {errors.monthlyCtc && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.monthlyCtc}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className="col-md-6 mb-3">
                                            <label>Company</label>
                                            <select id="company" value={form.company}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, company: value });
                                                    validateField("company", value);
                                                }}
                                                className={`form-control ${errors.company ? "is-invalid" : ""}`}
                                                onBlur={(e) => validateField("company", e.target.value)}
                                            >
                                                <option value="">Company</option>
                                                <option value="UBI Services Ltd.">UBI Services Ltd.</option>
                                            </select>
                                            {errors.company && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.company}</p>
                                            )}
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label>Location</label>
                                            <select id="locationName" value={form.locationName}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, locationName: value });
                                                    validateField("locationName", value);
                                                }}
                                                className={`form-control ${errors.locationName ? "is-invalid" : ""}`}
                                                onBlur={(e) => validateField("locationName", e.target.value)}
                                            >
                                                <option value="">Location</option>
                                                <option value="Head Office - Mumbai">Head Office - Mumbai</option>
                                                <option value="Bangalore">Bangalore</option>
                                            </select>
                                            {errors.locationName && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.locationName}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className="col-md-6 mb-3">
                                            <label>Employee Grade</label>
                                            <select id="grade" value={form.grade}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, grade: value });
                                                    validateField("grade", value);
                                                }}
                                                className={`form-control ${errors.grade ? "is-invalid" : ""}`}
                                                onBlur={(e) => validateField("grade", e.target.value)}
                                            >
                                                <option value="location">Employee Grade</option>
                                                <option value="1">I</option>
                                                <option value="2">II</option>
                                            </select>
                                            {errors.grade && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.grade}</p>
                                            )}
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label>Approval Status</label>
                                            <select id="status" value={form.status}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, status: value });
                                                    validateField("status", value);
                                                }}
                                                className={`form-control ${errors.status ? "is-invalid" : ""}`}
                                                onBlur={(e) => validateField("status", e.target.value)}
                                            >
                                                <option value="">All</option>
                                                <option value="Active">Active</option>
                                                <option value="Inactive">Inactive</option>
                                            </select>

                                            {errors.status && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.status}</p>
                                            )}
                                        </div>
                                    </div>

                                </div>
                            </div>

                            <div className="text-start">
                                <button type="submit" className="btn btn-sm add-btn mb-2">Save</button>
                            </div>

                        </form>
                    </div>

                </div>
            )}



            <div className="card no-radius">
                <div className="card-header d-flex justify-content-between align-items-center text-white new-emp-bg">
                    <span>List All Employees</span>
                    <button className="btn btn-sm add-btn" onClick={toggleAddForm}>{showAddForm ? '- Hide' : '+ Add New'}</button>
                </div>

                <div className="m-3">

                    <div className="col-md-12 m-3">
                        <div className='row'>
                            <div className="col-md-3 mb-3">
                                <label>Department</label>
                                <select
                                    className="form-control"
                                    value={departmentFilter}
                                    onChange={(e) => setDepartmentFilter(e.target.value)}
                                >
                                    <option value="">All</option>
                                    <option value="Accounts">Accounts</option>
                                    <option value="Administrator">Administrator</option>
                                    <option value="Human Resource">Human Resource</option>
                                    <option value="Dealing">Dealing</option>
                                    <option value="Digital Marketing">Digital Marketing</option>
                                    <option value="IT">IT</option>
                                    <option value="Sales">Sales</option>
                                    <option value="Management">Management</option>
                                    <option value="Operation">Operation</option>
                                    <option value="Admin">Admin</option>

                                </select>

                            </div>

                            <div className="col-md-3 mb-3">
                                <label>Location</label>
                                <select
                                    className="form-control"
                                    value={locationNameFilter}
                                    onChange={(e) => setLocationNameFilter(e.target.value)}
                                >
                                    <option value="">All</option>
                                    <option value="Head Office - Mumbai">Head Office - Mumbai</option>
                                    <option value="Bangalore">Bangalore</option>
                                </select>
                            </div>

                            <div className="col-md-3 mb-3">
                                <label>Employee Status</label>
                                <select
                                    className="form-control"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="">All</option>
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                            <div className="col-md-2 mb-3 d-flex align-items-end">
                                <button className="btn btn-sm add-btn" onClick={handleExport}>Export</button>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="px-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <div className="d-flex align-items-center gap-2">
                            <label htmlFor="entriesSelect" className="mb-0 ms-4">Show</label>
                            <select
                                id="entriesSelect"
                                className="form-select form-select-sm w-auto"
                                value={rowsPerPage}
                                onChange={(e) => {
                                    setRowsPerPage(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                            >
                                <option value="10">10</option>
                                <option value="25">25</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </select>
                            <span className="ms-1">entries</span>
                        </div>
                    </div>

                    <DataTable
                        columns={columns}
                        data={paginated}
                        fixedHeader
                        highlightOnHover
                        customStyles={customStyles}
                        conditionalRowStyles={conditionalRowStyles}
                        responsive
                        subHeader
                        subHeaderAlign="right"
                        subHeaderComponent={
                            <div className="d-flex flex-wrap justify-content-between align-items-center w-100 gap-2">
                                <div className="d-flex flex-wrap gap-2">
                                    <button className="btn btn-sm btn-outline-dark">Copy</button>
                                    <button className="btn btn-sm btn-outline-dark">CSV</button>
                                    <button className="btn btn-sm btn-outline-dark">PDF</button>
                                    <button className="btn btn-sm btn-outline-dark">Print</button>
                                </div>

                                <div className="d-flex align-items-center gap-2">
                                    <label htmlFor="searchInput" className="mb-0">Search:</label>
                                    <input
                                        id="searchInput"
                                        type="text"
                                        className="form-control form-control-sm"
                                        onChange={() => { }}
                                    />
                                </div>
                            </div>
                        }
                    />
                </div>

                <div className="p-3">
                    <p className="mb-0 text-muted" style={{ fontSize: '0.9rem' }}>
                        Showing {startEntry} to {endEntry} of {totalEntries} entries
                    </p>
                </div>

                <div className="d-flex justify-content-end align-items-center p-3">
                    <button
                        className="btn btn-sm btn-outline-secondary px-3 prev-next me-1"
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Prev
                    </button>

                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            className={`btn btn-sm btn-outline-secondary prev-next me-1 ${currentPage === i + 1 ? 'active' : ''
                                }`}
                            onClick={() => setCurrentPage(i + 1)}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        className="btn btn-sm btn-outline-secondary px-3 prev-next"
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Employees;
