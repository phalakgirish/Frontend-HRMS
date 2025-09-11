import React, { useState, useEffect, useRef } from 'react';
import DataTable from 'react-data-table-component';
import './employees.css';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { getTermination, createTermination, updateTermination, deleteTermination } from '../../api/terminationApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';




const Terminations = () => {

    const [showModal, setShowModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [description, setDescription] = useState('');
    const [editId, setEditId] = useState(null);

    const editorRef = useRef(null);
    const [editorKey, setEditorKey] = useState(0);
    //from backend
    const [Termination, setTermination] = useState([]);
    // const [paginated, setPaginated] = useState([]);


    const [form, setForm] = useState({
        employee: '',
        terminationType: '',
        noticeDate: '',
        terminationDate: '',
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

    const validateField = (fieldName, value = "") => {
        let error = "";

        let displayName = fieldName
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, str => str.toUpperCase());

        value = value.toString();

        switch (fieldName) {
            case "employee":
                if (!value.trim()) error = `${displayName} is required`;
                break;

            case "terminationType":
                if (!value.trim()) error = `${displayName} is required`;
                break;

            case "noticeDate":
                if (!value.trim()) error = `${displayName} is required`;
                break;

            case "terminationDate":
                if (!value.trim()) error = `${displayName} is required`;
                break;

            case "approvalStatus":
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


    useEffect(() => {
        fetcTermination();
    }, []);

    const fetcTermination = async () => {
        try {
            const response = await getTermination();
            setTermination(response.data);
            paginate(response.data, currentPage);
        } catch (error) {
            console.error('Error fetching Termination:', error);
        }
    };

    const emptyForm = {
        employee: '',
        terminationType: '',
        noticeDate: '',
        terminationDate: '',
        approvalStatus: '',
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
                    await updateTermination(editId, form);
                    toast.success("Termination updated successfully!");

                    setEditId(null);
                } else {
                    await createTermination(form);
                    toast.success("Termination saved successfully!");

                }
                fetcTermination();
                setForm({
                    employee: '',
                    terminationType: '',
                    noticeDate: '',
                    terminationDate: '',
                    approvalStatus: '',
                    description: ''
                });
                setEditId("");
                setShowEditModal(false);
            } catch (err) {
                console.error("Error saving Termination:", err);
                toast.error("Termination failed to save!");

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
            employee: row.employee,
            terminationType: row.terminationType,
            noticeDate: row.noticeDate,
            terminationDate: row.terminationDate,
            approvalStatus: row.approvalStatus,
            description: row.description
        });
        setShowEditModal(true);
        setSelectedRow(row);
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this Termination?");
        if (!confirmDelete) return;
        try {
            await deleteTermination(id);
            fetcTermination();
        } catch (err) {
            console.error("Error deleting Termination:", err);
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
        { name: 'Employee', selector: row => row.employee },
        { name: 'Termination Type', selector: row => row.terminationType },
        { name: 'Notice Date', selector: row => row.noticeDate },
        { name: 'Termination Date', selector: row => row.terminationDate },
        { name: 'Approval Status', selector: row => row.approvalStatus },
    ];

    // const data = [
    //     {
    //         action: '-',
    //         employee: 'Rohit Mahadic',
    //         terminationType: 'Misconduct',
    //         noticeDate: '17-May-2022',
    //         terminationDate: '17-Jun-2022',
    //         approvalStatus: 'Pending'
    //     },
    //     {
    //         action: '-',
    //         employee: 'Rohit Mahadic',
    //         terminationType: 'Misconduct',
    //         noticeDate: '17-May-2022',
    //         terminationDate: '17-Jun-2022',
    //         approvalStatus: 'Pending'
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

    const totalEntries = Termination.length;
    const totalPages = Math.ceil(totalEntries / rowsPerPage);
     const [paginated, setPaginated] = useState(Termination.slice(0, rowsPerPage));
   
       const paginate = (data, page) => {
           const start = (page - 1) * rowsPerPage;
           const end = start + rowsPerPage;
           setPaginated(data.slice(start, end));
           setCurrentPage(page);
       };
   
       const startEntry = (currentPage - 1) * rowsPerPage + 1;
       const endEntry = Math.min(currentPage * rowsPerPage, Termination.length);
       useEffect(() => {
           const start = (currentPage - 1) * rowsPerPage;
           const end = start + rowsPerPage;
           setPaginated(Termination.slice(start, end));
       }, [Termination, currentPage, rowsPerPage]);

    const [showAddForm, setShowAddForm] = useState(false);

    const toggleAddForm = () => {
        setShowAddForm((prev) => !prev);
    };

    return (
        <div className="custom-container">
            <h5>Terminations</h5>
            <p style={{ fontSize: '15px', color: 'rgb(98, 98, 98)' }}>
                <span style={{ color: 'red' }}>Home</span> / Terminations
            </p>


            {showAddForm && (
                <div className="card mb-3 form-slide-container">
                    <div className="card-header d-flex justify-content-between align-items-center text-white new-emp-bg">
                        <span>Add New Termination</span>
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
                                        <label>Employee Terminated</label>
                                        <select id="resignEmployee" value={form.employee}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setForm({ ...form, employee: value });
                                                validateField("employee", value);
                                            }}
                                            className={`form-control ${errors.employee ? "is-invalid" : ""}`}
                                            onBlur={(e) => validateField("employee", e.target.value)}
                                        >
                                            <option value="">Choose an Employee</option>
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
                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Employee Name is required!</p>)}
                                    </div>

                                    <div className='row'>
                                        <div className="col-md-6 mb-3">
                                            <label>Notice Date</label>
                                            <input type="date" value={form.noticeDate}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, noticeDate: value });
                                                    validateField("noticeDate", value);
                                                }}
                                                className={`form-control ${errors.noticeDate ? "is-invalid" : ""}`}
                                                onBlur={(e) => validateField("noticeDate", e.target.value)}

                                            />
                                            {errors.noticeDate && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Notice Date is required!</p>)}
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label>Termination Date</label>
                                            <input type="date" value={form.terminationDate}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, terminationDate: value });
                                                    validateField("terminationDate", value);
                                                }}
                                                className={`form-control ${errors.terminationDate ? "is-invalid" : ""}`}
                                                onBlur={(e) => validateField("terminationDate", e.target.value)}

                                            />
                                            {errors.terminationDate && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Termination Date is required!</p>)}
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label>Termination Type</label>
                                        <select id="resignEmployee" value={form.terminationType}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setForm({ ...form, terminationType: value });
                                                validateField("terminationType", value);
                                            }}
                                            className={`form-control ${errors.terminationType ? "is-invalid" : ""}`}
                                            onBlur={(e) => validateField("terminationType", e.target.value)}
                                        >
                                            <option value="">Select Termination Type</option>
                                            <option value="Layoff">Layoff</option>
                                            <option value="Damaging Company Property">Damaging Company Property</option>
                                            <option value="Drug or Alcohol Possession at Work">Drug or Alcohol Possession at Work</option>
                                            <option value="Falsifying Company Records">Falsifying Company Records</option>
                                            <option value="Insubordination">Insubordination</option>
                                            <option value="Misconduct">Misconduct</option>
                                            <option value="Poor Perfprmance">Poor Perfprmance</option>
                                            <option value="Stealing">Stealing</option>
                                            <option value="Using Company Property for Personal Business">Using Company Property for Personal Business</option>
                                            <option value="Taking Too Much Time Off">Taking Too Much Time Off</option>
                                            <option value="Violating Company Policy">Violating Company Policy</option>
                                            <option value="Voluntary Termination">Voluntary Termination</option>
                                            <option value="Involuntary Termination">Involuntary Termination</option>
                                            <option value="Discriminatory Conduct Towards Others">Discriminatory Conduct Towards Others</option>
                                            <option value="Harassment (Sexual and Otherwise)">Harassment (Sexual and Otherwise)</option>

                                        </select>
                                        {errors.terminationType && (
                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Termination Type is required!</p>)}
                                    </div>

                                </div>

                                {/* Right Column */}
                                <div className="col-md-6">

                                    <div className="mb-3">
                                        <label>Approval Status</label>
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
                                        <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Description is required!</p>)}
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
                    <span>List All Terminations</span>
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
                                    <h5 className="modal-title">View Termination</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setShowModal(false)}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <p><strong>Employee Terminated:</strong> {selectedRow.employee}</p>
                                    <p><strong>Notice Date:</strong> {selectedRow.noticeDate}</p>
                                    <p><strong>Termination Date:</strong> {selectedRow.terminationDate}</p>
                                    <p><strong>Termination Type:</strong> {selectedRow.terminationType}</p>
                                    <p><strong>Status:</strong> {selectedRow.approvalStatus}</p>
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
                                        <h5 className="modal-title">Edit Termination</h5>
                                        <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                                    </div>
                                    <div className="modal-body">
                                        <form onSubmit={handleSubmit}>
                                            <div className="row">
                                                {/* Left Column */}
                                                <div className="col-md-6">
                                                    <div className="mb-3">
                                                        <label>Employee Terminated</label>
                                                        <select id="resignEmployee" value={form.employee}
                                                            onChange={(e) => {
                                                                const { value } = e.target;
                                                                setForm({ ...form, employee: value });
                                                                validateField("employee", value);
                                                            }}
                                                            className={`form-control ${errors.employee ? "is-invalid" : ""}`}
                                                            onBlur={(e) => validateField("employee", e.target.value)}
                                                        >
                                                            <option value="">Choose an Employee</option>
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
                                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Employee Name is required!</p>)}
                                                    </div>

                                                    <div className='row'>
                                                        <div className="col-md-6 mb-3">
                                                            <label>Notice Date</label>
                                                            <input type="date" value={form.noticeDate}
                                                                onChange={(e) => {
                                                                    const { value } = e.target;
                                                                    setForm({ ...form, noticeDate: value });
                                                                    validateField("noticeDate", value);
                                                                }}
                                                                className={`form-control ${errors.noticeDate ? "is-invalid" : ""}`}
                                                                onBlur={(e) => validateField("noticeDate", e.target.value)}

                                                            />
                                                            {errors.noticeDate && (
                                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Notice Date is required!</p>)}
                                                        </div>

                                                        <div className="col-md-6 mb-3">
                                                            <label>Termination Date</label>
                                                            <input type="date" value={form.terminationDate}
                                                                onChange={(e) => {
                                                                    const { value } = e.target;
                                                                    setForm({ ...form, terminationDate: value });
                                                                    validateField("terminationDate", value);
                                                                }}
                                                                className={`form-control ${errors.terminationDate ? "is-invalid" : ""}`}
                                                                onBlur={(e) => validateField("terminationDate", e.target.value)}

                                                            />
                                                            {errors.terminationDate && (
                                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Termination Date is required!</p>)}
                                                        </div>
                                                    </div>

                                                    <div className="mb-3">
                                                        <label>Termination Type</label>
                                                        <select id="resignEmployee" value={form.terminationType}
                                                            onChange={(e) => {
                                                                const { value } = e.target;
                                                                setForm({ ...form, terminationType: value });
                                                                validateField("terminationType", value);
                                                            }}
                                                            className={`form-control ${errors.terminationType ? "is-invalid" : ""}`}
                                                            onBlur={(e) => validateField("terminationType", e.target.value)}
                                                        >
                                                            <option value="">Select Termination Type</option>
                                                            <option value="Layoff">Layoff</option>
                                                            <option value="Damaging Company Property">Damaging Company Property</option>
                                                            <option value="Drug or Alcohol Possession at Work">Drug or Alcohol Possession at Work</option>
                                                            <option value="Falsifying Company Records">Falsifying Company Records</option>
                                                            <option value="Insubordination">Insubordination</option>
                                                            <option value="Misconduct">Misconduct</option>
                                                            <option value="Poor Perfprmance">Poor Perfprmance</option>
                                                            <option value="Stealing">Stealing</option>
                                                            <option value="Using Company Property for Personal Business">Using Company Property for Personal Business</option>
                                                            <option value="Taking Too Much Time Off">Taking Too Much Time Off</option>
                                                            <option value="Violating Company Policy">Violating Company Policy</option>
                                                            <option value="Voluntary Termination">Voluntary Termination</option>
                                                            <option value="Involuntary Termination">Involuntary Termination</option>
                                                            <option value="Discriminatory Conduct Towards Others">Discriminatory Conduct Towards Others</option>
                                                            <option value="Harassment (Sexual and Otherwise)">Harassment (Sexual and Otherwise)</option>

                                                        </select>
                                                        {errors.terminationType && (
                                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Termination Type is required!</p>)}
                                                    </div>

                                                </div>

                                                {/* Right Column */}
                                                <div className="col-md-6">

                                                    <div className="mb-3">
                                                        <label>Approval Status</label>
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

export default Terminations;
