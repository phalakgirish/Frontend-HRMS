import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import './employees.css';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { getWarnings, createWarnings, updateWarnings, deleteWarnings } from '../../api/warningsApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const Warnings = () => {

    const [showModal, setShowModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [description, setDescription] = useState('');
    const [editId, setEditId] = useState(null);

    //from backend
    const [Warnings, setWarnings] = useState([]);
    const [paginated, setPaginated] = useState([]);


    const [form, setForm] = useState({
        employee: '',
        warningDate: '',
        subject: '',
        warningType: '',
        approvalStatus: '',
        warningBy: '',
        description: ''
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

    useEffect(() => {
        fetchWarnings();
    }, []);

    const fetchWarnings = async () => {
        try {
            const response = await getWarnings();
            setWarnings(response.data);
            paginate(response.data, currentPage);
        } catch (error) {
            console.error('Error fetching Warnings:', error);
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {

            try {
                if (editId) {
                    await updateWarnings(editId, form);
                    toast.success("Warning updted successfully!");

                    // setEditId(null);
                } else {
                    await createWarnings(form);
                    toast.success("Warning saved successfully!");

                }
                fetchWarnings();
                setForm({
                    employee: '',
                    warningDate: '',
                    subject: '',
                    warningType: '',
                    approvalStatus: '',
                    warningBy: '',
                    description: '',
                });
                setEditId("");
                setShowEditModal(false);
            } catch (err) {
                console.error("Error saving Warnings:", err);
                toast.error("Warning failed to save!");

            }
        }
    };

    const handleView = (row) => {
        setSelectedRow(row);
        setShowModal(true);
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

            case "warningDate":
                if (!value.trim()) error = `${displayName} is required`;
                break;

            case "subject":
                if (!value.trim()) error = `${displayName} is required`;
                break;

            case "warningType":
                if (!value.trim()) error = `${displayName} is required`;
                break;

            case "approvalStatus":
                if (!value.trim()) error = `${displayName} is required`;
                break;

            case "warningBy":
                if (!value.trim()) error = `${displayName} is required`;
                break;

            case "description":
                if (!value.trim()) error = `${displayName} is required`;
                break;

            default:
                break;
        }

        setErrors(prev => ({ ...prev, [fieldName]: error }));
        return error;
    };


    const emptyForm = {
        employee: '',
        warningDate: '',
        subject: '',
        warningType: '',
        approvalStatus: '',
        warningBy: '',
        description: ''
    };

    const resetForm = () => {
        setForm(emptyForm);
        setEditId(null);
        setShowEditModal(false);
    };

    const handleEdit = (row) => {
        setEditId(row._id);
        setForm({
            employee: row.employee,
            warningDate: row.warningDate,
            subject: row.subject,
            warningType: row.warningType,
            approvalStatus: row.approvalStatus,
            warningBy: row.warningBy,
            description: row.description,
            comment: row.comment,

        });
        setShowEditModal(true);
        setSelectedRow(row);
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this Warnings?");
        if (!confirmDelete) return;
        try {
            await deleteWarnings(id);
            fetchWarnings();
        } catch (err) {
            console.error("Error deleting Warnings:", err);
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
        { name: 'Warning Date', selector: row => row.warningDate },
        { name: 'Subject', selector: row => row.subject },
        { name: 'Warning Type', selector: row => row.warningType },
        { name: 'Approval Status', selector: row => row.approvalStatus },
        { name: 'Warning By', selector: row => row.warningBy }
    ];

    // const data = [
    //     {
    //         action: '-',
    //         employee: 'Amit Kumar',
    //         warningDate: '06-May-2022',
    //         subject: 'Test',
    //         warningType: 'First Written Warning',
    //         approvalStatus: 'Accepted',
    //         warningBy: 'Amit Kumar'
    //     },
    //     {
    //         action: '-',
    //         employee: 'Amit Kumar',
    //         warningDate: '06-May-2022',
    //         subject: 'Test',
    //         warningType: 'First Written Warning',
    //         approvalStatus: 'Accepted',
    //         warningBy: 'Amit Kumar'
    //     }, {
    //         action: '-',
    //         employee: 'Amit Kumar',
    //         warningDate: '06-May-2022',
    //         subject: 'Test',
    //         warningType: 'First Written Warning',
    //         approvalStatus: 'Accepted',
    //         warningBy: 'Amit Kumar'
    //     }, {
    //         action: '-',
    //         employee: 'Amit Kumar',
    //         warningDate: '06-May-2022',
    //         subject: 'Test',
    //         warningType: 'First Written Warning',
    //         approvalStatus: 'Accepted',
    //         warningBy: 'Amit Kumar'
    //     }, {
    //         action: '-',
    //         employee: 'Amit Kumar',
    //         warningDate: '06-May-2022',
    //         subject: 'Test',
    //         warningType: 'First Written Warning',
    //         approvalStatus: 'Accepted',
    //         warningBy: 'Amit Kumar'
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

    const totalEntries = Warnings.length;
    const totalPages = Math.ceil(totalEntries / rowsPerPage);
    console.log('Paginated data:', paginated);

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
            <h5>Warnings</h5>
            <p style={{ fontSize: '15px', color: 'rgb(98, 98, 98)' }}>
                <span style={{ color: 'red' }}>Home</span> / Warnings
            </p>


            {showAddForm && (
                <div className="card mb-3 form-slide-container">
                    <div className="card-header d-flex justify-content-between align-items-center text-white new-emp-bg">
                        <span>Add New Warning</span>
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
                                        <label>Warning To</label>
                                        <select id="resignEmployee" value={form.employee}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setForm({ ...form, employee: value });
                                                validateField("employee", value);
                                            }}
                                            className={`form-control ${errors.employee ? "is-invalid" : ""}`}
                                            onBlur={(e) => validateField("employee", e.target.value)}
                                        >
                                            <option value="">Warning To</option>
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
                                        {errors.employee && (
                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Employee Name is required!</p>)}
                                    </div>

                                    <div className='row'>
                                        <div className="col-md-6 mb-3">
                                            <label>Warning Type</label>
                                            <select id="resignEmployee" value={form.warningType}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, warningType: value });
                                                    validateField("warningType", value);
                                                }}
                                                className={`form-control ${errors.warningType ? "is-invalid" : ""}`}
                                                onBlur={(e) => validateField("warningType", e.target.value)}
                                            >
                                                <option value="">Warning Type</option>
                                                <option value="First Written Warning">First Written Warning</option>
                                                <option value="Second Written Warning">Second Written Warning</option>
                                                <option value="Final Written Warning">Final Written Warning</option>
                                                <option value="Incident Explaination Request">Incident Explaination Request</option>
                                            </select>
                                            {errors.warningType && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Warning Type is required!</p>)}
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label>Subject</label>
                                            <input type="text" value={form.subject}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, subject: value });
                                                    validateField("subject", value);
                                                }}
                                                className={`form-control ${errors.subject ? "is-invalid" : ""}`}
                                                placeholder="Subject"
                                                onBlur={(e) => validateField("subject", e.target.value)}

                                            />
                                            {errors.subject && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Subject is required!</p>)}
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className="col-md-6 mb-3">
                                            <label>Warning By</label>
                                            <select id="resignEmployee" value={form.warningBy}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, warningBy: value });
                                                    validateField("warningBy", value);
                                                }}
                                                className={`form-control ${errors.warningBy ? "is-invalid" : ""}`}
                                                onBlur={(e) => validateField("warningBy", e.target.value)}
                                            >
                                                <option value="">Choose an Employee</option>
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
                                            {errors.warningBy && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>This field is required!</p>)}
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label>Warning Date</label>
                                            <input type="date" value={form.warningDate}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, warningDate: value });
                                                    validateField("warningDate", value);
                                                }}
                                                className={`form-control ${errors.warningDate ? "is-invalid" : ""}`}
                                                placeholder="Promotion Date"
                                                onBlur={(e) => validateField("warningDate", e.target.value)}

                                            />
                                            {errors.warningDate && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Warning date is required!</p>)}
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label>Approval Status</label>
                                        <select id="approvalStatus" value={form.approvalStatus}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setForm({ ...form, approvalStatus: value });
                                                validateField("approvalStatus", value);
                                            }}
                                            className={`form-control ${errors.approvalStatus ? "is-invalid" : ""}`}
                                            onBlur={(e) => validateField("approvalStatus", e.target.value)}
                                        >
                                            <option value="">Status</option>
                                            <option value="Pending">Pending</option>
                                            <option value="Accepted">Accepted</option>
                                            <option value="Rejected">Rejected</option>
                                        </select>
                                        {errors.approvalStatus && (
                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Approval Status is required!</p>)}
                                    </div>

                                </div>

                                {/* Right Column */}
                                <div className="col-md-6">

                                    <label>Description</label>
                                    <CKEditor
                                        editor={ClassicEditor}
                                        data={description || ""}
                                        onChange={(event, editor) => {
                                            const newData = editor.getData();
                                            setForm({ ...form, description: newData });
                                        }}
                                        onBlur={() => validateField("description", form.description)}
                                    />
                                    {errors.description && (
                                        <p className="text-danger mb-0" style={{ fontSize: '13px' }}>
                                            Description is Required
                                        </p>
                                    )}
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
                    <span>List All Warnings</span>
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
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">View Warning</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setShowModal(false)}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <p><strong>Warning To:</strong> {selectedRow.employee}</p>
                                    <p><strong>Warning Type:</strong> {selectedRow.warningType}</p>
                                    <p><strong>Subject:</strong> {selectedRow.subject}</p>
                                    <p><strong>Warning By:</strong> {selectedRow.warningBy}</p>
                                    <p><strong>Warning Date:</strong> {selectedRow.warningDate}</p>
                                    <p><strong>Status:</strong>{selectedRow.approvalStatus}</p>
                                    <p>
                                        <strong>Description:</strong> {(selectedRow?.description || '').replace(/<[^>]+>/g, '')}
                                    </p>

                                    <p>
                                        <strong>Comment:</strong> {(selectedRow?.comment || '').replace(/<[^>]+>/g, '')}
                                    </p>

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
                                        <h5 className="modal-title">Edit Warning</h5>
                                        <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                                    </div>
                                    <div className="modal-body">
                                        <form onSubmit={handleSubmit}>
                                            <div className="row">
                                                {/* Left Column */}
                                                <div className="col-md-6">
                                                    <div className="mb-3">
                                                        <label>Warning To</label>
                                                        <select id="resignEmployee" value={form.employee}
                                                            onChange={(e) => {
                                                                const { value } = e.target;
                                                                setForm({ ...form, employee: value });
                                                                validateField("employee", value);
                                                            }}
                                                            className={`form-control ${errors.employee ? "is-invalid" : ""}`}
                                                            onBlur={(e) => validateField("employee", e.target.value)}
                                                        >
                                                            <option value="">Warning To</option>
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
                                                        {errors.employee && (
                                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Employee Name is required!</p>)}
                                                    </div>

                                                    <div className='row'>
                                                        <div className="col-md-6 mb-3">
                                                            <label>Warning Type</label>
                                                            <select id="resignEmployee" value={form.warningType}
                                                                onChange={(e) => {
                                                                    const { value } = e.target;
                                                                    setForm({ ...form, warningType: value });
                                                                    validateField("warningType", value);
                                                                }}
                                                                className={`form-control ${errors.warningType ? "is-invalid" : ""}`}
                                                                onBlur={(e) => validateField("warningType", e.target.value)}
                                                            >
                                                                <option value="">Warning Type</option>
                                                                <option value="First Written Warning">First Written Warning</option>
                                                                <option value="Second Written Warning">Second Written Warning</option>
                                                                <option value="Final Written Warning">Final Written Warning</option>
                                                                <option value="Incident Explaination Request">Incident Explaination Request</option>
                                                            </select>
                                                            {errors.warningType && (
                                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Warning Type is required!</p>)}
                                                        </div>

                                                        <div className="col-md-6 mb-3">
                                                            <label>Subject</label>
                                                            <input type="text" value={form.subject}
                                                                onChange={(e) => {
                                                                    const { value } = e.target;
                                                                    setForm({ ...form, subject: value });
                                                                    validateField("subject", value);
                                                                }}
                                                                className={`form-control ${errors.subject ? "is-invalid" : ""}`}
                                                                placeholder="Subject"
                                                                onBlur={(e) => validateField("subject", e.target.value)}

                                                            />
                                                            {errors.subject && (
                                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Subject is required!</p>)}
                                                        </div>
                                                    </div>

                                                    <div className='row'>
                                                        <div className="col-md-6 mb-3">
                                                            <label>Warning By</label>
                                                            <select id="resignEmployee" value={form.warningBy}
                                                                onChange={(e) => {
                                                                    const { value } = e.target;
                                                                    setForm({ ...form, warningBy: value });
                                                                    validateField("warningBy", value);
                                                                }}
                                                                className={`form-control ${errors.warningBy ? "is-invalid" : ""}`}
                                                                onBlur={(e) => validateField("warningBy", e.target.value)}
                                                            >
                                                                <option value="">Choose an Employee</option>
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
                                                            {errors.warningBy && (
                                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>This field is required!</p>)}
                                                        </div>

                                                        <div className="col-md-6 mb-3">
                                                            <label>Warning Date</label>
                                                            <input type="date" value={form.warningDate}
                                                                onChange={(e) => {
                                                                    const { value } = e.target;
                                                                    setForm({ ...form, warningDate: value });
                                                                    validateField("warningDate", value);
                                                                }}
                                                                className={`form-control ${errors.warningDate ? "is-invalid" : ""}`}
                                                                placeholder="Promotion Date"
                                                                onBlur={(e) => validateField("warningDate", e.target.value)}

                                                            />
                                                            {errors.warningDate && (
                                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Warning date is required!</p>)}
                                                        </div>
                                                    </div>

                                                    <div className="mb-3">
                                                        <label>Approval Status</label>
                                                        <select id="approvalStatus" value={form.approvalStatus}
                                                            onChange={(e) => {
                                                                const { value } = e.target;
                                                                setForm({ ...form, approvalStatus: value });
                                                                validateField("approvalStatus", value);
                                                            }}
                                                            className={`form-control ${errors.approvalStatus ? "is-invalid" : ""}`}
                                                            onBlur={(e) => validateField("approvalStatus", e.target.value)}
                                                        >
                                                            <option value="">Status</option>
                                                            <option value="Pending">Pending</option>
                                                            <option value="Accepted">Accepted</option>
                                                            <option value="Rejected">Rejected</option>
                                                        </select>
                                                        {errors.approvalStatus && (
                                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Approval Status is required!</p>)}
                                                    </div>

                                                </div>

                                                {/* Right Column */}
                                                <div className="col-md-6">

                                                    <label>Description</label>
                                                    <CKEditor
                                                        editor={ClassicEditor}
                                                        data={form.description || ""}
                                                        onChange={(event, editor) => {
                                                            const newData = editor.getData();
                                                            setForm({ ...form, description: newData });
                                                        }}
                                                        onBlur={() => validateField("description", form.description)}
                                                    />
                                                    {errors.description && (
                                                        <p className="text-danger mb-0" style={{ fontSize: '13px' }}>
                                                            Description is Required
                                                        </p>
                                                    )}


                                                    <label>Comment</label>
                                                    <CKEditor
                                                        editor={ClassicEditor}
                                                        data={form.comment}
                                                        onChange={(event, editor) => {
                                                            const newData = editor.getData();
                                                            setForm({ ...form, comment: newData });
                                                        }}
                                                    />
                                                    {errors.comment && (
                                                        <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Resignation Reason is required!</p>)}

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

export default Warnings;
