import React, { useState, useEffect, useRef } from 'react';
import DataTable from 'react-data-table-component';
import './employees.css';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { getResignation, createResignation, updateResignation, deleteResignation } from '../../api/resignationApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Resignations = () => {

    const [showModal, setShowModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [description, setDescription] = useState('');
    const [comment, setComment] = useState('');
    const editorRef = useRef(null);
    const [editorKey, setEditorKey] = useState(0);

    //from backend
    const [Resignation, setResignation] = useState([]);
    const [paginated, setPaginated] = useState([]);

    const [editId, setEditId] = useState(null);

    const [form, setForm] = useState({
        employeeName: '',
        noticeDate: '',
        resignationDate: '',
        addedBy: '',
        approvalStatus: '',
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
        fetchResignation();
    }, []);

    const fetchResignation = async () => {
        try {
            const response = await getResignation();
            setResignation(response.data);
            paginate(response.data, currentPage);
        } catch (error) {
            console.error('Error fetching Resignation:', error);
        }
    };


    const emptyForm = {
        employeeName: '',
        noticeDate: '',
        resignationDate: '',
        addedBy: '',
        approvalStatus: '',
        description: ''
    };

    const resetForm = () => {
        setForm(emptyForm);
        setEditId(null);
        setShowEditModal(false);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {

            try {
                if (editId) {
                    await updateResignation(editId, form);
                    toast.success("Resignation updated successfully!");

                } else {
                    await createResignation(form);
                    toast.success("Resignation saved successfully!");

                }
                fetchResignation();
                setForm({
                    employeeName: '',
                    noticeDate: '',
                    resignationDate: '',
                    addedBy: '',
                    approvalStatus: '',
                    description: ''
                });
                setEditId("");
                setShowEditModal(false);
            } catch (err) {
                console.error("Error saving Resignation:", err);
                toast.error("Resignation failed to save!");

            }
        }
    };

    const validateField = (fieldName, value = "") => {
        let error = "";

        let displayName = fieldName
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, str => str.toUpperCase());

        value = value.toString();

        switch (fieldName) {
            case "employeeName":
                if (!value.trim()) error = `${displayName} is required`;
                break;

            case "noticeDate":
                if (!value.trim()) error = `${displayName} is required`;
                break;

            case "resignationDate":
                if (!value.trim()) error = `${displayName} is required`;
                break;

            case "approvalStatus":
                if (!value.trim()) error = `${displayName} is required`;
                break;

            case "description":
                if (!value.trim()) error = `${displayName} is required`;
                break;

            case "addedBy":
                if (!value.trim()) error = `${displayName} is required`;
                break;

            case "comment":
                if (!value.trim()) error = `${displayName} is required`;
                break;

            default:
                break;
        }

        setErrors(prev => ({ ...prev, [fieldName]: error }));
        return error;
    };




    const handleEdit = (row) => {
        setForm({
            employeeName: row.employeeName,
            noticeDate: row.noticeDate,
            resignationDate: row.resignationDate,
            addedBy: row.addedBy,
            approvalStatus: row.approvalStatus,
            comment: row.comment,
            description: row.description
        });
        setEditId(row._id);
        setShowEditModal(true);
        setSelectedRow(row);
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this Resignation?");
        if (!confirmDelete) return;
        try {
            await deleteResignation(id);
            fetchResignation();
        } catch (err) {
            console.error("Error deleting Resignation:", err);
        }
    };


    const handleView = (row) => {
        setSelectedRow(row);
        setShowModal(true);
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
        { name: 'Employee Name', selector: row => row.employeeName },
        { name: 'Notice Date', selector: row => row.noticeDate },
        { name: 'Resignation Date', selector: row => row.resignationDate },
        { name: 'Added By', selector: row => row.addedBy },
        { name: 'Approval Status', selector: row => row.approvalStatus }
    ];

    // const data = [
    //     {
    //         action: '-',
    //         employeeName: 'Shubham Kadam',
    //         noticeDate: '12-May-2022',
    //         resignationDate: '11-Nov-2021',
    //         addedBy: 'Admin Admin',
    //         approvalStatus: 'Accepted',
    //     },
    //     {
    //         action: '-',
    //         employeeName: 'Shubham Kadam',
    //         noticeDate: '12-May-2022',
    //         resignationDate: '11-Nov-2021',
    //         addedBy: 'Admin Admin',
    //         approvalStatus: 'Accepted',
    //     }, {
    //         action: '-',
    //         employeeName: 'Shubham Kadam',
    //         noticeDate: '12-May-2022',
    //         resignationDate: '11-Nov-2021',
    //         addedBy: 'Admin Admin',
    //         approvalStatus: 'Accepted',
    //     }, {
    //         action: '-',
    //         employeeName: 'Shubham Kadam',
    //         noticeDate: '12-May-2022',
    //         resignationDate: '11-Nov-2021',
    //         addedBy: 'Admin Admin',
    //         approvalStatus: 'Accepted',
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

    const totalEntries = Resignation.length;
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
            <h5>Resignations</h5>
            <p style={{ fontSize: '15px', color: 'rgb(98, 98, 98)' }}>
                <span style={{ color: 'red' }}>Home</span> / Resignations
            </p>


            {showAddForm && (
                <div className="card mb-3 form-slide-container">
                    <div className="card-header d-flex justify-content-between align-items-center text-white new-emp-bg">
                        <span>Add New Resignation</span>
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
                                        <label>Resigning Employee</label>
                                        <select id="resignEmployee" value={form.employeeName}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setForm({ ...form, employeeName: value });
                                                validateField("employeeName", value);
                                            }}
                                            className={`form-control ${errors.employeeName ? "is-invalid" : ""}`}
                                            onBlur={(e) => validateField("employeeName", e.target.value)}
                                        >
                                            <option value="">Select Department</option>
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
                                        {errors.employeeName && (
                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.employeeName}</p>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label>Notice Date</label>
                                        <input type="date" value={form.noticeDate}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setForm({ ...form, noticeDate: value });
                                                validateField("noticeDate", value);
                                            }}
                                            className={`form-control ${errors.noticeDate ? "is-invalid" : ""}`}
                                            onBlur={(e) => validateField("noticeDate", e.target.value)}

                                        />
                                        {errors.noticeDate && (
                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.noticeDate}</p>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label>Resignation Date</label>
                                        <input type="date" value={form.resignationDate}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setForm({ ...form, resignationDate: value });
                                                validateField("resignationDate", value);
                                            }}
                                            className={`form-control ${errors.resignationDate ? "is-invalid" : ""}`}
                                            onBlur={(e) => validateField("resignationDate", e.target.value)}

                                        />
                                        {errors.resignationDate && (
                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.resignationDate}</p>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label>Status</label>
                                        <select id="status" value={form.approvalStatus}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setForm({ ...form, approvalStatus: value });
                                                validateField("approvalStatus", value);
                                            }}
                                            className={`form-control ${errors.approvalStatus ? "is-invalid" : ""}`}
                                            onBlur={(e) => validateField("approvalStatus", e.target.value)}
                                        >
                                            <option value="">Status</option>
                                            <option value="pending">Pending</option>
                                            <option value="accepted">Accepted</option>
                                            <option value="rejected">Rejected</option>
                                        </select>
                                        {errors.approvalStatus && (
                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.approvalStatus}</p>
                                        )}
                                    </div>

                                </div>

                                {/* Right Column */}
                                <div className="col-md-6">

                                    <div className="mb-3">
                                        <label>Added By</label>
                                        <select id="addedBy" value={form.addedBy}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setForm({ ...form, addedBy: value });
                                                validateField("addedBy", value);
                                            }}
                                            className={`form-control ${errors.addedBy ? "is-invalid" : ""}`}
                                            onBlur={(e) => validateField("addedBy", e.target.value)}
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
                                        {errors.addedBy && (
                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.addedBy}</p>
                                        )}
                                    </div>

                                    <label>Resignation Reason</label>
                                    <CKEditor
                                        key={editorKey}
                                        editor={ClassicEditor}
                                        data={form.description}
                                        onReady={(editor) => {
                                            editorRef.current = editor;
                                        }}
                                        onChange={(event, editor) => {
                                            const newData = editor.getData();
                                            setForm(prev => ({ ...prev, description: newData }));
                                        }}
                                    />
                                    {errors.description && (
                                        <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Resignation Reason is required!</p>)}
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
                    <span>List All Resignations</span>
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
                                    <h5 className="modal-title">View Resignation</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setShowModal(false)}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <p><strong>Resigning Employee:</strong> {selectedRow.employeeName}</p>
                                    <p><strong>Notice Date:</strong> {selectedRow.noticeDate}</p>
                                    <p><strong>Resignation Date:</strong> {selectedRow.resignationDate}</p>
                                    <p><strong>Status:</strong> {selectedRow.approvalStatus}</p>

                                    <p>
                                        <strong>Resignation reason:</strong> {(selectedRow?.description || '').replace(/<[^>]+>/g, '')}
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
                                        <h5 className="modal-title">Edit Resignation</h5>
                                        <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                                    </div>
                                    <div className="modal-body">
                                        <form onSubmit={handleSubmit}>
                                            <div className="row">
                                                {/* Left Column */}
                                                <div className="col-md-6">
                                                    <div className="mb-3">
                                                        <label>Resigning Employee</label>
                                                        <select id="resignEmployee" value={form.employeeName}
                                                            onChange={(e) => {
                                                                const { value } = e.target;
                                                                setForm({ ...form, employeeName: value });
                                                                validateField("employeeName", value);
                                                            }}
                                                            className={`form-control ${errors.employeeName ? "is-invalid" : ""}`}
                                                            onBlur={(e) => validateField("employeeName", e.target.value)}
                                                        >
                                                            <option value="">Select Department</option>
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
                                                        {errors.employeeName && (
                                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.employeeName}</p>
                                                        )}
                                                    </div>

                                                    <div className="mb-3">
                                                        <label>Notice Date</label>
                                                        <input type="date" value={form.noticeDate}
                                                            onChange={(e) => {
                                                                const { value } = e.target;
                                                                setForm({ ...form, noticeDate: value });
                                                                validateField("noticeDate", value);
                                                            }}
                                                            className={`form-control ${errors.noticeDate ? "is-invalid" : ""}`}
                                                            onBlur={(e) => validateField("noticeDate", e.target.value)}

                                                        />
                                                        {errors.noticeDate && (
                                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.noticeDate}</p>
                                                        )}
                                                    </div>

                                                    <div className="mb-3">
                                                        <label>Resignation Date</label>
                                                        <input type="date" value={form.resignationDate}
                                                            onChange={(e) => {
                                                                const { value } = e.target;
                                                                setForm({ ...form, resignationDate: value });
                                                                validateField("resignationDate", value);
                                                            }}
                                                            className={`form-control ${errors.resignationDate ? "is-invalid" : ""}`}
                                                            onBlur={(e) => validateField("resignationDate", e.target.value)}

                                                        />
                                                        {errors.resignationDate && (
                                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.resignationDate}</p>
                                                        )}
                                                    </div>

                                                    <div className="mb-3">
                                                        <label>Status</label>
                                                        <select id="status" value={form.approvalStatus}
                                                            onChange={(e) => {
                                                                const { value } = e.target;
                                                                setForm({ ...form, approvalStatus: value });
                                                                validateField("approvalStatus", value);
                                                            }}
                                                            className={`form-control ${errors.approvalStatus ? "is-invalid" : ""}`}
                                                            onBlur={(e) => validateField("approvalStatus", e.target.value)}
                                                        >
                                                            <option value="">Status</option>
                                                            <option value="pending">Pending</option>
                                                            <option value="accepted">Accepted</option>
                                                            <option value="rejected">Rejected</option>
                                                        </select>
                                                        {errors.addedBy && (
                                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.addedBy}</p>
                                                        )}
                                                    </div>

                                                </div>

                                                {/* Right Column */}
                                                <div className="col-md-6">

                                                    <div className="mb-3">
                                                        <label>Added By</label>
                                                        <select id="addedBy" value={form.addedBy}
                                                            onChange={(e) => {
                                                                const { value } = e.target;
                                                                setForm({ ...form, addedBy: value });
                                                                validateField("addedBy", value);
                                                            }}
                                                            className={`form-control ${errors.addedBy ? "is-invalid" : ""}`}
                                                            onBlur={(e) => validateField("addedBy", e.target.value)}
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
                                                        {errors.addedBy && (
                                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.addedBy}</p>
                                                        )}
                                                    </div>

                                                    <label>Resignation Reason</label>
                                                    <CKEditor
                                                        editor={ClassicEditor}
                                                        data={form.description}
                                                        onChange={(event, editor) => {
                                                            const newData = editor.getData();
                                                            setForm({ ...form, description: newData });
                                                        }}
                                                    />
                                                    {errors.description && (
                                                        <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Resignation Reason is required!</p>)}


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


                                            <div className="text-end mt-3">
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

export default Resignations;
