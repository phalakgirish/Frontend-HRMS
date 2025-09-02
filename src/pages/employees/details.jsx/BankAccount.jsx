import React from "react";
import { useState, useRef, useEffect } from "react";
import DataTable from 'react-data-table-component';
import { getEmployeeBankAccount, createEmployeeBankAccount, updateEmployeeBankAccount, deleteEmployeeBankAccount } from "./apis/bankAccountApi";
import { toast } from "react-toastify"

const BankAccount = ({ employeeId, mode }) => {
    useEffect(() => {
    }, [employeeId]);

    const [showModal, setShowModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [description, setDescription] = useState('');
    const editorRef = useRef(null);
    const [editorKey, setEditorKey] = useState(0);
    const [bankAccountList, setBankAccountList] = useState([]);
    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);

    //from backend
    const [BankAccount, setBankAccount] = useState([]);
    const [paginated, setPaginated] = useState([]);

    const [editId, setEditId] = useState(null);

    const [form, setForm] = useState({
        account_title: "",
        account_number: "",
        account_bank_name: "",
        aacount_bank_code: "",
        account_bank_branch: "",
        account_bank_doc: "",

    });

    const handleView = (row) => {
        setSelectedRow(row);
        setShowModal(true);
    };


    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) setForm({ ...form, account_bank_doc: file });
    };




    // Reset form
    const resetForm = () => {
        setForm({
            account_title: "",
            account_number: "",
            account_bank_name: "",
            aacount_bank_code: "",
            account_bank_branch: "",
            account_bank_doc: "",

        });
        setEditId(null);
    };

    const handleSubmit = async (e) => {
        console.log("data is sending.............", form);

        e.preventDefault();

        if (!employeeId) return toast.error("Employee ID missing");

        try {
            const formData = new FormData();
            formData.append("employeeId", employeeId);
            formData.append("account_title", form.account_title);
            formData.append("account_number", form.account_number);
            formData.append("account_bank_name", form.account_bank_name);
            formData.append("aacount_bank_code", form.aacount_bank_code);
            formData.append("account_bank_branch", form.account_bank_branch);

            if (form.account_bank_doc) {
                formData.append("document_file", form.account_bank_doc);
            }



            if (editId) {
                await updateEmployeeBankAccount(editId, formData);
                toast.success("BankAccount detail updated!");
            } else {
                await createEmployeeBankAccount(formData);
                toast.success("BankAccount detail added!");
            }

            fetchBankAccount();
            resetForm();
            setSelectedFile(null);
            setShowEditModal(false);
        } catch (err) {
            console.error("Error saving BankAccount detail:", err);
            toast.error("Failed to save!");
        }
    };


    const fetchBankAccount = async () => {
        if (!employeeId) return;
        try {
            const res = await getEmployeeBankAccount(employeeId);
            console.log("BankAccount list:", res.data);
            setBankAccountList(res.data);
        } catch (err) {
            console.error("Error fetching BankAccount:", err);
        }
    };

    useEffect(() => {
        fetchBankAccount();
    }, [employeeId]);


    const handleEdit = (row) => {
        setForm({
            account_title: row.account_title,
            account_number: row.account_number,
            account_bank_name: row.account_bank_name,
            aacount_bank_code: row.aacount_bank_code,
            account_bank_branch: row.account_bank_branch,
            account_bank_doc: row.account_bank_doc,
        });

        setEditId(row._id);
        setShowEditModal(true);
        setSelectedRow(row);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this record?")) return;

        try {
            await deleteEmployeeBankAccount(id);
            fetchBankAccount();
            toast.success("Deleted successfully!");
        } catch (err) {
            console.error("Error deleting:", err);
            toast.error("Failed to delete!");
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
        { name: 'Account Title', selector: row => row.account_title },
        { name: 'Account Number', selector: row => row.account_number },
        { name: 'Bank Name', selector: row => row.account_bank_name },
        { name: 'Bank Code', selector: row => row.aacount_bank_code },
        { name: 'Bank Branch', selector: row => row.account_bank_branch }


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

    const totalEntries = bankAccountList.length;
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

    useEffect(() => {
        paginate(bankAccountList, currentPage);
    }, [bankAccountList, currentPage, rowsPerPage]);

    return (
        <div>
            {mode === "edit" && (

                <div className="container-fluid mt-4">
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            {/* Left Column */}
                            <div className="col-md-6 mb-3">
                                <label>Account Title</label>
                                <input
                                    type="text"
                                    placeholder="Account Title"
                                    className="form-control"
                                    name="account_title"
                                    value={form.account_title}
                                    onChange={(e) => setForm({ ...form, account_title: e.target.value })}
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label>Account Number</label>
                                <input
                                    type="text"
                                    placeholder="Account Number"
                                    className="form-control"
                                    name="account_number"
                                    value={form.account_number}
                                    onChange={(e) => setForm({ ...form, account_number: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label>Bank Name</label>
                                <input
                                    type="text"
                                    placeholder="Bank Name"
                                    className="form-control"
                                    name="account_bank_name"
                                    value={form.account_bank_name}
                                    onChange={(e) => setForm({ ...form, account_bank_name: e.target.value })}
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label>Bank Code</label>
                                <input
                                    type="text"
                                    placeholder="Bank Code"
                                    className="form-control"
                                    name="aacount_bank_code"
                                    value={form.aacount_bank_code}
                                    onChange={(e) => setForm({ ...form, aacount_bank_code: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label>Bank Branch</label>
                                <input
                                    type="text"
                                    placeholder="Bank Branch"
                                    className="form-control"
                                    name="account_bank_branch"
                                    value={form.account_bank_branch}
                                    onChange={(e) => setForm({ ...form, account_bank_branch: e.target.value })}
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label>Document File</label>
                                <input
                                    className="form-control"
                                    type="file"
                                    ref={fileInputRef}
                                    name="document_file"
                                    onChange={handleFileChange}
                                />

                            </div>
                        </div>


                        <div className="text-start mb-4">
                            <button type="submit" className="btn btn-sm add-btn">Save</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="card no-radius">
                <div className="card-header d-flex justify-content-between align-items-center text-white new-emp-bg">
                    <span>List All Bank Account Details</span>
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

                {showModal && selectedRow && (
                    <div className="modal show fade d-block" tabIndex="-1" role="dialog">
                        <div className="modal-dialog modal-dialog-centered" role="BankAccount">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">View Bank Account Details</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setShowModal(false)}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <p><strong>Account Title:</strong> {selectedRow.account_title}</p>
                                    <p><strong>Account Number:</strong> {selectedRow.account_number}</p>
                                    <p><strong>Bank Name:</strong> {selectedRow.account_bank_name}</p>
                                    <p><strong>Bank Code:</strong> {selectedRow.aacount_bank_code}</p>
                                    <p><strong>Bank Branch:</strong> {selectedRow.account_bank_branch}</p>

                                    <p>
                                        <strong>Document File:</strong>
                                        {selectedRow.account_bank_doc ? (
                                            <a
                                                href={`http://localhost:3000/employee-bankaccount/download/${selectedRow.account_bank_doc.split('/').pop()}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="ms-2"
                                            >
                                                Download
                                            </a>
                                        ) : (
                                            "No file uploaded"
                                        )}


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
                                        <h5 className="modal-title">Edit Promotion</h5>
                                        <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                                    </div>
                                    <div className="modal-body">
                                        <form onSubmit={handleSubmit}>
                                            <div className="row">
                                                {/* Left Column */}
                                                <div className="col-md-6 mb-3">
                                                    <label>Account Title</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Account Title"
                                                        className="form-control"
                                                        name="account_title"
                                                        value={form.account_title}
                                                        onChange={(e) => setForm({ ...form, account_title: e.target.value })}
                                                    />
                                                </div>

                                                <div className="col-md-6 mb-3">
                                                    <label>Account Number</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Account Number"
                                                        className="form-control"
                                                        name="account_number"
                                                        value={form.account_number}
                                                        onChange={(e) => setForm({ ...form, account_number: e.target.value })}
                                                    />
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="col-md-6 mb-3">
                                                    <label>Bank Name</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Bank Name"
                                                        className="form-control"
                                                        name="account_bank_name"
                                                        value={form.account_bank_name}
                                                        onChange={(e) => setForm({ ...form, account_bank_name: e.target.value })}
                                                    />
                                                </div>

                                                <div className="col-md-6 mb-3">
                                                    <label>Bank Code</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Bank Code"
                                                        className="form-control"
                                                        name="aacount_bank_code"
                                                        value={form.aacount_bank_code}
                                                        onChange={(e) => setForm({ ...form, aacount_bank_code: e.target.value })}
                                                    />
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="col-md-6 mb-3">
                                                    <label>Bank Branch</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Bank Branch"
                                                        className="form-control"
                                                        name="account_bank_branch"
                                                        value={form.account_bank_branch}
                                                        onChange={(e) => setForm({ ...form, account_bank_branch: e.target.value })}
                                                    />
                                                </div>

                                                {/* <div className="col-md-6 mb-3">
                                <label>Document File</label>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    accept=".png,.jpg,.jpeg,.gif,.txt,.pdf,.xls,.xlsx,.doc,.docx"
                                    className="form-control"
                                    name="document_file"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        setForm({ ...form, document_file: file });
                                    }}
                                />
                            </div> */}
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
export default BankAccount;