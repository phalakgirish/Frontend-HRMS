import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
// import './organization.css';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useNavigate } from 'react-router-dom';
import { getLeave, createLeave, updateLeave, deleteLeave } from '../../api/leaveApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';


const Leave = () => {

    const [showModal, setShowModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [description, setDescription] = useState('');
    const [employees, setEmployees] = useState([]);
    const [employeeId, setEmployeeId] = useState('');

    //from backend
    const [Leave, setLeave] = useState([]);
    // const [paginated, setPaginated] = useState([]);

    const [editId, setEditId] = useState(null);

    const [form, setForm] = useState({
        employeeCode: '',
        employee: '',
        leaveType: '',
        appliedOn: '',
        endDate: '',
        requestDuration: '',
        days: '',
        reason: '',
        // status: '',
        addedBy: ''
    });



    const [errors, setErrors] = useState({});
    const validateForm = () => {
        let newErrors = {};
        const requiredFields = ["employee", "leaveType", "appliedOn", "endDate", "reason"];
        requiredFields.forEach((field) => {
            if (!form[field] || form[field].toString().trim() === "") {
                newErrors[field] = `${field.replace(/([A-Z])/g, " $1")} is required`;
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    useEffect(() => {
        fetchLeave();
    }, []);

    const fetchLeave = async () => {
        try {
            const response = await getLeave();
            setLeave(response.data);
            paginate(response.data, currentPage);
        } catch (error) {
            console.error('Error fetching Leave:', error);
        }
    };

    const validateField = (fieldName, value = "") => {
        let error = "";

        let displayName = fieldName
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, str => str.toUpperCase());

        value = value.toString();

        switch (fieldName) {
            case "employee":
                if (!value.trim()) error = `${displayName} is required`;
                break;

            case "leaveType":
                if (!value.trim()) error = `${displayName} is required`;
                break;

            case "requestDuration":
                if (!value.trim()) error = `${displayName} is required`;
                break;

            case "appliedOn":
                if (!value.trim()) error = `${displayName} is required`;
                break;

            case "endDate":
                if (!value.trim()) error = `${displayName} is required`;
                break;

            case "reason":
                if (!value.trim()) error = `${displayName} is required`;
                break;

            // case "status":
            //     if (!value.trim()) error = `${displayName} is required`;
            //     break;

            case "addedBy":
                if (!value.trim()) error = `${displayName} is required`;
                break;

            default:
                break;
        }

        setErrors(prev => ({ ...prev, [fieldName]: error }));
        return error;
    };

    useEffect(() => {
  if (showEditModal && selectedRow) {
    setForm({
      employeeId: selectedRow.employeeId || "",
      employee: selectedRow.employee || "",
      leaveType: selectedRow.leaveType || "",
      appliedOn: selectedRow.appliedOn?.slice(0, 10) || "", // format YYYY-MM-DD
      endDate: selectedRow.endDate?.slice(0, 10) || "",
      days: selectedRow.days || "",
      reason: selectedRow.reason || "",
      status: selectedRow.status || "Pending",
    });
  }
}, [showEditModal, selectedRow]);



    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     if (validateForm()) {
    //         try {
    //             if (editId) {
    //                 await updateLeave(editId, form);
    //                 toast.success("Leave updated successfully!");
    //     days: Number(form.days),     

    //             } else {
    //                 await createLeave(form);
    //                 toast.success("Leave saved successfully!");

    //             }
    //             fetchLeave();
    //             setForm({
    //                 employee: '',
    //                 leaveType: '',
    //                 appliedOn: '',
    //                 endDate: '',
    //                 requestDuration: '',
    //                 days: '',
    //                 reason: '',
    //                 // status: '',
    //                 addedBy: ''
    //             });
    //             setEditId(null);
    //             setShowEditModal(false);
    //             setShowAddForm(false);
    //         } catch (err) {
    //             console.error("Error saving Leave:", err);
    //             toast.error("Leave failed to fail!");

    //         }
    //     }
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                // ✅ Clean payload
                const payload = {
                    employeeId: form.employeeId,  // only send ID
                    leaveType: form.leaveType,
                    appliedOn: form.appliedOn,
                    endDate: form.endDate,
                    requestDuration: form.requestDuration,
                    days: Number(form.days),
                    reason: form.reason,
                    addedBy: form.addedBy || "",
                };

                console.log("Submitting payload:", payload);

                if (editId) {
                    await updateLeave(editId, payload);
                    toast.success("Leave updated successfully!");
                } else {
                    await createLeave(payload);
                    toast.success("Leave saved successfully!");
                }

                fetchLeave();
                setForm(emptyForm);
                setEditId(null);
                setShowEditModal(false);
                setShowAddForm(false);
            } catch (err) {
                console.error("Error saving Leave:", err.response?.data || err);
                toast.error("Leave failed to save!");
            }
        }
    };


    const emptyForm = {
        employee: '',
        leaveType: '',
        appliedOn: '',
        endDate: '',
        requestDuration: '',
        days: '',
        reason: '',
        // status: '',
        addedBy: ''
    };

    const resetForm = () => {
        setForm(emptyForm);
        setEditId(null);
        setShowEditModal(false);
    };


    const handleEdit = (row) => {
        setForm({
            employee: row.employee,
            leaveType: row.leaveType,
            appliedOn: row.appliedOn,
            endDate: row.endDate,
            requestDuration: row.requestDuration,
            days: row.days,
            reason: row.reason,
            // status: row.status,
            addedBy: row.addedBy
        });
        setEditId(row._id);
        setShowEditModal(true);
        setSelectedRow(row);
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this Leave?");
        if (!confirmDelete) return;
        try {
            await deleteLeave(id);
            fetchLeave();
        } catch (err) {
            console.error("Error deleting Leave:", err);
        }
    };

    const handleView = (row) => {
        setSelectedRow(row);
        setShowModal(true);
    };

    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:3000/employee")
            .then(res => res.json())
            .then(data => setEmployees(data))
            .catch(err => console.error("Error fetching employees:", err));
    }, []);

    useEffect(() => {
        if (form.appliedOn && form.endDate) {
            const start = new Date(form.appliedOn);
            const end = new Date(form.endDate);
            const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
            setForm((prev) => ({
                ...prev,
                requestDuration: `${form.appliedOn} to ${form.endDate}`,
                days: diffDays.toString(),
            }));
        }
    }, [form.appliedOn, form.endDate]);


    const columns = [
        {
            name: 'Action',
            cell: (row) => (
                <div className="d-flex">
                    <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => navigate(`/leaveDetail/${row._id}`, { state: { employee: row } })}
                    >
                        <i className="fas fa-arrow-right"></i>
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
        { name: 'Employee', selector: row => row.employee, sortable: true },
        { name: 'Leave Type', selector: row => row.leaveType },
        { name: 'Request Duration', selector: row => row.requestDuration },
        { name: 'Days', selector: row => row.days },
        { name: 'Applied On', selector: row => row.appliedOn },
        { name: 'Reason', selector: row => row.reason },
        { name: 'Status', selector: row => row.status },
    ];

    // const data = [
    //     {
    //         action: '-',
    //         employee: 'Aniket Rane',
    //         leaveType: 'Casual Leave',
    //         requestDuration: '13-Dec-2021 to 15-Dec-2021',
    //         days: '2 Years',
    //         appliedOn: '13-Dec-2021',
    //         reason: 'abcd',
    //         status: 'Approved'
    //     },
    //     {
    //         action: '-',
    //         employee: 'Manoj Kumar',
    //         leaveType: 'Casual Leave',
    //         requestDuration: '13-Dec-2021 to 15-Dec-2021',
    //         days: '2 Years',
    //         appliedOn: '13-Dec-2021',
    //         reason: 'abcd',
    //         status: 'Approved'
    //     }, {
    //         action: '-',
    //         employee: 'Aniket Rane',
    //         leaveType: 'Casual Leave',
    //         requestDuration: '13-Dec-2021 to 15-Dec-2021',
    //         days: '2 Years',
    //         appliedOn: '13-Dec-2021',
    //         reason: 'abcd',
    //         status: 'Approved'
    //     },
    //     // Add more records as needed
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

    const totalEntries = Leave.length;
    const totalPages = Math.ceil(totalEntries / rowsPerPage);
    const [paginated, setPaginated] = useState(Leave.slice(0, rowsPerPage));

    const paginate = (data, page) => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        setPaginated(data.slice(start, end));
        setCurrentPage(page);
    };

    const startEntry = (currentPage - 1) * rowsPerPage + 1;
    const endEntry = Math.min(currentPage * rowsPerPage, Leave.length);
    useEffect(() => {
        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        setPaginated(Leave.slice(start, end));
    }, [Leave, currentPage, rowsPerPage]);

    const [showAddForm, setShowAddForm] = useState(false);

    const toggleAddForm = () => {
        setShowAddForm((prev) => !prev);
    };



    return (
        <div className="custom-container">
            <h5>Leave</h5>
            <p style={{ fontSize: '15px', color: 'rgb(98, 98, 98)' }}>
                <span style={{ color: 'red' }}>Home</span> / Leave
            </p>


            {showAddForm && (
                <div className="card mb-3 form-slide-container">
                    <div className="card-header d-flex justify-content-between align-items-center text-white new-emp-bg">
                        <span>Add Leave</span>
                        <button className="btn btn-sm add-btn" onClick={toggleAddForm}>
                            - Hide
                        </button>
                    </div>

                    <div className="container mt-4">
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                {/* Left Column */}
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label>Leave Type</label>
                                        <select id="leaveType" value={form.leaveType}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setForm({ ...form, leaveType: value });
                                                validateField("leaveType", value);
                                            }}
                                            className={`form-control ${errors.leaveType ? "is-invalid" : ""}`}
                                            onBlur={(e) => validateField("leaveType", e.target.value)}
                                        >
                                            <option value="">Choose Leave Type...</option>
                                            <option value="Casual Leave">Casual Leave</option>
                                            <option value="Medical Leave">Medical Leave</option>
                                            <option value="Maternity Leave">Maternity Leave</option>
                                            <option value="Half Day">Half Day</option>
                                            <option value="COM Off">COM Off</option>
                                            <option value="Sick Leave">Sick Leave</option>
                                            <option value="Earning Leave">Earning Leave</option>
                                        </select>
                                        {errors.leaveType && (
                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Leave Type is required!</p>)}
                                    </div>

                                    <div className='row'>
                                        <div className="col-md-6 mb-3">
                                            <label>Start Date</label>
                                            <input type="date" value={form.appliedOn}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, appliedOn: value });
                                                    validateField("appliedOn", value);
                                                }}
                                                className={`form-control ${errors.appliedOn ? "is-invalid" : ""}`}
                                                onBlur={(e) => validateField("appliedOn", e.target.value)}

                                            />
                                            {errors.appliedOn && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>This field is required!</p>)}
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label>End Date</label>
                                            <input type="date" value={form.endDate}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, endDate: value });
                                                    validateField("endDate", value);
                                                }}
                                                className={`form-control ${errors.endDate ? "is-invalid" : ""}`}
                                                onBlur={(e) => validateField("endDate", e.target.value)}

                                            />
                                            {errors.endDate && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>This field is required!</p>)}
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label>Leave for Employee</label>
                                        <select
                                            value={form.employeeId || ""}
                                            onChange={(e) => {
                                                const selectedEmp = employees.find(emp => emp._id === e.target.value);

                                                if (selectedEmp) {
                                                    setForm({
                                                        ...form,
                                                        employeeId: selectedEmp._id, // only send ID
                                                        employee: `${selectedEmp.firstName} ${selectedEmp.lastName}`, // optional for display
                                                    });
                                                }
                                            }}
                                            className="form-control"
                                        >
                                            <option value="">-- Select Employee --</option>
                                            {employees.map((emp) => (
                                                <option key={emp._id} value={emp._id}>
                                                    {emp.firstName} {emp.lastName}
                                                    {emp.employeeCode ? ` (${emp.employeeCode})` : ""}
                                                </option>
                                            ))}
                                        </select>

                                        {errors.employee && (
                                            <p className="text-danger mb-0" style={{ fontSize: "13px" }}>
                                                This field is required!
                                            </p>
                                        )}
                                    </div>

                                </div>

                                {/* Right Column */}
                                {/* <div className="col-md-6 mb-3">
                                    <div className='row'>
                                        <label>No. of Days</label>
                                        <input type="text" value={form.days}
                                            onChange={(e) => setForm({ ...form, days: e.target.value })} className="form-control" placeholder="End Date" />
                                    </div>
                                </div> */}

                                <div className="col-md-6">

                                    <div className="mb-3">
                                        <label>No of Days</label>
                                        <input type="text" value={form.days}
                                            onChange={(e) => setForm({ ...form, days: e.target.value })} className="form-control" placeholder="End Date" />

                                    </div>

                                    {/* <div className="mb-3">
                                        <label>Status</label>
                                        <select id="status" value={form.status}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setForm({ ...form, status: value });
                                                validateField("status", value);
                                            }}
                                            className={`form-control ${errors.status ? "is-invalid" : ""}`}
                                            onBlur={(e) => validateField("status", e.target.value)}
                                        >
                                            <option value="">Status</option>
                                            <option value="pending">Pending</option>
                                            <option value="accepted">Accepted</option>
                                            <option value="rejected">Rejected</option>
                                        </select>
                                        {errors.status && (
                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>This field is required!</p>)}
                                    </div> */}

                                </div>
                                <div className="mb-3">
                                    <label>Reason</label>
                                    <textarea
                                        value={form.reason}
                                        onChange={(e) => setForm({ ...form, reason: e.target.value })}
                                        className="form-control"
                                        placeholder="Enter reason for leave"
                                    />
                                    {errors.reason && (
                                        <p className="text-danger mb-0" style={{ fontSize: '13px' }}>This field is required!</p>)}
                                </div>



                            </div>

                            <div className="text-start mb-2">
                                <button type="submit" className="btn btn-sm add-btn">Save</button>
                            </div>
                        </form>

                    </div>

                </div>
            )}



            <div className="card no-radius">
                <div className="card-header d-flex justify-content-between align-items-center text-white new-emp-bg">
                    <span>List all Leaves</span>
                    <button className="btn btn-sm add-btn" onClick={toggleAddForm}>{showAddForm ? '- Hide' : '+ Add Leave'}</button>
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
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Location Details</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setShowModal(false)}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <p><strong>Location Name:</strong> {selectedRow.locationName}</p>
                                    <p><strong>Company:</strong> {selectedRow.company}</p>
                                    <p><strong>Location Head:</strong> {selectedRow.locationHead}</p>
                                    <p><strong>City:</strong> {selectedRow.city}</p>
                                    <p><strong>Country:</strong> {selectedRow.country}</p>
                                    <p><strong>Added By:</strong> {selectedRow.addedBy}</p>
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
                                        <h5 className="modal-title">Edit Leave</h5>
                                        <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                                    </div>
                                    <div className="modal-body">
                                        <form onSubmit={handleSubmit}>
                                            <div className="row">
                                                {/* Left Column */}
                                                <div className="col-md-6">
                                                    <div className="mb-3">
                                                        <label>Leave Type</label>
                                                        <select id="leaveType" value={form.leaveType}
                                                            onChange={(e) => {
                                                                const { value } = e.target;
                                                                setForm({ ...form, leaveType: value });
                                                                validateField("leaveType", value);
                                                            }}
                                                            className={`form-control ${errors.leaveType ? "is-invalid" : ""}`}
                                                            onBlur={(e) => validateField("leaveType", e.target.value)}
                                                        >
                                                            <option value="">Choose Leave Type...</option>
                                                            <option value="Casual Leave">Casual Leave</option>
                                                            <option value="Medical Leave">Medical Leave</option>
                                                            <option value="Maternity Leave">Maternity Leave</option>
                                                            <option value="Half Day">Half Day</option>
                                                            <option value="COM Off">COM Off</option>
                                                            <option value="Sick Leave">Sick Leave</option>
                                                            <option value="Earning Leave">Earning Leave</option>
                                                        </select>
                                                        {errors.leaveType && (
                                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Leave Type is required!</p>)}
                                                    </div>

                                                    <div className='row'>
                                                        <div className="col-md-6 mb-3">
                                                            <label>Start Date</label>
                                                            <input type="date" value={form.appliedOn}
                                                                onChange={(e) => {
                                                                    const { value } = e.target;
                                                                    setForm({ ...form, appliedOn: value });
                                                                    validateField("appliedOn", value);
                                                                }}
                                                                className={`form-control ${errors.appliedOn ? "is-invalid" : ""}`}
                                                                onBlur={(e) => validateField("appliedOn", e.target.value)}

                                                            />
                                                            {errors.appliedOn && (
                                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>This field is required!</p>)}
                                                        </div>

                                                        <div className="col-md-6 mb-3">
                                                            <label>End Date</label>
                                                            <input type="date" value={form.endDate}
                                                                onChange={(e) => {
                                                                    const { value } = e.target;
                                                                    setForm({ ...form, endDate: value });
                                                                    validateField("endDate", value);
                                                                }}
                                                                className={`form-control ${errors.endDate ? "is-invalid" : ""}`}
                                                                onBlur={(e) => validateField("endDate", e.target.value)}

                                                            />
                                                            {errors.endDate && (
                                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>This field is required!</p>)}
                                                        </div>
                                                    </div>

                                                    <div className="mb-3">
                                                        <label>Leave for Employee</label>
                                                        <select
                                                            value={form.employeeId || ""}
                                                            onChange={(e) => {
                                                                const selectedEmp = employees.find(emp => emp._id === e.target.value);

                                                                if (selectedEmp) {
                                                                    setForm({
                                                                        ...form,
                                                                        employeeId: selectedEmp._id, // only send ID
                                                                        employee: `${selectedEmp.firstName} ${selectedEmp.lastName}`, // optional for display
                                                                    });
                                                                }
                                                            }}
                                                            className="form-control"
                                                        >
                                                            <option value="">-- Select Employee --</option>
                                                            {employees.map((emp) => (
                                                                <option key={emp._id} value={emp._id}>
                                                                    {emp.firstName} {emp.lastName}
                                                                    {emp.employeeCode ? ` (${emp.employeeCode})` : ""}
                                                                </option>
                                                            ))}
                                                        </select>

                                                        {errors.employee && (
                                                            <p className="text-danger mb-0" style={{ fontSize: "13px" }}>
                                                                This field is required!
                                                            </p>
                                                        )}
                                                    </div>

                                                </div>

                                                {/* Right Column */}
                                                {/* <div className="col-md-6 mb-3">
                                    <div className='row'>
                                        <label>No. of Days</label>
                                        <input type="text" value={form.days}
                                            onChange={(e) => setForm({ ...form, days: e.target.value })} className="form-control" placeholder="End Date" />
                                    </div>
                                </div> */}

                                                <div className="col-md-6">

                                                    <div className="mb-3">
                                                        <label>No of Days</label>
                                                        <input type="text" value={form.days}
                                                            onChange={(e) => setForm({ ...form, days: e.target.value })} className="form-control" placeholder="End Date" />

                                                    </div>

                                                    {/* <div className="mb-3">
                                        <label>Status</label>
                                        <select id="status" value={form.status}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setForm({ ...form, status: value });
                                                validateField("status", value);
                                            }}
                                            className={`form-control ${errors.status ? "is-invalid" : ""}`}
                                            onBlur={(e) => validateField("status", e.target.value)}
                                        >
                                            <option value="">Status</option>
                                            <option value="pending">Pending</option>
                                            <option value="accepted">Accepted</option>
                                            <option value="rejected">Rejected</option>
                                        </select>
                                        {errors.status && (
                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>This field is required!</p>)}
                                    </div> */}

                                                </div>
                                                <div className="mb-3">
                                                    <label>Reason</label>
                                                    <textarea
                                                        value={form.reason}
                                                        onChange={(e) => setForm({ ...form, reason: e.target.value })}
                                                        className="form-control"
                                                        placeholder="Enter reason for leave"
                                                    />
                                                    {errors.reason && (
                                                        <p className="text-danger mb-0" style={{ fontSize: '13px' }}>This field is required!</p>)}
                                                </div>



                                            </div>

                                            <div className="text-start mb-2">
                                                <button type="submit" className="btn btn-sm add-btn">Save</button>
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

export default Leave;
