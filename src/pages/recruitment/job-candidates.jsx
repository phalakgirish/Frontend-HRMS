import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { useNavigate } from 'react-router-dom';
import { getJobCandidate, createJobCandidate, updateJobCandidate, deleteJobCandidate } from '../../api/jobCandidateApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const JobCandidates = () => {
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [description, setDescription] = useState('<div class="mb-3"><label>Hello, Your Payslip is generated</label></div>');
    const [editId, setEditId] = useState(null);

    // const handleView = (row) => {
    //     setSelectedRow(row);
    //     setShowModal(true);
    // };

    //from backend
    const [JobCandidate, setJobCandidate] = useState([]);
    const [paginated, setPaginated] = useState([]);


    const [form, setForm] = useState({
        jobTitle: '',
        firstName: '',
        lastName: '',
        email: '',
        status: '',
        applyDate: ''
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
            case "jobTitle":
                if (!value.trim()) error = `${displayName} is required`;
                break;

            case "firstName":
                if (!value.trim()) error = `${displayName} is required`;
                break;

            case "lastName":
                if (!value.trim()) error = `${displayName} is required`;
                break;

            case "email":
                if (!value.trim()) error = `${displayName} is required`;
                break;

            case "status":
                if (!value.trim()) error = `${displayName} is required`;
                break;

            case "applyDate":
                if (!value.trim()) error = `${displayName} is required`;
                break;

            default:
                break;
        }

        setErrors(prev => ({ ...prev, [fieldName]: error }));
        return error;
    };


    useEffect(() => {
        fetcJobCandidate();
    }, []);

    const fetcJobCandidate = async () => {
        try {
            const response = await getJobCandidate();
            setJobCandidate(response.data);
            paginate(response.data, currentPage);
        } catch (error) {
            console.error('Error fetching JobCandidate:', error);
        }
    };

    const emptyForm = {
        jobTitle: '',
        firstName: '',
        lastName: '',
        email: '',
        status: '',
        applyDate: ''
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
                    await updateJobCandidate(editId, form);
                    toast.success("Job Candidate updated successfully!");

                    setEditId(null);
                } else {
                    await createJobCandidate(form);
                    toast.success("Job Candidate saved successfully!");

                }
                fetcJobCandidate();
                setForm({
                    jobTitle: '',
                    firstName: '',
                    lastName: '',
                    email: '',
                    status: '',
                    applyDate: ''
                });
                setEditId("");
                setShowEditModal(false);
            } catch (err) {
                console.error("Error saving Job Candidate:", err);
                toast.error("Job Candidate failed to save!");

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
            jobTitle: row.jobTitle,
            firstName: row.firstName,
            lastName: row.lastName,
            email: row.email,
            status: row.status,
            applyDate: row.applyDate
        });
        setShowEditModal(true);
        setSelectedRow(row);
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this JobCandidate?");
        if (!confirmDelete) return;
        try {
            await deleteJobCandidate(id);
            fetcJobCandidate();
        } catch (err) {
            console.error("Error deleting JobCandidate:", err);
        }
    };

    // const handleDelete = async (id) => {
    //     console.log("🗑️ Delete requested for JobCandidate ID:", id);

    //     const confirmDelete = window.confirm("Are you sure you want to delete this JobCandidate?");
    //     if (!confirmDelete) return;

    //     try {
    //         await deleteJobCandidate(id); // ✅ id should be string, not object
    //         console.log("✅ JobCandidate deleted successfully!");
    //         fetcJobCandidate();
    //     } catch (err) {
    //         console.error("🔥 Error deleting JobCandidate:", err);
    //     }
    // };




    const handleSend = (row) => {
        setSelectedRow(row);
        setShowEditModal(true);
    }


    const columns = [
        {
            name: 'Action',
            cell: (row) => (
                <div className="d-flex">
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
                        <i className="fas fa-eye"></i>
                    </button> */}
                    <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => handleEdit(row)}
                    >
                        <i className="fas fa-edit"></i>
                    </button>

                    <button
                        className="btn btn-outline-secondary btn-sm"
                        title="Offer Letter"
                        onClick={() => {
                            handleSend(row)
                            navigate(`/offer/${row._id}`, {});
                        }}
                    >
                        <i className="fas fa-paper-plane"></i>
                    </button>

                    <button
                        className="btn btn-outline-secondary btn-sm"
                        title="Appointment Letter"
                        onClick={() => {
                            handleSend(row)
                            navigate(`/appointment/${row._id}`, {});
                        }}
                    >
                        <i className="fas fa-paper-plane"></i>
                    </button>
                </div>
            ),
            width: '150px',
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
        { name: 'Job Title', selector: row => row.jobTitle },
        { name: 'Candidate Name', selector: row => `${row.firstName} ${row.lastName}` },
        { name: 'Email', selector: row => row.email },
        { name: 'Status', selector: row => row.status },
        { name: 'Apply Date', selector: row => row.applyDate },
    ];

    // const data = [
    //     {
    //         action: '-',
    //         jobTitle: 'Software Engineer',
    //         candidateName: 'Rahul Sharma',
    //         email: 'inf@ubisl.co.in',
    //         status: 'Applied ',
    //         applyDate: '12-Aug-2021'
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

    const totalEntries = JobCandidate.length;
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
            <h5>Job Candidates</h5>
            <p style={{ fontSize: '15px', color: 'rgb(98, 98, 98)' }}>
                <span style={{ color: 'red' }}>Home</span> / Job Candidates
            </p>


            {showAddForm && (
                <div className="card mb-3 form-slide-container">
                    <div className="card-header d-flex justify-content-between align-items-center text-white new-emp-bg">
                        <span>Add New Candidate</span>
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
                                        <label>Job Title</label>
                                        <select id="resignEmployee"
                                            value={form.jobTitle}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setForm({ ...form, jobTitle: value });
                                                validateField("jobTitle", value);
                                            }}
                                            className={`form-control ${errors.jobTitle ? "is-invalid" : ""}`}
                                            onBlur={(e) => validateField("jobTitle", e.target.value)}
                                        >
                                            <option value="">Choose Job Title</option>
                                            <option value="Software Engineer">Software Engineer</option>
                                            <option value="Software Developer">Software Developer</option>
                                            <option value="Senior Developer">Senior Developer</option>
                                            <option value="Junior Developer">Junior Developer</option>

                                        </select>
                                        {errors.jobTitle && (
                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Job Title is required!</p>)}
                                    </div>

                                    <div className='row'>
                                        <div className="col-md-6 mb-3">
                                            <label>First Name</label>
                                            <input type="text" value={form.firstName} placeholder='Enter First Name'
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, firstName: value });
                                                    validateField("firstName", value);
                                                }}
                                                className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
                                                onBlur={(e) => validateField("firstName", e.target.value)}

                                            />
                                            {errors.firstName && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>First Name is required!</p>)}                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label>Last Name</label>
                                            <input type="text" value={form.lastName} placeholder='Enter Last Name'
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, lastName: value });
                                                    validateField("lastName", value);
                                                }}
                                                className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
                                                onBlur={(e) => validateField("lastName", e.target.value)}

                                            />
                                            {errors.lastName && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Last Name is required!</p>)}
                                        </div>
                                    </div>

                                </div>

                                {/* Right Column */}
                                <div className="col-md-6">

                                    <div className="mb-3">
                                        <label>Email</label>
                                        <input type="text" value={form.email} placeholder='Enter Email ID'
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setForm({ ...form, email: value });
                                                validateField("email", value);
                                            }}
                                            className={`form-control ${errors.email ? "is-invalid" : ""}`}
                                            onBlur={(e) => validateField("email", e.target.value)}

                                        />
                                        {errors.email && (
                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Email is required!</p>)}

                                    </div>

                                    <div className='row'>
                                        <div className="col-md-6 mb-3">
                                            <label>Status</label>
                                            <select id="resignEmployee"
                                                value={form.status}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, status: value });
                                                    validateField("status", value);
                                                }}
                                                className={`form-control ${errors.status ? "is-invalid" : ""}`}
                                                onBlur={(e) => validateField("status", e.target.value)}
                                            >
                                                <option value="">Status</option>
                                                <option value="Accepted">Accepted</option>
                                                <option value="Pending">Pending</option>
                                                <option value="Rejected">Rejected</option>
                                            </select>
                                            {errors.status && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Status is required!</p>)}
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label>Apply Date</label>
                                            <input type="date" value={form.applyDate}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, applyDate: value });
                                                    validateField("applyDate", value);
                                                }}
                                                className={`form-control ${errors.applyDate ? "is-invalid" : ""}`}
                                                onBlur={(e) => validateField("applyDate", e.target.value)}

                                            />
                                            {errors.applyDate && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Apply Date is required!</p>)}
                                        </div>
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
                    <span>List All Job Candidates</span>
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
                                        <h5 className="modal-title">Edit Job Candidate</h5>
                                        <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                                    </div>
                                    <div className="modal-body">
                                        <form onSubmit={handleSubmit}>
                                            <div className="row">
                                {/* Left Column */}


                                <div className="col-md-6">

                                    <div className="mb-3">
                                        <label>Job Title</label>
                                        <select id="resignEmployee"
                                            value={form.jobTitle}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setForm({ ...form, jobTitle: value });
                                                validateField("jobTitle", value);
                                            }}
                                            className={`form-control ${errors.jobTitle ? "is-invalid" : ""}`}
                                            onBlur={(e) => validateField("jobTitle", e.target.value)}
                                        >
                                            <option value="">Choose Job Title</option>
                                            <option value="Software Engineer">Software Engineer</option>
                                            <option value="Software Developer">Software Developer</option>
                                            <option value="Senior Developer">Senior Developer</option>
                                            <option value="Junior Developer">Junior Developer</option>

                                        </select>
                                        {errors.jobTitle && (
                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Job Title is required!</p>)}
                                    </div>

                                    <div className='row'>
                                        <div className="col-md-6 mb-3">
                                            <label>First Name</label>
                                            <input type="text" value={form.firstName} placeholder='Enter First Name'
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, firstName: value });
                                                    validateField("firstName", value);
                                                }}
                                                className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
                                                onBlur={(e) => validateField("firstName", e.target.value)}

                                            />
                                            {errors.firstName && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>First Name is required!</p>)}                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label>Last Name</label>
                                            <input type="text" value={form.lastName} placeholder='Enter Last Name'
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, lastName: value });
                                                    validateField("lastName", value);
                                                }}
                                                className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
                                                onBlur={(e) => validateField("lastName", e.target.value)}

                                            />
                                            {errors.lastName && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Last Name is required!</p>)}
                                        </div>
                                    </div>

                                </div>

                                {/* Right Column */}
                                <div className="col-md-6">

                                    <div className="mb-3">
                                        <label>Email</label>
                                        <input type="text" value={form.email} placeholder='Enter Email ID'
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setForm({ ...form, email: value });
                                                validateField("email", value);
                                            }}
                                            className={`form-control ${errors.email ? "is-invalid" : ""}`}
                                            onBlur={(e) => validateField("email", e.target.value)}

                                        />
                                        {errors.email && (
                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Email is required!</p>)}

                                    </div>

                                    <div className='row'>
                                        <div className="col-md-6 mb-3">
                                            <label>Status</label>
                                            <select id="resignEmployee"
                                                value={form.status}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, status: value });
                                                    validateField("status", value);
                                                }}
                                                className={`form-control ${errors.status ? "is-invalid" : ""}`}
                                                onBlur={(e) => validateField("status", e.target.value)}
                                            >
                                                <option value="">Status</option>
                                                <option value="Accepted">Accepted</option>
                                                <option value="Pending">Pending</option>
                                                <option value="Rejected">Rejected</option>
                                            </select>
                                            {errors.status && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Status is required!</p>)}
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label>Apply Date</label>
                                            <input type="date" value={form.applyDate}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, applyDate: value });
                                                    validateField("applyDate", value);
                                                }}
                                                className={`form-control ${errors.applyDate ? "is-invalid" : ""}`}
                                                onBlur={(e) => validateField("applyDate", e.target.value)}

                                            />
                                            {errors.applyDate && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Apply Date is required!</p>)}
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

export default JobCandidates;
