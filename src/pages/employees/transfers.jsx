import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import './employees.css';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { getTransfer, createTransfer, updateTransfer, deleteTransfer } from '../../api/transferApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Transfers = () => {

    const [showModal, setShowModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [description, setDescription] = useState('');

    //from backend
    const [Transfer, setTransfer] = useState([]);
    const [paginated, setPaginated] = useState([]);

    const [editId, setEditId] = useState(null);

    const [form, setForm] = useState({
        employeeName: '',
        transferDate: '',
        transferToDepartment: '',
        transferToLocation: '',
        status: '',
        addedBy: '',
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
        fetchTransfer();
    }, []);

    const fetchTransfer = async () => {
        try {
            const response = await getTransfer();
            setTransfer(response.data);
            paginate(response.data, currentPage);
        } catch (error) {
            console.error('Error fetching Transfer:', error);
        }
    };

    const emptyForm = {
        employeeName: '',
        transferDate: '',
        transferToDepartment: '',
        transferToLocation: '',
        status: '',
        addedBy: '',
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
                    await updateTransfer(editId, form);
                    toast.success("Transfer updated successfully!");

                } else {
                    await createTransfer(form);
                    toast.success("Transfer saved successfully!");
                }
                fetchTransfer();
                setForm({
                    employeeName: '',
                    transferDate: '',
                    transferToDepartment: '',
                    transferToLocation: '',
                    status: '',
                    addedBy: '',
                    description: ''
                });
                setEditId("");
                setShowEditModal(false);
            } catch (err) {
                console.error("Error saving Transfer:", err);
                toast.error("Transfer failed to successfully!");

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
                displayName = "Employee Name";
                if (!value.trim()) error = `${displayName} is required`;
                break;

            case "transferDate":
                if (!value.trim()) error = `${displayName} is required`;
                break;

            case "transferToDepartment":
                if (!value.trim()) error = `${displayName} is required`;
                break;

            case "transferToLocation":
                if (!value.trim()) error = `${displayName} is required`;
                break;

            case "status":
                if (!value.trim()) error = `${displayName} is required`;
                break;

            case "addedBy":
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



    const handleEdit = (row) => {
        setForm({
            employeeName: row.employeeName,
            transferDate: row.transferDate,
            transferToDepartment: row.transferToDepartment,
            transferToLocation: row.transferToLocation,
            status: row.status,
            addedBy: row.addedBy,
            description: row.description
        });
        setEditId(row._id);
        setShowEditModal(true);
        setSelectedRow(row);
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this Transfer?");
        if (!confirmDelete) return;
        try {
            await deleteTransfer(id);
            fetchTransfer();
        } catch (err) {
            console.error("Error deleting Transfer:", err);
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
        { name: 'Transfer Date', selector: row => row.transferDate },
        { name: 'Transfer To (Department)', selector: row => row.transferToDepartment },
        { name: 'Transfer To (Location)', selector: row => row.transferToLocation },
        { name: 'Status', selector: row => row.status },
        { name: 'Added By', selector: row => row.addedBy },
    ];

    // const data = [
    //     {
    //         action: '-',
    //         employeeName: 'Shubham Kadam',
    //         transferDate: '12-May-2022',
    //         transferToDepartment: 'Administrator',
    //         transferToLocation: 'Bangalore',
    //         status: 'Accepted',
    //         addedBy: 'Admin Admin'
    //     },
    //     {
    //         action: '-',
    //         employeeName: 'Aniket Rane',
    //         transferDate: '12-May-2022',
    //         transferToDepartment: 'Administrator',
    //         transferToLocation: 'Mumbai',
    //         status: 'Pending',
    //         addedBy: 'Admin Admin'
    //     }, {
    //         action: '-',
    //         employeeName: 'Shubham Kadam',
    //         transferDate: '12-May-2022',
    //         transferToDepartment: 'Administrator',
    //         transferToLocation: 'Bangalore',
    //         status: 'Accepted',
    //         addedBy: 'Admin Admin'
    //     }, {
    //         action: '-',
    //         employeeName: 'Shubham Kadam',
    //         transferDate: '12-May-2022',
    //         transferToDepartment: 'Administrator',
    //         transferToLocation: 'Bangalore',
    //         status: 'Accepted',
    //         addedBy: 'Admin Admin'
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

    const totalEntries = Transfer.length;
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
            <h5>Transfers</h5>
            <p style={{ fontSize: '15px', color: 'rgb(98, 98, 98)' }}>
                <span style={{ color: 'red' }}>Home</span> / Transfers
            </p>


            {showAddForm && (
                <div className="card mb-3 form-slide-container">
                    <div className="card-header d-flex justify-content-between align-items-center text-white new-emp-bg">
                        <span>Add New Transfer</span>
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
                                        <label>Employee To Transfer</label>
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
                                        <label>Transfer Date</label>
                                        <input type="date" value={form.transferDate}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setForm({ ...form, transferDate: value });
                                                validateField("transferDate", value);
                                            }}
                                            className={`form-control ${errors.transferDate ? "is-invalid" : ""}`}
                                            onBlur={(e) => validateField("transferDate", e.target.value)}

                                        />
                                        {errors.transferDate && (
                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.transferDate}</p>
                                        )}
                                    </div>


                                    <div className='row'>
                                        <div className="col-md-6 mb-3">
                                            <label>Transfer To (Department)</label>
                                            <select id="transferDepartment" value={form.transferToDepartment}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, transferToDepartment: value });
                                                    validateField("transferToDepartment", value);
                                                }}
                                                className={`form-control ${errors.transferToDepartment ? "is-invalid" : ""}`}
                                                onBlur={(e) => validateField("transferToDepartment", e.target.value)}
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
                                            {errors.transferToDepartment && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.transferToDepartment}</p>
                                            )}
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label>Transfer To (Location)</label>
                                            <select id="transferLocation" value={form.transferToLocation}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, transferToLocation: value });
                                                    validateField("transferToLocation", value);
                                                }}
                                                className={`form-control ${errors.transferToLocation ? "is-invalid" : ""}`}
                                                onBlur={(e) => validateField("transferToLocation", e.target.value)}
                                            >
                                                <option value="">Select Location</option>
                                                <option value="mumbai">Head Office - Mumbai</option>
                                                <option value="bangalore">Bangalore</option>
                                            </select>
                                            {errors.transferToLocation && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.transferToLocation}</p>
                                            )}
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
                                                <option value="">Status</option>
                                                <option value="pending">Pending</option>
                                                <option value="accepted">Accepted</option>
                                                <option value="rejected">Rejected</option>
                                            </select>
                                            {errors.status && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.status}</p>
                                            )}
                                        </div>

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
                                            {errors.description}
                                        </p>
                                    )}
                                </div>

                            </div>

                            <div className="text-start mb-2">
                                <button type="submit" className="btn btn-sm add-btn">Save</button>
                            </div>
                        </form>
                    </div>

                </div >
            )}



            <div className="card no-radius">
                <div className="card-header d-flex justify-content-between align-items-center text-white new-emp-bg">
                    <span>List All Transfers</span>
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
                                    <h5 className="modal-title">View Transfers</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setShowModal(false)}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <p><strong>
                                        Employee to Transfer:</strong> {selectedRow.employeeName}</p>
                                    <p><strong>Transfer Date:</strong> {selectedRow.transferDate}</p>
                                    <p><strong>Transfer To (Department):</strong> {selectedRow.transferToDepartment}</p>
                                    <p><strong>Transfer To (Location):</strong> {selectedRow.transferToLocation}</p>
                                    <p><strong>Status:</strong> {selectedRow.status}</p>
                                    {/* <p><strong>Added By:</strong> {selectedRow.addedBy}</p> */}
                                    <p>
                                        <strong>Description:</strong> {String(selectedRow?.description || '').replace(/<[^>]+>/g, '')}
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
                                        <h5 className="modal-title">Edit Transfer</h5>
                                        <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                                    </div>
                                    <div className="modal-body">
                                        <form onSubmit={handleSubmit}>
                                          <div className="row">
                                {/* Left Column */}
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label>Employee To Transfer</label>
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
                                        <label>Transfer Date</label>
                                        <input type="date" value={form.transferDate}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setForm({ ...form, transferDate: value });
                                                validateField("transferDate", value);
                                            }}
                                            className={`form-control ${errors.transferDate ? "is-invalid" : ""}`}
                                            onBlur={(e) => validateField("transferDate", e.target.value)}

                                        />
                                        {errors.transferDate && (
                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.transferDate}</p>
                                        )}
                                    </div>


                                    <div className='row'>
                                        <div className="col-md-6 mb-3">
                                            <label>Transfer To (Department)</label>
                                            <select id="transferDepartment" value={form.transferToDepartment}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, transferToDepartment: value });
                                                    validateField("transferToDepartment", value);
                                                }}
                                                className={`form-control ${errors.transferToDepartment ? "is-invalid" : ""}`}
                                                onBlur={(e) => validateField("transferToDepartment", e.target.value)}
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
                                            {errors.transferToDepartment && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.transferToDepartment}</p>
                                            )}
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label>Transfer To (Location)</label>
                                            <select id="transferLocation" value={form.transferToLocation}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, transferToLocation: value });
                                                    validateField("transferToLocation", value);
                                                }}
                                                className={`form-control ${errors.transferToLocation ? "is-invalid" : ""}`}
                                                onBlur={(e) => validateField("transferToLocation", e.target.value)}
                                            >
                                                <option value="">Select Location</option>
                                                <option value="mumbai">Head Office - Mumbai</option>
                                                <option value="bangalore">Bangalore</option>
                                            </select>
                                            {errors.transferToLocation && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.transferToLocation}</p>
                                            )}
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
                                                <option value="">Status</option>
                                                <option value="pending">Pending</option>
                                                <option value="accepted">Accepted</option>
                                                <option value="rejected">Rejected</option>
                                            </select>
                                            {errors.status && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.status}</p>
                                            )}
                                        </div>

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
                                            {errors.description}
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
        </div >
    );
};

export default Transfers;
