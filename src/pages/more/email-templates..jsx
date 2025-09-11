import React, { useState, useEffect, useRef } from 'react';
import DataTable from 'react-data-table-component';
// import './organization.css';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { getEmailTemplates, createEmailTemplates, updateEmailTemplates, deleteEmailTemplates } from '../../api/emailTemplatesApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const EmailTemplates = () => {

    // const [showModal, setShowModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [description, setDescription] = useState('<div class="mb-3"><label>Hello, Your Payslip is generated</label></div>');
    const editorRef = useRef(null);
    const [editorKey, setEditorKey] = useState(0);

    //from backend
    const [EmailTemplates, setEmailTemplates] = useState([]);
    // const [paginated, setPaginated] = useState([]);

    const [editId, setEditId] = useState(null);

    const [form, setForm] = useState({
        templateName: '',
        subject: '',
        status: ''
    });

    const [errors, setErrors] = useState({});
    const validateForm = () => {
        let newErrors = {};
        const requiredFields = [
            "templateName",
            'subject',
            "status"
        ];

        requiredFields.forEach((field) => {
            if (!form[field] || form[field].toString().trim() === "") {
                newErrors[field] = `${field.replace(/([A-Z])/g, " $1")} is required`;
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    useEffect(() => {
        fetchEmailTemplates();
    }, []);

    const fetchEmailTemplates = async () => {
        try {
            const response = await getEmailTemplates();
            setEmailTemplates(response.data);
            paginate(response.data, currentPage);
        } catch (error) {
            console.error('Error fetching EmailTemplates:', error);
        }
    };


    const validateField = (fieldName, value = "") => {
        let error = "";

        let displayName = fieldName
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, str => str.toUpperCase());

        value = value.toString().trim();

        switch (fieldName) {
            case "subject":
            case "templateName":
            case "status":
                if (!value) error = `${displayName} is required`;
                break;

            default:
                break;
        }

        setErrors(prev => ({ ...prev, [fieldName]: error }));
        return error;
    };



    const handleSubmit = async (e) => {
        console.log("this is submit", form);

        e.preventDefault();
        if (validateForm()) {

            try {
                if (editId) {
                    await updateEmailTemplates(editId, form);
                    toast.success("Email Templates updated successfully!");

                } else {
                    await createEmailTemplates(form);
                    toast.success("Email Templates saved successfully!");

                }
                setForm(selectedRow);

                setForm({
                    templateName: '',
                    subject: '',
                    status: ''
                });
                setEditId("");
                setSelectedRow(null);
                setShowEditModal(false);

                fetchEmailTemplates();
            } catch (err) {
                console.error("Error saving Email Templates:", err);
                toast.error("Email Templates failed to save!");

            }
        }
    };


    const emptyForm = {
        templateName: '',
        subject: '',
        status: ''
    };

    const resetForm = () => {
        setForm(emptyForm);
        setEditId(null);
        setShowEditModal(false);
    };

    const handleEdit = (row) => {
        setForm({
            templateName: row.templateName,
            subject: row.subject,
            status: row.status
        });
        setEditId(row._id);
        setShowEditModal(true);
        setSelectedRow(row);
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this EmailTemplates?");
        if (!confirmDelete) return;
        try {
            await deleteEmailTemplates(id);
            fetchEmailTemplates();
        } catch (err) {
            console.error("Error deleting EmailTemplates:", err);
        }
    };

    // const handleView = (row) => {
    //     setSelectedRow(row);
    //     setShowModal(true);
    // };

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
        { name: 'Status', selector: row => row.status },
        { name: 'Template Name', selector: row => row.templateName },
        {
            name: 'Subject',
            cell: (row) => (
                <span className={`badge ${row.subject?.trim().toLowerCase() === 'active' ? 'bg-success' : 'bg-danger'}`}>
                    {row.subject}
                </span>

            ),
            selector: row => row.subject
        }
    ];

    // const data = [
    //     {
    //         action: '-',
    //         status: 'Payslip generated',
    //         templateName: 'Payslip generated',
    //         subject: 'Active'
    //     },
    //     {
    //         action: '-',
    //         status: 'Forgot Password',
    //         templateName: 'Forgot Password',
    //         subject: 'InActive'
    //     },
    //     {
    //         action: '-',
    //         status: 'Payslip generated',
    //         templateName: 'Payslip generated',
    //         subject: 'Active'
    //     }, {
    //         action: '-',
    //         status: 'Forgot Password',
    //         templateName: 'Forgot Password',
    //         subject: 'Active'
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

    const totalEntries = EmailTemplates.length;
    const totalPages = Math.ceil(totalEntries / rowsPerPage);
     const [paginated, setPaginated] = useState(EmailTemplates.slice(0, rowsPerPage));
   
       const paginate = (data, page) => {
           const start = (page - 1) * rowsPerPage;
           const end = start + rowsPerPage;
           setPaginated(data.slice(start, end));
           setCurrentPage(page);
       };
   
       const startEntry = (currentPage - 1) * rowsPerPage + 1;
       const endEntry = Math.min(currentPage * rowsPerPage, EmailTemplates.length);
       useEffect(() => {
           const start = (currentPage - 1) * rowsPerPage;
           const end = start + rowsPerPage;
           setPaginated(EmailTemplates.slice(start, end));
       }, [EmailTemplates, currentPage, rowsPerPage]);

    const [showAddForm, setShowAddForm] = useState(false);

    const toggleAddForm = () => {
        setShowAddForm((prev) => !prev);
    };

    return (
        <div className="custom-container">
            <h5>Email Templates</h5>
            <p style={{ fontSize: '15px', color: 'rgb(98, 98, 98)' }}>
                <span style={{ color: 'red' }}>Home</span> / Email Templates
            </p>

            {showAddForm && (
                <div className="card mb-3 form-slide-container">
                    <div className="card-header d-flex justify-content-between align-items-center text-white new-emp-bg">
                        <span>Add New Award</span>
                        <button className="btn btn-sm add-btn" onClick={toggleAddForm}>
                            - Hide
                        </button>
                    </div>

                    <div className="container mt-4">
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                {/* Left Column */}
                                <div className="col-md-6 mb-3">
                                    <div className="mb-3">
                                        <label>Template Name</label>
                                        <input type="text"
                                            value={form.templateName}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setForm({ ...form, templateName: value });
                                                validateField("templateName", value);
                                            }}
                                            className={`form-control ${errors.templateName ? "is-invalid" : ""}`}
                                            placeholder="Template Name"
                                            onBlur={(e) => validateField("templateName", e.target.value)}

                                        />
                                        {errors.templateName && (
                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.templateName}</p>
                                        )}
                                    </div>

                                    <div className="col-md-12 mb-3">
                                        <label>Subject</label>
                                        <select id="awardType"
                                            value={form.subject}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setForm({ ...form, subject: value });
                                                validateField("subject", value);
                                            }}
                                            className={`form-control ${errors.subject ? "is-invalid" : ""}`}
                                            onBlur={(e) => validateField("subject", e.target.value)}
                                        >
                                            <option value="">Subject</option>
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                        </select>
                                        {errors.subject && (
                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.subject}</p>
                                        )}
                                    </div>

                                </div>

                                {/* Right Column */}
                                <div className="col-md-6 mb-3">

                                    <label>Status</label>
                                    <CKEditor
                                        key={editorKey}
                                        editor={ClassicEditor}
                                        data={form.status}
                                        onReady={(editor) => {
                                            editorRef.current = editor;
                                        }}
                                        onChange={(event, editor) => {
                                            const newData = editor.getData();
                                            setForm(prev => ({ ...prev, status: newData }));
                                        }}
                                    />
                                    {errors.status && (
                                        <p className="text-danger mb-0" style={{ fontSize: '13px' }}>
                                            {errors.status}
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
                    <span>List All Email Templates</span>
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


                {showEditModal && selectedRow && (
                    <>

                        <div className="custom-backdrop"></div>
                        <div className="modal show fade d-block" tabIndex="-1">
                            <div className="modal-dialog modal-dialog-centered edit-modal">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Edit Email Template</h5>
                                        <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                                    </div>
                                    <div className="modal-body">
                                        <form onSubmit={handleSubmit}>
                                            <div className="row">
                                                {/* Left Column */}
                                                <div className="col-md-6 mb-3">
                                                    <div className="mb-3">
                                                        <label>Template Name</label>
                                                        <input type="text"
                                                            value={form.templateName}
                                                            onChange={(e) => {
                                                                const { value } = e.target;
                                                                setForm({ ...form, templateName: value });
                                                                validateField("templateName", value);
                                                            }}
                                                            className={`form-control ${errors.templateName ? "is-invalid" : ""}`}
                                                            placeholder="Template Name"
                                                            onBlur={(e) => validateField("templateName", e.target.value)}

                                                        />
                                                        {errors.templateName && (
                                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.templateName}</p>
                                                        )}
                                                    </div>

                                                    <div className="col-md-12 mb-3">
                                                        <label>Subject</label>
                                                        <select id="awardType"
                                                            value={form.subject}
                                                            onChange={(e) => {
                                                                const { value } = e.target;
                                                                setForm({ ...form, subject: value });
                                                                validateField("subject", value);
                                                            }}
                                                            className={`form-control ${errors.subject ? "is-invalid" : ""}`}
                                                            onBlur={(e) => validateField("subject", e.target.value)}
                                                        >
                                                            <option value="">Subject</option>
                                                            <option value="Active">Active</option>
                                                            <option value="Inactive">Inactive</option>
                                                        </select>
                                                        {errors.subject && (
                                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.subject}</p>
                                                        )}
                                                    </div>

                                                </div>

                                                {/* Right Column */}
                                                <div className="col-md-6 mb-3">

                                                    <label>Status</label>
                                                    <CKEditor
                                                        key={editorKey}
                                                        editor={ClassicEditor}
                                                        data={form.status}
                                                        onReady={(editor) => {
                                                            editorRef.current = editor;
                                                        }}
                                                        onChange={(event, editor) => {
                                                            const newData = editor.getData();
                                                            setForm(prev => ({ ...prev, status: newData }));
                                                        }}
                                                    />
                                                    {errors.status && (
                                                        <p className="text-danger mb-0" style={{ fontSize: '13px' }}>
                                                            {errors.status}
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

export default EmailTemplates;
