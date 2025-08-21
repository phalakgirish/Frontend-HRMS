import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { getSupportRequest, createSupportRequest, updateSupportRequest, deleteSupportRequest } from '../api/supportRequestApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TicketDetail = () => {

    const location = useLocation();
    const employee = location.state?.employee;
    const [activeTab, setActiveTab] = useState('details');
    const [remarks, setRemarks] = useState('');
    const [paginate, setPaginate] = useState('');
    const [data, setData] = useState('');

    const [showModal, setShowModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [description, setDescription] = useState('');
    //from backend
    const [SupportRequest, setSupportRequest] = useState([]);
    const [paginated, setPaginated] = useState([]);
    const [savedEmployee, setSavedEmployee] = useState(null); // 👈 store saved employee

    const [editId, setEditId] = useState(null);

    const [form, setForm] = useState({
        assignedTo: '',
        status: '',
        remarks: ''
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


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const payload = { ...form, description };
            let updatedRow;

            if (editId) {
                updatedRow = await updateSupportRequest(editId, form); // return updated object
                toast.success("Support Request updated successfully!");
            } else {
                updatedRow = await createSupportRequest(form);
                toast.success("Support Request saved successfully!");
            }

            // Update main page if callback exists
            if (location.state?.onUpdate) {
                location.state.onUpdate(updatedRow);
            }
            setSavedEmployee(form.assignedTo); // 👈 Save employee

            // reset form
            setForm({ assignedTo: '', status: '', remarks: '' });
            setDescription('');
            setEditId('');
            setShowEditModal(false);

        } catch (err) {
            console.error("Error saving SupportRequest:", err);
            toast.error("Support Request failed to save!");
        }
    };




    const handleEdit = (row) => {
        setForm({
            assignedTo: row.assignedTo,
            status: row.status
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
        assignedTo: '',
        status: '',
        remarks: ''
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
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(row)}
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
        { name: 'Date & Time', selector: row => row.dateandtime }
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

    const totalEntries = data.length;
    const totalPages = Math.ceil(totalEntries / rowsPerPage);

    const paginatedData = data.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const startEntry = (currentPage - 1) * rowsPerPage + 1;
    const endEntry = Math.min(currentPage * rowsPerPage, totalEntries);

    const [showAddForm, setShowAddForm] = useState(false);

    const toggleAddForm = () => {
        setShowAddForm((prev) => !prev);
    };


const handleSave = async () => {
  try {
    const response = await fetch(`http://localhost:3000/support-request/${employee._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    if (!response.ok) throw new Error("Failed to update");

    const updatedRow = await response.json();

    navigate("/supportRequest", { state: { updatedRow } });
  } catch (err) {
    console.error(err);
  }
};


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
                                    value={form.remarks}
                                    onChange={(e) => setForm({ ...form, remarks: e.target.value })}
                                ></textarea>
                                {errors.remarks && (
                                    <p className="text-danger mb-0">{errors.remarks}</p>
                                )}
                            </div>
                        </div>

                        <div className="text-start mb-2">
                            <button type="submit"  onClick={handleSave} className="btn btn-sm add-btn">
                                Save
                            </button>
                        </div>
                    </form>

                </>;
            case 'comments':
                return <><div className="mb-3">
                    <textarea
                        id="remarks"
                        className="form-control"
                        rows="4"
                        placeholder="Enter remarks here..."
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                    ></textarea>
                    <button type="submit" className="btn btn-sm add-btn mt-2">Save</button>

                </div>
                </>;
            case 'notes':
                return <><div className="mb-3">
                    <textarea
                        id="remarks"
                        className="form-control"
                        rows="4"
                        placeholder="Ticket Notes..."
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                    ></textarea>
                    <button type="submit" className="btn btn-sm add-btn mt-2">Save</button>

                </div>
                </>;
            case 'files':
                return <>
                    <div className="col-md-12 mb-3">
                        <label>Title</label>
                        <input type="text" className="form-control" placeholder="Title" />
                    </div>

                    <div className="col-md-12 mb-3">
                        <label>Attachment File</label>
                        <input type="file" className="form-control" />
                    </div>

                    <label>Description</label>
                    <textarea
                        id="remarks"
                        className="form-control"
                        rows="4"
                        placeholder="Descripion"
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                    ></textarea>

                    <button type="submit" className="btn btn-sm add-btn mt-2 mb-2">Save</button>

                    <div className="card no-radius">
                        <div className="card-header d-flex justify-content-between align-items-center text-white new-emp-bg">
                            <span>Attachment List</span>
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
                                data={paginatedData}
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

                    </div>
                </>;
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
                            <li className="list-group-item"><strong>Subject: {employee?.subject || 'N/A'}</strong></li>
                            <li className="list-group-item"><strong>Employee: {employee?.employee || 'N/A'}</strong></li>
                            <li className="list-group-item"><strong>Priority: {employee?.priority || 'N/A'}</strong></li>
                            <li className="list-group-item"><strong>Date: {employee?.date || 'N/A'}</strong></li>
                            <li className="list-group-item"><strong>Remarks: {employee?.remarks || 'N/A'}</strong></li>
                           
                        </ul>
                    </div>


                    {/* <div className="card no-radius mb-3">
                        <div className="card-header text-white new-emp-bg fw-bold">Assigned To</div>
                        <div className="card-body">
                            <form>
                                <div className="mb-3">
                                    <label>Employee</label>
                                    <select id="assignedTo" value={form.assignedTo}
                                        onChange={(e) => {
                                            const { value } = e.target;
                                            setForm({ ...form, assignedTo: value });
                                            validateField("assignedTo", value);
                                        }}
                                        className={`form-control ${errors.assignedTo ? "is-invalid" : ""}`}
                                        onBlur={(e) => validateField("assignedTo", e.target.value)}
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
                                        <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.assignedTo}</p>)}

                                </div>
                                <div className="text-start mb-2">
                                    <button type="submit" className="btn btn-sm add-btn">Save</button>
                                </div>
                            </form>
                        </div>
                    </div> */}
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
                                <li className="nav-item">
                                    <button className={`nav-link ${activeTab === 'comments' ? 'active' : ''}`} onClick={() => setActiveTab('comments')}>
                                        <i className="fas fa-comments me-1 fs-6"></i> Comments
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button className={`nav-link ${activeTab === 'notes' ? 'active' : ''}`} onClick={() => setActiveTab('notes')}>
                                        <i className="fas fa-pen me-1 fs-6"></i> Note
                                    </button>
                                </li>
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
