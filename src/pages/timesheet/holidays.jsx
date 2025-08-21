import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
// import './organization.css';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { getHoliday, createHoliday, updateHoliday, deleteHoliday } from '../../api/holidaysApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Placeholder } from 'react-bootstrap';

const Holidays = () => {

    const [showModal, setShowModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [description, setDescription] = useState('');
    //from backend
    const [Holiday, setHoliday] = useState([]);
    const [paginated, setPaginated] = useState([]);

    const [editId, setEditId] = useState(null);

    const [form, setForm] = useState({
        location: '',
        eventName: '',
        status: '',
        startDate: '',
        endDate: '',
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
        fetchHoliday();
    }, []);

    const fetchHoliday = async () => {
        try {
            const response = await getHoliday();
            setHoliday(response.data);
            paginate(response.data, currentPage);
        } catch (error) {
            console.error('Error fetching Holiday:', error);
        }
    };


    const validateField = (fieldName, value = "") => {
        let error = "";

        let displayName = fieldName
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, str => str.toUpperCase());

        value = value.toString();

        switch (fieldName) {
            case "location":
                if (!value.trim()) error = `${displayName} is required`;
                break;

            case "eventName":
                if (!value.trim()) error = `${displayName} is required`;
                break;

            case "status":
                if (!value.trim()) error = `${displayName} is required`;
                break;

            case "startDate":
                if (!value.trim()) error = `${displayName} is required`;
                break;

            case "endDate":
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


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {

            try {
                if (editId) {
                    await updateHoliday(editId, form);
                    toast.success("Holiday updated successfully!");

                } else {
                    await createHoliday(form);
                    toast.success("Holiday saved successfully!");

                }
                fetchHoliday();
                setForm({
                    location: '',
                    eventName: '',
                    status: '',
                    startDate: '',
                    endDate: '',
                    description: ''
                });
                setEditId("");
                setShowEditModal(false);
            } catch (err) {
                console.error("Error saving Holiday:", err);
                toast.error("Holiday failed to save!");

            }
        }
    };

    const emptyForm = {
        location: '',
        eventName: '',
        status: '',
        startDate: '',
        endDate: '',
        description: ''
    };

    const resetForm = () => {
        setForm(emptyForm);
        setEditId(null);
        setShowEditModal(false);
    };

    const handleEdit = (row) => {
        setForm({
            location: row.location,
            eventName: row.eventName,
            status: row.status,
            startDate: row.startDate,
            endDate: row.endDate,
            description: row.description
        });
        setEditId(row._id);
        setShowEditModal(true);
        setSelectedRow(row);
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this Holiday?");
        if (!confirmDelete) return;
        try {
            await deleteHoliday(id);
            fetchHoliday();
        } catch (err) {
            console.error("Error deleting Holiday:", err);
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

                    {/* <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => handleView(row)}
                    >
                        <i className="fas fa-clock"></i>
                    </button> */}
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
        { name: 'Location', selector: row => row.location, sortable: true },
        { name: 'Event Name', selector: row => row.eventName },
        { name: 'Status', selector: row => row.status },
        { name: 'Start Date', selector: row => row.startDate },
        { name: 'End Date', selector: row => row.endDate }

    ];

    // const data = [
    //     {
    //         action: '-',
    //         location: 'Bangalore',
    //         eventName: 'Festival',
    //         status: 'Published',
    //         startDate: '13-Apr-2017',
    //         endDate: '14-Apr-2017'
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

    const totalEntries = Holiday.length;
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
            <h5>Holidays</h5>
            <p style={{ fontSize: '15px', color: 'rgb(98, 98, 98)' }}>
                <span style={{ color: 'red' }}>Home</span> / Holidays
            </p>


            {showAddForm && (
                <div className="card mb-3 form-slide-container">
                    <div className="card-header d-flex justify-content-between align-items-center text-white new-emp-bg">
                        <span>Add New Holiday</span>
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
                                        <label>Location</label>
                                        <select id="location" value={form.location}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setForm({ ...form, location: value });
                                                validateField("location", value);
                                            }}
                                            className={`form-control ${errors.location ? "is-invalid" : ""}`}
                                            onBlur={(e) => validateField("location", e.target.value)}
                                        >
                                            <option value="All">All</option>
                                            <option value="Head Office - Mumbai">Head Office - Mumbai</option>
                                            <option value="Bangalore">Bangalore</option>
                                        </select>
                                        {errors.location && (
                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Location is required!</p>)}
                                    </div>

                                    <div className="mb-3">
                                        <label>Event Name</label>
                                        <input type="text" value={form.eventName} Placeholder="Event Name"
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setForm({ ...form, eventName: value });
                                                validateField("eventName", value);
                                            }}
                                            className={`form-control ${errors.eventName ? "is-invalid" : ""}`}
                                            onBlur={(e) => validateField("eventName", e.target.value)}

                                        />
                                        {errors.eventName && (
                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Event Name is required!</p>)}
                                    </div>

                                    <div className='row'>
                                        <div className="col-md-6 mb-3">
                                            <label>Start Date</label>
                                            <input type="date" value={form.startDate}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, startDate: value });
                                                    validateField("startDate", value);
                                                }}
                                                className={`form-control ${errors.startDate ? "is-invalid" : ""}`}
                                                onBlur={(e) => validateField("startDate", e.target.value)}

                                            />
                                            {errors.startDate && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Start date is required!</p>)}
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
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>End date is required!</p>)}
                                        </div>
                                    </div>

                                    <div className="mb-3">
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
                                            <option value="">Select Status</option>
                                            <option value="published">Published</option>
                                            <option value="unpublished">Unpublished</option>
                                        </select>
                                        {errors.status && (
                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Status is required!</p>)}
                                    </div>

                                </div>

                                {/* Right Column */}
                                <div className="col-md-6">


                                    <div className="mb-3">
                                        <label>Description</label>
                                        <CKEditor
                                            editor={ClassicEditor}
                                            data={description}
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

                            <div className="text-start mb-2">
                                <button type="submit" className="btn btn-sm add-btn">Save</button>
                            </div>
                        </form>

                    </div>

                </div>
            )}



            <div className="card no-radius">
                <div className="card-header d-flex justify-content-between align-items-center text-white new-emp-bg">
                    <span>List Holidays</span>
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



                {showEditModal && selectedRow && (
                    <>

                        <div className="custom-backdrop"></div>
                        <div className="modal show fade d-block" tabIndex="-1">
                            <div className="modal-dialog modal-dialog-centered edit-modal">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Edit Holiday</h5>
                                        <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                                    </div>
                                    <div className="modal-body">
                                        <form onSubmit={handleSubmit}>
                                            <div className="row">
                                                {/* Left Column */}
                                                <div className="col-md-6">
                                                    <div className="mb-3">
                                                        <label>Location</label>
                                                        <select id="location" value={form.location}
                                                            onChange={(e) => {
                                                                const { value } = e.target;
                                                                setForm({ ...form, location: value });
                                                                validateField("location", value);
                                                            }}
                                                            className={`form-control ${errors.location ? "is-invalid" : ""}`}
                                                            onBlur={(e) => validateField("location", e.target.value)}
                                                        >
                                                            <option value="All">All</option>
                                                            <option value="Head Office - Mumbai">Head Office - Mumbai</option>
                                                            <option value="Bangalore">Bangalore</option>
                                                        </select>
                                                        {errors.location && (
                                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Location is required!</p>)}
                                                    </div>

                                                    <div className="mb-3">
                                                        <label>Event Name</label>
                                                        <input type="text" value={form.eventName}
                                                            onChange={(e) => {
                                                                const { value } = e.target;
                                                                setForm({ ...form, eventName: value });
                                                                validateField("eventName", value);
                                                            }}
                                                            className={`form-control ${errors.eventName ? "is-invalid" : ""}`}
                                                            onBlur={(e) => validateField("eventName", e.target.value)}

                                                        />
                                                        {errors.eventName && (
                                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Event Name is required!</p>)}
                                                    </div>

                                                    <div className='row'>
                                                        <div className="col-md-6 mb-3">
                                                            <label>Start Date</label>
                                                            <input type="date" value={form.startDate}
                                                                onChange={(e) => {
                                                                    const { value } = e.target;
                                                                    setForm({ ...form, startDate: value });
                                                                    validateField("startDate", value);
                                                                }}
                                                                className={`form-control ${errors.startDate ? "is-invalid" : ""}`}
                                                                onBlur={(e) => validateField("startDate", e.target.value)}

                                                            />
                                                            {errors.startDate && (
                                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Start date is required!</p>)}
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
                                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>End date is required!</p>)}
                                                        </div>
                                                    </div>

                                                    <div className="mb-3">
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
                                                            <option value="">Select Status</option>
                                                            <option value="published">Published</option>
                                                            <option value="unpublished">Unpublished</option>
                                                        </select>
                                                        {errors.status && (
                                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Status is required!</p>)}
                                                    </div>

                                                </div>

                                                {/* Right Column */}
                                                <div className="col-md-6">


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

export default Holidays;
