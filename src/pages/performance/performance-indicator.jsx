import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
// import './employees.css';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { getPerformanceIndicator, createPerformanceIndicator, updatePerformanceIndicator, deletePerformanceIndicator } from '../../api/performanceIndicatorApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const PerformanceIndicator = () => {

    const [showModal, setShowModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [description, setDescription] = useState('');
    const [editId, setEditId] = useState(null);

    //from backend
    const [PerformanceIndicator, setPerformanceIndicator] = useState([]);
    // const [paginated, setPaginated] = useState([]);


    const [form, setForm] = useState({
        designation: '',
        department: '',
        addedBy: '',
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
            case "PerformanceIndicatorType":
            case "noticeDate":
            case "PerformanceIndicatorDate":
            case "approvalStatus":
            case "description":
            case "designation":
            // case "department":
            case "addedBy":
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
        fetcPerformanceIndicator();
    }, []);

    const fetcPerformanceIndicator = async () => {
        try {
            const response = await getPerformanceIndicator();
            setPerformanceIndicator(response.data);
            paginate(response.data, currentPage);
        } catch (error) {
            console.error('Error fetching PerformanceIndicator:', error);
        }
    };

    const emptyForm = {
        designation: '',
        department: '',
        addedBy: '',
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
                    await updatePerformanceIndicator(editId, form);
                    toast.success("PerformanceIndicator updated successfully!");

                    setEditId(null);
                } else {
                    console.log("Final data sent to API:", JSON.stringify(form, null, 2));

                    await createPerformanceIndicator(form);
                    toast.success("PerformanceIndicator saved successfully!");

                }
                fetcPerformanceIndicator();
                setForm({
                    designation: '',
                    department: '',
                    addedBy: '',
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
                console.error("Error saving PerformanceIndicator:", err);
                toast.error("PerformanceIndicator failed to save!");

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
            designation: row.designation || '',
            department: row.department || '',
            addedBy: row.addedBy || '',
            createdAt: row.createdAt || '',
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
        const confirmDelete = window.confirm("Are you sure you want to delete this PerformanceIndicator?");
        if (!confirmDelete) return;
        try {
            await deletePerformanceIndicator(id);
            fetcPerformanceIndicator();
        } catch (err) {
            console.error("Error deleting PerformanceIndicator:", err);
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
        { name: 'Designation', selector: row => row.designation },
        { name: 'Department', selector: row => row.department },
        { name: 'Added By', selector: row => row.addedBy },
        { name: 'Created At', selector: row => row.createdAt },

    ];

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

    const totalEntries = PerformanceIndicator.length;
    const totalPages = Math.ceil(totalEntries / rowsPerPage);
     const [paginated, setPaginated] = useState(PerformanceIndicator.slice(0, rowsPerPage));
   
       const paginate = (data, page) => {
           const start = (page - 1) * rowsPerPage;
           const end = start + rowsPerPage;
           setPaginated(data.slice(start, end));
           setCurrentPage(page);
       };
   
       const startEntry = (currentPage - 1) * rowsPerPage + 1;
       const endEntry = Math.min(currentPage * rowsPerPage, PerformanceIndicator.length);
       useEffect(() => {
           const start = (currentPage - 1) * rowsPerPage;
           const end = start + rowsPerPage;
           setPaginated(PerformanceIndicator.slice(start, end));
       }, [PerformanceIndicator, currentPage, rowsPerPage]);

    const [showAddForm, setShowAddForm] = useState(false);

    const toggleAddForm = () => {
        setShowAddForm((prev) => !prev);
    };

    return (
        <div className="custom-container">
            <h5>Performance Indicator</h5>
            <p style={{ fontSize: '15px', color: 'rgb(98, 98, 98)' }}>
                <span style={{ color: 'red' }}>Home</span> / Performance Indicator
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


                                <div className="row g-1 mb-3 align-items-center justify-content-center">
                                    <div className="col-12 col-md-3 d-flex align-items-center">
                                        <label htmlFor="designation" className="ms-3 me-2 mb-0" style={{ minWidth: "120px" }}>
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
                                        {errors.designation && <p className="text-danger mb-0 ms-2" style={{ fontSize: '13px' }}>Required!</p>}
                                    </div>

                                    <div className="col-12 col-md-3 d-flex align-items-center">
                                        <label htmlFor="addedBy" className="ms-3 me-2 mb-0" style={{ minWidth: "120px" }}>
                                            Added By
                                        </label>
                                        <select
                                            id="addedBy"
                                            value={form.addedBy}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setForm({ ...form, addedBy: value });
                                                validateField("addedBy", value);
                                            }}
                                            onBlur={(e) => validateField("addedBy", e.target.value)}
                                            className={`form-control ${errors.addedBy ? "is-invalid" : ""}`}
                                        >
                                            <option value="">Added By</option>
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
                                        {errors.addedBy && <p className="text-danger mb-0 ms-2" style={{ fontSize: '13px' }}>Required!</p>}
                                    </div>

                                    <div className="col-12 col-md-3 d-flex align-items-center">
                                        <label htmlFor="department" className="ms-3 me-2 mb-0" style={{ minWidth: "120px" }}>
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
                                </div>


                                <div className="col-md-6">
                                    <div className="card-header col-md-12 d-flex justify-content-between align-items-center text-white new-emp-bg">
                                        <span>Technical Competencies</span>
                                    </div>

                                    <div className="mb-3 d-flex align-items-center mt-3">
                                        <label
                                            htmlFor="custExperience"
                                            className="me-2 mb-0 ms-4"
                                            style={{ width: "160px" }}
                                        >
                                            Customer Experience
                                        </label>
                                        <select
                                            id="customerExperience"
                                            value={form.customerExperience}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setForm({ ...form, customerExperience: value });
                                                validateField("customerExperience", value);
                                            }}
                                            className={`form-control ms-5 ${errors.customerExperience ? "is-invalid" : ""}`}
                                            style={{ width: "300px" }}
                                            onBlur={(e) => validateField("customerExperience", e.target.value)}
                                        >
                                            <option value="">None</option>
                                            <option value="Beginner">Beginner</option>
                                            <option value="Intermediate">Intermediate</option>
                                            <option value="Advanced">Advanced</option>
                                            <option value="Expert">Expert/Leader</option>
                                        </select>
                                        {errors.customerExperience && (
                                            <p className="text-danger mb-0 ms-3" style={{ fontSize: '13px' }}>Required!</p>)}
                                    </div>


                                    <div className="mb-3 d-flex align-items-center mt-3">
                                        <label htmlFor="marketing" className="me-2 mb-0 ms-4" style={{ width: "160px" }}>
                                            Marketing
                                        </label>
                                        <select
                                            id="marketing"
                                            value={form.marketing}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setForm({ ...form, marketing: value });
                                                validateField("marketing", value);
                                            }}
                                            className={`form-control ms-5 ${errors.marketing ? "is-invalid" : ""}`}
                                            style={{ width: "300px" }}
                                            onBlur={(e) => validateField("marketing", e.target.value)}
                                        >
                                            <option value="">None</option>
                                            <option value="Beginner">Beginner</option>
                                            <option value="Intermediate">Intermediate</option>
                                            <option value="Advanced">Advanced</option>
                                            <option value="Expert">Expert/Leader</option>

                                        </select>
                                        {errors.marketing && (
                                            <p className="text-danger mb-0 ms-3" style={{ fontSize: '13px' }}>Required!</p>)}
                                    </div>

                                    <div className="mb-3 d-flex align-items-center mt-3">
                                        <label htmlFor="management" className="me-2 mb-0 ms-4" style={{ width: "160px" }}>
                                            Management
                                        </label>
                                        <select
                                            id="management"
                                            value={form.management}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setForm({ ...form, management: value });
                                                validateField("management", value);
                                            }}
                                            className={`form-control ms-5 ${errors.management ? "is-invalid" : ""}`}
                                            style={{ width: "300px" }}
                                            onBlur={(e) => validateField("management", e.target.value)}
                                        >
                                            <option value="">None</option>
                                            <option value="Beginner">Beginner</option>
                                            <option value="Intermediate">Intermediate</option>
                                            <option value="Advanced">Advanced</option>
                                            <option value="Expert">Expert/Leader</option>

                                        </select>
                                        {errors.management && (
                                            <p className="text-danger mb-0 ms-3" style={{ fontSize: '13px' }}>Required!</p>)}
                                    </div>

                                    <div className="mb-3 d-flex align-items-center mt-3">
                                        <label htmlFor="administration" className="me-2 mb-0 ms-4" style={{ width: "160px" }}>
                                            Administration
                                        </label>
                                        <select
                                            id="administration"
                                            value={form.administration}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setForm({ ...form, administration: value });
                                                validateField("administration", value);
                                            }}
                                            className={`form-control ms-5 ${errors.administration ? "is-invalid" : ""}`}
                                            style={{ width: "300px" }}
                                            onBlur={(e) => validateField("administration", e.target.value)}
                                        >
                                            <option value="">None</option>
                                            <option value="Beginner">Beginner</option>
                                            <option value="Intermediate">Intermediate</option>
                                            <option value="Advanced">Advanced</option>
                                            <option value="Expert">Expert/Leader</option>

                                        </select>
                                        {errors.administration && (
                                            <p className="text-danger mb-0 ms-3" style={{ fontSize: '13px' }}>Required!</p>)}
                                    </div>

                                    <div className="mb-3 d-flex align-items-center mt-3">
                                        <label htmlFor="presentationSkill" className="me-2 mb-0 ms-4" style={{ width: "160px" }}>
                                            Presentation Skill
                                        </label>
                                        <select
                                            id="presentationSkill"
                                            value={form.presentationSkill}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setForm({ ...form, presentationSkill: value });
                                                validateField("presentationSkill", value);
                                            }}
                                            className={`form-control ms-5 ${errors.presentationSkill ? "is-invalid" : ""}`}
                                            style={{ width: "300px" }}
                                            onBlur={(e) => validateField("presentationSkill", e.target.value)}
                                        >
                                            <option value="">None</option>
                                            <option value="Beginner">Beginner</option>
                                            <option value="Intermediate">Intermediate</option>
                                            <option value="Advanced">Advanced</option>
                                            <option value="Expert">Expert/Leader</option>
                                        </select>
                                        {errors.presentationSkill && (
                                            <p className="text-danger mb-0 ms-3" style={{ fontSize: '13px' }}>Required!</p>)}
                                    </div>

                                    <div className="mb-3 d-flex align-items-center mt-3">
                                        <label htmlFor="qualityOfWork" className="me-2 mb-0 ms-4" style={{ width: "160px" }}>
                                            Quality Of Work
                                        </label>
                                        <select
                                            id="qualityOfWork"
                                            value={form.qualityOfWork}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setForm({ ...form, qualityOfWork: value });
                                                validateField("qualityOfWork", value);
                                            }}
                                            className={`form-control ms-5 ${errors.qualityOfWork ? "is-invalid" : ""}`}
                                            style={{ width: "300px" }}
                                            onBlur={(e) => validateField("qualityOfWork", e.target.value)}
                                        >
                                            <option value="">None</option>
                                            <option value="Beginner">Beginner</option>
                                            <option value="Intermediate">Intermediate</option>
                                            <option value="Advanced">Advanced</option>
                                            <option value="Expert">Expert/Leader</option>
                                        </select>
                                        {errors.qualityOfWork && (
                                            <p className="text-danger mb-0 ms-3" style={{ fontSize: '13px' }}>Required!</p>)}
                                    </div>

                                    <div className="mb-3 d-flex align-items-center mt-3">
                                        <label htmlFor="efficiency" className="me-2 mb-0 ms-4" style={{ width: "160px" }}>
                                            Efficiency
                                        </label>
                                        <select
                                            id="efficiency"
                                            value={form.efficiency}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setForm({ ...form, efficiency: value });
                                                validateField("efficiency", value);
                                            }}
                                            className={`form-control ms-5 ${errors.efficiency ? "is-invalid" : ""}`}
                                            style={{ width: "300px" }}
                                            onBlur={(e) => validateField("efficiency", e.target.value)}
                                        >
                                            <option value="">None</option>
                                            <option value="Beginner">Beginner</option>
                                            <option value="Intermediate">Intermediate</option>
                                            <option value="Advanced">Advanced</option>
                                            <option value="Expert">Expert/Leader</option>
                                        </select>
                                        {errors.efficiency && (
                                            <p className="text-danger mb-0 ms-3" style={{ fontSize: '13px' }}>Required!</p>)}
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="col-md-6">
                                    <div className="card-header col-md-12 d-flex justify-content-between align-items-center text-white new-emp-bg">
                                        <span>Organizational Competencies</span>
                                    </div>

                                    <div className="mb-3 d-flex align-items-center mt-3">
                                        <label htmlFor="integrity" className="me-2 mb-0 ms-4" style={{ width: "160px" }}>
                                            Integrity
                                        </label>
                                        <select
                                            id="integrity"
                                            value={form.integrity}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setForm({ ...form, integrity: value });
                                                validateField("integrity", value);
                                            }}
                                            className={`form-control ms-5 ${errors.integrity ? "is-invalid" : ""}`}
                                            style={{ width: "300px" }}
                                            onBlur={(e) => validateField("integrity", e.target.value)}
                                        >
                                            <option value="">None</option>
                                            <option value="Beginner">Beginner</option>
                                            <option value="Intermediate">Intermediate</option>
                                            <option value="Advanced">Advanced</option>
                                            <option value="Expert">Expert/Leader</option>
                                        </select>
                                        {errors.integrity && (
                                            <p className="text-danger mb-0 ms-3" style={{ fontSize: '13px' }}>Required!</p>)}
                                    </div>

                                    <div className="mb-3 d-flex align-items-center mt-3">
                                        <label htmlFor="professionalism" className="me-2 mb-0 ms-4" style={{ width: "160px" }}>
                                            Professionalism
                                        </label>
                                        <select
                                            id="professionalism"
                                            value={form.professionalism}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setForm({ ...form, professionalism: value });
                                                validateField("professionalism", value);
                                            }}
                                            className={`form-control ms-5 ${errors.professionalism ? "is-invalid" : ""}`}
                                            style={{ width: "300px" }}
                                            onBlur={(e) => validateField("professionalism", e.target.value)}
                                        >
                                            <option value="">None</option>
                                            <option value="Beginner">Beginner</option>
                                            <option value="Intermediate">Intermediate</option>
                                            <option value="Advanced">Advanced</option>
                                            <option value="Expert">Expert/Leader</option>
                                        </select>
                                        {errors.professionalism && (
                                            <p className="text-danger mb-0 ms-3" style={{ fontSize: '13px' }}>Required!</p>)}
                                    </div>

                                    <div className="mb-3 d-flex align-items-center mt-3">
                                        <label htmlFor="teamWork" className="me-2 mb-0 ms-4" style={{ width: "160px" }}>
                                            Team Work
                                        </label>
                                        <select
                                            id="teamWork"
                                            value={form.teamWork}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setForm({ ...form, teamWork: value });
                                                validateField("teamWork", value);
                                            }}
                                            className={`form-control ms-5 ${errors.teamWork ? "is-invalid" : ""}`}
                                            style={{ width: "300px" }}
                                            onBlur={(e) => validateField("teamWork", e.target.value)}
                                        >
                                            <option value="">None</option>
                                            <option value="Beginner">Beginner</option>
                                            <option value="Intermediate">Intermediate</option>
                                            <option value="Advanced">Advanced</option>
                                            <option value="Expert">Expert/Leader</option>
                                        </select>
                                        {errors.teamWork && (
                                            <p className="text-danger mb-0 ms-3" style={{ fontSize: '13px' }}>Required!</p>)}
                                    </div>

                                    <div className="mb-3 d-flex align-items-center mt-3">
                                        <label htmlFor="criticalThinking" className="me-2 mb-0 ms-4" style={{ width: "160px" }}>
                                            Critical Thinking
                                        </label>
                                        <select
                                            id="criticalThinking"
                                            value={form.criticalThinking}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setForm({ ...form, criticalThinking: value });
                                                validateField("criticalThinking", value);
                                            }}
                                            className={`form-control ms-5 ${errors.criticalThinking ? "is-invalid" : ""}`}
                                            style={{ width: "300px" }}
                                            onBlur={(e) => validateField("criticalThinking", e.target.value)}
                                        >
                                            <option value="">None</option>
                                            <option value="Beginner">Beginner</option>
                                            <option value="Intermediate">Intermediate</option>
                                            <option value="Advanced">Advanced</option>
                                            <option value="Expert">Expert/Leader</option>
                                        </select>
                                        {errors.criticalThinking && (
                                            <p className="text-danger mb-0 ms-3" style={{ fontSize: '13px' }}>Required!</p>)}
                                    </div>

                                    <div className="mb-3 d-flex align-items-center mt-3">
                                        <label htmlFor="conflictManagement" className="me-2 mb-0 ms-4" style={{ width: "160px" }}>
                                            Conflict Management
                                        </label>
                                        <select
                                            id="conflictManagement"
                                            value={form.conflictManagement}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setForm({ ...form, conflictManagement: value });
                                                validateField("conflictManagement", value);
                                            }}
                                            className={`form-control ms-5 ${errors.conflictManagement ? "is-invalid" : ""}`}
                                            style={{ width: "300px" }}
                                            onBlur={(e) => validateField("conflictManagement", e.target.value)}
                                        >
                                            <option value="">None</option>
                                            <option value="Beginner">Beginner</option>
                                            <option value="Intermediate">Intermediate</option>
                                            <option value="Advanced">Advanced</option>
                                            <option value="Expert">Expert/Leader</option>
                                        </select>
                                        {errors.conflictManagement && (
                                            <p className="text-danger mb-0 ms-3" style={{ fontSize: '13px' }}>Required!</p>)}
                                    </div>

                                    <div className="mb-3 d-flex align-items-center mt-3">
                                        <label htmlFor="attendance" className="me-2 mb-0 ms-4" style={{ width: "160px" }}>
                                            Attendance
                                        </label>
                                        <select
                                            id="attendance"
                                            value={form.attendance}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setForm({ ...form, attendance: value });
                                                validateField("attendance", value);
                                            }}
                                            className={`form-control ms-5 ${errors.attendance ? "is-invalid" : ""}`}
                                            style={{ width: "300px" }}
                                            onBlur={(e) => validateField("attendance", e.target.value)}
                                        >
                                            <option value="">None</option>
                                            <option value="Beginner">Beginner</option>
                                            <option value="Intermediate">Intermediate</option>
                                            <option value="Advanced">Advanced</option>
                                            <option value="Expert">Expert/Leader</option>
                                        </select>
                                        {errors.attendance && (
                                            <p className="text-danger mb-0 ms-3" style={{ fontSize: '13px' }}>Required!</p>)}
                                    </div>

                                    <div className="mb-3 d-flex align-items-center mt-3">
                                        <label htmlFor="abilityToMeetDeadline" className="me-2 mb-0 ms-4" style={{ width: "160px" }}>
                                            Ability To Meet Deadline
                                        </label>
                                        <select
                                            id="abilityToMeetDeadline"
                                            value={form.abilityToMeetDeadline}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setForm({ ...form, abilityToMeetDeadline: value });
                                                validateField("abilityToMeetDeadline", value);
                                            }}
                                            className={`form-control ms-5 ${errors.abilityToMeetDeadline ? "is-invalid" : ""}`}
                                            style={{ width: "300px" }}
                                            onBlur={(e) => validateField("abilityToMeetDeadline", e.target.value)}
                                        >
                                            <option value="">None</option>
                                            <option value="Beginner">Beginner</option>
                                            <option value="Intermediate">Intermediate</option>
                                            <option value="Advanced">Advanced</option>
                                            <option value="Expert">Expert/Leader</option>
                                        </select>
                                        {errors.abilityToMeetDeadline && (
                                            <p className="text-danger mb-0 ms-3" style={{ fontSize: '13px' }}>Required!</p>)}
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
                    <span>List All Performance Indicators</span>
                    <button className="btn btn-sm add-btn" onClick={toggleAddForm}>{showAddForm ? '- Hide' : '+ Add New'}</button>
                </div>


                <div className="px-3">
                                <div className="d-flex justify-content-between align-items-center mb-2 mt-4">
                                    <div className="d-flex align-items-center gap-2">
                                        <label htmlFor="entriesSelect" className="mb-0 ms-4">Show</label>
                                        <select
                                            value={rowsPerPage}
                                            onChange={(e) => {
                                                setRowsPerPage(Number(e.target.value));
                                                setCurrentPage(1);
                                            }}
                                        >
                                            <option value={10}>10</option>
                                            <option value={25}>25</option>
                                            <option value={50}>50</option>
                                            <option value={100}>100</option>
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
                        <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">View Performance Indicator</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setShowModal(false)}
                                    ></button>
                                </div>


                                <div className="modal-body">
                                    <div className="row">
                                        <p><strong>Deignation:</strong> {selectedRow.designation}</p>

                                        {/* Technical Competencies */}
                                        <div className="col-md-6">
                                            <h6><strong>Technical Competencies</strong></h6>
                                            <p><strong>Customer Experience:</strong>  {(selectedRow?.customerExperience || '').replace(/<[^>]+>/g, '')}</p>
                                            <p><strong>Marketing:</strong> {selectedRow.marketing} {(selectedRow?.marketing || '').replace(/<[^>]+>/g, '')}</p>
                                            <p><strong>Management:</strong>  {(selectedRow?.management || '').replace(/<[^>]+>/g, '')}</p>
                                            <p><strong>Administration:</strong> {(selectedRow?.administration || '').replace(/<[^>]+>/g, '')}</p>
                                            <p><strong>Presentation Skill:</strong>  {(selectedRow?.presentationSkill || '').replace(/<[^>]+>/g, '')}</p>
                                            <p><strong>Quality Of Work:</strong>  {(selectedRow?.qualityOfWork || '').replace(/<[^>]+>/g, '')}</p>
                                            <p><strong>Efficiency:</strong>  {(selectedRow?.efficiency || '').replace(/<[^>]+>/g, '')}</p>
                                        </div>

                                        {/* Organizational Competencies */}
                                        <div className="col-md-6">
                                            <h6><strong>Organizational Competencies</strong></h6>
                                            <p><strong>Integrity:</strong>  {(selectedRow?.integrity || '').replace(/<[^>]+>/g, '')}</p>
                                            <p><strong>Professionalism:</strong>  {(selectedRow?.professionalism || '').replace(/<[^>]+>/g, '')}</p>
                                            <p><strong>Team Work:</strong>  {(selectedRow?.teamWork || '').replace(/<[^>]+>/g, '')}</p>
                                            <p><strong>Critical Thinking:</strong> {(selectedRow?.criticalThinking || '').replace(/<[^>]+>/g, '')}</p>
                                            <p><strong>Conflict Management:</strong>  {(selectedRow?.conflictManagement || '').replace(/<[^>]+>/g, '')}</p>
                                            <p><strong>Attendance:</strong> {(selectedRow?.attendance || '').replace(/<[^>]+>/g, '')}</p>
                                            <p><strong>Ability To Meet Deadline:</strong>  {(selectedRow?.abilityToMeetDeadline || '').replace(/<[^>]+>/g, '')}</p>
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
                                        <h5 className="modal-title">Edit Performance Indicator</h5>
                                        <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                                    </div>
                                    <div className="modal-body">
                                        <form onSubmit={handleSubmit}>
                                            <div className="row">
                                {/* Left Column */}


                                <div className="row g-1 mb-3 align-items-center justify-content-center">
                                    <div className="col-12 col-md-3 d-flex align-items-center">
                                        <label htmlFor="designation" className="ms-3 me-2 mb-0" style={{ minWidth: "80px" }}>
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
                                        {errors.designation && <p className="text-danger mb-0 ms-2" style={{ fontSize: '13px' }}>Required!</p>}
                                    </div>

                                    <div className="col-12 col-md-3 d-flex align-items-center">
                                        <label htmlFor="addedBy" className="ms-3 me-2 mb-0" style={{ minWidth: "80px" }}>
                                            Added By
                                        </label>
                                        <select
                                            id="addedBy"
                                            value={form.addedBy}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setForm({ ...form, addedBy: value });
                                                validateField("addedBy", value);
                                            }}
                                            onBlur={(e) => validateField("addedBy", e.target.value)}
                                            className={`form-control ${errors.addedBy ? "is-invalid" : ""}`}
                                        >
                                            <option value="">Added By</option>
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
                                        {errors.addedBy && <p className="text-danger mb-0 ms-2" style={{ fontSize: '13px' }}>Required!</p>}
                                    </div>

                                    <div className="col-12 col-md-3 d-flex align-items-center">
                                        <label htmlFor="department" className="ms-3 me-2 mb-0" style={{ minWidth: "75px" }}>
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
                                </div>


                                <div className="col-md-6">
                                    <div className="card-header col-md-12 d-flex justify-content-between align-items-center text-white new-emp-bg">
                                        <span>Technical Competencies</span>
                                    </div>

                                    <div className="mb-3 d-flex align-items-center mt-3">
                                        <label
                                            htmlFor="custExperience"
                                            className="me-2 mb-0 ms-4"
                                            style={{ width: "160px" }}
                                        >
                                            Customer Experience
                                        </label>
                                        <select
                                            id="customerExperience"
                                            value={form.customerExperience}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setForm({ ...form, customerExperience: value });
                                                validateField("customerExperience", value);
                                            }}
                                            className={`form-control ms-5 ${errors.customerExperience ? "is-invalid" : ""}`}
                                            style={{ width: "300px" }}
                                            onBlur={(e) => validateField("customerExperience", e.target.value)}
                                        >
                                            <option value="">None</option>
                                            <option value="Beginner">Beginner</option>
                                            <option value="Intermediate">Intermediate</option>
                                            <option value="Advanced">Advanced</option>
                                            <option value="Expert">Expert/Leader</option>
                                        </select>
                                        {errors.customerExperience && (
                                            <p className="text-danger mb-0 ms-3" style={{ fontSize: '13px' }}>Required!</p>)}
                                    </div>


                                    <div className="mb-3 d-flex align-items-center mt-3">
                                        <label htmlFor="marketing" className="me-2 mb-0 ms-4" style={{ width: "160px" }}>
                                            Marketing
                                        </label>
                                        <select
                                            id="marketing"
                                            value={form.marketing}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setForm({ ...form, marketing: value });
                                                validateField("marketing", value);
                                            }}
                                            className={`form-control ms-5 ${errors.marketing ? "is-invalid" : ""}`}
                                            style={{ width: "300px" }}
                                            onBlur={(e) => validateField("marketing", e.target.value)}
                                        >
                                            <option value="">None</option>
                                            <option value="Beginner">Beginner</option>
                                            <option value="Intermediate">Intermediate</option>
                                            <option value="Advanced">Advanced</option>
                                            <option value="Expert">Expert/Leader</option>

                                        </select>
                                        {errors.marketing && (
                                            <p className="text-danger mb-0 ms-3" style={{ fontSize: '13px' }}>Required!</p>)}
                                    </div>

                                    <div className="mb-3 d-flex align-items-center mt-3">
                                        <label htmlFor="management" className="me-2 mb-0 ms-4" style={{ width: "160px" }}>
                                            Management
                                        </label>
                                        <select
                                            id="management"
                                            value={form.management}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setForm({ ...form, management: value });
                                                validateField("management", value);
                                            }}
                                            className={`form-control ms-5 ${errors.management ? "is-invalid" : ""}`}
                                            style={{ width: "300px" }}
                                            onBlur={(e) => validateField("management", e.target.value)}
                                        >
                                            <option value="">None</option>
                                            <option value="Beginner">Beginner</option>
                                            <option value="Intermediate">Intermediate</option>
                                            <option value="Advanced">Advanced</option>
                                            <option value="Expert">Expert/Leader</option>

                                        </select>
                                        {errors.management && (
                                            <p className="text-danger mb-0 ms-3" style={{ fontSize: '13px' }}>Required!</p>)}
                                    </div>

                                    <div className="mb-3 d-flex align-items-center mt-3">
                                        <label htmlFor="administration" className="me-2 mb-0 ms-4" style={{ width: "160px" }}>
                                            Administration
                                        </label>
                                        <select
                                            id="administration"
                                            value={form.administration}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setForm({ ...form, administration: value });
                                                validateField("administration", value);
                                            }}
                                            className={`form-control ms-5 ${errors.administration ? "is-invalid" : ""}`}
                                            style={{ width: "300px" }}
                                            onBlur={(e) => validateField("administration", e.target.value)}
                                        >
                                            <option value="">None</option>
                                            <option value="Beginner">Beginner</option>
                                            <option value="Intermediate">Intermediate</option>
                                            <option value="Advanced">Advanced</option>
                                            <option value="Expert">Expert/Leader</option>

                                        </select>
                                        {errors.administration && (
                                            <p className="text-danger mb-0 ms-3" style={{ fontSize: '13px' }}>Required!</p>)}
                                    </div>

                                    <div className="mb-3 d-flex align-items-center mt-3">
                                        <label htmlFor="presentationSkill" className="me-2 mb-0 ms-4" style={{ width: "160px" }}>
                                            Presentation Skill
                                        </label>
                                        <select
                                            id="presentationSkill"
                                            value={form.presentationSkill}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setForm({ ...form, presentationSkill: value });
                                                validateField("presentationSkill", value);
                                            }}
                                            className={`form-control ms-5 ${errors.presentationSkill ? "is-invalid" : ""}`}
                                            style={{ width: "300px" }}
                                            onBlur={(e) => validateField("presentationSkill", e.target.value)}
                                        >
                                            <option value="">None</option>
                                            <option value="Beginner">Beginner</option>
                                            <option value="Intermediate">Intermediate</option>
                                            <option value="Advanced">Advanced</option>
                                            <option value="Expert">Expert/Leader</option>
                                        </select>
                                        {errors.presentationSkill && (
                                            <p className="text-danger mb-0 ms-3" style={{ fontSize: '13px' }}>Required!</p>)}
                                    </div>

                                    <div className="mb-3 d-flex align-items-center mt-3">
                                        <label htmlFor="qualityOfWork" className="me-2 mb-0 ms-4" style={{ width: "160px" }}>
                                            Quality Of Work
                                        </label>
                                        <select
                                            id="qualityOfWork"
                                            value={form.qualityOfWork}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setForm({ ...form, qualityOfWork: value });
                                                validateField("qualityOfWork", value);
                                            }}
                                            className={`form-control ms-5 ${errors.qualityOfWork ? "is-invalid" : ""}`}
                                            style={{ width: "300px" }}
                                            onBlur={(e) => validateField("qualityOfWork", e.target.value)}
                                        >
                                            <option value="">None</option>
                                            <option value="Beginner">Beginner</option>
                                            <option value="Intermediate">Intermediate</option>
                                            <option value="Advanced">Advanced</option>
                                            <option value="Expert">Expert/Leader</option>
                                        </select>
                                        {errors.qualityOfWork && (
                                            <p className="text-danger mb-0 ms-3" style={{ fontSize: '13px' }}>Required!</p>)}
                                    </div>

                                    <div className="mb-3 d-flex align-items-center mt-3">
                                        <label htmlFor="efficiency" className="me-2 mb-0 ms-4" style={{ width: "160px" }}>
                                            Efficiency
                                        </label>
                                        <select
                                            id="efficiency"
                                            value={form.efficiency}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setForm({ ...form, efficiency: value });
                                                validateField("efficiency", value);
                                            }}
                                            className={`form-control ms-5 ${errors.efficiency ? "is-invalid" : ""}`}
                                            style={{ width: "300px" }}
                                            onBlur={(e) => validateField("efficiency", e.target.value)}
                                        >
                                            <option value="">None</option>
                                            <option value="Beginner">Beginner</option>
                                            <option value="Intermediate">Intermediate</option>
                                            <option value="Advanced">Advanced</option>
                                            <option value="Expert">Expert/Leader</option>
                                        </select>
                                        {errors.efficiency && (
                                            <p className="text-danger mb-0 ms-3" style={{ fontSize: '13px' }}>Required!</p>)}
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="col-md-6">
                                    <div className="card-header col-md-12 d-flex justify-content-between align-items-center text-white new-emp-bg">
                                        <span>Organizational Competencies</span>
                                    </div>

                                    <div className="mb-3 d-flex align-items-center mt-3">
                                        <label htmlFor="integrity" className="me-2 mb-0 ms-4" style={{ width: "160px" }}>
                                            Integrity
                                        </label>
                                        <select
                                            id="integrity"
                                            value={form.integrity}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setForm({ ...form, integrity: value });
                                                validateField("integrity", value);
                                            }}
                                            className={`form-control ms-5 ${errors.integrity ? "is-invalid" : ""}`}
                                            style={{ width: "300px" }}
                                            onBlur={(e) => validateField("integrity", e.target.value)}
                                        >
                                            <option value="">None</option>
                                            <option value="Beginner">Beginner</option>
                                            <option value="Intermediate">Intermediate</option>
                                            <option value="Advanced">Advanced</option>
                                            <option value="Expert">Expert/Leader</option>
                                        </select>
                                        {errors.integrity && (
                                            <p className="text-danger mb-0 ms-3" style={{ fontSize: '13px' }}>Required!</p>)}
                                    </div>

                                    <div className="mb-3 d-flex align-items-center mt-3">
                                        <label htmlFor="professionalism" className="me-2 mb-0 ms-4" style={{ width: "160px" }}>
                                            Professionalism
                                        </label>
                                        <select
                                            id="professionalism"
                                            value={form.professionalism}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setForm({ ...form, professionalism: value });
                                                validateField("professionalism", value);
                                            }}
                                            className={`form-control ms-5 ${errors.professionalism ? "is-invalid" : ""}`}
                                            style={{ width: "300px" }}
                                            onBlur={(e) => validateField("professionalism", e.target.value)}
                                        >
                                            <option value="">None</option>
                                            <option value="Beginner">Beginner</option>
                                            <option value="Intermediate">Intermediate</option>
                                            <option value="Advanced">Advanced</option>
                                            <option value="Expert">Expert/Leader</option>
                                        </select>
                                        {errors.professionalism && (
                                            <p className="text-danger mb-0 ms-3" style={{ fontSize: '13px' }}>Required!</p>)}
                                    </div>

                                    <div className="mb-3 d-flex align-items-center mt-3">
                                        <label htmlFor="teamWork" className="me-2 mb-0 ms-4" style={{ width: "160px" }}>
                                            Team Work
                                        </label>
                                        <select
                                            id="teamWork"
                                            value={form.teamWork}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setForm({ ...form, teamWork: value });
                                                validateField("teamWork", value);
                                            }}
                                            className={`form-control ms-5 ${errors.teamWork ? "is-invalid" : ""}`}
                                            style={{ width: "300px" }}
                                            onBlur={(e) => validateField("teamWork", e.target.value)}
                                        >
                                            <option value="">None</option>
                                            <option value="Beginner">Beginner</option>
                                            <option value="Intermediate">Intermediate</option>
                                            <option value="Advanced">Advanced</option>
                                            <option value="Expert">Expert/Leader</option>
                                        </select>
                                        {errors.teamWork && (
                                            <p className="text-danger mb-0 ms-3" style={{ fontSize: '13px' }}>Required!</p>)}
                                    </div>

                                    <div className="mb-3 d-flex align-items-center mt-3">
                                        <label htmlFor="criticalThinking" className="me-2 mb-0 ms-4" style={{ width: "160px" }}>
                                            Critical Thinking
                                        </label>
                                        <select
                                            id="criticalThinking"
                                            value={form.criticalThinking}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setForm({ ...form, criticalThinking: value });
                                                validateField("criticalThinking", value);
                                            }}
                                            className={`form-control ms-5 ${errors.criticalThinking ? "is-invalid" : ""}`}
                                            style={{ width: "300px" }}
                                            onBlur={(e) => validateField("criticalThinking", e.target.value)}
                                        >
                                            <option value="">None</option>
                                            <option value="Beginner">Beginner</option>
                                            <option value="Intermediate">Intermediate</option>
                                            <option value="Advanced">Advanced</option>
                                            <option value="Expert">Expert/Leader</option>
                                        </select>
                                        {errors.criticalThinking && (
                                            <p className="text-danger mb-0 ms-3" style={{ fontSize: '13px' }}>Required!</p>)}
                                    </div>

                                    <div className="mb-3 d-flex align-items-center mt-3">
                                        <label htmlFor="conflictManagement" className="me-2 mb-0 ms-4" style={{ width: "160px" }}>
                                            Conflict Management
                                        </label>
                                        <select
                                            id="conflictManagement"
                                            value={form.conflictManagement}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setForm({ ...form, conflictManagement: value });
                                                validateField("conflictManagement", value);
                                            }}
                                            className={`form-control ms-5 ${errors.conflictManagement ? "is-invalid" : ""}`}
                                            style={{ width: "300px" }}
                                            onBlur={(e) => validateField("conflictManagement", e.target.value)}
                                        >
                                            <option value="">None</option>
                                            <option value="Beginner">Beginner</option>
                                            <option value="Intermediate">Intermediate</option>
                                            <option value="Advanced">Advanced</option>
                                            <option value="Expert">Expert/Leader</option>
                                        </select>
                                        {errors.conflictManagement && (
                                            <p className="text-danger mb-0 ms-3" style={{ fontSize: '13px' }}>Required!</p>)}
                                    </div>

                                    <div className="mb-3 d-flex align-items-center mt-3">
                                        <label htmlFor="attendance" className="me-2 mb-0 ms-4" style={{ width: "160px" }}>
                                            Attendance
                                        </label>
                                        <select
                                            id="attendance"
                                            value={form.attendance}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setForm({ ...form, attendance: value });
                                                validateField("attendance", value);
                                            }}
                                            className={`form-control ms-5 ${errors.attendance ? "is-invalid" : ""}`}
                                            style={{ width: "300px" }}
                                            onBlur={(e) => validateField("attendance", e.target.value)}
                                        >
                                            <option value="">None</option>
                                            <option value="Beginner">Beginner</option>
                                            <option value="Intermediate">Intermediate</option>
                                            <option value="Advanced">Advanced</option>
                                            <option value="Expert">Expert/Leader</option>
                                        </select>
                                        {errors.attendance && (
                                            <p className="text-danger mb-0 ms-3" style={{ fontSize: '13px' }}>Required!</p>)}
                                    </div>

                                    <div className="mb-3 d-flex align-items-center mt-3">
                                        <label htmlFor="abilityToMeetDeadline" className="me-2 mb-0 ms-4" style={{ width: "160px" }}>
                                            Ability To Meet Deadline
                                        </label>
                                        <select
                                            id="abilityToMeetDeadline"
                                            value={form.abilityToMeetDeadline}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setForm({ ...form, abilityToMeetDeadline: value });
                                                validateField("abilityToMeetDeadline", value);
                                            }}
                                            className={`form-control ms-5 ${errors.abilityToMeetDeadline ? "is-invalid" : ""}`}
                                            style={{ width: "300px" }}
                                            onBlur={(e) => validateField("abilityToMeetDeadline", e.target.value)}
                                        >
                                            <option value="">None</option>
                                            <option value="Beginner">Beginner</option>
                                            <option value="Intermediate">Intermediate</option>
                                            <option value="Advanced">Advanced</option>
                                            <option value="Expert">Expert/Leader</option>
                                        </select>
                                        {errors.abilityToMeetDeadline && (
                                            <p className="text-danger mb-0 ms-3" style={{ fontSize: '13px' }}>Required!</p>)}
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

export default PerformanceIndicator;
