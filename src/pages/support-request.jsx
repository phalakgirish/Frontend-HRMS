import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
// import './organization.css';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useLocation, useNavigate } from 'react-router-dom';
import { getSupportRequest, createSupportRequest, updateSupportRequest, deleteSupportRequest } from '../api/supportRequestApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const SupportRequest = () => {

    const [showModal, setShowModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [description, setDescription] = useState('');
    const location = useLocation();

    //from backend
    const [SupportRequest, setSupportRequest] = useState([]);
    const [paginated, setPaginated] = useState([]);

    const [editId, setEditId] = useState(null);

    const [form, setForm] = useState({
        subject: '',
        employee: '',
        priority: '',
        remarks: '',
        // ticketCode: '',
        // assignedTo: '',
        // status: '',
        date: ''
    });

    const [errors, setErrors] = useState({});
    // const validateForm = () => {
    //     let newErrors = {};

    //     Object.keys(form).forEach((field) => {
    //         if (!form[field] || form[field].toString().trim() === "") {
    //             newErrors[field] = `${field.replace(/([A-Z])/g, " $1")} is required`;
    //         }
    //     });

    //     setErrors(newErrors);
    //     return Object.keys(newErrors).length === 0;
    // };

    useEffect(() => {
        fetchSupportRequest();
    }, []);

    const fetchSupportRequest = async () => {
        try {
            const response = await getSupportRequest();
            setSupportRequest(response.data);
            paginate(response.data, currentPage);
        } catch (error) {
            console.error('Error fetching SupportRequest:', error);
        }
    };

    const validateField = (fieldName, value = "") => {
        let error = "";

        let displayName = fieldName
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, str => str.toUpperCase());

        value = value.toString();

        switch (fieldName) {
            case "subject":
                if (!value.trim()) error = `${displayName} is required`;
                break;

            case "employee":
                if (!value.trim()) error = `${displayName} is required`;
                break;

            case "priority":
                if (!value.trim()) error = `${displayName} is required`;
                break;

            case "remarks":
                if (!value.trim()) error = `${displayName} is required`;
                break;

            // case "ticketCode":
            //     if (!value.trim()) error = `${displayName} is required`;
            //     break;

            //  case "assignedTo":
            //     if (!value.trim()) error = `${displayName} is required`;
            //     break;

            //  case "status":
            //     if (!value.trim()) error = `${displayName} is required`;
            //     break;

            case "date":
                if (!value.trim()) error = `${displayName} is required`;
                break;

            default:
                break;
        }

        setErrors(prev => ({ ...prev, [fieldName]: error }));
        return error;
    };

    const generateTicketCode = () => {
        return "TKT-" + Math.floor(1000 + Math.random() * 9000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        //   if (!validateForm()) {
        //     console.log("❌ Validation failed, not saving.");
        //     return;
        //   }

        try {
            const payload = editId
                ? { ...form, description }
                : { ...form, description, ticketCode: generateTicketCode() };

            console.log("📤 Sending payload:", payload); // Debug

            if (editId) {
                await updateSupportRequest(editId, payload);
                toast.success("Support Request updated successfully!");
            } else {
                await createSupportRequest(payload);
                toast.success("Support Request saved successfully!");
            }

            fetchSupportRequest();

            setForm({
                subject: "",
                employee: "",
                priority: "",
                remarks: "",
                date: "",
            });
            setDescription("");
            setEditId("");
            setShowEditModal(false);

        } catch (err) {
            console.error("❌ Error saving SupportRequest:", err.response || err);
            toast.error("Support Request failed to save!");
        }
    };




    const handleEdit = (row) => {
        setForm({
            subject: row.subject,
            employee: row.employee,
            priority: row.priority,
            remarks: row.remarks,
            ticketCode: row.ticketCode,
            // assignedTo: row.assignedTo,
            // status: row.status,
            date: row.date
        });
        setEditId(row._id);
        setShowEditModal(true);
        setSelectedRow(row);
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this SupportRequest?");
        if (!confirmDelete) return;
        try {
            await deleteSupportRequest(id);
            fetchSupportRequest();
        } catch (err) {
            console.error("Error deleting SupportRequest:", err);
        }
    };

    const handleView = (row) => {
        setSelectedRow(row);
        setShowModal(true);
    };


    const emptyForm = {
        subject: '',
        employee: '',
        priority: '',
        remarks: '',
        ticketCode: '',
        // assignedTo: '',
        // status: '',
        date: ''
    };

    const resetForm = () => {
        setForm(emptyForm);
        setEditId(null);
        setShowEditModal(false);
    };
    const navigate = useNavigate();

    //    const location = useLocation();

    useEffect(() => {
        if (location.state?.updatedRow) {
            setSupportRequest(prev =>
                prev.map(r =>
                    r._id === location.state.updatedRow._id
                        ? location.state.updatedRow
                        : r
                )
            );
        }
    }, [location.state]);


    const columns = [
        {
            name: 'Action',
            cell: (row) => (
                <div className="d-flex">
                    <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() =>
                            navigate(`/ticketDetail/${row._id}`, {
                                state: { employee: row }
                            })
                        }
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
        { name: 'Ticket Code', selector: row => row.ticketCode },
        { name: 'Subject', selector: row => row.subject },
        { name: 'Employee', selector: row => row.employee },
        { name: 'Assigned To', selector: row => row.assignedTo },
        { name: 'Priority', selector: row => row.priority },
        { name: 'Status', selector: row => row.status },
        { name: 'Date', selector: row => row.date },
    ];

    // const data = [
    //     {
    //         action: '-',
    //         ticketCode: 'VZG1SGY',
    //         subject: 'Not able to backup windows database.',
    //         employee: 'Amit Kumar',
    //         assignedTo: 'Aniket Rane',
    //         priority: 'Medium',
    //         status: 'Open',
    //         date: '08-Apr-2022 04:35 AM'
    //     },
    //     {
    //         action: '-',
    //         ticketCode: 'VZG1SGY',
    //         subject: 'Salary',
    //         employee: 'Amit Kumar',
    //         assignedTo: '-',
    //         priority: 'Medium',
    //         status: 'Open',
    //         date: '08-Apr-2022 04:35 AM'
    //     }, {
    //         action: '-',
    //         ticketCode: 'VZG1SGY',
    //         subject: 'Not able to backup windows database.',
    //         employee: '-',
    //         assignedTo: 'Aniket Rane',
    //         priority: 'Medium',
    //         status: 'Open',
    //         date: '08-Apr-2022 04:35 AM'
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

    const totalEntries = SupportRequest.length;
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
            <h5>Support Request</h5>
            <p style={{ fontSize: '15px', color: 'rgb(98, 98, 98)' }}>
                <span style={{ color: 'red' }}>Home</span> / Support Request
            </p>


            {showAddForm && (
                <div className="card mb-3 form-slide-container">
                    <div className="card-header d-flex justify-content-between align-items-center text-white new-emp-bg">
                        <span>Create new Ticket</span>
                        <button className="btn btn-sm add-btn" onClick={toggleAddForm}>
                            - Hide
                        </button>
                    </div>

                    <div className="container mt-4">
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                {/* Left Column */}
                                <div className='row'>
                                    <div className='row'>
                                        <div className="col-md-6 mb-3">
                                            <label>Subject</label>
                                            <input type="text" value={form.subject} Placeholder="Enter Subject"
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, subject: value });
                                                    validateField("subject", value);
                                                }}
                                                className={`form-control ${errors.subject ? "is-invalid" : ""}`}
                                                onBlur={(e) => validateField("subject", e.target.value)}

                                            />
                                            {errors.subject && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.subject}</p>)}
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label>Date</label>
                                            <input type="date" value={form.date}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, date: value });
                                                    validateField("date", value);
                                                }}
                                                className={`form-control ${errors.date ? "is-invalid" : ""}`}
                                                onBlur={(e) => validateField("date", e.target.value)}

                                            />
                                            {errors.date && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.date}</p>)}


                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className="col-md-6 mb-3">
                                            <label>Ticket for Employee</label>
                                            <select id="employee" value={form.employee}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, employee: value });
                                                    validateField("employee", value);
                                                }}
                                                className={`form-control ${errors.employee ? "is-invalid" : ""}`}
                                                onBlur={(e) => validateField("employee", e.target.value)}
                                            >
                                                <option value="">Choose an Employee..</option>
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
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.employee}</p>)}
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label>Priority</label>
                                            <select id="priority" value={form.priority}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, priority: value });
                                                    validateField("priority", value);
                                                }}
                                                className={`form-control ${errors.priority ? "is-invalid" : ""}`}
                                                onBlur={(e) => validateField("priority", e.target.value)}
                                            >
                                                <option value="">Prioriy</option>
                                                <option value="Low">Low</option>
                                                <option value="Medium">Medium</option>
                                                <option value="High">High</option>
                                                <option value="Critical">Critical</option>
                                            </select>
                                            {errors.priority && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.priority}</p>)}
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
                    <span>List all Support Request</span>
                    <button className="btn btn-sm add-btn" onClick={toggleAddForm}>{showAddForm ? '- Hide' : '+ Add'}</button>
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
                            <div className="d-flex justify-content-between align-items-center w-100">
                                <div className="d-flex">
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

                {/* {showModal && selectedRow && (
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
                )} */}

                {showEditModal && selectedRow && (
                    <>

                        <div className="custom-backdrop"></div>
                        <div className="modal show fade d-block" tabIndex="-1">
                            <div className="modal-dialog modal-dialog-centered edit-modal">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Edit Ticket</h5>
                                        <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                                    </div>
                                    <div className="modal-body">
                                        <form onSubmit={handleSubmit}>
                                            <div className="row">
                                                {/* Left Column */}
                                                <div className="col-md-6">

                                                    <div className=" mb-3">
                                                        <label>Ticket Code</label>
                                                        <input type="text" value={form.ticketCode} Placeholder="Enter Ticket Code"
                                                            onChange={(e) => {
                                                                const { value } = e.target;
                                                                setForm({ ...form, ticketCode: value });
                                                                validateField("ticketCode", value);

                                                            }}
                                                            className={`form-control ${errors.ticketCode ? "is-invalid" : ""}`}
                                                            onBlur={(e) => validateField("ticketCode", e.target.value)}
                                                            disabled
                                                        />
                                                        {errors.ticketCode && (
                                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.ticketCode}</p>)}

                                                    </div>

                                                    <div className=" mb-3">
                                                        <label>Subject</label>
                                                        <input type="text" value={form.subject} Placeholder="Enter Subject"
                                                            onChange={(e) => {
                                                                const { value } = e.target;
                                                                setForm({ ...form, subject: value });
                                                                validateField("subject", value);
                                                            }}
                                                            className={`form-control ${errors.subject ? "is-invalid" : ""}`}
                                                            onBlur={(e) => validateField("subject", e.target.value)}

                                                        />
                                                        {errors.subject && (
                                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.subject}</p>)}

                                                    </div>

                                                    <div className='row'>
                                                        <div className="col-md-6 mb-3">
                                                            <label>Ticket for Employee</label>
                                                            <select id="employee" value={form.employee}
                                                                onChange={(e) => {
                                                                    const { value } = e.target;
                                                                    setForm({ ...form, employee: value });
                                                                    validateField("employee", value);
                                                                }}
                                                                className={`form-control ${errors.employee ? "is-invalid" : ""}`}
                                                                onBlur={(e) => validateField("employee", e.target.value)}
                                                            >
                                                                <option value="">Choose an Employee..</option>
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
                                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.employee}</p>)}
                                                        </div>

                                                        <div className="col-md-6 mb-3">
                                                            <label>Priority</label>
                                                            <select id="priority" value={form.priority}
                                                                onChange={(e) => {
                                                                    const { value } = e.target;
                                                                    setForm({ ...form, priority: value });
                                                                    validateField("priority", value);
                                                                }}
                                                                className={`form-control ${errors.priority ? "is-invalid" : ""}`}
                                                                onBlur={(e) => validateField("priority", e.target.value)}
                                                            >
                                                                <option value="">Prioriy</option>
                                                                <option value="Low">Low</option>
                                                                <option value="Medium">Medium</option>
                                                                <option value="High">High</option>
                                                                <option value="Critical">Critical</option>
                                                            </select>
                                                            {errors.priority && (
                                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.priority}</p>)}
                                                        </div>
                                                    </div>

                                                    {/* <div className="col-md-6 mb-3">
                                                        <label>Ticket Code</label>
                                                        <input type="text" value={form.ticketCode} Placeholder="Enter Ticket Code"
                                                            onChange={(e) => {
                                                                const { value } = e.target;
                                                                setForm({ ...form, ticketCode: value });
                                                                validateField("ticketCode", value);
                                                            }}
                                                            className={`form-control ${errors.ticketCode ? "is-invalid" : ""}`}
                                                            onBlur={(e) => validateField("ticketCode", e.target.value)}

                                                        />
                                                        {errors.ticketCode && (
                                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.ticketCode}</p>)}

                                                    </div> */}

                                                    <div className="col-md-12 mb-3">
                                                        <label>Date</label>
                                                        <input type="date" value={form.date}
                                                            onChange={(e) => {
                                                                const { value } = e.target;
                                                                setForm({ ...form, date: value });
                                                                validateField("date", value);
                                                            }}
                                                            className={`form-control ${errors.date ? "is-invalid" : ""}`}
                                                            onBlur={(e) => validateField("date", e.target.value)}

                                                        />
                                                        {errors.date && (
                                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.date}</p>)}


                                                    </div>
                                                </div>

                                                {/* Right Column */}
                                                <div className="col-md-6">
                                                    <div className='row'>
                                                        <label>Remarks</label>
                                                        <CKEditor
                                                            editor={ClassicEditor}
                                                            data={form.remarks || ""}
                                                            onChange={(event, editor) => {
                                                                const newData = editor.getData();
                                                                setForm({ ...form, remarks: newData });
                                                            }}
                                                            onBlur={() => validateField("remarks", form.remarks)}
                                                        />
                                                        {errors.remarks && (
                                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>
                                                                Remarks Required!
                                                            </p>
                                                        )}
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

export default SupportRequest;
