import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
// import './employees.css';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { getPerformanceAppraisal, createPerformanceAppraisal, updatePerformanceAppraisal, deletePerformanceAppraisal } from '../../api/performanceAppraisalApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PerformanceAppraisal = () => {

    const [showModal, setShowModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [description, setDescription] = useState('');
    const [editId, setEditId] = useState(null);

    //from backend
    const [PerformanceAppraisal, setPerformanceAppraisal] = useState([]);
    const [paginated, setPaginated] = useState([]);


    const [form, setForm] = useState({
        employee: '',
        designation: '',
        department: '',
        appraisalDate: '',
        description: '',
        // addedBy: '',
        // createdAt: '',
        customerExperience: '',
        marketing: '',
        management: '',
        administration: '',
        presentationSkill: '',
        qualityOfWork: '',
        efficiency: '',
        integrity: '',
        professionalism: '',
        teamWork: '',
        criticalThinking: '',
        conflictManagement: '',
        attendance: '',
        abilityToMeetDeadline: ''
    });

    const [errors, setErrors] = useState({});
    const validateForm = () => {
        let newErrors = {};

        Object.keys(form).forEach((field) => {
            if (!form[field] || form[field].toString().trim() === "") {
                newErrors[field] = `${field.replace(/([A-Z])/g, " $1")} is required`;
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateField = (fieldName, value = "") => {
        let error = "";

        let displayName = fieldName
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, str => str.toUpperCase());

        value = value.toString();

        switch (fieldName) {
            case "employee":
            case "appraisalDate":
            // case "noticeDate":
            // case "PerformanceAppraisalDate":
            // case "approvalStatus":
            case "description":
            case "designation":
            case "department":
            // case "addedBy":
            case "customerExperience":
            case "marketing":
            case "management":
            case "administration":
            case "presentationSkill":
            case "qualityOfWork":
            case "efficiency":
            case "integrity":
            case "professionalism":
            case "teamWork":
            case "criticalThinking":
            case "conflictManagement":
            case "attendance":
            case "abilityToMeetDeadline":
                if (!value.trim()) error = `${displayName} is required`;
                break;

            default:
                break;
        }

        setErrors(prev => ({ ...prev, [fieldName]: error }));
        return error;
    };


    useEffect(() => {
        fetcPerformanceAppraisal();
    }, []);

    const fetcPerformanceAppraisal = async () => {
        try {
            const response = await getPerformanceAppraisal();
            setPerformanceAppraisal(response.data);
            paginate(response.data, currentPage);
        } catch (error) {
            console.error('Error fetching PerformanceAppraisal:', error);
        }
    };

    const emptyForm = {
        employee: '',
        appraisalDate: '',
        designation: '',
        department: '',
        description: '',
        // addedBy: '',
        // createdAt: '',
        customerExperience: '',
        marketing: '',
        management: '',
        administration: '',
        presentationSkill: '',
        qualityOfWork: '',
        efficiency: '',
        integrity: '',
        professionalism: '',
        teamWork: '',
        criticalThinking: '',
        conflictManagement: '',
        attendance: '',
        abilityToMeetDeadline: ''
    };

    const resetForm = () => {
        setForm(emptyForm);
        setEditId(null);
        setShowEditModal(false);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("🔍 Starting save process...");
        console.log("Current Form Data:", form);
        console.log("Edit ID:", editId);


        if (validateForm()) {

            try {
                if (editId) {
                    await updatePerformanceAppraisal(editId, form);
                    toast.success("PerformanceAppraisal updated successfully!");

                    setEditId(null);
                } else {
                    console.log("Final data sent to API:", JSON.stringify(form, null, 2));

                    await createPerformanceAppraisal(form);
                    toast.success("PerformanceAppraisal saved successfully!");

                }
                fetcPerformanceAppraisal();
                setForm({
                    employee: '',
                    appraisalDate: '',
                    designation: '',
                    department: '',
                    description: '',
                    // createdAt: '',
                    customerExperience: '',
                    marketing: '',
                    management: '',
                    administration: '',
                    presentationSkill: '',
                    qualityOfWork: '',
                    efficiency: '',
                    integrity: '',
                    professionalism: '',
                    teamWork: '',
                    criticalThinking: '',
                    conflictManagement: '',
                    attendance: '',
                    abilityToMeetDeadline: ''
                });

                setEditId("");
                setShowEditModal(false);
            } catch (err) {
                console.error("Error saving PerformanceAppraisal:", err);
                toast.error("PerformanceAppraisal failed to save!");

            }
        }
    };

    const handleView = (row) => {
        setSelectedRow(row);
        setShowModal(true);
    };


    const handleEdit = (row) => {
        setEditId(row._id);
        setForm({
            employee: row.employee || '',
            appraisalDate: row.appraisalDate || '',
            designation: row.designation || '',
            department: row.department || '',
            description: row.description || '',
            // addedBy: row.addedBy || '',
            // createdAt: row.createdAt || '',
            customerExperience: row.customerExperience || '',
            marketing: row.marketing || '',
            management: row.management || '',
            administration: row.administration || '',
            presentationSkill: row.presentationSkill || '',
            qualityOfWork: row.qualityOfWork || '',
            efficiency: row.efficiency || '',
            integrity: row.integrity || '',
            professionalism: row.professionalism || '',
            teamWork: row.teamWork || '',
            criticalThinking: row.criticalThinking || '',
            conflictManagement: row.conflictManagement || '',
            attendance: row.attendance || '',
            abilityToMeetDeadline: row.abilityToMeetDeadline || ''
        });

        setShowEditModal(true);
        setSelectedRow(row);
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this PerformanceAppraisal?");
        if (!confirmDelete) return;
        try {
            await deletePerformanceAppraisal(id);
            fetcPerformanceAppraisal();
        } catch (err) {
            console.error("Error deleting PerformanceAppraisal:", err);
        }
    };



    const columns = [
        {
            name: 'Action',
            cell: (row) => (
                <div className="d-flex">
                    <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => handleView(row)}
                    >
                        <i className="fas fa-eye"></i>
                    </button>
                    <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => handleEdit(row)}
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
        { name: 'Employee', selector: row => row.employee },
        { name: 'Department', selector: row => row.department },
        { name: 'Designation', selector: row => row.designation },
        { name: 'Appraisal Date', selector: row => row.appraisalDate },

    ];

    // const data = [
    //     {
    //         action: '-',
    //         employee: 'Shubham Kadam',
    //         department: 'Trainee',
    //         designation: 'Digital Marketing',
    //         appraisalDate: '01-Jun-2017',
    //     },
    //     {
    //         action: '-',
    //         employee: 'Shubham Kadam',
    //         department: 'Trainee',
    //         designation: 'Digital Marketing',
    //         appraisalDate: '01-Jun-2017',
    //     }, {
    //         action: '-',
    //         employee: 'Shubham Kadam',
    //         department: 'Trainee',
    //         designation: 'Digital Marketing',
    //         appraisalDate: '01-Jun-2017',
    //     },
    // ];

    const customStyles = {
        headCells: {
            style: {
                backgroundColor: '#2b528c',
                color: 'white',
                fontSize: '14px',
            },
        },
    };

    const conditionalRowStyles = [
        {
            when: (row, index) => index % 2 === 0,
            style: {
                backgroundColor: 'white',
            },
        },
        {
            when: (row, index) => index % 2 !== 0,
            style: {
                backgroundColor: '#f8f9fa',
            },
        },
    ];

    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const totalEntries = PerformanceAppraisal.length;
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

    return (
        <div className="custom-container">
            <h5>Performance Appraisal</h5>
            <p style={{ fontSize: '15px', color: 'rgb(98, 98, 98)' }}>
                <span style={{ color: 'red' }}>Home</span> / Performance Appraisal
            </p>


            {showAddForm && (
                <div className="card mb-3 form-slide-container">
                    <div className="card-header d-flex justify-content-between align-items-center text-white new-emp-bg">
                        <span>Set New Indicator</span>
                        <button className="btn btn-sm add-btn" onClick={toggleAddForm}>
                            - Hide
                        </button>
                    </div>

                    <div className="container mt-4">

                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                {/* Left Column */}
                                <div className="row">
                                    {/* Employee */}
                                    <div className="col-12 col-md-6 mb-3 d-flex align-items-center">
                                        <label
                                            htmlFor="employee"
                                            className="me-2 mb-0"
                                            style={{ minWidth: "160px" }}
                                        >
                                            Employee
                                        </label>
                                        <select
                                            id="employee"
                                            value={form.employee}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setForm({ ...form, employee: value });
                                                validateField("employee", value);
                                            }}
                                            onBlur={(e) => validateField("employee", e.target.value)}
                                            className={`form-control ${errors.employee ? "is-invalid" : ""}`}
                                        >
                                            <option value="">Choose an Employee..</option>
                                            <option value="Admin Admin">Admin Admin</option>
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
                                        {errors.employee && (
                                            <p className="text-danger mb-0 mt-1" style={{ fontSize: "13px" }}>
                                                Required!
                                            </p>
                                        )}
                                    </div>

                                    {/* Department */}
                                    <div className="col-12 col-md-6 mb-3 d-flex align-items-center">
                                        <label
                                            htmlFor="department"
                                            className="me-2 mb-0"
                                            style={{ minWidth: "160px" }}
                                        >
                                            Department
                                        </label>
                                        <select
                                            id="department"
                                            value={form.department}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setForm({ ...form, department: value });
                                                validateField("department", value);
                                            }}
                                            onBlur={(e) => validateField("department", e.target.value)}
                                            className={`form-control ${errors.department ? "is-invalid" : ""}`}
                                        >
                                            <option value="">Select Department</option>
                                            <option value="Accounts">Accounts</option>
                                            <option value="Administrator">Administrator</option>
                                            <option value="Human Resource">Human Resource</option>
                                            <option value="Dealing">Dealing</option>
                                            <option value="Digital Marketing">Digital Marketing</option>
                                            <option value="IT">IT</option>
                                            <option value="Sales">Sales</option>
                                            <option value="Admin">Admin</option>
                                            <option value="Management">Management</option>
                                            <option value="Operation">Operation</option>
                                        </select>
                                        {errors.department && <p className="text-danger mb-0 ms-2" style={{ fontSize: '13px' }}>Required!</p>}
                                    </div>

                                    {/* Designation */}
                                    <div className="col-12 col-md-6 mb-3 d-flex align-items-center">
                                        <label
                                            htmlFor="employee"
                                            className="me-2 mb-0"
                                            style={{ minWidth: "160px" }}
                                        >
                                            Designation
                                        </label>
                                        <select
                                            id="designation"
                                            value={form.designation}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setForm({ ...form, designation: value });
                                                validateField("designation", value);
                                            }}
                                            onBlur={(e) => validateField("designation", e.target.value)}
                                            className={`form-control ${errors.designation ? "is-invalid" : ""}`}
                                        >
                                            <option value="">Select Designation</option>
                                            <option value="Manager">Manager</option>
                                            <option value="Senior Executive">Senior Executive</option>
                                            <option value="Executive">Executive</option>
                                            <option value="Assistant">Assistant</option>
                                        </select>
                                        {errors.designation && <p className="text-danger mb-0 ms-2" style={{ fontSize: '13px' }}>Required!</p>}
                                    </div>

                                    {/* Month */}
                                    <div className="col-12 col-md-6 mb-3 d-flex align-items-center">
                                        <label
                                            htmlFor="month"
                                            className="me-2 mb-0"
                                            style={{ minWidth: "160px" }}
                                        >
                                            Select Month
                                        </label>
                                        <input type="date" value={form.appraisalDate}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setForm({ ...form, appraisalDate: value });
                                                validateField("appraisalDate", value);
                                            }}
                                            className={`form-control ${errors.appraisalDate ? "is-invalid" : ""}`}
                                            placeholder="appraisalDate"
                                            onBlur={(e) => validateField("appraisalDate", e.target.value)}

                                        />
                                        {errors.appraisalDate && (
                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Required!</p>
                                        )}
                                    </div>
                                </div>

                                {/* left colm */}
                                <div className="col-md-6">
                                    <div className="card-header col-md-12 d-flex justify-content-between align-items-center text-white new-emp-bg">
                                        <span>Technical Competencies</span>
                                    </div>

                                    <div className="d-flex mt-3 fw-bold border-bottom pb-2 mx-4">
                                        <div style={{ width: "160px" }}>Indicator</div>
                                        <div style={{ width: "200px" }}>Expected Value</div>
                                        <div style={{ width: "250px" }}>Set Value</div>
                                    </div>

                                    <div className="mb-3 d-flex align-items-center mt-3">
                                        {/* Label */}
                                        <label
                                            htmlFor="customerExperience"
                                            className="me-2 mb-0 ms-4"
                                            style={{ width: "160px" }}
                                        >
                                            Customer Experience
                                        </label>

                                        {/* Span */}
                                        <span style={{ width: "200px" }}>Expert/Leader</span>

                                        {/* Input + Error stacked */}
                                        <div className="d-flex flex-column" style={{ width: "250px" }}>
                                            <select
                                                id="customerExperience"
                                                value={form.customerExperience}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, customerExperience: value });
                                                    validateField("customerExperience", value);
                                                }}
                                                className={`form-control ${errors.customerExperience ? "is-invalid" : ""}`}
                                                onBlur={(e) => validateField("customerExperience", e.target.value)}
                                            >
                                                <option value="">None</option>
                                                <option value="beginner">Beginner</option>
                                                <option value="intermediate">Intermediate</option>
                                                <option value="advanced">Advanced</option>
                                                <option value="expert">Expert/Leader</option>
                                            </select>

                                            {/* Error below input */}
                                            {errors.customerExperience && (
                                                <p className="text-danger mb-0 mt-1" style={{ fontSize: "13px" }}>
                                                    Required!
                                                </p>
                                            )}
                                        </div>
                                    </div>


                                    {/* Row: Marketing */}
                                    <div className="mb-3 d-flex align-items-center mt-3">
                                        <label
                                            htmlFor="marketing"
                                            className="me-2 mb-0 ms-4"
                                            style={{ width: "160px" }}
                                        >
                                            Marketing
                                        </label>
                                        <span style={{ width: "200px" }}>Expert/Leader</span>

                                        <div className="d-flex flex-column" style={{ width: "250px" }}>
                                            <select
                                                id="marketing"
                                                value={form.marketing}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, marketing: value });
                                                    validateField("marketing", value);
                                                }}
                                                className={`form-control ${errors.marketing ? "is-invalid" : ""}`}
                                                onBlur={(e) => validateField("marketing", e.target.value)}
                                            >
                                                <option value="">None</option>
                                                <option value="beginner">Beginner</option>
                                                <option value="intermediate">Intermediate</option>
                                                <option value="advanced">Advanced</option>
                                                <option value="expert">Expert/Leader</option>
                                            </select>

                                            {/* Error below input */}
                                            {errors.customerExperience && (
                                                <p className="text-danger mb-0 mt-1" style={{ fontSize: "13px" }}>
                                                    Required!
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Row: Management */}
                                    <div className="mb-3 d-flex align-items-center mt-3">
                                        <label
                                            htmlFor="management"
                                            className="me-2 mb-0 ms-4"
                                            style={{ width: "160px" }}
                                        >
                                            Management
                                        </label>
                                        <span style={{ width: "200px" }}>Expert/Leader</span>
                                        <div className="d-flex flex-column" style={{ width: "250px" }}>
                                            <select
                                                id="management"
                                                value={form.management}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, management: value });
                                                    validateField("management", value);
                                                }}
                                                className={`form-control ${errors.management ? "is-invalid" : ""}`}
                                                onBlur={(e) => validateField("management", e.target.value)}
                                            >
                                                <option value="">None</option>
                                                <option value="beginner">Beginner</option>
                                                <option value="intermediate">Intermediate</option>
                                                <option value="advanced">Advanced</option>
                                                <option value="expert">Expert/Leader</option>
                                            </select>

                                            {/* Error below input */}
                                            {errors.management && (
                                                <p className="text-danger mb-0 mt-1" style={{ fontSize: "13px" }}>
                                                    Required!
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mb-3 d-flex align-items-center mt-3">
                                        <label
                                            htmlFor="administration"
                                            className="me-2 mb-0 ms-4"
                                            style={{ width: "160px" }}
                                        >
                                            Administration
                                        </label>
                                        <span style={{ width: "200px" }}>Expert/Leader</span>
                                        <div className="d-flex flex-column" style={{ width: "250px" }}>
                                            <select
                                                id="administration"
                                                value={form.administration}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, administration: value });
                                                    validateField("administration", value);
                                                }}
                                                className={`form-control ${errors.administration ? "is-invalid" : ""}`}
                                                onBlur={(e) => validateField("administration", e.target.value)}
                                            >
                                                <option value="">None</option>
                                                <option value="beginner">Beginner</option>
                                                <option value="intermediate">Intermediate</option>
                                                <option value="advanced">Advanced</option>
                                                <option value="expert">Expert/Leader</option>
                                            </select>

                                            {/* Error below input */}
                                            {errors.administration && (
                                                <p className="text-danger mb-0 mt-1" style={{ fontSize: "13px" }}>
                                                    Required!
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mb-3 d-flex align-items-center mt-3">
                                        <label
                                            htmlFor="presentationSkill"
                                            className="me-2 mb-0 ms-4"
                                            style={{ width: "160px" }}
                                        >
                                            Presentation Skill
                                        </label>
                                        <span style={{ width: "200px" }}>Expert/Leader</span>
                                        <div className="d-flex flex-column" style={{ width: "250px" }}>
                                            <select
                                                id="presentationSkill"
                                                value={form.presentationSkill}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, presentationSkill: value });
                                                    validateField("presentationSkill", value);
                                                }}
                                                className={`form-control ${errors.presentationSkill ? "is-invalid" : ""}`}
                                                onBlur={(e) => validateField("presentationSkill", e.target.value)}
                                            >
                                                <option value="">None</option>
                                                <option value="beginner">Beginner</option>
                                                <option value="intermediate">Intermediate</option>
                                                <option value="advanced">Advanced</option>
                                                <option value="expert">Expert/Leader</option>
                                            </select>

                                            {/* Error below input */}
                                            {errors.presentationSkill && (
                                                <p className="text-danger mb-0 mt-1" style={{ fontSize: "13px" }}>
                                                    Required!
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mb-3 d-flex align-items-center mt-3">
                                        <label
                                            htmlFor="qualityOfWork"
                                            className="me-2 mb-0 ms-4"
                                            style={{ width: "160px" }}
                                        >
                                            Quality Of Work
                                        </label>
                                        <span style={{ width: "200px" }}>Expert/Leader</span>
                                        <div className="d-flex flex-column" style={{ width: "250px" }}>
                                            <select
                                                id="qualityOfWork"
                                                value={form.qualityOfWork}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, qualityOfWork: value });
                                                    validateField("qualityOfWork", value);
                                                }}
                                                className={`form-control ${errors.qualityOfWork ? "is-invalid" : ""}`}
                                                onBlur={(e) => validateField("qualityOfWork", e.target.value)}
                                            >
                                                <option value="">None</option>
                                                <option value="beginner">Beginner</option>
                                                <option value="intermediate">Intermediate</option>
                                                <option value="advanced">Advanced</option>
                                                <option value="expert">Expert/Leader</option>
                                            </select>

                                            {/* Error below input */}
                                            {errors.qualityOfWork && (
                                                <p className="text-danger mb-0 mt-1" style={{ fontSize: "13px" }}>
                                                    Required!
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mb-3 d-flex align-items-center mt-3">
                                        <label
                                            htmlFor="efficiency"
                                            className="me-2 mb-0 ms-4"
                                            style={{ width: "160px" }}
                                        >
                                            Efficiency
                                        </label>
                                        <span style={{ width: "200px" }}>Expert/Leader</span>
                                        <div className="d-flex flex-column" style={{ width: "250px" }}>
                                            <select
                                                id="efficiency"
                                                value={form.efficiency}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, efficiency: value });
                                                    validateField("efficiency", value);
                                                }}
                                                className={`form-control ${errors.efficiency ? "is-invalid" : ""}`}
                                                onBlur={(e) => validateField("efficiency", e.target.value)}
                                            >
                                                <option value="">None</option>
                                                <option value="beginner">Beginner</option>
                                                <option value="intermediate">Intermediate</option>
                                                <option value="advanced">Advanced</option>
                                                <option value="expert">Expert/Leader</option>
                                            </select>

                                            {/* Error below input */}
                                            {errors.efficiency && (
                                                <p className="text-danger mb-0 mt-1" style={{ fontSize: "13px" }}>
                                                    Required!
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <label className="ms-4">Description</label>
                                    <div className="ms-4">
                                        <CKEditor
                                            editor={ClassicEditor}
                                            data={form.description || ""}
                                            onChange={(event, editor) => {
                                                const newData = editor.getData();
                                                setForm({ ...form, description: newData });
                                            }}
                                            onBlur={() => validateField("description", form.description)}
                                        />
                                    </div>
                                    {errors.description && (
                                        <p className="text-danger mb-0 ms-4" style={{ fontSize: "13px" }}>
                                            Description is Required!
                                        </p>
                                    )}


                                </div>

                                {/* Right Column */}
                                <div className="col-md-6">
                                    <div className="card-header col-md-12 d-flex justify-content-between align-items-center text-white new-emp-bg">
                                        <span>Organizational Competencies</span>
                                    </div>

                                    <div className="d-flex mt-3 fw-bold border-bottom pb-2 mx-4">
                                        <div style={{ width: "160px" }}>Indicator</div>
                                        <div style={{ width: "200px" }}>Expected Value</div>
                                        <div style={{ width: "250px" }}>Set Value</div>
                                    </div>


                                    <div className="mb-3 d-flex align-items-center mt-3">
                                        <label
                                            htmlFor="integrity"
                                            className="me-2 mb-0 ms-4"
                                            style={{ width: "160px" }}
                                        >
                                            Integrity
                                        </label>
                                        <span style={{ width: "200px" }}>Expert/Leader</span>
                                        <div className="d-flex flex-column" style={{ width: "250px" }}>
                                            <select
                                                id="integrity"
                                                value={form.integrity}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, integrity: value });
                                                    validateField("integrity", value);
                                                }}
                                                className={`form-control ${errors.integrity ? "is-invalid" : ""}`}
                                                onBlur={(e) => validateField("integrity", e.target.value)}
                                            >
                                                <option value="">None</option>
                                                <option value="beginner">Beginner</option>
                                                <option value="intermediate">Intermediate</option>
                                                <option value="advanced">Advanced</option>
                                                <option value="expert">Expert/Leader</option>
                                            </select>

                                            {/* Error below input */}
                                            {errors.integrity && (
                                                <p className="text-danger mb-0 mt-1" style={{ fontSize: "13px" }}>
                                                    Required!
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mb-3 d-flex align-items-center mt-3">
                                        <label
                                            htmlFor="professionalism"
                                            className="me-2 mb-0 ms-4"
                                            style={{ width: "160px" }}
                                        >
                                            Professionalism
                                        </label>
                                        <span style={{ width: "200px" }}>Expert/Leader</span>
                                        <div className="d-flex flex-column" style={{ width: "250px" }}>
                                            <select
                                                id="professionalism"
                                                value={form.professionalism}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, professionalism: value });
                                                    validateField("professionalism", value);
                                                }}
                                                className={`form-control ${errors.professionalism ? "is-invalid" : ""}`}
                                                onBlur={(e) => validateField("professionalism", e.target.value)}
                                            >
                                                <option value="">None</option>
                                                <option value="beginner">Beginner</option>
                                                <option value="intermediate">Intermediate</option>
                                                <option value="advanced">Advanced</option>
                                                <option value="expert">Expert/Leader</option>
                                            </select>

                                            {/* Error below input */}
                                            {errors.professionalism && (
                                                <p className="text-danger mb-0 mt-1" style={{ fontSize: "13px" }}>
                                                    Required!
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mb-3 d-flex align-items-center mt-3">
                                        <label
                                            htmlFor="teamWork"
                                            className="me-2 mb-0 ms-4"
                                            style={{ width: "160px" }}
                                        >
                                            Team Work
                                        </label>
                                        <span style={{ width: "200px" }}>Expert/Leader</span>
                                        <div className="d-flex flex-column" style={{ width: "250px" }}>
                                            <select
                                                id="teamWork"
                                                value={form.teamWork}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, teamWork: value });
                                                    validateField("teamWork", value);
                                                }}
                                                className={`form-control ${errors.teamWork ? "is-invalid" : ""}`}
                                                onBlur={(e) => validateField("teamWork", e.target.value)}
                                            >
                                                <option value="">None</option>
                                                <option value="beginner">Beginner</option>
                                                <option value="intermediate">Intermediate</option>
                                                <option value="advanced">Advanced</option>
                                                <option value="expert">Expert/Leader</option>
                                            </select>

                                            {/* Error below input */}
                                            {errors.teamWork && (
                                                <p className="text-danger mb-0 mt-1" style={{ fontSize: "13px" }}>
                                                    Required!
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mb-3 d-flex align-items-center mt-3">
                                        <label
                                            htmlFor="criticalThinking"
                                            className="me-2 mb-0 ms-4"
                                            style={{ width: "160px" }}
                                        >
                                            Critical Thinking
                                        </label>
                                        <span style={{ width: "200px" }}>Expert/Leader</span>
                                        <div className="d-flex flex-column" style={{ width: "250px" }}>
                                            <select
                                                id="criticalThinking"
                                                value={form.criticalThinking}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, criticalThinking: value });
                                                    validateField("criticalThinking", value);
                                                }}
                                                className={`form-control ${errors.criticalThinking ? "is-invalid" : ""}`}
                                                onBlur={(e) => validateField("criticalThinking", e.target.value)}
                                            >
                                                <option value="">None</option>
                                                <option value="beginner">Beginner</option>
                                                <option value="intermediate">Intermediate</option>
                                                <option value="advanced">Advanced</option>
                                                <option value="expert">Expert/Leader</option>
                                            </select>

                                            {/* Error below input */}
                                            {errors.criticalThinking && (
                                                <p className="text-danger mb-0 mt-1" style={{ fontSize: "13px" }}>
                                                    Required!
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mb-3 d-flex align-items-center mt-3">
                                        <label
                                            htmlFor="conflictManagement"
                                            className="me-2 mb-0 ms-4"
                                            style={{ width: "160px" }}
                                        >
                                            Conflict Management
                                        </label>
                                        <span style={{ width: "200px" }}>Expert/Leader</span>
                                        <div className="d-flex flex-column" style={{ width: "250px" }}>
                                            <select
                                                id="conflictManagement"
                                                value={form.conflictManagement}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, conflictManagement: value });
                                                    validateField("conflictManagement", value);
                                                }}
                                                className={`form-control ${errors.conflictManagement ? "is-invalid" : ""}`}
                                                onBlur={(e) => validateField("conflictManagement", e.target.value)}
                                            >
                                                <option value="">None</option>
                                                <option value="beginner">Beginner</option>
                                                <option value="intermediate">Intermediate</option>
                                                <option value="advanced">Advanced</option>
                                                <option value="expert">Expert/Leader</option>
                                            </select>

                                            {/* Error below input */}
                                            {errors.conflictManagement && (
                                                <p className="text-danger mb-0 mt-1" style={{ fontSize: "13px" }}>
                                                    Required!
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mb-3 d-flex align-items-center mt-3">
                                        <label
                                            htmlFor="attendance"
                                            className="me-2 mb-0 ms-4"
                                            style={{ width: "160px" }}
                                        >
                                            Attendance
                                        </label>
                                        <span style={{ width: "200px" }}>Expert/Leader</span>
                                        <div className="d-flex flex-column" style={{ width: "250px" }}>
                                            <select
                                                id="attendance"
                                                value={form.attendance}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, attendance: value });
                                                    validateField("attendance", value);
                                                }}
                                                className={`form-control ${errors.attendance ? "is-invalid" : ""}`}
                                                onBlur={(e) => validateField("attendance", e.target.value)}
                                            >
                                                <option value="">None</option>
                                                <option value="beginner">Beginner</option>
                                                <option value="intermediate">Intermediate</option>
                                                <option value="advanced">Advanced</option>
                                                <option value="expert">Expert/Leader</option>
                                            </select>

                                            {/* Error below input */}
                                            {errors.attendance && (
                                                <p className="text-danger mb-0 mt-1" style={{ fontSize: "13px" }}>
                                                    Required!
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mb-3 d-flex align-items-center mt-3">
                                        <label
                                            htmlFor="abilityToMeetDeadline"
                                            className="me-2 mb-0 ms-4"
                                            style={{ width: "160px" }}
                                        >
                                            Ability To Meet Deadline
                                        </label>
                                        <span style={{ width: "200px" }}>Expert/Leader</span>
                                        <div className="d-flex flex-column" style={{ width: "250px" }}>
                                            <select
                                                id="abilityToMeetDeadline"
                                                value={form.abilityToMeetDeadline}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, abilityToMeetDeadline: value });
                                                    validateField("abilityToMeetDeadline", value);
                                                }}
                                                className={`form-control ${errors.abilityToMeetDeadline ? "is-invalid" : ""}`}
                                                onBlur={(e) => validateField("abilityToMeetDeadline", e.target.value)}
                                            >
                                                <option value="">None</option>
                                                <option value="beginner">Beginner</option>
                                                <option value="intermediate">Intermediate</option>
                                                <option value="advanced">Advanced</option>
                                                <option value="expert">Expert/Leader</option>
                                            </select>

                                            {/* Error below input */}
                                            {errors.abilityToMeetDeadline && (
                                                <p className="text-danger mb-0 mt-1" style={{ fontSize: "13px" }}>
                                                    Required!
                                                </p>
                                            )}
                                        </div>
                                    </div>



                                </div>


                            </div>

                            <div className="text-start mb-2 mt-3">
                                <button type="submit" className="btn btn-sm add-btn">Save</button>
                            </div>
                        </form>

                    </div>

                </div>
            )}



            <div className="card no-radius">
                <div className="card-header d-flex justify-content-between align-items-center text-white new-emp-bg">
                    <span>List All Performance Appraisals</span>
                    <button className="btn btn-sm add-btn" onClick={toggleAddForm}>{showAddForm ? '- Hide' : '+ Add New'}</button>
                </div>


                <div className="px-3 mt-4">
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

                {showModal && selectedRow && (
                    <div className="modal show fade d-block" tabIndex="-1" role="dialog">
                        <div className="modal-dialog modal-dialog-centered modal-xl" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">View Performance Appraisal</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setShowModal(false)}
                                    ></button>
                                </div>


                                <div className="modal-body">
                                    <div className="row">
                                        <div className="container-fluid">
                                            {/* Employee and Month Info */}
                                            <div className="row mb-4">
                                                <div className="col-md-6">
                                                    <strong>Employee:</strong> {selectedRow.employee}
                                                </div>
                                                <div className="col-md-6">
                                                    <strong>Month:</strong> {selectedRow.appraisalDate}
                                                </div>
                                                <div className="col-md-6">
                                                    <strong>Department:</strong> {selectedRow.department}
                                                </div>
                                                <div className="col-md-6">
                                                    <strong>Designation:</strong> {selectedRow.designation}
                                                </div>
                                            </div>

                                            {/* Two Tables Side-by-Side */}
                                            <div className="row">
                                                {/* Technical Competencies */}
                                                <div className="col-md-6">
                                                    <h5 className="mb-2">Technical Competencies</h5>
                                                    <table className="table table-bordered table-striped">
                                                        <thead className="table-light">
                                                            <tr>
                                                                <th>Indicator</th>
                                                                <th>Expected</th>
                                                                <th>Set</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {[
                                                                { label: "Customer Experience", key: "customerExperience" },
                                                                { label: "Marketing", key: "marketing" },
                                                                { label: "Management", key: "management" },
                                                                { label: "Administration", key: "administration" },
                                                                { label: "Presentation Skill", key: "presentationSkill" },
                                                                { label: "Quality Of Work", key: "qualityOfWork" },
                                                                { label: "Efficiency", key: "efficiency" },
                                                            ].map((item, idx) => (
                                                                <tr key={idx}>
                                                                    <td>{item.label}</td>
                                                                    <td>Expert/Leader</td>
                                                                    <td>{selectedRow[item.key]}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>

                                                {/* Organizational Competencies */}
                                                <div className="col-md-6">
                                                    <h5 className="mb-2">Organizational Competencies</h5>
                                                    <table className="table table-bordered table-striped">
                                                        <thead className="table-light">
                                                            <tr>
                                                                <th>Indicator</th>
                                                                <th>Expected</th>
                                                                <th>Set</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {[
                                                                { label: "Integrity", key: "integrity" },
                                                                { label: "Professionalism", key: "professionalism" },
                                                                { label: "Team Work", key: "teamWork" },
                                                                { label: "Critical Thinking", key: "criticalThinking" },
                                                                { label: "Conflict Management", key: "conflictManagement" },
                                                                { label: "Attendance", key: "attendance" },
                                                                { label: "Ability To Meet Deadline", key: "abilityToMeetDeadline" },
                                                            ].map((item, idx) => (
                                                                <tr key={idx}>
                                                                    <td>{item.label}</td>
                                                                    <td>Expert/Leader</td>
                                                                    <td>{selectedRow[item.key]}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>

                                                </div>
                                                <p><strong>Description:</strong>  {(selectedRow?.description || '').replace(/<[^>]+>/g, '')}</p>

                                            </div>
                                        </div>


                                    </div>
                                </div>



                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setShowModal(false)}>
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {showEditModal && selectedRow && (
                    <>

                        <div className="custom-backdrop"></div>
                        <div className="modal show fade d-block" tabIndex="-1">
                            <div className="modal-dialog modal-dialog-centered edit-modal">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Edit Performance Appraisal</h5>
                                        <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                                    </div>
                                    <div className="modal-body">
                                        <form onSubmit={handleSubmit}>
                                            <div className="row">
                                                <div className="row">
                                                    {/* Employee */}
                                                    <div className="col-12 col-md-6 mb-3 d-flex align-items-center">
                                                        <label
                                                            htmlFor="employee"
                                                            className="me-2 mb-0"
                                                            style={{ minWidth: "160px" }}
                                                        >
                                                            Employee
                                                        </label>
                                                        <select
                                                            id="employee"
                                                            value={form.employee}
                                                            onChange={(e) => {
                                                                const { value } = e.target;
                                                                setForm({ ...form, employee: value });
                                                                validateField("employee", value);
                                                            }}
                                                            onBlur={(e) => validateField("employee", e.target.value)}
                                                            className={`form-control ${errors.employee ? "is-invalid" : ""}`}
                                                        >
                                                            <option value="">Choose an Employee..</option>
                                                            <option value="Admin Admin">Admin Admin</option>
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
                                                        {errors.employee && (
                                                            <p className="text-danger mb-0 mt-1" style={{ fontSize: "13px" }}>
                                                                Required!
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Department */}
                                                    <div className="col-12 col-md-6 mb-3 d-flex align-items-center">
                                                        <label
                                                            htmlFor="department"
                                                            className="me-2 mb-0"
                                                            style={{ minWidth: "160px" }}
                                                        >
                                                            Department
                                                        </label>
                                                        <select
                                                            id="department"
                                                            value={form.department}
                                                            onChange={(e) => {
                                                                const { value } = e.target;
                                                                setForm({ ...form, department: value });
                                                                validateField("department", value);
                                                            }}
                                                            onBlur={(e) => validateField("department", e.target.value)}
                                                            className={`form-control ${errors.department ? "is-invalid" : ""}`}
                                                        >
                                                            <option value="">Select Department</option>
                                                            <option value="Accounts">Accounts</option>
                                                            <option value="Administrator">Administrator</option>
                                                            <option value="Human Resource">Human Resource</option>
                                                            <option value="Dealing">Dealing</option>
                                                            <option value="Digital Marketing">Digital Marketing</option>
                                                            <option value="IT">IT</option>
                                                            <option value="Sales">Sales</option>
                                                            <option value="Admin">Admin</option>
                                                            <option value="Management">Management</option>
                                                            <option value="Operation">Operation</option>
                                                        </select>
                                                        {errors.department && <p className="text-danger mb-0 ms-2" style={{ fontSize: '13px' }}>Required!</p>}
                                                    </div>

                                                    {/* Designation */}
                                                    <div className="col-12 col-md-6 mb-3 d-flex align-items-center">
                                                        <label
                                                            htmlFor="employee"
                                                            className="me-2 mb-0"
                                                            style={{ minWidth: "160px" }}
                                                        >
                                                            Designation
                                                        </label>
                                                        <select
                                                            id="designation"
                                                            value={form.designation}
                                                            onChange={(e) => {
                                                                const { value } = e.target;
                                                                setForm({ ...form, designation: value });
                                                                validateField("designation", value);
                                                            }}
                                                            onBlur={(e) => validateField("designation", e.target.value)}
                                                            className={`form-control ${errors.designation ? "is-invalid" : ""}`}
                                                        >
                                                            <option value="">Select Designation</option>
                                                            <option value="Manager">Manager</option>
                                                            <option value="Senior Executive">Senior Executive</option>
                                                            <option value="Executive">Executive</option>
                                                            <option value="Assistant">Assistant</option>
                                                        </select>
                                                        {errors.designation && <p className="text-danger mb-0 ms-2" style={{ fontSize: '13px' }}>Required!</p>}
                                                    </div>

                                                    {/* Month */}
                                                    <div className="col-12 col-md-6 mb-3 d-flex align-items-center">
                                                        <label
                                                            htmlFor="month"
                                                            className="me-2 mb-0"
                                                            style={{ minWidth: "160px" }}
                                                        >
                                                            Select Month
                                                        </label>
                                                        <input type="date" value={form.appraisalDate}
                                                            onChange={(e) => {
                                                                const { value } = e.target;
                                                                setForm({ ...form, appraisalDate: value });
                                                                validateField("appraisalDate", value);
                                                            }}
                                                            className={`form-control ${errors.appraisalDate ? "is-invalid" : ""}`}
                                                            placeholder="appraisalDate"
                                                            onBlur={(e) => validateField("appraisalDate", e.target.value)}

                                                        />
                                                        {errors.appraisalDate && (
                                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Required!</p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* left colm */}
                                                <div className="col-md-6">
                                                    <div className="card-header col-md-12 d-flex justify-content-between align-items-center text-white new-emp-bg">
                                                        <span>Technical Competencies</span>
                                                    </div>

                                                    <div className="d-flex mt-3 fw-bold border-bottom pb-2 mx-4">
                                                        <div style={{ width: "160px" }}>Indicator</div>
                                                        <div style={{ width: "200px" }}>Expected Value</div>
                                                        <div style={{ width: "250px" }}>Set Value</div>
                                                    </div>

                                                    <div className="mb-3 d-flex align-items-center mt-3">
                                                        {/* Label */}
                                                        <label
                                                            htmlFor="customerExperience"
                                                            className="me-2 mb-0 ms-4"
                                                            style={{ width: "160px" }}
                                                        >
                                                            Customer Experience
                                                        </label>

                                                        {/* Span */}
                                                        <span style={{ width: "200px" }}>Expert/Leader</span>

                                                        {/* Input + Error stacked */}
                                                        <div className="d-flex flex-column" style={{ width: "250px" }}>
                                                            <select
                                                                id="customerExperience"
                                                                value={form.customerExperience}
                                                                onChange={(e) => {
                                                                    const { value } = e.target;
                                                                    setForm({ ...form, customerExperience: value });
                                                                    validateField("customerExperience", value);
                                                                }}
                                                                className={`form-control ${errors.customerExperience ? "is-invalid" : ""}`}
                                                                onBlur={(e) => validateField("customerExperience", e.target.value)}
                                                            >
                                                                <option value="">None</option>
                                                                <option value="beginner">Beginner</option>
                                                                <option value="intermediate">Intermediate</option>
                                                                <option value="advanced">Advanced</option>
                                                                <option value="expert">Expert/Leader</option>
                                                            </select>

                                                            {/* Error below input */}
                                                            {errors.customerExperience && (
                                                                <p className="text-danger mb-0 mt-1" style={{ fontSize: "13px" }}>
                                                                    Required!
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>


                                                    {/* Row: Marketing */}
                                                    <div className="mb-3 d-flex align-items-center mt-3">
                                                        <label
                                                            htmlFor="marketing"
                                                            className="me-2 mb-0 ms-4"
                                                            style={{ width: "160px" }}
                                                        >
                                                            Marketing
                                                        </label>
                                                        <span style={{ width: "200px" }}>Expert/Leader</span>

                                                        <div className="d-flex flex-column" style={{ width: "250px" }}>
                                                            <select
                                                                id="marketing"
                                                                value={form.marketing}
                                                                onChange={(e) => {
                                                                    const { value } = e.target;
                                                                    setForm({ ...form, marketing: value });
                                                                    validateField("marketing", value);
                                                                }}
                                                                className={`form-control ${errors.marketing ? "is-invalid" : ""}`}
                                                                onBlur={(e) => validateField("marketing", e.target.value)}
                                                            >
                                                                <option value="">None</option>
                                                                <option value="beginner">Beginner</option>
                                                                <option value="intermediate">Intermediate</option>
                                                                <option value="advanced">Advanced</option>
                                                                <option value="expert">Expert/Leader</option>
                                                            </select>

                                                            {/* Error below input */}
                                                            {errors.customerExperience && (
                                                                <p className="text-danger mb-0 mt-1" style={{ fontSize: "13px" }}>
                                                                    Required!
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Row: Management */}
                                                    <div className="mb-3 d-flex align-items-center mt-3">
                                                        <label
                                                            htmlFor="management"
                                                            className="me-2 mb-0 ms-4"
                                                            style={{ width: "160px" }}
                                                        >
                                                            Management
                                                        </label>
                                                        <span style={{ width: "200px" }}>Expert/Leader</span>
                                                        <div className="d-flex flex-column" style={{ width: "250px" }}>
                                                            <select
                                                                id="management"
                                                                value={form.management}
                                                                onChange={(e) => {
                                                                    const { value } = e.target;
                                                                    setForm({ ...form, management: value });
                                                                    validateField("management", value);
                                                                }}
                                                                className={`form-control ${errors.management ? "is-invalid" : ""}`}
                                                                onBlur={(e) => validateField("management", e.target.value)}
                                                            >
                                                                <option value="">None</option>
                                                                <option value="beginner">Beginner</option>
                                                                <option value="intermediate">Intermediate</option>
                                                                <option value="advanced">Advanced</option>
                                                                <option value="expert">Expert/Leader</option>
                                                            </select>

                                                            {/* Error below input */}
                                                            {errors.management && (
                                                                <p className="text-danger mb-0 mt-1" style={{ fontSize: "13px" }}>
                                                                    Required!
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="mb-3 d-flex align-items-center mt-3">
                                                        <label
                                                            htmlFor="administration"
                                                            className="me-2 mb-0 ms-4"
                                                            style={{ width: "160px" }}
                                                        >
                                                            Administration
                                                        </label>
                                                        <span style={{ width: "200px" }}>Expert/Leader</span>
                                                        <div className="d-flex flex-column" style={{ width: "250px" }}>
                                                            <select
                                                                id="administration"
                                                                value={form.administration}
                                                                onChange={(e) => {
                                                                    const { value } = e.target;
                                                                    setForm({ ...form, administration: value });
                                                                    validateField("administration", value);
                                                                }}
                                                                className={`form-control ${errors.administration ? "is-invalid" : ""}`}
                                                                onBlur={(e) => validateField("administration", e.target.value)}
                                                            >
                                                                <option value="">None</option>
                                                                <option value="beginner">Beginner</option>
                                                                <option value="intermediate">Intermediate</option>
                                                                <option value="advanced">Advanced</option>
                                                                <option value="expert">Expert/Leader</option>
                                                            </select>

                                                            {/* Error below input */}
                                                            {errors.administration && (
                                                                <p className="text-danger mb-0 mt-1" style={{ fontSize: "13px" }}>
                                                                    Required!
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="mb-3 d-flex align-items-center mt-3">
                                                        <label
                                                            htmlFor="presentationSkill"
                                                            className="me-2 mb-0 ms-4"
                                                            style={{ width: "160px" }}
                                                        >
                                                            Presentation Skill
                                                        </label>
                                                        <span style={{ width: "200px" }}>Expert/Leader</span>
                                                        <div className="d-flex flex-column" style={{ width: "250px" }}>
                                                            <select
                                                                id="presentationSkill"
                                                                value={form.presentationSkill}
                                                                onChange={(e) => {
                                                                    const { value } = e.target;
                                                                    setForm({ ...form, presentationSkill: value });
                                                                    validateField("presentationSkill", value);
                                                                }}
                                                                className={`form-control ${errors.presentationSkill ? "is-invalid" : ""}`}
                                                                onBlur={(e) => validateField("presentationSkill", e.target.value)}
                                                            >
                                                                <option value="">None</option>
                                                                <option value="beginner">Beginner</option>
                                                                <option value="intermediate">Intermediate</option>
                                                                <option value="advanced">Advanced</option>
                                                                <option value="expert">Expert/Leader</option>
                                                            </select>

                                                            {/* Error below input */}
                                                            {errors.presentationSkill && (
                                                                <p className="text-danger mb-0 mt-1" style={{ fontSize: "13px" }}>
                                                                    Required!
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="mb-3 d-flex align-items-center mt-3">
                                                        <label
                                                            htmlFor="qualityOfWork"
                                                            className="me-2 mb-0 ms-4"
                                                            style={{ width: "160px" }}
                                                        >
                                                            Quality Of Work
                                                        </label>
                                                        <span style={{ width: "200px" }}>Expert/Leader</span>
                                                        <div className="d-flex flex-column" style={{ width: "250px" }}>
                                                            <select
                                                                id="qualityOfWork"
                                                                value={form.qualityOfWork}
                                                                onChange={(e) => {
                                                                    const { value } = e.target;
                                                                    setForm({ ...form, qualityOfWork: value });
                                                                    validateField("qualityOfWork", value);
                                                                }}
                                                                className={`form-control ${errors.qualityOfWork ? "is-invalid" : ""}`}
                                                                onBlur={(e) => validateField("qualityOfWork", e.target.value)}
                                                            >
                                                                <option value="">None</option>
                                                                <option value="beginner">Beginner</option>
                                                                <option value="intermediate">Intermediate</option>
                                                                <option value="advanced">Advanced</option>
                                                                <option value="expert">Expert/Leader</option>
                                                            </select>

                                                            {/* Error below input */}
                                                            {errors.qualityOfWork && (
                                                                <p className="text-danger mb-0 mt-1" style={{ fontSize: "13px" }}>
                                                                    Required!
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="mb-3 d-flex align-items-center mt-3">
                                                        <label
                                                            htmlFor="efficiency"
                                                            className="me-2 mb-0 ms-4"
                                                            style={{ width: "160px" }}
                                                        >
                                                            Efficiency
                                                        </label>
                                                        <span style={{ width: "200px" }}>Expert/Leader</span>
                                                        <div className="d-flex flex-column" style={{ width: "250px" }}>
                                                            <select
                                                                id="efficiency"
                                                                value={form.efficiency}
                                                                onChange={(e) => {
                                                                    const { value } = e.target;
                                                                    setForm({ ...form, efficiency: value });
                                                                    validateField("efficiency", value);
                                                                }}
                                                                className={`form-control ${errors.efficiency ? "is-invalid" : ""}`}
                                                                onBlur={(e) => validateField("efficiency", e.target.value)}
                                                            >
                                                                <option value="">None</option>
                                                                <option value="beginner">Beginner</option>
                                                                <option value="intermediate">Intermediate</option>
                                                                <option value="advanced">Advanced</option>
                                                                <option value="expert">Expert/Leader</option>
                                                            </select>

                                                            {/* Error below input */}
                                                            {errors.efficiency && (
                                                                <p className="text-danger mb-0 mt-1" style={{ fontSize: "13px" }}>
                                                                    Required!
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <label className="ms-4">Description</label>
                                                    <div className="ms-4">
                                                        <CKEditor
                                                            editor={ClassicEditor}
                                                            data={form.description || ""}
                                                            onChange={(event, editor) => {
                                                                const newData = editor.getData();
                                                                setForm({ ...form, description: newData });
                                                            }}
                                                            onBlur={() => validateField("description", form.description)}
                                                        />
                                                    </div>
                                                    {errors.description && (
                                                        <p className="text-danger mb-0 ms-4" style={{ fontSize: "13px" }}>
                                                            Description is Required!
                                                        </p>
                                                    )}


                                                </div>

                                                {/* Right Column */}
                                                <div className="col-md-6">
                                                    <div className="card-header col-md-12 d-flex justify-content-between align-items-center text-white new-emp-bg">
                                                        <span>Organizational Competencies</span>
                                                    </div>

                                                    <div className="d-flex mt-3 fw-bold border-bottom pb-2 mx-4">
                                                        <div style={{ width: "160px" }}>Indicator</div>
                                                        <div style={{ width: "200px" }}>Expected Value</div>
                                                        <div style={{ width: "250px" }}>Set Value</div>
                                                    </div>


                                                    <div className="mb-3 d-flex align-items-center mt-3">
                                                        <label
                                                            htmlFor="integrity"
                                                            className="me-2 mb-0 ms-4"
                                                            style={{ width: "160px" }}
                                                        >
                                                            Integrity
                                                        </label>
                                                        <span style={{ width: "200px" }}>Expert/Leader</span>
                                                        <div className="d-flex flex-column" style={{ width: "250px" }}>
                                                            <select
                                                                id="integrity"
                                                                value={form.integrity}
                                                                onChange={(e) => {
                                                                    const { value } = e.target;
                                                                    setForm({ ...form, integrity: value });
                                                                    validateField("integrity", value);
                                                                }}
                                                                className={`form-control ${errors.integrity ? "is-invalid" : ""}`}
                                                                onBlur={(e) => validateField("integrity", e.target.value)}
                                                            >
                                                                <option value="">None</option>
                                                                <option value="beginner">Beginner</option>
                                                                <option value="intermediate">Intermediate</option>
                                                                <option value="advanced">Advanced</option>
                                                                <option value="expert">Expert/Leader</option>
                                                            </select>

                                                            {/* Error below input */}
                                                            {errors.integrity && (
                                                                <p className="text-danger mb-0 mt-1" style={{ fontSize: "13px" }}>
                                                                    Required!
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="mb-3 d-flex align-items-center mt-3">
                                                        <label
                                                            htmlFor="professionalism"
                                                            className="me-2 mb-0 ms-4"
                                                            style={{ width: "160px" }}
                                                        >
                                                            Professionalism
                                                        </label>
                                                        <span style={{ width: "200px" }}>Expert/Leader</span>
                                                        <div className="d-flex flex-column" style={{ width: "250px" }}>
                                                            <select
                                                                id="professionalism"
                                                                value={form.professionalism}
                                                                onChange={(e) => {
                                                                    const { value } = e.target;
                                                                    setForm({ ...form, professionalism: value });
                                                                    validateField("professionalism", value);
                                                                }}
                                                                className={`form-control ${errors.professionalism ? "is-invalid" : ""}`}
                                                                onBlur={(e) => validateField("professionalism", e.target.value)}
                                                            >
                                                                <option value="">None</option>
                                                                <option value="beginner">Beginner</option>
                                                                <option value="intermediate">Intermediate</option>
                                                                <option value="advanced">Advanced</option>
                                                                <option value="expert">Expert/Leader</option>
                                                            </select>

                                                            {/* Error below input */}
                                                            {errors.professionalism && (
                                                                <p className="text-danger mb-0 mt-1" style={{ fontSize: "13px" }}>
                                                                    Required!
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="mb-3 d-flex align-items-center mt-3">
                                                        <label
                                                            htmlFor="teamWork"
                                                            className="me-2 mb-0 ms-4"
                                                            style={{ width: "160px" }}
                                                        >
                                                            Team Work
                                                        </label>
                                                        <span style={{ width: "200px" }}>Expert/Leader</span>
                                                        <div className="d-flex flex-column" style={{ width: "250px" }}>
                                                            <select
                                                                id="teamWork"
                                                                value={form.teamWork}
                                                                onChange={(e) => {
                                                                    const { value } = e.target;
                                                                    setForm({ ...form, teamWork: value });
                                                                    validateField("teamWork", value);
                                                                }}
                                                                className={`form-control ${errors.teamWork ? "is-invalid" : ""}`}
                                                                onBlur={(e) => validateField("teamWork", e.target.value)}
                                                            >
                                                                <option value="">None</option>
                                                                <option value="beginner">Beginner</option>
                                                                <option value="intermediate">Intermediate</option>
                                                                <option value="advanced">Advanced</option>
                                                                <option value="expert">Expert/Leader</option>
                                                            </select>

                                                            {/* Error below input */}
                                                            {errors.teamWork && (
                                                                <p className="text-danger mb-0 mt-1" style={{ fontSize: "13px" }}>
                                                                    Required!
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="mb-3 d-flex align-items-center mt-3">
                                                        <label
                                                            htmlFor="criticalThinking"
                                                            className="me-2 mb-0 ms-4"
                                                            style={{ width: "160px" }}
                                                        >
                                                            Critical Thinking
                                                        </label>
                                                        <span style={{ width: "200px" }}>Expert/Leader</span>
                                                        <div className="d-flex flex-column" style={{ width: "250px" }}>
                                                            <select
                                                                id="criticalThinking"
                                                                value={form.criticalThinking}
                                                                onChange={(e) => {
                                                                    const { value } = e.target;
                                                                    setForm({ ...form, criticalThinking: value });
                                                                    validateField("criticalThinking", value);
                                                                }}
                                                                className={`form-control ${errors.criticalThinking ? "is-invalid" : ""}`}
                                                                onBlur={(e) => validateField("criticalThinking", e.target.value)}
                                                            >
                                                                <option value="">None</option>
                                                                <option value="beginner">Beginner</option>
                                                                <option value="intermediate">Intermediate</option>
                                                                <option value="advanced">Advanced</option>
                                                                <option value="expert">Expert/Leader</option>
                                                            </select>

                                                            {/* Error below input */}
                                                            {errors.criticalThinking && (
                                                                <p className="text-danger mb-0 mt-1" style={{ fontSize: "13px" }}>
                                                                    Required!
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="mb-3 d-flex align-items-center mt-3">
                                                        <label
                                                            htmlFor="conflictManagement"
                                                            className="me-2 mb-0 ms-4"
                                                            style={{ width: "160px" }}
                                                        >
                                                            Conflict Management
                                                        </label>
                                                        <span style={{ width: "200px" }}>Expert/Leader</span>
                                                        <div className="d-flex flex-column" style={{ width: "250px" }}>
                                                            <select
                                                                id="conflictManagement"
                                                                value={form.conflictManagement}
                                                                onChange={(e) => {
                                                                    const { value } = e.target;
                                                                    setForm({ ...form, conflictManagement: value });
                                                                    validateField("conflictManagement", value);
                                                                }}
                                                                className={`form-control ${errors.conflictManagement ? "is-invalid" : ""}`}
                                                                onBlur={(e) => validateField("conflictManagement", e.target.value)}
                                                            >
                                                                <option value="">None</option>
                                                                <option value="beginner">Beginner</option>
                                                                <option value="intermediate">Intermediate</option>
                                                                <option value="advanced">Advanced</option>
                                                                <option value="expert">Expert/Leader</option>
                                                            </select>

                                                            {/* Error below input */}
                                                            {errors.conflictManagement && (
                                                                <p className="text-danger mb-0 mt-1" style={{ fontSize: "13px" }}>
                                                                    Required!
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="mb-3 d-flex align-items-center mt-3">
                                                        <label
                                                            htmlFor="attendance"
                                                            className="me-2 mb-0 ms-4"
                                                            style={{ width: "160px" }}
                                                        >
                                                            Attendance
                                                        </label>
                                                        <span style={{ width: "200px" }}>Expert/Leader</span>
                                                        <div className="d-flex flex-column" style={{ width: "250px" }}>
                                                            <select
                                                                id="attendance"
                                                                value={form.attendance}
                                                                onChange={(e) => {
                                                                    const { value } = e.target;
                                                                    setForm({ ...form, attendance: value });
                                                                    validateField("attendance", value);
                                                                }}
                                                                className={`form-control ${errors.attendance ? "is-invalid" : ""}`}
                                                                onBlur={(e) => validateField("attendance", e.target.value)}
                                                            >
                                                                <option value="">None</option>
                                                                <option value="beginner">Beginner</option>
                                                                <option value="intermediate">Intermediate</option>
                                                                <option value="advanced">Advanced</option>
                                                                <option value="expert">Expert/Leader</option>
                                                            </select>

                                                            {/* Error below input */}
                                                            {errors.attendance && (
                                                                <p className="text-danger mb-0 mt-1" style={{ fontSize: "13px" }}>
                                                                    Required!
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="mb-3 d-flex align-items-center mt-3">
                                                        <label
                                                            htmlFor="abilityToMeetDeadline"
                                                            className="me-2 mb-0 ms-4"
                                                            style={{ width: "160px" }}
                                                        >
                                                            Ability To Meet Deadline
                                                        </label>
                                                        <span style={{ width: "200px" }}>Expert/Leader</span>
                                                        <div className="d-flex flex-column" style={{ width: "250px" }}>
                                                            <select
                                                                id="abilityToMeetDeadline"
                                                                value={form.abilityToMeetDeadline}
                                                                onChange={(e) => {
                                                                    const { value } = e.target;
                                                                    setForm({ ...form, abilityToMeetDeadline: value });
                                                                    validateField("abilityToMeetDeadline", value);
                                                                }}
                                                                className={`form-control ${errors.abilityToMeetDeadline ? "is-invalid" : ""}`}
                                                                onBlur={(e) => validateField("abilityToMeetDeadline", e.target.value)}
                                                            >
                                                                <option value="">None</option>
                                                                <option value="beginner">Beginner</option>
                                                                <option value="intermediate">Intermediate</option>
                                                                <option value="advanced">Advanced</option>
                                                                <option value="expert">Expert/Leader</option>
                                                            </select>

                                                            {/* Error below input */}
                                                            {errors.abilityToMeetDeadline && (
                                                                <p className="text-danger mb-0 mt-1" style={{ fontSize: "13px" }}>
                                                                    Required!
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>



                                                </div>

                                            </div>

                                            <div className="text-end">
                                                <button type="button" className="btn btn-sm btn-light me-2" onClick={() => { resetForm(); setShowEditModal(false) }}>Close</button>
                                                <button type="submit" onClick={(e) => handleSubmit(e)} className="btn btn-sm add-btn">Update</button>
                                            </div>
                                        </form>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}


            </div>
        </div>
    );
};

export default PerformanceAppraisal;
