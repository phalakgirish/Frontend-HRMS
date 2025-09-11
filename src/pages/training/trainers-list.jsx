import React, { useState, useEffect, useRef } from 'react';
import DataTable from 'react-data-table-component';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { getTrainersList, createTrainersList, updateTrainersList, deleteTrainersList } from '../../api/trainersListApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const TrainersList = () => {

    const [showModal, setShowModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [description, setDescription] = useState('');
    const editorRef = useRef(null);
    const [editorKey, setEditorKey] = useState(0);

    //from backend
    const [TrainersList, setTrainersList] = useState([]);
    // const [paginated, setPaginated] = useState([]);

    const [editId, setEditId] = useState(null);

    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        contactNo: '',
        email: '',
        designation: '',
        expertise: '',
        address: ''
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
        fetchTrainersList();
    }, []);

    const fetchTrainersList = async () => {
        try {
            const response = await getTrainersList();
            setTrainersList(response.data);
            paginate(response.data, currentPage);
        } catch (error) {
            console.error('Error fetching TrainersList:', error);
        }
    };

    const validateField = (fieldName, value = "") => {
        let error = "";

        switch (fieldName) {
            case "firstName":
                if (!value.trim()) {
                    error = "First Name is required";
                } else if (!/^[A-Za-z\s]+$/.test(value)) {
                    error = "First Name must contain only letters";
                }
                break;

            case "lastName":
                if (!value.trim()) {
                    error = "Last Name is required";
                } else if (!/^[A-Za-z\s]+$/.test(value)) {
                    error = "Last Name must contain only letters";
                }
                break;

            case "email":
                if (!value.trim()) {
                    error = "Email is required";
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    error = "Invalid email format";
                }
                break;

            case "contactNo":
                if (!value.trim()) {
                    error = "Contact No is required";
                } else if (!/^\d{10}$/.test(value)) {
                    error = "Contact No must be 10 digits";
                }
                break;

            case "designation":
                if (!value.trim()) {
                    error = "Designation is required";
                }
                break;

            case "address":
                if (!value.trim()) {
                    error = "Address is required";
                }
                break;

            case "description":
                if (!value.trim()) {
                    error = "Description is required";
                }
                break;

            default:
                break;
        }

        setErrors((prev) => ({ ...prev, [fieldName]: error }));
        return !error; // true if valid
    };




    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                if (editId) {
                    await updateTrainersList(editId, form);
                    toast.success("Trainers List updated successfully!");

                } else {
                    await createTrainersList(form);
                    toast.success("Trainers List saved successfully!");

                }
                fetchTrainersList();
                setForm({
                    firstName: '',
                    lastName: '',
                    contactNo: '',
                    email: '',
                    designation: '',
                    expertise: '',
                    address: ''
                });
                setEditId("");
                setShowEditModal(false);
            } catch (err) {
                console.error("Error saving TrainersList:", err);
                toast.error("Trainers List failed to save!");

            }
        }
    };

    const emptyForm = {
        firstName: '',
        lastName: '',
        contactNo: '',
        email: '',
        designation: '',
        expertise: '',
        address: ''
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

    const handleEdit = (row) => {
        setForm({
            firstName: row.firstName,
            lastName: row.lastName,
            contactNo: row.contactNo,
            email: row.email,
            designation: row.designation,
            expertise: row.expertise,
            address: row.address
        });
        setEditId(row._id);
        setShowEditModal(true);
        setSelectedRow(row);
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this Trainers List?");
        if (!confirmDelete) return;
        try {
            await deleteTrainersList(id);
            fetchTrainersList();
        } catch (err) {
            console.error("Error deleting TrainersList:", err);
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

        {
            name: 'Full Name',
            selector: row => `${row.firstName} ${row.lastName}`
        },
        { name: 'Designation', selector: row => row.designation },
        { name: 'Contact Number', selector: row => row.contactNo },
        { name: 'Email', selector: row => row.email },
        { name: 'Adderess', selector: row => row.address }

    ];

    // const data = [
    //     {
    //         action: '-',
    //         fullname: 'girish Phalak	',
    //         designantion: 'Asst. Dealer',
    //         contactNo: '+918879679180',
    //         email: 'phalak.girish@gmail.com	',
    //         address: 'Imperial Heights'
    //     },

    // ];

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
                whiteSpace: 'normal', // allow text to wrap
                wordBreak: 'break-word',
            },
        },
    };


    const conditionalRowStyles = [
        {
            when: (row, index) => index % 2 === 0,
            style: {
                backgroundColor: 'white',
                minHeight: '60px', // ensure taller row
                paddingTop: '10px',
                paddingBottom: '10px',
                whiteSpace: 'normal', // wrap text
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

    const totalEntries = TrainersList.length;
    const totalPages = Math.ceil(totalEntries / rowsPerPage);
     const [paginated, setPaginated] = useState(TrainersList.slice(0, rowsPerPage));
   
       const paginate = (data, page) => {
           const start = (page - 1) * rowsPerPage;
           const end = start + rowsPerPage;
           setPaginated(data.slice(start, end));
           setCurrentPage(page);
       };
   
       const startEntry = (currentPage - 1) * rowsPerPage + 1;
       const endEntry = Math.min(currentPage * rowsPerPage, TrainersList.length);
       useEffect(() => {
           const start = (currentPage - 1) * rowsPerPage;
           const end = start + rowsPerPage;
           setPaginated(TrainersList.slice(start, end));
       }, [TrainersList, currentPage, rowsPerPage]);
    const [showAddForm, setShowAddForm] = useState(false);

    const toggleAddForm = () => {
        setShowAddForm((prev) => !prev);
    };

    return (
        <div className="custom-container">
            <h5>Trainers List</h5>
            <p style={{ fontSize: '15px', color: 'rgb(98, 98, 98)' }}>
                <span style={{ color: 'red' }}>Home</span> / Trainers List
            </p>


            {showAddForm && (
                <div className="card mb-3 form-slide-container">
                    <div className="card-header d-flex justify-content-between align-items-center text-white new-emp-bg">
                        <span>Add New Training</span>
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
                                            <input
                                                type="text"
                                                value={form.firstName}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, firstName: value });
                                                    validateField("firstName", value);
                                                }}
                                                className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
                                                placeholder="First Name"
                                                onBlur={(e) => validateField("firstName", e.target.value)}

                                            />
                                            {errors.firstName && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.firstName}</p>
                                            )}
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label>Last Name</label>
                                            <input
                                                type="text"
                                                value={form.lastName}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, lastName: value });
                                                    validateField("lastName", value);
                                                }}
                                                className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
                                                placeholder="Last Name"
                                                onBlur={(e) => validateField("lastName", e.target.value)}

                                            />
                                            {errors.lastName && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.lastName}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className="col-md-6 mb-3">
                                            <label>Contact Number</label>
                                            <input
                                                type="text"
                                                value={form.contactNo}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, contactNo: value });
                                                    validateField("contactNo", value);
                                                }}
                                                className={`form-control ${errors.contactNo ? "is-invalid" : ""}`}
                                                placeholder="Contact Number"
                                                onBlur={(e) => validateField("contactNo", e.target.value)}

                                            />
                                            {errors.contactNo && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.contactNo}</p>
                                            )}
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label>Email</label>
                                            <input
                                                type="text"
                                                value={form.email}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, email: value });
                                                    validateField("email", value);
                                                }}
                                                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                                                placeholder="Email"
                                                onBlur={(e) => validateField("email", e.target.value)}

                                            />
                                            {errors.email && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}> Email is Required!</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-12 mb-3">
                                            <label>Designation</label>
                                            <select
                                                value={form.designation}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, designation: value });
                                                    validateField("designation", value);
                                                }}
                                                className={`form-control ${errors.designation ? "is-invalid" : ""}`}
                                                onBlur={(e) => validateField("designation", e.target.value)}
                                            >
                                                <option value="">designation</option>
                                                <option value="Asst. Dealer">Asst. Dealer</option>
                                            </select>

                                            {errors.designation && (
                                                <p className="text-danger mb-0" style={{ fontSize: "13px" }}>
                                                    Designation is Required!
                                                </p>
                                            )}
                                        </div>
                                    </div>


                                </div>

                                {/* Right Column */}
                                <div className="col-md-6">

                                    <div className="col-md-12 mb-3">
                                        <label>Expertise</label>
                                        <CKEditor
                                            key={editorKey}
                                            editor={ClassicEditor}
                                            data={form.expertise}
                                            onReady={(editor) => {
                                                editorRef.current = editor;
                                            }}
                                            onChange={(event, editor) => {
                                                const newData = editor.getData();
                                                setForm(prev => ({ ...prev, expertise: newData }));
                                            }}
                                        />
                                        {errors.expertise && (
                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>
                                                Expertise is Required!
                                            </p>
                                        )}
                                    </div>

                                </div>

                                <div className="col-md-12 mb-3">
                                    <label htmlFor="address">Address</label>
                                    <textarea
                                        id="address"
                                        rows="3"
                                        value={form.address}
                                        onChange={(e) => {
                                            const { value } = e.target;
                                            setForm({ ...form, address: value });
                                            validateField("address", value);
                                        }}
                                        className={`form-control ${errors.address ? "is-invalid" : ""}`}
                                        placeholder="Enter Address"
                                        onBlur={(e) => validateField("address", e.target.value)}
                                    ></textarea>

                                    {errors.address && (
                                        <p className="text-danger mb-0" style={{ fontSize: "13px" }}>
                                            Address is Required!
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
                    <span>List All Training</span>
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
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Trainers List</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setShowModal(false)}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <p><strong>First Name:</strong> {selectedRow.firstName}</p>
                                    <p><strong>Last Name:</strong> {selectedRow.lastName}</p>
                                    <p><strong>Contact Number:</strong> {selectedRow.contactNo}</p>
                                    <p><strong>Email:</strong> {selectedRow.email}</p>
                                    <p><strong>Designation:</strong> {selectedRow.designation}</p>
                                    <p><strong>Expertise:</strong> {selectedRow.expertise}</p>
                                    <p><strong>Address:</strong> {selectedRow.address}</p>
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
                                        <h5 className="modal-title">Edit Trainers List</h5>
                                        <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                                    </div>
                                    <div className="modal-body">
                                        <form onSubmit={handleSubmit}>
                                            <div className="row">
                                                {/* Left Column */}
                                                <div className="col-md-6">
                                                    <div className='row'>
                                                        <div className="col-md-6 mb-3">
                                                            <label>First Name</label>
                                                            <input
                                                                type="text"
                                                                value={form.firstName}
                                                                onChange={(e) => {
                                                                    const { value } = e.target;
                                                                    setForm({ ...form, firstName: value });
                                                                    validateField("firstName", value);
                                                                }}
                                                                className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
                                                                placeholder="First Name"
                                                                onBlur={(e) => validateField("firstName", e.target.value)}

                                                            />
                                                            {errors.firstName && (
                                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.firstName}</p>
                                                            )}
                                                        </div>

                                                        <div className="col-md-6 mb-3">
                                                            <label>Last Name</label>
                                                            <input
                                                                type="text"
                                                                value={form.lastName}
                                                                onChange={(e) => {
                                                                    const { value } = e.target;
                                                                    setForm({ ...form, lastName: value });
                                                                    validateField("lastName", value);
                                                                }}
                                                                className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
                                                                placeholder="Last Name"
                                                                onBlur={(e) => validateField("lastName", e.target.value)}

                                                            />
                                                            {errors.lastName && (
                                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.lastName}</p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className='row'>
                                                        <div className="col-md-6 mb-3">
                                                            <label>Contact Number</label>
                                                            <input
                                                                type="text"
                                                                value={form.contactNo}
                                                                onChange={(e) => {
                                                                    const { value } = e.target;
                                                                    setForm({ ...form, contactNo: value });
                                                                    validateField("contactNo", value);
                                                                }}
                                                                className={`form-control ${errors.contactNo ? "is-invalid" : ""}`}
                                                                placeholder="Contact Number"
                                                                onBlur={(e) => validateField("contactNo", e.target.value)}

                                                            />
                                                            {errors.contactNo && (
                                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.contactNo}</p>
                                                            )}
                                                        </div>

                                                        <div className="col-md-6 mb-3">
                                                            <label>Email</label>
                                                            <input
                                                                type="text"
                                                                value={form.email}
                                                                onChange={(e) => {
                                                                    const { value } = e.target;
                                                                    setForm({ ...form, email: value });
                                                                    validateField("email", value);
                                                                }}
                                                                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                                                                placeholder="Email"
                                                                onBlur={(e) => validateField("email", e.target.value)}

                                                            />
                                                            {errors.email && (
                                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}> Email is Required!</p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="row">
                                                        <div className="col-md-12 mb-3">
                                                            <label>Designation</label>
                                                            <select
                                                                value={form.designation}
                                                                onChange={(e) => {
                                                                    const { value } = e.target;
                                                                    setForm({ ...form, designation: value });
                                                                    validateField("designation", value);
                                                                }}
                                                                className={`form-control ${errors.designation ? "is-invalid" : ""}`}
                                                                onBlur={(e) => validateField("designation", e.target.value)}
                                                            >
                                                                <option value="">designation</option>
                                                                <option value="Asst. Dealer">Asst. Dealer</option>
                                                            </select>

                                                            {errors.designation && (
                                                                <p className="text-danger mb-0" style={{ fontSize: "13px" }}>
                                                                    Designation is Required!
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>


                                                </div>

                                                {/* Right Column */}
                                                <div className="col-md-6">

                                                    <div className="col-md-12 mb-3">
                                                        <label>Expertise</label>
                                                        <CKEditor
                                                            editor={ClassicEditor}
                                                            data={form.expertise || ""}
                                                            onChange={(event, editor) => {
                                                                const newData = editor.getData();
                                                                setForm({ ...form, expertise: newData });
                                                            }}
                                                            onBlur={() => validateField("expertise", form.expertise)}
                                                        />
                                                        {errors.expertise && (
                                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>
                                                                Expertise is Required!
                                                            </p>
                                                        )}
                                                    </div>

                                                </div>

                                                <div className="col-md-12 mb-3">
                                                    <label htmlFor="address">Address</label>
                                                    <textarea
                                                        id="address"
                                                        rows="3"
                                                        value={form.address}
                                                        onChange={(e) => {
                                                            const { value } = e.target;
                                                            setForm({ ...form, address: value });
                                                            validateField("address", value);
                                                        }}
                                                        className={`form-control ${errors.address ? "is-invalid" : ""}`}
                                                        placeholder="Enter Address"
                                                        onBlur={(e) => validateField("address", e.target.value)}
                                                    ></textarea>

                                                    {errors.address && (
                                                        <p className="text-danger mb-0" style={{ fontSize: "13px" }}>
                                                            Address is Required!
                                                        </p>
                                                    )}
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

export default TrainersList;
