import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import './organization.css';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { getExpense, createExpense, updateExpense, deleteExpense } from '../../api/expenseApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Expense = () => {

    const [showModal, setShowModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [description, setDescription] = useState('');
    //from backend
    const [expense, setExpense] = useState([]);
    const [paginated, setPaginated] = useState([]);

    const [editId, setEditId] = useState(null);


    const [form, setForm] = useState({
        expense: '',
        employee: '',
        purchasedDate: '',
        amount: '',
        status: '',
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
        fetchExpense();
    }, []);

    const fetchExpense = async () => {
        try {
            const response = await getExpense();
            setExpense(response.data);
            paginate(response.data, currentPage);
        } catch (error) {
            console.error('Error fetching Expense:', error);
        }
    };

    const validateField = (fieldName, value = "") => {
        let error = "";

        let displayName = fieldName
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, str => str.toUpperCase());

        value = value.toString();

        switch (fieldName) {
            case "expense":
                displayName = "Expense";
                if (!value.trim()) error = `${displayName} is required`;
                break;

            case "employee":
                if (!value.trim()) error = `${displayName} is required`;
                break;

            case "purchasedDate":
                if (!value.trim()) error = `${displayName} is required`;
                break;

            case "amount":
                if (!value.trim()) error = `${displayName} is required`;
                break;

            case "status":
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
                    await updateExpense(editId, form);
                    toast.success("Expense updated successfully!");

                } else {
                    await createExpense(form);
                    toast.success("Expense saved successfully!");

                }
                fetchExpense();
                setForm({ expense: '', employee: '', purchasedDate: '', amount: '', status: '', description: '' });
                setEditId("");
                setDescription('');
                setShowEditModal(false);

            } catch (err) {
                console.error("Error saving Expense:", err);
                toast.error("Expense failed to save!");

            }
        }
    };

    const emptyForm = {
        expense: '',
        employee: '',
        purchasedDate: '',
        amount: '',
        status: '',
        description: ''
    };

    const resetForm = () => {
        setForm(emptyForm);
        setEditId(null);
        setShowEditModal(false);
    };

    const handleEdit = (row) => {
        setForm({
            expense: row.expense,
            employee: row.employee,
            purchasedDate: row.purchasedDate,
            amount: row.amount,
            status: row.status,
            description: row.description
        });
        setEditId(row._id);
        setShowEditModal(true);
        setSelectedRow(row);
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this Expense?");
        if (!confirmDelete) return;
        try {
            await deleteExpense(id);
            fetchExpense();
        } catch (err) {
            console.error("Error deleting Expense:", err);
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
        { name: 'Employee', selector: row => row.employee, sortable: true },
        { name: 'Expense', selector: row => row.expense },
        { name: 'Amount', selector: row => row.amount },
        { name: 'Purchase Date', selector: row => row.purchasedDate },
        { name: 'Status', selector: row => row.status }
    ];

    // const data = [
    //     {
    //         action: '-',
    //         employee: 'Shubham Kadam',
    //         expense: 'Rent',
    //         amount: 'Rs.5000',
    //         purchaseDate: '17-04-2025',
    //         status: 'Pending'
    //     },
    //     {
    //         action: '-',
    //         employee: 'Shubham Kadam',
    //         expense: 'Rent',
    //         amount: 'Rs.5000',
    //         purchaseDate: '17-04-2025',
    //         status: 'Pending'
    //     }, {
    //         action: '-',
    //         employee: 'Shubham Kadam',
    //         expense: 'Rent',
    //         amount: 'Rs.5000',
    //         purchaseDate: '17-04-2025',
    //         status: 'Pending'
    //     }, {
    //         action: '-',
    //         employee: 'Abc Deff',
    //         expense: 'Rent',
    //         amount: 'Rs.8000',
    //         purchaseDate: '17-04-2025',
    //         status: 'Pending'
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

    const totalEntries = expense.length;
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
            <h5>Expenses</h5>
            <p style={{ fontSize: '15px', color: 'rgb(98, 98, 98)' }}>
                <span style={{ color: 'red' }}>Home</span> / Expenses
            </p>


            {showAddForm && (
                <div className="card mb-3 form-slide-container">
                    <div className="card-header d-flex justify-content-between align-items-center text-white new-emp-bg">
                        <span>Add New Expense</span>
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
                                        <label>Edit Expense Type</label>
                                        <select id="expense" value={form.expense}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setForm({ ...form, expense: value });
                                                validateField("expense", value);
                                            }}
                                            className={`form-control ${errors.expense ? "is-invalid" : ""}`}
                                            onBlur={(e) => validateField("expense", e.target.value)}
                                        >
                                            <option value="">Choose an Expense Type...</option>
                                            <option value="Utilities">Utilities</option>
                                            <option value="Rent">Rent</option>
                                            <option value="Insurance">Insurance</option>
                                            <option value="Supllies">Supllies</option>
                                            <option value="Wages">Wages</option>
                                            <option value="taxes">Taxes</option>
                                            <option value="Interest">Interest</option>
                                            <option value="Maintainance">Maintainance</option>
                                            <option value="Meals and Entertainment">Meals and Entertainment</option>
                                        </select>
                                        {errors.expense && (
                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Expense Type is Required!</p>
                                        )}
                                    </div>

                                    <div className='row'>
                                        <div className="col-md-6 mb-3">
                                            <label>Purchase Date</label>
                                            <input type="date" value={form.purchasedDate}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, purchasedDate: value });
                                                    validateField("purchasedDate", value);
                                                }}
                                                className={`form-control ${errors.purchasedDate ? "is-invalid" : ""}`}
                                                placeholder="Purchased Date"
                                                onBlur={(e) => validateField("purchasedDate", e.target.value)}

                                            />
                                            {errors.purchasedDate && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Purchased Date is Required!</p>
                                            )}
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label>Amount</label>
                                            <input type="number" value={form.amount}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, amount: value });
                                                    validateField("amount", value);
                                                }}
                                                className={`form-control ${errors.amount ? "is-invalid" : ""}`}
                                                placeholder="Amount"
                                                onBlur={(e) => validateField("amount", e.target.value)}

                                            />
                                            {errors.amount && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Amount is Required!</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label>Purchased By</label>
                                        <select id="purchasedBy" value={form.employee}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setForm({ ...form, employee: value });
                                                validateField("employee", value);
                                            }}
                                            className={`form-control ${errors.employee ? "is-invalid" : ""}`}
                                            onBlur={(e) => validateField("employee", e.target.value)}
                                        >
                                            <option value="">Purchased By</option>
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
                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Employee Name is Required!</p>
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
                                            <option value="approved">Approved</option>
                                        </select>
                                        {errors.status && (
                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Status is Required!</p>
                                        )}
                                    </div>

                                </div>

                                {/* Right Column */}
                                <div className="col-md-6">

                                    <div className="col-md-12 mb-3">
                                        <label>Bill copy</label>
                                        <input type="file" className="form-control" placeholder="Title" />
                                        <label style={{ fontSize: '12px' }}>Upload files only: gif,png,jpg,jpeg,doc,docx,xls,xlsx,pdf,txt</label>
                                    </div>

                                    <div className="mb-3">
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
                                                Description is Required!
                                            </p>
                                        )}
                                    </div>

                                </div>
                            </div>

                            <div className="text-start">
                                <button type="submit" className="btn btn-sm add-btn mb-2">Save</button>
                            </div>
                        </form>
                    </div>

                </div>
            )}



            <div className="card no-radius">
                <div className="card-header d-flex justify-content-between align-items-center text-white new-emp-bg">
                    <span>List All Expenses</span>
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
                                    <h5 className="modal-title">View Expense</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setShowModal(false)}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <p><strong>Expense Type:</strong> {selectedRow.expense}</p>
                                    <p><strong>Purchase Date:</strong> {selectedRow.purchasedDate}</p>
                                    <p><strong>Amount:</strong> {selectedRow.amount}</p>
                                    <p><strong>Purchased By:</strong> {selectedRow.employee}</p>
                                    <p><strong>Status:</strong> {selectedRow.status}</p>

                                    <p><strong>Bill copy:</strong> </p>


                                    <p> <strong>Remarks:</strong> {(selectedRow?.description || '').replace(/<[^>]+>/g, '')} </p>

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
                                        <h5 className="modal-title">Edit Expense</h5>
                                        <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                                    </div>
                                    <div className="modal-body">
                                        <form onSubmit={handleSubmit}>
                                            <div className="row">
                                                {/* Left Column */}
                                                <div className="col-md-6">
                                                    <div className="mb-3">
                                                        <label>Edit Expense Type</label>
                                                        <select id="expense" value={form.expense}
                                                            onChange={(e) => {
                                                                const { value } = e.target;
                                                                setForm({ ...form, expense: value });
                                                                validateField("expense", value);
                                                            }}
                                                            className={`form-control ${errors.expense ? "is-invalid" : ""}`}
                                                            onBlur={(e) => validateField("expense", e.target.value)}
                                                        >
                                                            <option value="">Choose an Expense Type...</option>
                                                            <option value="Utilities">Utilities</option>
                                                            <option value="Rent">Rent</option>
                                                            <option value="Insurance">Insurance</option>
                                                            <option value="Supllies">Supllies</option>
                                                            <option value="Wages">Wages</option>
                                                            <option value="taxes">Taxes</option>
                                                            <option value="Interest">Interest</option>
                                                            <option value="Maintainance">Maintainance</option>
                                                            <option value="Meals and Entertainment">Meals and Entertainment</option>
                                                        </select>
                                                        {errors.expense && (
                                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Expense Type is Required!</p>
                                                        )}
                                                    </div>

                                                    <div className='row'>
                                                        <div className="col-md-6 mb-3">
                                                            <label>Purchase Date</label>
                                                            <input type="date" value={form.purchasedDate}
                                                                onChange={(e) => {
                                                                    const { value } = e.target;
                                                                    setForm({ ...form, purchasedDate: value });
                                                                    validateField("purchasedDate", value);
                                                                }}
                                                                className={`form-control ${errors.purchasedDate ? "is-invalid" : ""}`}
                                                                placeholder="Purchased Date"
                                                                onBlur={(e) => validateField("purchasedDate", e.target.value)}

                                                            />
                                                            {errors.purchasedDate && (
                                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Purchased Date is Required!</p>
                                                            )}
                                                        </div>

                                                        <div className="col-md-6 mb-3">
                                                            <label>Amount</label>
                                                            <input type="number" value={form.amount}
                                                                onChange={(e) => {
                                                                    const { value } = e.target;
                                                                    setForm({ ...form, amount: value });
                                                                    validateField("amount", value);
                                                                }}
                                                                className={`form-control ${errors.amount ? "is-invalid" : ""}`}
                                                                placeholder="Amount"
                                                                onBlur={(e) => validateField("amount", e.target.value)}

                                                            />
                                                            {errors.amount && (
                                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Amount is Required!</p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="mb-3">
                                                        <label>Purchased By</label>
                                                        <select id="purchasedBy" value={form.employee}
                                                            onChange={(e) => {
                                                                const { value } = e.target;
                                                                setForm({ ...form, employee: value });
                                                                validateField("employee", value);
                                                            }}
                                                            className={`form-control ${errors.employee ? "is-invalid" : ""}`}
                                                            onBlur={(e) => validateField("employee", e.target.value)}
                                                        >
                                                            <option value="">Purchased By</option>
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
                                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Employee Name is Required!</p>
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
                                                            <option value="approved">Approved</option>
                                                        </select>
                                                        {errors.status && (
                                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Status is Required!</p>
                                                        )}
                                                    </div>

                                                </div>

                                                {/* Right Column */}
                                                <div className="col-md-6">

                                                    <div className="col-md-12 mb-3">
                                                        <label>Bill copy</label>
                                                        <input type="file" className="form-control" placeholder="Title" />
                                                        <label style={{ fontSize: '12px' }}>Upload files only: gif,png,jpg,jpeg,doc,docx,xls,xlsx,pdf,txt</label>
                                                    </div>

                                                    <div className="mb-3">
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
                                                                Description is Required!
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
        </div >
    );
};

export default Expense;
