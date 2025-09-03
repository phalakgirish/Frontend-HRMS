import React from "react";
import { useState, useRef, useEffect } from "react";
import DataTable from 'react-data-table-component';
import { getEmployeeDocument, createEmployeeDocument, updateEmployeeDocument, deleteEmployeeDocument } from "./apis/documentApi";
import { toast } from "react-toastify";

const Document = ({ mode, employeeId }) => {

    useEffect(() => {
    }, [employeeId]);

    const [showModal, setShowModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [description, setDescription] = useState('');
    const editorRef = useRef(null);
    const [editorKey, setEditorKey] = useState(0);
    const [documentList, setDocumentList] = useState([]);
    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);

    //from backend
    const [Document, setDocument] = useState([]);
    const [paginated, setPaginated] = useState([]);

    const [editId, setEditId] = useState(null);

    const [form, setForm] = useState({
        document_type_id: "",
        document_title: "",
        document_doe: "",
        document_notification_email: "",
        document_desc: "",
        document_file: "",
        is_sendnotification_doe: ""

    });

    const handleView = (row) => {
        setSelectedRow(row);
        setShowModal(true);
    };

    const handleBrowseClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setForm({ ...form, document_file: file });
        }
    };



    // Reset form
    const resetForm = () => {
        setForm({
            document_type_id: "",
            document_title: "",
            document_doe: "",
            document_notification_email: "",
            document_desc: "",
            document_file: "",
            is_sendnotification_doe: ""

        });
        setEditId(null);
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     console.log("this is sending", form);
    //     console.log("employeeId before payload:", employeeId);

    //     if (!employeeId) return toast.error("Employee ID missing");
    //     console.log("employeeId from route:", employeeId);

    //     const payload = {
    //         ...form, employeeId: employeeId,
    //         // document_doe: form.document_doe ? new Date(form.document_doe) : null

    //     };
    //     console.log("this is sent data:", payload);

    //     try {
    //         if (editId) {
    //             await updateEmployeeDocument(editId, payload);
    //             toast.success("Document detail updated!");
    //         } else {
    //             await createEmployeeDocument(payload);
    //             toast.success("Document detail added!");
    //         }

    //         fetchDocument();
    //         resetForm();
    //         setShowEditModal(false);
    //     } catch (err) {
    //         console.error("Error saving Document detail:", err);
    //         toast.error("Failed to save!");
    //     }
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!employeeId) return toast.error("Employee ID missing");

        try {
            const formData = new FormData();
            formData.append("employeeId", employeeId);
            formData.append("document_type_id", form.document_type_id);
            formData.append("document_title", form.document_title);
            formData.append("document_desc", form.document_desc);
            formData.append("document_doe", form.document_doe);
            formData.append("document_notification_email", form.document_notification_email);
            formData.append("is_sendnotification_doe", form.is_sendnotification_doe);

            if (form.document_file) {
                formData.append("document_file", form.document_file);
            }


            if (editId) {
                await updateEmployeeDocument(editId, formData);
                toast.success("Document detail updated!");
            } else {
                await createEmployeeDocument(formData);
                toast.success("Document detail added!");
            }

            fetchDocument();
            resetForm();
            setSelectedFile(null);
            setShowEditModal(false);
        } catch (err) {
            console.error("Error saving Document detail:", err);
            toast.error("Failed to save!");
        }
    };


    const fetchDocument = async () => {
        if (!employeeId) return;
        try {
            const res = await getEmployeeDocument(employeeId);
            console.log("Document list:", res.data);
            setDocumentList(res.data);
        } catch (err) {
            console.error("Error fetching Document:", err);
        }
    };

    useEffect(() => {
        fetchDocument();
    }, [employeeId]);


    const handleEdit = (row) => {
        setForm({
            document_type_id: row.document_type_id,
            document_title: row.document_title,
            document_doe: row.document_doe ? new Date(row.document_doe).toISOString().split('T')[0] : '',
            document_notification_email: row.document_notification_email,
            document_desc: row.document_desc,
            document_file: row.document_file,
            is_sendnotification_doe: row.is_sendnotification_doe

        });

        setEditId(row._id);
        setShowEditModal(true);
        setSelectedRow(row);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this record?")) return;

        try {
            await deleteEmployeeDocument(id);
            fetchDocument();
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
        { name: 'Document Type', selector: row => row.document_type_id },
        { name: 'Title', selector: row => row.document_title },
        { name: 'Notification Email', selector: row => row.document_notification_email },
        { name: 'Date of Expiry', selector: row => row.document_doe }

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

    const totalEntries = documentList.length;
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
        paginate(documentList, currentPage);
    }, [documentList, currentPage, rowsPerPage]);

    return (
        <div>
            {mode === "edit" && (

                <div className="container-fluid mt-4">
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label>Document Type</label>
                                    <select
                                        name="document_type_id"
                                        className="form-control"
                                        value={form.document_type_id}
                                        onChange={(e) => setForm({ ...form, document_type_id: e.target.value })}
                                    >
                                        <option value="">Choose Document Type</option>
                                        <option value="Driving License">Driving License</option>
                                        <option value="Passport">Passport</option>
                                        <option value="Visa">Visa</option>
                                        <option value="PAN Card">PAN Card</option>
                                        <option value="PF No">PF No</option>
                                        <option value="ESI No">ESI No</option>
                                        <option value="UAN">UAN</option>
                                        <option value="Aadhar Card">Aadhar Card</option>
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label>Document Title</label>
                                    <input
                                        type="text"
                                        placeholder="Document Title"
                                        className="form-control"
                                        name="document_title"
                                        value={form.document_title}
                                        onChange={(e) => setForm({ ...form, document_title: e.target.value })}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label>Description</label>
                                    <textarea type="text" className="form-control" placeholder="Description"
                                        name="document_desc"
                                        value={form.document_desc}
                                        onChange={(e) => setForm({ ...form, document_desc: e.target.value })}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label>Send notification email when expired? </label>
                                    <select
                                        name="is_sendnotification_doe"
                                        className="form-control"
                                        value={form.is_sendnotification_doe}
                                        onChange={(e) => setForm({ ...form, is_sendnotification_doe: e.target.value })}
                                    >
                                        <option value="">Choose One</option>
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                    </select>
                                </div>

                            </div>

                            {/* Right Column */}
                            <div className="col-md-6">

                                <div className="mb-3">
                                    <label>Date of Expiry</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        name="document_doe"
                                        value={form.document_doe}
                                        onChange={(e) => setForm({ ...form, document_doe: e.target.value })}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label>Notification Email</label>
                                    <input
                                        type="text"
                                        placeholder="Notification Email"
                                        className="form-control"
                                        name="document_notification_email"
                                        value={form.document_notification_email}
                                        onChange={(e) => setForm({ ...form, document_notification_email: e.target.value })}
                                    />
                                </div>

                                <div className="mb-3">
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

                                    <small style={{ fontSize: "11px" }} className="text-muted ms-1">
                                        Upload files only: png, jpg, jpeg, gif, txt, pdf, xls, xlsx, doc, docx
                                    </small>
                                </div>

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
                    <span>List All Documents</span>
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
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">View Documents Details</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setShowModal(false)}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <p><strong>Document Type:</strong> {selectedRow.document_type_id}</p>
                                    <p><strong>Docuumnt Title:</strong> {selectedRow.document_title}</p>
                                    <p><strong>Date of Expiry:</strong> {selectedRow.document_doe}</p>
                                    <p><strong>Notification Email:</strong> {selectedRow.document_notification_email}</p>

                                    <p>
                                        <strong>Description:</strong> {selectedRow.document_desc.replace(/<[^>]+>/g, '')}
                                    </p>

                                    <p>
                                        <strong>Document File:</strong>
                                        {selectedRow.document_file ? (
                                            <a
                                                href={`http://localhost:3000/employee-document/download/${selectedRow.document_file.split('/').pop()}`}
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

                                    <p><strong>Notification Confirmation:</strong> {selectedRow.is_sendnotification_doe}</p>

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
                                        <h5 className="modal-title">Edit Documents Details</h5>
                                        <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                                    </div>
                                    <div className="modal-body">
                                        <form onSubmit={handleSubmit}>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="mb-3">
                                                        <label>Document Type</label>
                                                        <select
                                                            name="document_type_id"
                                                            className="form-control"
                                                            value={form.document_type_id}
                                                            onChange={(e) => setForm({ ...form, document_type_id: e.target.value })}
                                                        >
                                                            <option value="">Choose Document Type</option>
                                                            <option value="Driving License">Driving License</option>
                                                            <option value="Passport">Passport</option>
                                                            <option value="Visa">Visa</option>
                                                            <option value="PAN Card">PAN Card</option>
                                                            <option value="PF No">PF No</option>
                                                            <option value="ESI No">ESI No</option>
                                                            <option value="UAN">UAN</option>
                                                            <option value="Aadhar Card">Aadhar Card</option>
                                                        </select>
                                                    </div>

                                                    <div className="mb-3">
                                                        <label>Document Title</label>
                                                        <input
                                                            type="text"
                                                            placeholder="Document Title"
                                                            className="form-control"
                                                            name="document_title"
                                                            value={form.document_title}
                                                            onChange={(e) => setForm({ ...form, document_title: e.target.value })}
                                                        />
                                                    </div>

                                                    <div className="mb-3">
                                                        <label>Description</label>
                                                        <textarea type="text" className="form-control" placeholder="Description"
                                                            name="document_desc"
                                                            value={form.document_desc}
                                                            onChange={(e) => setForm({ ...form, document_desc: e.target.value })}
                                                        />
                                                    </div>

                                                    <div className="mb-3">
                                                        <label>Send notification email when expired? </label>
                                                        <select
                                                            name="is_sendnotification_doe"
                                                            className="form-control"
                                                            value={form.is_sendnotification_doe}
                                                            onChange={(e) => setForm({ ...form, is_sendnotification_doe: e.target.value })}
                                                        >
                                                            <option value="">Choose One</option>
                                                            <option value="Yes">Yes</option>
                                                            <option value="No">No</option>
                                                        </select>
                                                    </div>

                                                </div>

                                                {/* Right Column */}
                                                <div className="col-md-6">

                                                    <div className="mb-3">
                                                        <label>Date of Expiry</label>
                                                        <input
                                                            type="date"
                                                            className="form-control"
                                                            name="document_doe"
                                                            value={form.document_doe}
                                                            onChange={(e) => setForm({ ...form, document_doe: e.target.value })}
                                                        />
                                                    </div>

                                                    <div className="mb-3">
                                                        <label>Notification Email</label>
                                                        <input
                                                            type="text"
                                                            placeholder="Notification Email"
                                                            className="form-control"
                                                            name="document_notification_email"
                                                            value={form.document_notification_email}
                                                            onChange={(e) => setForm({ ...form, document_notification_email: e.target.value })}
                                                        />
                                                    </div>

                                                    {/* <div className="mb-3">
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

                                                        <small style={{ fontSize: "11px" }} className="text-muted ms-1">
                                                            Upload files only: png, jpg, jpeg, gif, txt, pdf, xls, xlsx, doc, docx
                                                        </small>
                                                    </div> */}

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
export default Document;