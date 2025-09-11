import React, { useState, useEffect, useRef } from 'react';
import DataTable from 'react-data-table-component';
import './organization.css';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { getAnnouncement, createAnnouncement, updateAnnouncement, deleteAnnouncement } from '../../api/announcementApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Announcements = () => {

    const [showModal, setShowModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [description, setDescription] = useState('');
    const [editId, setEditId] = useState(null);

    const editorRef = useRef(null);
    const [editorKey, setEditorKey] = useState(0);
    //from backend
    const [announcement, setAnnouncement] = useState([]);
    // const [paginated, setPaginated] = useState([]);


    const [form, setForm] = useState({
        title: '',
        summary: '',
        publishedFor: '',
        startDate: '',
        endDate: '',
        publishedBy: '',
        description: '',
        company: '',
        location: ''
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
        fetchAnnouncement();
    }, []);

    const fetchAnnouncement = async () => {
        try {
            const response = await getAnnouncement();
            setAnnouncement(response.data);
            paginate(response.data, currentPage);
        } catch (error) {
            console.error('Error fetching Announcement:', error);
        }
    };

    const emptyForm = {
        title: '',
        summary: '',
        publishedFor: '',
        startDate: '',
        endDate: '',
        publishedBy: '',
        description: '',
        company: '',
        location: ''
    };

    const resetForm = () => {
        setForm(emptyForm);
        setEditId(null);
        setShowEditModal(false);
    };

    const validateField = (fieldName, value = "") => {
        let error = "";

        const displayName = fieldName
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, str => str.toUpperCase());

        value = value.toString();

        switch (fieldName) {
            case "title": {
                const displayName = "Announcement";
                if (!value.trim()) {
                    error = `${displayName} is required`;
                } else if (!/^[A-Za-z\s]+$/.test(value)) {
                    error = `${displayName} must contain only letters`;
                }
                break;
            }


            case "publishedFor":
                if (!value.trim()) error = `${displayName} is required`;
                break;

            case "startDate":
                if (!value.trim()) error = `${displayName} is required`;
                break;

            case "endDate":
                if (!value.trim()) error = `${displayName} is required`;
                break;

            case "company":
                if (!value.trim()) error = `${displayName} is required`;
                break;

            case "location":
                if (!value.trim()) error = `${displayName} is required`;
                break;

            case "publishedBy":
                if (!value.trim()) error = `${displayName} is required`;
                break;

            case "description":
                if (!value.trim()) error = `${displayName} is required`;
                break;

            case "summary":
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
                    await updateAnnouncement(editId, form);
                    toast.success("Announcement updated successfully!");
                    setEditId(null);
                } else {
                    await createAnnouncement(form);
                    toast.success("Announcement saved successfully!");
                }
                fetchAnnouncement();
                setForm({
                    title: '', summary: '', publishedFor: '', startDate: '', endDate: '', publishedBy: '', description: '',
                    company: '',
                    location: ''
                });
                setEditId("");
                setShowEditModal(false);
            } catch (err) {
                console.error("Error saving Announcement:", err);
                toast.error("Failed to save announcement!");
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
            title: row.title,
            summary: row.summary,
            publishedFor: row.publishedFor,
            startDate: row.startDate,
            endDate: row.endDate,
            publishedBy: row.publishedBy,
            description: row.description,
            company: row.company,
            location: row.location
        });
        setShowEditModal(true);
        setSelectedRow(row);
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this Announcement?");
        if (!confirmDelete) return;
        try {
            await deleteAnnouncement(id);
            fetchAnnouncement();
        } catch (err) {
            console.error("Error deleting Announcement:", err);
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
        { name: 'Title', selector: row => row.title, sortable: true },
        { name: 'Summary', selector: row => row.summary },
        { name: 'Published For', selector: row => row.publishedFor },
        { name: 'Start Date', selector: row => row.startDate },
        { name: 'End Date', selector: row => row.endDate },
        { name: 'Published By', selector: row => row.publishedBy },
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

    const totalEntries = announcement.length;
    const totalPages = Math.ceil(totalEntries / rowsPerPage);
    const [paginated, setPaginated] = useState(announcement.slice(0, rowsPerPage));

    const paginate = (data, page) => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        setPaginated(data.slice(start, end));
        setCurrentPage(page);
    };

    const startEntry = (currentPage - 1) * rowsPerPage + 1;
    const endEntry = Math.min(currentPage * rowsPerPage, announcement.length);
    useEffect(() => {
        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        setPaginated(announcement.slice(start, end));
    }, [announcement, currentPage, rowsPerPage]);

    const [showAddForm, setShowAddForm] = useState(false);

    const toggleAddForm = () => {
        setShowAddForm((prev) => !prev);
    };

    return (
        <div className="custom-container">
            <h5>Announcements</h5>
            <p style={{ fontSize: '15px', color: 'rgb(98, 98, 98)' }}>
                <span style={{ color: 'red' }}>Home</span> / Announcements
            </p>


            {showAddForm && (
                <div className="card mb-3 form-slide-container">
                    <div className="card-header d-flex justify-content-between align-items-center text-white new-emp-bg">
                        <span>Add New Announcement</span>
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
                                        <label>Title</label>
                                        <input
                                            type="text"
                                            value={form.title}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setForm({ ...form, title: value });
                                                validateField("title", value);
                                            }}
                                            className={`form-control ${errors.title ? "is-invalid" : ""}`}
                                            placeholder="Name"
                                            onBlur={(e) => validateField("title", e.target.value)}

                                        />
                                        {errors.title && (
                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>
                                                Title is Required!
                                            </p>
                                        )}
                                    </div>

                                    <div className='row'>
                                        <div className="col-md-6 mb-3">
                                            <label>Start Date</label>
                                            <input
                                                type="date"
                                                value={form.startDate}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, startDate: value });
                                                    validateField("startDate", value);
                                                }}
                                                className={`form-control ${errors.startDate ? "is-invalid" : ""}`}
                                                placeholder="Name"
                                                onBlur={(e) => validateField("startDate", e.target.value)}

                                            />
                                            {errors.startDate && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>
                                                    Start Date is required!
                                                </p>
                                            )}
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label>End Date</label>
                                            <input
                                                type="date"
                                                value={form.endDate}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, endDate: value });
                                                    validateField("endDate", value);
                                                }}
                                                className={`form-control ${errors.endDate ? "is-invalid" : ""}`}
                                                placeholder="Name"
                                                onBlur={(e) => validateField("endDate", e.target.value)}

                                            />
                                            {errors.endDate && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>
                                                    End Date is required!
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className="mb-3">
                                            <label>Company</label>
                                            <select
                                                value={form.company}
                                                onChange={(e) =>
                                                    setForm({ ...form, company: e.target.value, location: "" })
                                                }
                                                onBlur={(e) => validateField("company", e.target.value)}
                                                className={`form-control ${errors.company ? "is-invalid" : ""}`}
                                            >
                                                <option value="">Select Company</option>
                                                <option value="UBI Services Ltd.">UBI Services Ltd.</option>
                                            </select>
                                            {errors.company && (
                                                <p className="text-danger mb-0" style={{ fontSize: "13px" }}>
                                                    Company Name is required!
                                                </p>
                                            )}
                                        </div>

                                        <div className="mb-3">
                                            <label>Location</label>
                                            <select
                                                value={form.location}
                                                onChange={(e) => setForm({ ...form, location: e.target.value })}
                                                onBlur={(e) => validateField("location", e.target.value)}
                                                className={`form-control ${errors.location ? "is-invalid" : ""}`}
                                            >
                                                <option value="">Select Location</option>
                                                {form.company === "UBI Services Ltd." && (
                                                    <>
                                                        <option value="Head Office - Mumbai">Head Office - Mumbai</option>
                                                        <option value="Bangalore">Bangalore</option>
                                                    </>
                                                )}
                                            </select>
                                            {errors.location && (
                                                <p className="text-danger mb-0" style={{ fontSize: "13px" }}>
                                                    Location is required!
                                                </p>
                                            )}
                                        </div>

                                    </div>

                                    <div className="mb-3">
                                        <label>Department</label>
                                        <select
                                            value={form.publishedFor}
                                            onChange={(e) => setForm({ ...form, publishedFor: e.target.value })}
                                            onBlur={(e) => validateField("publishedFor", e.target.value)}
                                            className={`form-control ${errors.publishedFor ? "is-invalid" : ""}`}
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
                                        {errors.publishedFor && <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Department is required!</p>}
                                    </div>

                                    <div className="mb-3">
                                        <label>Published By</label>
                                        <select
                                            value={form.publishedBy}
                                            onChange={(e) => setForm({ ...form, publishedBy: e.target.value })}
                                            onBlur={(e) => validateField("publishedBy", e.target.value)}
                                            className={`form-control ${errors.publishedBy ? "is-invalid" : ""}`}
                                        >
                                            <option value="">Published By</option>
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
                                        {errors.publishedBy && <p className="text-danger mb-0" style={{ fontSize: '13px' }}>This Field is Required!</p>}
                                    </div>

                                </div>

                                {/* Right Column */}
                                <div className="col-md-6">

                                    <div className="mb-3">
                                        <label>Summary</label>
                                        <textarea
                                            rows="3"
                                            value={form.summary}
                                            onChange={(e) => setForm({ ...form, summary: e.target.value })}
                                            onBlur={(e) => validateField("summary", e.target.value)}
                                            className={`form-control ${errors.summary ? "is-invalid" : ""}`}
                                        />
                                        {errors.summary && <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Summary is Required!</p>}
                                    </div>

                                    <div className="mb-3">
                                        <label>Description</label>
                                        <div className={errors.description ? "is-invalid" : ""}>
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
                                        </div>
                                        {errors.description && (
                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>
                                                Description is Required!
                                            </p>
                                        )}
                                    </div>

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
                    <span>List All Announcements</span>
                    <button className="btn btn-sm add-btn" onClick={toggleAddForm}>{showAddForm ? '- Hide' : '+ Add New'}</button>
                </div>


                <div className="px-3">
                    <div className="d-flex justify-content-between align-items-center mb-2 mt-3">
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
                                    <h5 className="modal-title">View Announcements</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setShowModal(false)}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <p><strong>Title:</strong> {selectedRow.title}</p>
                                    <p><strong>Start Date:</strong> {selectedRow.startDate}</p>
                                    <p><strong>End Date:</strong> {selectedRow.startDate}</p>

                                    <p>
                                        <strong>Company:</strong> {(selectedRow?.company || '').replace(/<[^>]+>/g, '')}
                                    </p>

                                    <p>
                                        <strong>Location:</strong> {(selectedRow?.location || '').replace(/<[^>]+>/g, '')}
                                    </p>


                                    <p><strong>Department:</strong> {selectedRow.publishedFor}</p>
                                    <p><strong>Summary:</strong> {selectedRow.summary}</p>

                                    <p>
                                        <strong>Description:</strong> {(selectedRow?.description || '').replace(/<[^>]+>/g, '')}
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
                                        <h5 className="modal-title">Edit Announcement</h5>
                                        <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                                    </div>
                                    <div className="modal-body">
                                        <form onSubmit={handleSubmit}>
                                            <div className="row">
                                                {/* Left Column */}
                                                <div className="col-md-6">
                                                    <div className="mb-3">
                                                        <label>Title</label>
                                                        <input type="text" className="form-control" value={form.title}
                                                            onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" />
                                                        {errors.title && (
                                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Title is required!</p>)}
                                                    </div>

                                                    <div className="col-md-12">
                                                        <div className="mb-3">
                                                            <label>Published For</label>
                                                            <select id="locationHead" value={form.publishedFor}
                                                                onChange={(e) => setForm({ ...form, publishedFor: e.target.value })} className="form-control">
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
                                                            {errors.publishedFor && (
                                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Department is required!</p>)}
                                                        </div>
                                                    </div>

                                                    <div className='row'>
                                                        <div className="col-md-6 mb-3">
                                                            <label>Start Date</label>
                                                            <input type="text" className="form-control" value={form.startDate}
                                                                onChange={(e) => setForm({ ...form, startDate: e.target.value })} placeholder="Start Date" />
                                                            {errors.startDate && (
                                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Start Date is required!</p>)}
                                                        </div>

                                                        <div className="col-md-6 mb-3">
                                                            <label>End Date</label>
                                                            <input type="text" className="form-control" value={form.endDate}
                                                                onChange={(e) => setForm({ ...form, endDate: e.target.value })} placeholder="End Date" />
                                                            {errors.endDate && (
                                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>End Date is required!</p>)}
                                                        </div>
                                                    </div>

                                                    <div className='row'>
                                                        <div className="col-md-6 mb-3">
                                                            <label>Company</label>
                                                            <select id="company" className="form-control"
                                                                value={form.company}
                                                                onChange={(e) => setForm({ ...form, company: e.target.value })}>
                                                                {/* <option value="">Company</option> */}
                                                                <option value="UBI Services Ltd.">UBI Services Ltd.</option>
                                                            </select>
                                                            {errors.company && (
                                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Company Name is required!</p>)}
                                                        </div>

                                                        <div className="col-md-6 mb-3">
                                                            <label>Location</label>
                                                            <select id="location" className="form-control"
                                                                value={form.location}
                                                                onChange={(e) => setForm({ ...form, location: e.target.value })}>
                                                                {/* <option value="">Location</option> */}
                                                                <option value="mumbai">Head Office - Mumbai</option>
                                                                <option value="bangalore">Bangalore</option>
                                                            </select>
                                                            {errors.location && (
                                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Location is required!</p>)}
                                                        </div>
                                                    </div>

                                                    <div className="mb-3">
                                                        <label>Published By</label>
                                                        <select id="publishedBy" value={form.publishedBy}
                                                            onChange={(e) => setForm({ ...form, publishedBy: e.target.value })} className="form-control">
                                                            <option value="">Published By</option>
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
                                                        {errors.publishedBy && (
                                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>This field is required!</p>)}
                                                    </div>

                                                </div>

                                                {/* Right Column */}


                                                <div className="col-md-6">
                                                    <label htmlFor="summary">Summary</label>
                                                    <textarea
                                                        id="summary"
                                                        className="form-control mb-2"
                                                        rows="3"
                                                        value={form.summary || ""}
                                                        onChange={(e) =>
                                                            setForm({
                                                                ...form,
                                                                summary: e.target.value
                                                            })
                                                        }
                                                    />
                                                    {errors.description && (
                                                        <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Summary is required!</p>)}

                                                    <div className="mb-3">
                                                        <label>Description</label>
                                                        <CKEditor
                                                            editor={ClassicEditor}
                                                            data={form.description}
                                                            onChange={(event, editor) => {
                                                                const newData = editor.getData();
                                                                setForm({ ...form, description: newData });
                                                            }}
                                                        />
                                                        {errors.description && (
                                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Description is required!</p>)}
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

export default Announcements;
