import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { getSupportRequest, createSupportRequest, updateSupportRequest, deleteSupportRequest } from '../api/supportRequestApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";

const TicketDetail = () => {

    const location = useLocation();
    const employee = location.state?.employee;
    const [activeTab, setActiveTab] = useState('details');
    const [remarks, setRemarks] = useState('');
    const [paginate, setPaginate] = useState('');
    const [data, setData] = useState('');
    const [title, setTitle] = useState("");
    const [file, setFile] = useState(null);
    const [attachments, setAttachments] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    //from backend
    const [SupportRequest, setSupportRequest] = useState([]);

    const [editId, setEditId] = useState(null);

    const [form, setForm] = useState({
        assignedTo: '',
        status: '',
        remarks: '',
        ticketNotes: '',
        fileTitle: '',
        fileDescription: '',
        fileUrl: '',
        createdAt: '',
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

    // const validateField = (fieldName, value = "") => {
    //     let error = "";

    //     let displayName = fieldName
    //         .replace(/([A-Z])/g, " $1")
    //         .replace(/^./, str => str.toUpperCase());

    //     value = value.toString();

    //     switch (fieldName) {

    //         case "assignedTo":
    //             if (!value.trim()) error = `${displayName} is required`;
    //             break;

    //         case "status":
    //             if (!value.trim()) error = `${displayName} is required`;
    //             break;

    //         case "remarks":
    //             if (!value.trim()) error = `${displayName} is required`;
    //             break;

    //         default:
    //             break;
    //     }

    //     setErrors(prev => ({ ...prev, [fieldName]: error }));
    //     return error;
    // };


    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     if (!validateForm()) return;

    //     try {
    //         const payload = { ...form, description };
    //         let updatedRow;

    //         if (editId) {
    //             updatedRow = await updateSupportRequest(editId, form);
    //             toast.success("Support Request updated successfully!");
    //         } else {
    //             updatedRow = await createSupportRequest(form);
    //             toast.success("Support Request saved successfully!");
    //         }

    //         if (location.state?.onUpdate) {
    //             location.state.onUpdate(updatedRow);
    //         }
    //         setSavedEmployee(form.assignedTo);

    //         // reset form
    //         setForm({ assignedTo: '', status: '', remarks: '' });
    //         setDescription('');
    //         setEditId('');
    //         setShowEditModal(false);

    //     } catch (err) {
    //         console.error("Error saving SupportRequest:", err);
    //         toast.error("Support Request failed to save!");
    //     }
    // };

    // const handleEdit = (row) => {
    //     setForm({
    //         assignedTo: row.assignedTo || "",
    //         status: row.status || "",
    //         remarks: row || ""
    //     });
    //     setEditId(row._id);
    //     setShowEditModal(true);
    //     setSelectedRow(row);
    // };


    // const handleView = (row) => {
    //     setSelectedRow(row);
    //     setShowModal(true);
    // };


    const emptyForm = {
        assignedTo: '',
        status: '',
        remarks: '',
        ticketNotes: '',
        fileTitle: '',
        fileDescription: '',
        fileUrl: '',
        createdAt: '',
    };

    const resetForm = () => {
        setForm(emptyForm);
        setEditId(null);
        setShowEditModal(false);
    };
    const navigate = useNavigate();


    const columns = [
        {
            name: 'Action',
            cell: (row) => (
                <div className="d-flex">
                    <button
                        className="btn btn-success btn-sm me-2"
                        onClick={() => handleDownload(row)}
                    >
                        <i className="fas fa-download text-white"></i>
                    </button>
                    <button
                        className="btn btn-danger btn-sm"
                        type="button"
                        onClick={() => handleDelete(row.id)}
                    >
                        <i className="fas fa-trash-alt text-white"></i>
                    </button>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
        { name: 'Title', selector: row => row.title, sortable: true },
        { name: 'Description', selector: row => row.description },
        { name: 'File', selector: row => row.fileName },
        { name: 'Date & Time', selector: row => row.createdAt }
    ];

    // const data = [
    //     {
    //         action: '-',
    //         title: 'Aniket Rane',
    //         description: 'abcd',
    //         dateandtime: '13-Dec-2021 to 15-Dec-2021',
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

    const totalEntries = attachments.length;
    const totalPages = Math.ceil(totalEntries / rowsPerPage);

    const paginatedData = attachments.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const startEntry = (currentPage - 1) * rowsPerPage + 1;
    const endEntry = Math.min(currentPage * rowsPerPage, totalEntries);


    const [showAddForm, setShowAddForm] = useState(false);

    const toggleAddForm = () => {
        setShowAddForm((prev) => !prev);
    };

  const handleDelete = async (id) => {
  if (!id) {
    console.error("Delete failed: No ID provided");
    return;
  }

  const confirmDelete = window.confirm("Are you sure you want to delete this entry?");
  if (!confirmDelete) return;

  try {
    await axios.delete(`http://localhost:3000/files/${id}`);
    fetchFiles();
  } catch (err) {
    console.error("Error deleting entry:", err);
  }
};




  const handleDownload = async (row) => {
    if (!row.fileName) {
        alert("No file available to download");
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/files/download/${row.fileName}`);

        if (!response.ok) {
            throw new Error("Download failed");
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = row.fileName; // use original file name
        document.body.appendChild(a);
        a.click();
        a.remove();

        window.URL.revokeObjectURL(url);
    } catch (err) {
        console.error("Error downloading file:", err);
        alert("Download failed!");
    }
};



    const handleSave = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append("assignedTo", form.assignedTo || ""); // map to backend field
            formData.append("status", form.status || "");
            formData.append("remarks", form.remarks || "");
            formData.append("ticketNotes", form.ticketNotes || "");
            if (file) formData.append("file", file);

            const response = await fetch(
                `http://localhost:3000/support-request/${employee._id}`,
                {
                    method: "PUT",
                    body: formData,
                }
            );

            if (!response.ok) {
                const errText = await response.text();
                throw new Error("Failed to update: " + errText);
            }

            const updatedRow = await response.json();
            console.log("Updated row:", updatedRow);
            navigate("/supportRequest", { state: { updatedRow } });
        } catch (err) {
            console.error("Error saving support request:", err);
        }
    };

    // const handleFileUpload = async (e) => {
    //     e.preventDefault();

    //     if (!title) {
    //         alert("Title is required!");
    //         return;
    //     }

    //     try {
    //         const res = await fetch("http://localhost:3000/files/create", {
    //             method: "POST",
    //             headers: { "Content-Type": "application/json" },
    //             body: JSON.stringify({
    //                 title,
    //                 description: remarks,
    //                 entryId: employee._id
    //             }),
    //         });

    //         const savedFile = await res.json();

    //         setAttachments((prev) => [
    //             ...prev,
    //             {
    //                 id: savedFile._id,
    //                 fileTitle: savedFile.fileTitle,
    //                 fileDescription: savedFile.fileDescription,
    //                 createdAt: new Date(savedFile.createdAt).toLocaleString(),
    //             },
    //         ]);
    //         fetchFiles();

    //         // Reset form
    //         setTitle("");
    //         setRemarks("");
    //     } catch (err) {
    //         console.error("Error saving file:", err);
    //     }
    // };



    // useEffect(() => {
    //     fetchFiles();
    // }, []);


    const handleFileUpload = async (e) => {
        e.preventDefault();
        if (!title) return alert("Title is required!");

        try {
            // 1️⃣ Create parent record
            const res = await fetch("http://localhost:3000/files/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    description: remarks,
                    entryId: employee._id
                }),
            });
            const savedFile = await res.json();

            // 2️⃣ If user selected a file, upload it
            if (file) {
                const formData = new FormData();
                formData.append("file", file);

                await fetch(`http://localhost:3000/files/${savedFile._id}/upload`, {
                    method: "POST",
                    body: formData,
                });
            }

            // 3️⃣ Refresh table
            fetchFiles();

            // 4️⃣ Reset form
            setTitle("");
            setRemarks("");
            setFile(null);

        } catch (err) {
            console.error("Error saving file:", err);
        }
    };


    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const res = await fetch("http://localhost:3000/files");
                const data = await res.json();

                const formatted = data.map((item) => ({
                    id: item._id,
                    fileTitle: item.fileTitle,
                    fileDescription: item.fileDescription,
                    createdAt: new Date(item.createdAt).toLocaleString(),
                }));

                setAttachments(formatted);
            } catch (err) {
                console.error("Error fetching files:", err);
            }
        };

        fetchFiles();
    }, []);

    // const fetchFiles = async () => {
    //     try {
    //         const res = await axios.get(`http://localhost:3000/files?entryId=${employee._id}`);
    //         setAttachments(res.data);
    //     } catch (err) {
    //         console.error("Error fetching files:", err);
    //     }
    // };


    const fetchFiles = async () => {
        if (!employee?._id) return;

        try {
            const res = await axios.get(`http://localhost:3000/files?entryId=${employee._id}`);

            const files = res.data.flatMap(doc => {
                if (doc.files && doc.files.length > 0) {
                    return doc.files.map(f => ({
                        id: f._id || doc._id,
                        title: doc.fileTitle,
                        description: f.fileDescription || doc.fileDescription,
                        fileName: f.fileTitle,
                        createdAt: new Date(f.createdAt).toLocaleString(),
                        fileUrl: f.fileUrl || "",
                    }));
                }

                return [{
                    id: doc._id,
                    title: doc.fileTitle,
                    description: doc.fileDescription,
                    fileName: "No file",
                    createdAt: new Date(doc.createdAt).toLocaleString(),
                    fileUrl: "",
                }];
            });

            setAttachments(files);
        } catch (err) {
            console.error("Error fetching files:", err);
        }
    };



    useEffect(() => {
        fetchFiles();
    }, [employee]);



    const renderTabContent = () => {
        switch (activeTab) {
            case 'details':
                return <>
                    <form onSubmit={handleSave}>

                        <div className="card no-radius mb-3">
                            <div className="card-header text-white new-emp-bg fw-bold">Assigned To</div>
                            <div className="card-body">
                                <label>Assigned To</label>
                                <select
                                    value={form.assignedTo}
                                    onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
                                    className={`form-control ${errors.assignedTo ? "is-invalid" : ""}`}
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
                                {errors.assignedTo && (
                                    <p className="text-danger mb-0">{errors.assignedTo}</p>
                                )}
                            </div>
                        </div>

                        <div className="card no-radius mb-3">
                            <div className="card-header text-white new-emp-bg fw-bold">Status</div>
                            <div className="card-body">
                                <label>Select Status</label>
                                <select
                                    value={form.status}
                                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                                    className={`form-control ${errors.status ? "is-invalid" : ""}`}
                                >
                                    <option value="">Select Status</option>
                                    <option value="Open">Open</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Closed">Closed</option>
                                </select>
                                {errors.status && (
                                    <p className="text-danger mb-0">{errors.status}</p>
                                )}
                            </div>
                        </div>

                        <div className="card no-radius mb-3">
                            <div className="card-header text-white new-emp-bg fw-bold">Remarks</div>
                            <div className="card-body">
                                <label>Remarks</label>
                                <textarea
                                    className={`form-control ${errors.remarks ? "is-invalid" : ""}`}
                                    rows="3"
                                    placeholder='Remarks'
                                    value={form.remarks}
                                    onChange={(e) => setForm({ ...form, remarks: e.target.value })}
                                ></textarea>
                                {errors.remarks && (
                                    <p className="text-danger mb-0">{errors.remarks}</p>
                                )}
                            </div>
                        </div>

                        <div className="card no-radius mb-3">
                            <div className="card-header text-white new-emp-bg fw-bold">Ticket Notes</div>
                            <div className="card-body">
                                <label>Ticket Notes</label>
                                <textarea
                                    className={`form-control ${errors.remarks ? "is-invalid" : ""}`}
                                    rows="3"
                                    placeholder='Ticket Notes'
                                    value={form.ticketNotes}
                                    onChange={(e) => setForm({ ...form, ticketNotes: e.target.value })}
                                ></textarea>
                                {errors.ticketNotes && (
                                    <p className="text-danger mb-0">{errors.ticketNotes}</p>
                                )}

                            </div>
                        </div>

                        <div className="text-start mb-2">
                            <button type="submit" className="btn btn-sm add-btn">
                                Save
                            </button>
                        </div>
                    </form>

                </>;


            case 'files':
                return <>
                    <form onSubmit={handleFileUpload}>
                        <div className="col-md-12 mb-3">
                            <label>Title</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>

                        <label>Description</label>
                        <textarea
                            className="form-control"
                            rows="4"
                            placeholder="Description"
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                        ></textarea>

                        <div className="col-md-12 mb-3">
                            <label>File</label>
                            <input
                                type="file"
                                className="form-control"
                                onChange={(e) => setFile(e.target.files[0])}
                            />
                        </div>

                        <button type="submit" className="btn btn-sm add-btn mt-2 mb-2">
                            Save
                        </button>
                    </form>


                    {/* Attachment List */}
                    <div className="card no-radius">
                        <div className="card-header d-flex justify-content-between align-items-center text-white new-emp-bg">
                            <span>Attachment List</span>
                        </div>

                        <div className="px-3 mt-4">
                            <DataTable
                                columns={columns}
                                data={paginatedData}
                                fixedHeader
                                highlightOnHover
                                responsive
                            />
                        </div>

                        <div className="p-3">
                            <p className="mb-0 text-muted" style={{ fontSize: "0.9rem" }}>
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
                                    className={`btn btn-sm btn-outline-secondary prev-next me-1 ${currentPage === i + 1 ? "active" : ""
                                        }`}
                                    onClick={() => setCurrentPage(i + 1)}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            <button
                                className="btn btn-sm btn-outline-secondary px-3 prev-next"
                                onClick={() =>
                                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                                }
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </>

            default:
                return null;
        }
    };

    return (
        <div className="custom-container">
            <h5>Ticket Detail</h5>
            <p style={{ fontSize: '15px', color: 'rgb(98, 98, 98)' }}>
                <span style={{ color: 'red' }}>Home</span> / Ticket Details
            </p>

            <div className="row">
                <div className="col-md-4">
                    <div className="card no-radius mb-3">
                        <div className="card-header text-white new-emp-bg fw-bold">Ticket Details</div>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item"><strong>Ticket Code: {employee?.ticketCode || 'N/A'}</strong></li>
                            <li className="list-group-item"><strong>Subject: {employee?.subject || 'N/A'}</strong></li>
                            <li className="list-group-item"><strong>Employee: {employee?.employee || 'N/A'}</strong></li>
                            <li className="list-group-item"><strong>Priority: {employee?.priority || 'N/A'}</strong></li>
                            <li className="list-group-item"><strong>Date: {employee?.date || 'N/A'}</strong></li>
                            <li className="list-group-item"><strong>Remarks: {employee?.remarks || 'N/A'}</strong></li>
                            <li className="list-group-item"><strong>Ticket Notes: {employee?.ticketNotes || 'N/A'}</strong></li>

                        </ul>
                    </div>
                </div>


                <div className="col-md-8">
                    <div className="card no-radius mb-3">
                        <div className="card-body">

                            <ul className="nav nav-tabs mb-3">
                                <li className="nav-item">
                                    <button className={`nav-link ${activeTab === 'details' ? 'active' : ''}`} onClick={() => setActiveTab('details')}>
                                        <i className="fas fa-home me-1 fs-6"></i> Details
                                    </button>
                                </li>
                                {/* <li className="nav-item">
                                    <button className={`nav-link ${activeTab === 'comments' ? 'active' : ''}`} onClick={() => setActiveTab('comments')}>
                                        <i className="fas fa-comments me-1 fs-6"></i> Comments
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button className={`nav-link ${activeTab === 'notes' ? 'active' : ''}`} onClick={() => setActiveTab('notes')}>
                                        <i className="fas fa-pen me-1 fs-6"></i> Note
                                    </button>
                                </li> */}
                                <li className="nav-item">
                                    <button className={`nav-link ${activeTab === 'files' ? 'active' : ''}`} onClick={() => setActiveTab('files')}>
                                        <i className="fas fa-paperclip me-1 fs-6"></i> Ticket Files
                                    </button>
                                </li>
                            </ul>

                            {/* Tab Content */}
                            {renderTabContent()}

                            {/* Cards below tab content */}
                            {/* <div className="row">
                        <div className="col-md-6">
                            <div className="card no-radius mb-3">
                                <div className="card-header text-white new-emp-bg fw-bold">Assigned To</div>
                                <div className="card-body">
                                    <p className="text-muted">Select an employee to assign...</p>
                                </div>
                            </div>
                        </div>


                        <div className="col-md-6">
                            <div className="card no-radius mb-3">
                                <div className="card-header text-white new-emp-bg fw-bold">Update Status</div>
                                <div className="card-body">
                                    <form>
                                        <div className="mb-3">
                                            <label htmlFor="status" className="form-label">Status</label>
                                            <select id="status" className="form-select">
                                                <option value="open">Open</option>
                                                <option value="in_progress">In Progress</option>
                                                <option value="closed">Closed</option>
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="remarks" className="form-label">Remarks</label>
                                            <textarea id="remarks" className="form-control" rows="3" placeholder="Remarks"></textarea>
                                        </div>
                                        <button type="submit" className="btn btn-primary">Save</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default TicketDetail;
