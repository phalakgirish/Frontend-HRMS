import React, { useState, useEffect, useRef } from 'react';
import DataTable from 'react-data-table-component';
import './employees.css';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { getComplaint, createComplaint, updateComplaint, deleteComplaint } from '../../api/complaintApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';


const Complaints = () => {

    const [showModal, setShowModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [description, setDescription] = useState('');
    const editorRef = useRef(null);
    const [editorKey, setEditorKey] = useState(0);

    //from backend
    const [Complaint, setComplaint] = useState([]);
    const [paginated, setPaginated] = useState([]);

    const [editId, setEditId] = useState(null);


    const options = [
        { value: 'Admin', label: 'Admin' },
        { value: 'Anjali Patle ', label: 'Anjali Patle' },
        { value: 'Amit Kumar ', label: 'Amit Kumar ' },
        { value: 'Aniket Rane ', label: 'Aniket Rane ' },
        { value: 'Shubham Kadam ', label: 'Shubham Kadam ' },
        { value: 'Abhijieet Tawate ', label: 'Abhijieet Tawate ' },
        { value: 'Pravin Bildlan ', label: 'Pravin Bildlan ' },
        { value: 'Amit Pednekar ', label: 'Amit Pednekar ' },
        { value: 'Mahendra Chaudhary ', label: 'Mahendra Chaudhary ' },
        { value: 'Hamsa Dhwjaa ', label: 'Hamsa Dhwjaa ' },
        { value: 'Manoj Kumar Sinha ', label: 'Manoj Kumar Sinha ' },
    ];

    const [form, setForm] = useState({
        complaintFrom: '',
        complaintAgainst: [],
        complaintTitle: '',
        complaintDate: '',
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
        fetchComplaint();
    }, []);

    const fetchComplaint = async () => {
        try {
            const response = await getComplaint();
            setComplaint(response.data);
            paginate(response.data, currentPage);
        } catch (error) {
            console.error('Error fetching Complaint:', error);
        }
    };

    const validateField = (fieldName, value = "") => {
        let error = "";

        let displayName = fieldName
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, str => str.toUpperCase());

        value = value.toString();

        switch (fieldName) {
            case "complaintFrom":
                if (!value.trim()) error = `${displayName} is required`;
                break;

            case "complaintAgainst":
                if (!value.trim()) error = `${displayName} is required`;
                break;

            case "complaintTitle":
                if (!value.trim()) error = `${displayName} is required`;
                break;

            case "complaintDate":
                if (!value.trim()) error = `${displayName} is required`;
                break;

            case "approvalStatus":
                if (!value.trim()) error = `${displayName} is required`;
                break;

            case "description":
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


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {

            try {
                if (editId) {
                    await updateComplaint(editId, form);
                    toast.success("Complaint updated successfully!");

                } else {
                    await createComplaint(form);
                    toast.success("Complaint saved successfully!");

                }
                fetchComplaint();
                setForm({
                    complaintFrom: '',
                    complaintAgainst: [],
                    complaintTitle: '',
                    complaintDate: '',
                    approvalStatus: '',
                    description: ''
                });
                setEditId("");
                setShowEditModal(false);
            } catch (err) {
                console.error("Error saving Complaint:", err);
                toast.error("Complaint failed to save!");

            }
        }
    };



    const handleEdit = (row) => {
        setForm({
            complaintFrom: row.complaintFrom,
            complaintAgainst: row.compaintAgainst,
            complaintTitle: row.complaintTitle,
            complaintDate: row.complaintDate,
            approvalStatus: row.approvalStatus,
            description: row.description
        });
        setEditId(row._id);
        setShowEditModal(true);
        setSelectedRow(row);
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this Complaint?");
        if (!confirmDelete) return;
        try {
            await deleteComplaint(id);
            fetchComplaint();
        } catch (err) {
            console.error("Error deleting Complaint:", err);
        }
    };

    const emptyForm = {
        complaintFrom: '',
        complaintAgainst: [],
        complaintTitle: '',
        complaintDate: '',
        approvalStatus: '',
        description: ''
    };

    const resetForm = () => {
        setForm(emptyForm);
        setEditId(null);
        setShowEditModal(false);
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
        { name: 'Complaint From', selector: row => row.complaintFrom },
        { name: 'Complaint Against', selector: row => row.complaintAgainst },
        { name: 'Complaint Title', selector: row => row.complaintTitle },
        { name: 'Complaint Date', selector: row => row.complaintDate },
        { name: 'Approval Status', selector: row => row.approvalStatus }
    ];

    // const data = [
    //     {
    //         action: '-',
    //         complaintFrom: 'Shubham Kadam',
    //         compaintAgainst: '1.Aniket Rane 2.Shubham Kadam',
    //         compaintTitle: 'Test',
    //         compaintDate: '08-Apr-2022',
    //         approvalStatus: 'Accepted'
    //     },
    //     {
    //         action: '-',
    //         complaintFrom: 'Shubham Kadam',
    //         compaintAgainst: '1.Aniket Rane 2.Shubham Kadam',
    //         compaintTitle: 'Test',
    //         compaintDate: '08-Apr-2022',
    //         approvalStatus: 'Accepted'
    //     }, {
    //         action: '-',
    //         complaintFrom: 'Shubham Kadam',
    //         compaintAgainst: '1.Aniket Rane 2.Shubham Kadam',
    //         compaintTitle: 'Test',
    //         compaintDate: '08-Apr-2022',
    //         approvalStatus: 'Accepted'
    //     }, {
    //         action: '-',
    //         complaintFrom: 'Shubham Kadam',
    //         compaintAgainst: '1.Aniket Rane 2.Shubham Kadam',
    //         compaintTitle: 'Test',
    //         compaintDate: '08-Apr-2022',
    //         approvalStatus: 'Accepted'
    //     }, {
    //         action: '-',
    //         complaintFrom: 'Shubham Kadam',
    //         compaintAgainst: '1.Aniket Rane 2.Shubham Kadam',
    //         compaintTitle: 'Test',
    //         compaintDate: '08-Apr-2022',
    //         approvalStatus: 'Accepted'
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

    const totalEntries = Complaint.length;
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
            <h5>Complaints</h5>
            <p style={{ fontSize: '15px', color: 'rgb(98, 98, 98)' }}>
                <span style={{ color: 'red' }}>Home</span> / Complaints
            </p>


            {showAddForm && (
                <div className="card mb-3 form-slide-container">
                    <div className="card-header d-flex justify-content-between align-items-center text-white new-emp-bg">
                        <span>Add New Complaint</span>
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
                                        <label>Complaint From</label>
                                        <select id="rom" value={form.complaintFrom}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setForm({ ...form, complaintFrom: value });
                                                validateField("complaintFrom", value);
                                            }}
                                            className={`form-control ${errors.complaintFrom ? "is-invalid" : ""}`}
                                            onBlur={(e) => validateField("complaintFrom", e.target.value)}
                                        >
                                            <option value="">Complaint From</option>
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
                                        {errors.complaintFrom && (
                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>This field is required!</p>)}
                                    </div>

                                    <div className='row'>
                                        <div className="col-md-6 mb-3">
                                            <label>Complaint Title</label>
                                            <input type="text" value={form.complaintTitle}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, complaintTitle: value });
                                                    validateField("complaintTitle", value);
                                                }}
                                                className={`form-control ${errors.complaintTitle ? "is-invalid" : ""}`}
                                                placeholder="Promotion Title"
                                                onBlur={(e) => validateField("complaintTitle", e.target.value)}

                                            />
                                            {errors.complaintTitle && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Complaint Title is required!</p>)}
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label>Complaint Date</label>
                                            <input type="date" value={form.complaintDate}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, complaintDate: value });
                                                    validateField("complaintDate", value);
                                                }}
                                                className={`form-control ${errors.complaintDate ? "is-invalid" : ""}`}
                                                placeholder="Promotion Title"
                                                onBlur={(e) => validateField("complaintDate", e.target.value)}

                                            />
                                            {errors.complaintDate && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Complaint Date is required!</p>)}
                                        </div>
                                    </div>

                                    <div className='mb-3'>
                                        <label>Complaint Against</label>
                                        <Select
                                            isMulti
                                            options={options}
                                            value={options.filter(o => (form.complaintAgainst || []).includes(o.value))}
                                            onChange={(selectedOptions) => {
                                                const values = selectedOptions ? selectedOptions.map(option => option.value) : [];
                                                setForm({
                                                    ...form,
                                                    complaintAgainst: values
                                                });
                                                validateField("complaintAgainst", values);
                                            }}

                                            className={errors.complaintAgainst ? "is-invalid" : ""}
                                            onBlur={() => validateField("complaintAgainst", form.complaintAgainst)}
                                        />
                                        {errors.complaintAgainst && (
                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>
                                                Complaint Against is required!
                                            </p>
                                        )}
                                    </div>

                                </div>

                                {/* Right Column */}


                                <div className="col-md-6">
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
                                            <option value="Pending">Pending</option>
                                            <option value="Accepted">Accepted</option>
                                            <option value="Rejected">Rejected</option>
                                        </select>
                                        {errors.approvalStatus && (
                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Approval Status is required!</p>)}
                                    </div>

                                    <label>Description</label>
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
                    <span>List All Complaints</span>
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
                                    <h5 className="modal-title">View Complaint</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setShowModal(false)}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <p><strong>Complaint From:</strong> {selectedRow.complaintFrom}</p>
                                    <p><strong>Complaint Title:</strong> {selectedRow.complaintTitle}</p>
                                    <p><strong>Complaint Date:</strong> {selectedRow.complaintDate}</p>
                                    <p><strong>Complaint Against:</strong> {selectedRow.complaintAgainst}</p>
                                    <p><strong>Status:</strong> {selectedRow.approvalStatus}</p>
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
                                        <h5 className="modal-title">Edit Complaint</h5>
                                        <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                                    </div>
                                    <div className="modal-body">
                                        <form onSubmit={handleSubmit}>
                                            <div className="row">
                                                {/* Left Column */}
                                                <div className="col-md-6">
                                                    <div className="mb-3">
                                                        <label>Complaint From</label>
                                                        <select id="rom" value={form.complaintFrom}
                                                            onChange={(e) => {
                                                                const { value } = e.target;
                                                                setForm({ ...form, complaintFrom: value });
                                                                validateField("complaintFrom", value);
                                                            }}
                                                            className={`form-control ${errors.complaintFrom ? "is-invalid" : ""}`}
                                                            onBlur={(e) => validateField("complaintFrom", e.target.value)}
                                                        >
                                                            <option value="">Complaint From</option>
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
                                                        {errors.complaintFrom && (
                                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>This field is required!</p>)}
                                                    </div>

                                                    <div className='row'>
                                                        <div className="col-md-6 mb-3">
                                                            <label>Complaint Title</label>
                                                            <input type="text" value={form.complaintTitle}
                                                                onChange={(e) => {
                                                                    const { value } = e.target;
                                                                    setForm({ ...form, complaintTitle: value });
                                                                    validateField("complaintTitle", value);
                                                                }}
                                                                className={`form-control ${errors.complaintTitle ? "is-invalid" : ""}`}
                                                                placeholder="Promotion Title"
                                                                onBlur={(e) => validateField("complaintTitle", e.target.value)}

                                                            />
                                                            {errors.complaintTitle && (
                                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Complaint Title is required!</p>)}
                                                        </div>

                                                        <div className="col-md-6 mb-3">
                                                            <label>Complaint Date</label>
                                                            <input type="date" value={form.complaintDate}
                                                                onChange={(e) => {
                                                                    const { value } = e.target;
                                                                    setForm({ ...form, complaintDate: value });
                                                                    validateField("complaintDate", value);
                                                                }}
                                                                className={`form-control ${errors.complaintDate ? "is-invalid" : ""}`}
                                                                placeholder="Promotion Title"
                                                                onBlur={(e) => validateField("complaintDate", e.target.value)}

                                                            />
                                                            {errors.complaintDate && (
                                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Complaint Date is required!</p>)}
                                                        </div>
                                                    </div>

                                                    <div className='mb-3'>
                                                        <label>Complaint Against</label>
                                                        <Select
                                                            isMulti
                                                            options={options}
                                                            value={options.filter(o => (form.complaintAgainst || []).includes(o.value))}
                                                            onChange={(selectedOptions) => {
                                                                const values = selectedOptions ? selectedOptions.map(option => option.value) : [];
                                                                setForm({
                                                                    ...form,
                                                                    complaintAgainst: values
                                                                });
                                                                validateField("complaintAgainst", values);
                                                            }}
                                                            className={errors.complaintAgainst ? "is-invalid" : ""}
                                                            onBlur={() => validateField("complaintAgainst", form.complaintAgainst)}
                                                        />
                                                        {errors.complaintAgainst && (
                                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>
                                                                Complaint Against is required!
                                                            </p>
                                                        )}
                                                    </div>

                                                </div>

                                                {/* Right Column */}


                                                <div className="col-md-6">
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
                                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Approval Status is required!</p>)}
                                                    </div>

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
                                                        onBlur={() => validateField("comment", form.comment)}
                                                    />
                                                    {errors.comment && (
                                                        <p className="text-danger mb-0" style={{ fontSize: '13px' }}>
                                                            Comment is Required
                                                        </p>
                                                    )}
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

export default Complaints;
