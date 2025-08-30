import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import './organization.css';
import { getDesignation, createDesignation, updateDesignation, deleteDesignation } from '../../api/designationApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Designation = () => {

    // const [showModal, setShowModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);


    //from backend
    const [designation, setDesignation] = useState([]);
    const [paginated, setPaginated] = useState([]);

    const [editId, setEditId] = useState(null);

    const [form, setForm] = useState({
        department: '',
        designation: '',
        expenceLimit: '',
        addedBy: ''
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
        fetchDesignation();
    }, []);

    const fetchDesignation = async () => {
        try {
            const response = await getDesignation();
            setDesignation(response.data);
            paginate(response.data, currentPage);
        } catch (error) {
            console.error('Error fetching designation:', error);
        }
    };

    const validateField = (fieldName, value = "") => {
        let error = "";

        const displayName = fieldName
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, str => str.toUpperCase());

        value = value.toString();

        switch (fieldName) {
            case "departmentName":
            case "designation":
                if (!value.trim()) {
                    error = `${displayName} is required`;
                } else if (!/^[A-Za-z\s]+$/.test(value)) {
                    error = `${displayName} must contain only letters`;
                }
                break;

            case "department":
            case "addedBy":
                if (!value.trim()) error = `${displayName} is required`;
                break;

            case "expenceLimit":
                if (!value.trim()) {
                    error = `${displayName} is required`;
                } else if (isNaN(value) || Number(value) < 0) {
                    error = `${displayName} must be a positive number`;
                }
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
                    await updateDesignation(editId, form);
                    toast.success("Designation updated successfully!");

                } else {
                    await createDesignation(form);
                    toast.success("Designation saved successfully!");

                }
                fetchDesignation();
                setForm({ department: '', designation: '', expenceLimit: '', addedBy: '' });
                setEditId("");
                setShowEditModal(false);
            } catch (err) {
                console.error("Error saving designation:", err);
                toast.error("Designation failed to save!");

            }
        }
    };

    const emptyForm = {
        department: '',
        designation: '',
        expenceLimit: '',
        addedBy: ''
    };

    const resetForm = () => {
        setForm(emptyForm);
        setEditId(null);
        setShowEditModal(false);
    };


    const handleEdit = (row) => {
        setForm({
            department: row.department,
            designation: row.designation,
            expenceLimit: row.expenceLimit,
            addedBy: row.addedBy,
        });
        setEditId(row._id);
        setShowEditModal(true);
        setSelectedRow(row);
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this Designation?");
        if (!confirmDelete) return;
        try {
            await deleteDesignation(id);
            fetchDesignation();
        } catch (err) {
            console.error("Error deleting Designation:", err);
        }
    };


    const columns = [
        {
            name: 'Action',
            cell: (row) => (
                <div className="d-flex">
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
        { name: 'Designation', selector: row => row.designation },
        { name: 'Deparment', selector: row => row.department },
        { name: 'Expence Limit', selector: row => row.expenceLimit },
        { name: 'Added By', selector: row => row.addedBy }
    ];

    // const data = [
    //     {
    //         action: '-',
    //         designation: 'System Administrator',
    //         department: 'Administrator',
    //         expenceLimit: '5000',
    //         addedBy: 'Admin Admin'
    //     },
    //     {
    //         action: '-',
    //         designation: 'System Administrator',
    //         department: 'Administrator',
    //         expenceLimit: '5000',
    //         addedBy: 'Admin Admin'
    //     }, {
    //         action: '-',
    //         designation: 'System Administrator',
    //         department: 'Administrator',
    //         expenceLimit: '5000',
    //         addedBy: 'Admin Admin'
    //     }, {
    //         action: '-',
    //         designation: 'System Administrator',
    //         department: 'Administrator',
    //         expenceLimit: '5000',
    //         addedBy: 'Admin Admin'
    //     }, {
    //         action: '-',
    //         designation: 'System Administrator',
    //         department: 'Administrator',
    //         expenceLimit: '5000',
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


    //backend
    const totalEntries = designation.length;
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

    // const [showAddForm, setShowAddForm] = useState(false);

    // const toggleAddForm = () => {
    //     setShowAddForm((prev) => !prev);
    // };

    return (
        <div className="custom-container">
            <h5>Designations</h5>
            <p style={{ fontSize: '15px', color: 'rgb(98, 98, 98)' }}>
                <span style={{ color: 'red' }}>Home</span> / Designations
            </p>

            <div className="container-fluid px-3 mt-4">

                <div className="row g-4">

                    <div className="col-12 col-lg-4">
                        <div className="card no-radius h-100">
                            <div className="card-header d-flex justify-content-between align-items-center text-white new-emp-bg">
                                <span>Add New Designation</span>
                            </div>

                            <form className="p-3" onSubmit={handleSubmit}>
                                <div className="row">
                                
                                    <div className="col-md-12 mb-3">
                                        <label>Department</label>
                                        <select
                                            value={form.department}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setForm({ ...form, department: value });
                                                validateField("department", value);
                                            }}
                                            className={`form-control ${errors.department ? "is-invalid" : ""}`}
                                            onBlur={(e) => validateField("department", e.target.value)}

                                        >
                                            <option value="">Select Department...</option>
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
                                        {errors.department && (
                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}> Department Name is Required!</p>
                                        )}
                                    </div>

                                    {/* Designation */}
                                    <div className="col-md-12 mb-3">
                                        <label>Designation Name</label>
                                        <input
                                            type="text"
                                            value={form.designation}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setForm({ ...form, designation: value });
                                                validateField("designation", value);
                                            }}
                                            className={`form-control ${errors.designation ? "is-invalid" : ""}`}
                                            placeholder="Designation Name"
                                            onBlur={(e) => validateField("designation", e.target.value)}

                                        />
                                        {errors.designation && (
                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}> Designation Name is Required!</p>
                                        )}
                                    </div>

                                    {/* Expense Limit */}
                                    <div className="col-md-12 mb-3">
                                        <label>Expense Limit</label>
                                        <input
                                            type="number"
                                            value={form.expenceLimit}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setForm({ ...form, expenceLimit: value });
                                                validateField("expenceLimit", value);
                                            }}
                                            className={`form-control ${errors.expenceLimit ? "is-invalid" : ""}`}
                                            placeholder="Expense Limit"
                                            onBlur={(e) => validateField("expenceLimit", e.target.value)}

                                        />
                                        {errors.expenceLimit && (
                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}> Expense Limit is Required!</p>
                                        )}
                                    </div>

                                    {/* Added By */}
                                    <div className="col-md-12 mb-3">
                                        <label>Added By</label>
                                        <select
                                            value={form.addedBy}
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
                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}> This Field is Required!</p>
                                        )}
                                    </div>
                                </div>


                                <div className="text-start">
                                    <button type="submit" className="btn btn-sm add-btn">Save</button>
                                </div>
                            </form>
                        </div>
                    </div>











                    <div className="col-12 col-lg-8">
                        <div className="card no-radius h-100">
                            <div className="card-header d-flex justify-content-between align-items-center text-white new-emp-bg">
                                <span>List All Designations</span>
                                {/* <button className="btn btn-sm add-btn" onClick={toggleAddForm}>{showAddForm ? '- Hide' : '+ Add New'}</button> */}
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
                                        <div className="modal-dialog modal-dialog-centered edit-modal col-md-12">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h5 className="modal-title">Edit Designation</h5>
                                                    <button
                                                        type="button"
                                                        className="btn-close"
                                                        onClick={() => setShowEditModal(false)}
                                                    ></button>
                                                </div>
                                                <div className="modal-body">
                                                    <form onSubmit={handleSubmit}>

                                                        <div className="row">
                                                            <div className="col-md-6 mb-3">
                                                                <label>Department</label>
                                                                <select
                                                                    id="department"
                                                                    value={form.department}
                                                                    onChange={(e) => {
                                                                        const { value } = e.target;
                                                                        setForm({ ...form, department: value });
                                                                        validateField("department", value);
                                                                    }}
                                                                    className={`form-control ${errors.department ? "is-invalid" : ""}`}
                                                                    onBlur={(e) => validateField("department", e.target.value)}

                                                                >
                                                                    <option value="">Select Department...</option>
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
                                                                {errors.department && (
                                                                    <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Department Name is required!</p>)}
                                                            </div>

                                                            <div className="col-md-6 mb-3">
                                                                <label>Designation</label>
                                                                <input
                                                                    type="text"
                                                                    value={form.designation}
                                                                    onChange={(e) => {
                                                                        const { value } = e.target;
                                                                        setForm({ ...form, designation: value });
                                                                        validateField("designation", value);
                                                                    }}
                                                                    className={`form-control ${errors.designation ? "is-invalid" : ""}`}
                                                                    placeholder="Name"
                                                                    onBlur={(e) => validateField("designation", e.target.value)}

                                                                />
                                                                {errors.designation && (
                                                                    <p className="text-danger mb-0" style={{ fontSize: '13px' }}>
                                                                       Designation Name is Required!
                                                                    </p>
                                                                )}
                                                            </div>

                                                            <div className="col-md-6 mb-3">
                                                                <label>Expence Limit</label>
                                                                <input
                                                                    type="text"
                                                                    value={form.expenceLimit}
                                                                    onChange={(e) => {
                                                                        const { value } = e.target;
                                                                        setForm({ ...form, expenceLimit: value });
                                                                        validateField("expenceLimit", value);
                                                                    }}
                                                                    className={`form-control ${errors.expenceLimit ? "is-invalid" : ""}`}
                                                                    placeholder="Name"
                                                                    onBlur={(e) => validateField("expenceLimit", e.target.value)}

                                                                />
                                                                {errors.expenceLimit && (
                                                                    <p className="text-danger mb-0" style={{ fontSize: '13px' }}>
                                                                       Expense Limit is Required!
                                                                    </p>
                                                                )}
                                                            </div>

                                                            <div className="col-md-6 mb-3">
                                                                <label>Added By</label>
                                                                <select
                                                                    id="addedBy"
                                                                    value={form.addedBy}
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
                                                                    <p className="text-danger mb-0" style={{ fontSize: '13px' }}>This field is required!</p>)}
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
                </div>
            </div>
        </div>
    );
};
export default Designation;
