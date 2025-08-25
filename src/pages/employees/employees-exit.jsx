import React, { useState, useEffect, useRef } from 'react';
import DataTable from 'react-data-table-component';
import './employees.css';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { getEmployeeExit, createEmployeeExit, updateEmployeeExit, deleteEmployeeExit } from '../../api/employeeexitApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Employeeexit = () => {

    const [showModal, setShowModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [description, setDescription] = useState('');
    const [editId, setEditId] = useState(null);
    const editorRef = useRef(null);
    const [editorKey, setEditorKey] = useState(0);

    //from backend
    const [EmployeeExit, setEmployeeExit] = useState([]);
    const [paginated, setPaginated] = useState([]);


    const [form, setForm] = useState({
        employee: '',
        exitType: '',
        exitDate: '',
        exitInterview: '',
        inactivateAccount: '',
        exitChecklist: '',
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
        fetchEmployeeExit();
    }, []);

    const fetchEmployeeExit = async () => {
        try {
            const response = await getEmployeeExit();
            setEmployeeExit(response.data);
            paginate(response.data, currentPage);
        } catch (error) {
            console.error('Error fetching EmployeeExit:', error);
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {

            try {
                if (editId) {
                    await updateEmployeeExit(editId, form);
                    toast.success("Employee Exit updated successfully!");

                    setEditId(null);
                } else {
                    await createEmployeeExit(form);
                    toast.success("Employee Exit saved successfully!");

                }
                fetchEmployeeExit();
                setForm({
                    employee: '',
                    exitType: '',
                    exitDate: '',
                    exitInterview: '',
                    inactivateAccount: '',
                    exitChecklist: '',
                    addedBy: '',
                    description: ''
                });
                setEditId("");
                setShowEditModal(false);
            } catch (err) {
                console.error("Error saving EmployeeExit:", err);
                toast.error("Employee Exit failed to save!");

            }
        }
    };

    const handleView = (row) => {
        setSelectedRow(row);
        setShowModal(true);
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

            case "exitType":
                if (!value.trim()) error = `${displayName} is required`;
                break;

            case "exitDate":
                if (!value.trim()) error = `${displayName} is required`;
                break;

            case "exitInterview":
                if (!value.trim()) error = `${displayName} is required`;
                break;

            case "inactivateAccount":
                if (!value.trim()) error = `${displayName} is required`;
                break;

            case "exitChecklist":
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


    const emptyForm = {
        employee: '',
        exitType: '',
        exitDate: '',
        exitInterview: '',
        inactivateAccount: '',
        exitChecklist: '',
        addedBy: '',
        description: ''
    };

    const resetForm = () => {
        setForm(emptyForm);
        setEditId(null);
        setShowEditModal(false);
    };


    const handleEdit = (row) => {
        setEditId(row._id);
        setForm({
            employee: row.employee,
            exitType: row.exitType,
            exitDate: row.exitDate,
            exitInterview: row.exitInterview,
            inactivateAccount: row.inactivateAccount,
            exitChecklist: row.exitChecklist,
            addedBy: row.addedBy,
            description: row.description
        });
        setShowEditModal(true);
        setSelectedRow(row);
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this EmployeeExit?");
        if (!confirmDelete) return;
        try {
            await deleteEmployeeExit(id);
            fetchEmployeeExit();
        } catch (err) {
            console.error("Error deleting EmployeeExit:", err);
        }
    };

    const handleChecklistChange = (e) => {
        const { value, checked } = e.target;

        setForm((prevForm) => {
            if (checked) {
                // add value
                return { ...prevForm, exitChecklist: [...prevForm.exitChecklist, value] };
            } else {
                // remove value
                return {
                    ...prevForm,
                    exitChecklist: prevForm.exitChecklist.filter((item) => item !== value)
                };
            }
        });
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
        { name: 'Exit Type', selector: row => row.exitType },
        { name: 'Exit Date', selector: row => row.exitDate },
        { name: 'Exit Interview', selector: row => row.exitInterview },
        { name: 'Inactivate Account', selector: row => row.inactivateAccount },
        { name: 'Added By', selector: row => row.addedBy },

    ];

    // const data = [
    //     {
    //         action: '-',
    //         employee: 'Rohit Mahadic',
    //         exitType: 'Retirement',
    //         exitDate: '17-May-2022',
    //         exitInterview: 'Yes',
    //         inactivateAccount: 'Yes',
    //         addedBy: 'Admin Admin'
    //     },
    //     {
    //         action: '-',
    //         employee: 'Rohit Mahadicc',
    //         exitType: 'Retirement',
    //         exitDate: '17-May-2022',
    //         exitInterview: 'Yes',
    //         inactivateAccount: 'Yes',
    //         addedBy: 'Admin Admin'
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

    const totalEntries = EmployeeExit.length;
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
            <h5>Employee Exit</h5>
            <p style={{ fontSize: '15px', color: 'rgb(98, 98, 98)' }}>
                <span style={{ color: 'red' }}>Home</span> / Employee Exit
            </p>


            {showAddForm && (
                <div className="card mb-3 form-slide-container">
                    <div className="card-header d-flex justify-content-between align-items-center text-white new-emp-bg">
                        <span>Add New Employee Exit</span>
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
                                        <label>Employee Exit</label>
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
                                            <label>Exit Date</label>
                                            <input type="date" value={form.exitDate}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, exitDate: value });
                                                    validateField("exitDate", value);
                                                }}
                                                className={`form-control ${errors.exitDate ? "is-invalid" : ""}`}
                                                onBlur={(e) => validateField("exitDate", e.target.value)}

                                            />
                                            {errors.exitDate && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Exit Date is required!</p>)}
                                        </div>


                                        <div className="col-md-6 mb-3">
                                            <label>Type of Exit</label>
                                            <select id="resignEmployee" value={form.exitType}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, exitType: value });
                                                    validateField("exitType", value);
                                                }}
                                                className={`form-control ${errors.exitType ? "is-invalid" : ""}`}
                                                onBlur={(e) => validateField("exitType", e.target.value)}
                                            >
                                                <option value="">Type of Exit</option>
                                                <option value="Resignation">Resignation</option>
                                                <option value="Retirement">Retirement</option>
                                                <option value="End of Contract">End of Contract</option>
                                                <option value="End of Project">End of Project</option>
                                                <option value="Dismissal">Dismissal</option>
                                                <option value="Layoff">Layoff</option>
                                                <option value="Termination by Mutual Agreement">Termination by Mutual Agreement</option>
                                                <option value="Forced Resignation">Forced Resignation</option>
                                                <option value="End of Temporary Appointment">End of Temporary Appointment</option>
                                                <option value="Abadonment">Abadonment</option>
                                                <option value="Death">Death</option>
                                            </select>
                                            {errors.exitType && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Exit Type is required!</p>)}
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className="col-md-6 mb-3">
                                            <label>Exit Interview</label>
                                            <select id="resignEmployee" value={form.exitInterview}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, exitInterview: value });
                                                    validateField("exitInterview", value);
                                                }}
                                                className={`form-control ${errors.exitInterview ? "is-invalid" : ""}`}
                                                onBlur={(e) => validateField("exitInterview", e.target.value)}
                                            >
                                                <option value="">Exit Interview</option>
                                                <option value="Yes">Yes</option>
                                                <option value="No">No</option>
                                            </select>
                                            {errors.exitInterview && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>This field is required!</p>)}
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label>Inactivate Employee Account</label>
                                            <select id="inactvatAcc" value={form.inactivateAccount}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, inactivateAccount: value });
                                                    validateField("inactivateAccount", value);
                                                }}
                                                className={`form-control ${errors.inactivateAccount ? "is-invalid" : ""}`}
                                                onBlur={(e) => validateField("inactivateAccount", e.target.value)}
                                            >
                                                <option value="">Inactivate Employee Account</option>
                                                <option value="yes">Yes</option>
                                                <option value="no">No</option>
                                            </select>
                                            {errors.inactivateAccount && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>This field is required!</p>)}
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label d-block">Exit Checklist</label>

                                        {["No Dues", "Final Settlement", "Experience Certificate"].map((item) => (
                                            <div className="form-check form-check-inline" key={item}>
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id={item.replace(/\s+/g, '')}
                                                    value={item}
                                                    checked={form.exitChecklist.includes(item)}
                                                    onChange={handleChecklistChange}
                                                    style={{ width: '16px', height: '16px' }}
                                                />

                                                <label className="form-check-label" htmlFor={item.replace(/\s+/g, '')}>
                                                    {item}
                                                </label>
                                            </div>
                                        ))}
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
                    <span>List All Employee Exit</span>
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
                                    <h5 className="modal-title">View Employee Exit</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setShowModal(false)}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <p><strong>Employee To Exit:</strong> {selectedRow.employee}</p>
                                    <p><strong>Exit Date:</strong> {selectedRow.exitDate}</p>
                                    <p><strong>Type of Exit:</strong> {selectedRow.exitType}</p>
                                    <p><strong>Exit Interview:</strong> {selectedRow.exitInterview}</p>
                                    <p><strong>Inactive Employee Account:</strong> {selectedRow.inactivateAccount}</p>

                                    <p><strong>Exit Checklist:</strong> {selectedRow?.exitChecklist?.join(", ")}</p>

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
                                        <h5 className="modal-title">Edit Employee Exit</h5>
                                        <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                                    </div>
                                    <div className="modal-body">
                                        <form onSubmit={handleSubmit}>
                                            <div className="row">
                                                {/* Left Column */}
                                                <div className="col-md-6">
                                                    <div className="mb-3">
                                                        <label>Employee Exit</label>
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
                                                            <label>Exit Date</label>
                                                            <input type="date" value={form.exitDate}
                                                                onChange={(e) => {
                                                                    const { value } = e.target;
                                                                    setForm({ ...form, exitDate: value });
                                                                    validateField("exitDate", value);
                                                                }}
                                                                className={`form-control ${errors.exitDate ? "is-invalid" : ""}`}
                                                                onBlur={(e) => validateField("exitDate", e.target.value)}

                                                            />
                                                            {errors.exitDate && (
                                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Exit Date is required!</p>)}
                                                        </div>


                                                        <div className="col-md-6 mb-3">
                                                            <label>Type of Exit</label>
                                                            <select id="resignEmployee" value={form.exitType}
                                                                onChange={(e) => {
                                                                    const { value } = e.target;
                                                                    setForm({ ...form, exitType: value });
                                                                    validateField("exitType", value);
                                                                }}
                                                                className={`form-control ${errors.exitType ? "is-invalid" : ""}`}
                                                                onBlur={(e) => validateField("exitType", e.target.value)}
                                                            >
                                                                <option value="">Type of Exit</option>
                                                                <option value="Resignation">Resignation</option>
                                                                <option value="Retirement">Retirement</option>
                                                                <option value="End of Contract">End of Contract</option>
                                                                <option value="End of Project">End of Project</option>
                                                                <option value="Dismissal">Dismissal</option>
                                                                <option value="Layoff">Layoff</option>
                                                                <option value="Termination by Mutual Agreement">Termination by Mutual Agreement</option>
                                                                <option value="Forced Resignation">Forced Resignation</option>
                                                                <option value="End of Temporary Appointment">End of Temporary Appointment</option>
                                                                <option value="Abadonment">Abadonment</option>
                                                                <option value="Death">Death</option>
                                                            </select>
                                                            {errors.exitType && (
                                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Exit Type is required!</p>)}
                                                        </div>
                                                    </div>

                                                    <div className='row'>
                                                        <div className="col-md-6 mb-3">
                                                            <label>Exit Interview</label>
                                                            <select id="resignEmployee" value={form.exitInterview}
                                                                onChange={(e) => {
                                                                    const { value } = e.target;
                                                                    setForm({ ...form, exitInterview: value });
                                                                    validateField("exitInterview", value);
                                                                }}
                                                                className={`form-control ${errors.exitInterview ? "is-invalid" : ""}`}
                                                                onBlur={(e) => validateField("exitInterview", e.target.value)}
                                                            >
                                                                <option value="">Exit Interview</option>
                                                                <option value="Yes">Yes</option>
                                                                <option value="No">No</option>
                                                            </select>
                                                            {errors.exitInterview && (
                                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>This field is required!</p>)}
                                                        </div>

                                                        <div className="col-md-6 mb-3">
                                                            <label>Inactivate Employee Account</label>
                                                            <select id="inactvatAcc" value={form.inactivateAccount}
                                                                onChange={(e) => {
                                                                    const { value } = e.target;
                                                                    setForm({ ...form, inactivateAccount: value });
                                                                    validateField("inactivateAccount", value);
                                                                }}
                                                                className={`form-control ${errors.inactivateAccount ? "is-invalid" : ""}`}
                                                                onBlur={(e) => validateField("inactivateAccount", e.target.value)}
                                                            >
                                                                <option value="">Inactivate Employee Account</option>
                                                                <option value="yes">Yes</option>
                                                                <option value="no">No</option>
                                                            </select>
                                                            {errors.inactivateAccount && (
                                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>This field is required!</p>)}
                                                        </div>
                                                    </div>

                                                    <div className="mb-3">
                                                        <label className="form-label d-block">Exit Checklist</label>

                                                        {["No Dues", "Final Settlement", "Experience Certificate"].map((item) => (
                                                            <div className="form-check form-check-inline" key={item}>
                                                                <input
                                                                    className="form-check-input"
                                                                    type="checkbox"
                                                                    id={item.replace(/\s+/g, '')}
                                                                    value={item}
                                                                    checked={form.exitChecklist.includes(item)}
                                                                    onChange={handleChecklistChange}
                                                                    style={{ width: '16px', height: '16px' }}
                                                                />

                                                                <label className="form-check-label" htmlFor={item.replace(/\s+/g, '')}>
                                                                    {item}
                                                                </label>
                                                            </div>
                                                        ))}
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

export default Employeeexit;
