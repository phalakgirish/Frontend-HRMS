import React, { useState, useEffect, useRef } from 'react';
import DataTable from 'react-data-table-component';
import './employees.css';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { getTravel, createTravel, updateTravel, deleteTravel } from '../../api/travelApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Travels = () => {

    const [showModal, setShowModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [description, setDescription] = useState('');
    const [editId, setEditId] = useState(null);
    const editorRef = useRef(null);
    const [editorKey, setEditorKey] = useState(0);

    //from backend
    const [Travel, setTravel] = useState([]);
    const [paginated, setPaginated] = useState([]);


    const [form, setForm] = useState({
        employeeName: '',
        purposeOfVisit: '',
        placOfVisit: '',
        startDate: '',
        endDate: '',
        travelMode: '',
        arrangementType: '',
        expectedTravelBudget: '',
        actualTravelBudget: '',
        approvalStatus: '',
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
        fetchTravel();
    }, []);

    const fetchTravel = async () => {
        try {
            const response = await getTravel();
            setTravel(response.data);
            paginate(response.data, currentPage);
        } catch (error) {
            console.error('Error fetching Travel:', error);
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
            case "purposeOfVisit":
            case "placOfVisit":
            case "startDate":
            case "endDate":
            case "travelMode":
            case "arrangementType":
            case "expectedTravelBudget":
            case "actualTravelBudget":
            case "approvalStatus":
            case "addedBy":
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
                    await updateTravel(editId, form);
                    toast.success("Travel updated successfully!");

                    setEditId(null);
                } else {
                    await createTravel(form); toast.success("Travel saved successfully!");

                }
                fetchTravel();
                setForm({
                    employeeName: '',
                    purposeOfVisit: '',
                    placOfVisit: '',
                    startDate: '',
                    endDate: '',
                    travelMode: '',
                    arrangementType: '',
                    expectedTravelBudget: '',
                    actualTravelBudget: '',
                    approvalStatus: '',
                    addedBy: '',
                    description: '',
                    comment: ''
                });
                setEditId("");
                setShowEditModal(false);
            } catch (err) {
                console.error("Error saving Travel:", err);
                toast.error("Travel failed to save successfully!");

            }
        }
    };

    const emptyForm = {
        employeeName: '',
        purposeOfVisit: '',
        placOfVisit: '',
        startDate: '',
        endDate: '',
        travelMode: '',
        arrangementType: '',
        expectedTravelBudget: '',
        actualTravelBudget: '',
        approvalStatus: '',
        addedBy: '',
        description: '',
        comment: ''
    };

    const resetForm = () => {
        setForm(emptyForm);
        setEditId(null);
        setShowEditModal(false);
    };


    const handleView = (row) => {
        setSelectedRow(row);
        setShowModal(true);
    };


    const handleEdit = (row) => {
        setEditId(row._id);
        setForm({
            employeeName: row.employeeName,
            purposeOfVisit: row.purposeOfVisit,
            placOfVisit: row.placOfVisit,
            startDate: row.startDate,
            endDate: row.endDate,
            travelMode: row.travelMode,
            arrangementType: row.arrangementType,
            expectedTravelBudget: row.expectedTravelBudget,
            actualTravelBudget: row.actualTravelBudget,
            approvalStatus: row.approvalStatus,
            addedBy: row.addedBy,
            description: row.description
        });
        setShowEditModal(true);
        setSelectedRow(row);
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this Travel?");
        if (!confirmDelete) return;
        try {
            await deleteTravel(id);
            fetchTravel();
        } catch (err) {
            console.error("Error deleting Travel:", err);
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
        { name: 'Employee', selector: row => row.employeeName },
        { name: 'Purpose of Visit', selector: row => row.purposeOfVisit },
        { name: 'Place of Visit', selector: row => row.placOfVisit },
        { name: 'Start Date', selector: row => row.startDate },
        { name: 'End Date', selector: row => row.endDate },
        { name: 'Approval Status', selector: row => row.approvalStatus },
        { name: 'Added By', selector: row => row.addedBy }

    ];

    // const data = [
    //     {
    //         action: '-',
    //         employeeName: 'Shubham Kadam',
    //         purposeOfVisit: 'Meeting',
    //         placOfVisit: 'Delhi',
    //         startDate: '12-May-2022',
    //         endDate: '13-May-2022',
    //         approvalStatus: 'Accepted',
    //         addedBy: 'Admin Admin'
    //     },
    //     {
    //         action: '-',
    //         employeeName: 'Shubham Kadam',
    //         purposeOfVisit: 'Meeting',
    //         placOfVisit: 'Delhi',
    //         startDate: '12-May-2022',
    //         endDate: '13-May-2022',
    //         approvalStatus: 'Accepted',
    //         addedBy: 'Admin Admin'
    //     }, {
    //         action: '-',
    //         employeeName: 'Shubham Kadam',
    //         purposeOfVisit: 'Meeting',
    //         placOfVisit: 'Delhi',
    //         startDate: '12-May-2022',
    //         endDate: '13-May-2022',
    //         approvalStatus: 'Accepted',
    //         addedBy: 'Admin Admin'
    //     }, {
    //         action: '-',
    //         employeeName: 'Shubham Kadam',
    //         purposeOfVisit: 'Meeting',
    //         placOfVisit: 'Hyderabad',
    //         startDate: '17-June-2023',
    //         endDate: '19-June-2023',
    //         approvalStatus: 'Rejected',
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

    const totalEntries = Travel.length;
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
            <h5>Travels</h5>
            <p style={{ fontSize: '15px', color: 'rgb(98, 98, 98)' }}>
                <span style={{ color: 'red' }}>Home</span> / Travels
            </p>


            {showAddForm && (
                <div className="card mb-3 form-slide-container">
                    <div className="card-header d-flex justify-content-between align-items-center text-white new-emp-bg">
                        <span>Add New Travel</span>
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
                                        <label>Employee</label>
                                        <select id="resignEmployee" value={form.employeeName}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setForm({ ...form, employeeName: value });
                                                validateField("employeeName", value);
                                            }}
                                            className={`form-control ${errors.employeeName ? "is-invalid" : ""}`}
                                            onBlur={(e) => validateField("employeeName", e.target.value)}
                                        >
                                            <option value="">Choose Employee</option>
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
                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Employee Name is required!</p>)}
                                    </div>

                                    <div className='row'>
                                        <div className="col-md-6 mb-3">
                                            <label>Start Date</label>
                                            <input type="date" value={form.startDate}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, startDate: value });
                                                    validateField("startDate", value);
                                                }}
                                                className={`form-control ${errors.startDate ? "is-invalid" : ""}`}
                                                placeholder="startDate"
                                                onBlur={(e) => validateField("startDate", e.target.value)}

                                            />
                                            {errors.startDate && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Start Date is required!</p>)}
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label>End date</label>
                                            <input type="date" value={form.endDate}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, endDate: value });
                                                    validateField("endDate", value);
                                                }}
                                                className={`form-control ${errors.endDate ? "is-invalid" : ""}`}
                                                placeholder="endDate"
                                                onBlur={(e) => validateField("endDate", e.target.value)}

                                            />
                                            {errors.endDate && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>End Date is required!</p>)}
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className="col-md-6 mb-3">
                                            <label>Purpose of Visit</label>
                                            <input type="text" value={form.purposeOfVisit}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, purposeOfVisit: value });
                                                    validateField("purposeOfVisit", value);
                                                }}
                                                className={`form-control ${errors.purposeOfVisit ? "is-invalid" : ""}`}
                                                placeholder="Purpose Of Visit"
                                                onBlur={(e) => validateField("purposeOfVisit", e.target.value)}

                                            />
                                            {errors.purposeOfVisit && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Purpose of Visit is required!</p>)}
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label>Place of Visit</label>
                                            <input type="text" value={form.placOfVisit}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, placOfVisit: value });
                                                    validateField("placOfVisit", value);
                                                }}
                                                className={`form-control ${errors.placOfVisit ? "is-invalid" : ""}`}
                                                placeholder="Place Of Visit"
                                                onBlur={(e) => validateField("placOfVisit", e.target.value)}

                                            />
                                            {errors.placOfVisit && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Place of Visit is required!</p>)}
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className="col-md-6 mb-3">
                                            <label>Travel Mode</label>
                                            <select id="travelMode" value={form.travelMode}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, travelMode: value });
                                                    validateField("travelMode", value);
                                                }}
                                                className={`form-control ${errors.travelMode ? "is-invalid" : ""}`}
                                                onBlur={(e) => validateField("travelMode", e.target.value)}
                                            >
                                                <option value="">Travel Mode</option>
                                                <option value="By Bus">By Bus</option>
                                                <option value="By Train">By Train</option>
                                                <option value="By Plane">By Plane</option>
                                                <option value="By Taxi">By Taxi</option>
                                                <option value="By rental Car">By rental Car</option>
                                            </select>
                                            {errors.travelMode && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Travel Mode is Required</p>
                                            )}
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label>Arrangement type</label>
                                            <select id="arrangementType" value={form.arrangementType}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, arrangementType: value });
                                                    validateField("arrangementType", value);
                                                }}
                                                className={`form-control ${errors.arrangementType ? "is-invalid" : ""}`}
                                                onBlur={(e) => validateField("arrangementType", e.target.value)}
                                            >
                                                <option value="">Arrangement Type</option>
                                                <option value="Hotel">Hotel</option>
                                                <option value="Guest House">Guest House</option>
                                                <option value="Motel">Motel</option>
                                                <option value="Air BnB">Air BnB</option>
                                            </select>
                                            {errors.arrangementType && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Arrangement Type is Required</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className="col-md-6 mb-3">
                                            <label>Expected Travel Budget</label>
                                            <input type="number" value={form.expectedTravelBudget}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, expectedTravelBudget: value });
                                                    validateField("expectedTravelBudget", value);
                                                }}
                                                className={`form-control ${errors.expectedTravelBudget ? "is-invalid" : ""}`}
                                                placeholder="Expected Travel Budget"
                                                onBlur={(e) => validateField("expectedTravelBudget", e.target.value)}

                                            />
                                            {errors.expectedTravelBudget && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Expected Travel Budget is required!</p>)}
                                        </div>


                                        <div className="col-md-6 mb-3">
                                            <label>Actual Travel Budget</label>
                                            <input type="number" value={form.actualTravelBudget}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, actualTravelBudget: value });
                                                    validateField("actualTravelBudget", value);
                                                }}
                                                className={`form-control ${errors.actualTravelBudget ? "is-invalid" : ""}`}
                                                placeholder="Actual Travel Budget"
                                                onBlur={(e) => validateField("actualTravelBudget", e.target.value)}

                                            />
                                            {errors.actualTravelBudget && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Actual Travel Budget is required!</p>)}
                                        </div>

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
                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Approval Status is Required</p>
                                        )}
                                    </div>

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
                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>This Field is Required</p>
                                        )}
                                    </div>

                                    <label>Travel Reason</label>
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
                                        <p className="text-danger mb-0" style={{ fontSize: '13px' }}>
                                            Travel Reason is Required
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
                    <span>List All Travels</span>
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
                                    <h5 className="modal-title">View Resignation</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setShowModal(false)}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <p><strong>Employee:</strong> {selectedRow.employeeName}</p>
                                    <p><strong>Start Date:</strong> {selectedRow.startDate}</p>
                                    <p><strong>End Date:</strong> {selectedRow.endDate}</p>
                                    <p><strong>Purpose of Visit:</strong> {selectedRow.purposeOfVisit}</p>
                                    <p><strong>Place of Visit:</strong> {selectedRow.placOfVisit}</p>

                                    <p>
                                        <strong>Travel Mode:</strong> {String(selectedRow?.travelMode || '').replace(/<[^>]+>/g, '')}
                                    </p>

                                    <p>
                                        <strong>Arrangement Type:</strong> {String(selectedRow?.arrangementType || '').replace(/<[^>]+>/g, '')}
                                    </p>

                                    <p>
                                        <strong>Expected Travel Budget:</strong> {String(selectedRow?.expectedTravelBudget || '').replace(/<[^>]+>/g, '')}
                                    </p>

                                    <p>
                                        <strong>Actual Travel Budget:</strong> {String(selectedRow?.actualTravelBudget || '').replace(/<[^>]+>/g, '')}
                                    </p>

                                    <p><strong>Status:</strong> {selectedRow.approvalStatus}</p>

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
                                        <h5 className="modal-title">Edit Travel</h5>
                                        <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                                    </div>
                                    <div className="modal-body">
                                        <form onSubmit={handleSubmit}>
                                            <div className="row">
                                                {/* Left Column */}
                                                <div className="col-md-6">
                                                    <div className="mb-3">
                                                        <label>Employee</label>
                                                        <select id="resignEmployee" value={form.employeeName}
                                                            onChange={(e) => {
                                                                const { value } = e.target;
                                                                setForm({ ...form, employeeName: value });
                                                                validateField("employeeName", value);
                                                            }}
                                                            className={`form-control ${errors.employeeName ? "is-invalid" : ""}`}
                                                            onBlur={(e) => validateField("employeeName", e.target.value)}
                                                        >
                                                            <option value="">Choose Employee</option>
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
                                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Employee Name is required!</p>)}
                                                    </div>

                                                    <div className='row'>
                                                        <div className="col-md-6 mb-3">
                                                            <label>Start Date</label>
                                                            <input type="date" value={form.startDate}
                                                                onChange={(e) => {
                                                                    const { value } = e.target;
                                                                    setForm({ ...form, startDate: value });
                                                                    validateField("startDate", value);
                                                                }}
                                                                className={`form-control ${errors.startDate ? "is-invalid" : ""}`}
                                                                placeholder="startDate"
                                                                onBlur={(e) => validateField("startDate", e.target.value)}

                                                            />
                                                            {errors.startDate && (
                                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Start Date is required!</p>)}
                                                        </div>

                                                        <div className="col-md-6 mb-3">
                                                            <label>End date</label>
                                                            <input type="date" value={form.endDate}
                                                                onChange={(e) => {
                                                                    const { value } = e.target;
                                                                    setForm({ ...form, endDate: value });
                                                                    validateField("endDate", value);
                                                                }}
                                                                className={`form-control ${errors.endDate ? "is-invalid" : ""}`}
                                                                placeholder="endDate"
                                                                onBlur={(e) => validateField("endDate", e.target.value)}

                                                            />
                                                            {errors.endDate && (
                                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>End Date is required!</p>)}
                                                        </div>
                                                    </div>

                                                    <div className='row'>
                                                        <div className="col-md-6 mb-3">
                                                            <label>Purpose of Visit</label>
                                                            <input type="text" value={form.purposeOfVisit}
                                                                onChange={(e) => {
                                                                    const { value } = e.target;
                                                                    setForm({ ...form, purposeOfVisit: value });
                                                                    validateField("purposeOfVisit", value);
                                                                }}
                                                                className={`form-control ${errors.purposeOfVisit ? "is-invalid" : ""}`}
                                                                placeholder="Purpose Of Visit"
                                                                onBlur={(e) => validateField("purposeOfVisit", e.target.value)}

                                                            />
                                                            {errors.purposeOfVisit && (
                                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Purpose of Visit is required!</p>)}
                                                        </div>

                                                        <div className="col-md-6 mb-3">
                                                            <label>Place of Visit</label>
                                                            <input type="text" value={form.placOfVisit}
                                                                onChange={(e) => {
                                                                    const { value } = e.target;
                                                                    setForm({ ...form, placOfVisit: value });
                                                                    validateField("placOfVisit", value);
                                                                }}
                                                                className={`form-control ${errors.placOfVisit ? "is-invalid" : ""}`}
                                                                placeholder="Place Of Visit"
                                                                onBlur={(e) => validateField("placOfVisit", e.target.value)}

                                                            />
                                                            {errors.placOfVisit && (
                                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Place of Visit is required!</p>)}
                                                        </div>
                                                    </div>

                                                    <div className='row'>
                                                        <div className="col-md-6 mb-3">
                                                            <label>Travel Mode</label>
                                                            <select id="travelMode" value={form.travelMode}
                                                                onChange={(e) => {
                                                                    const { value } = e.target;
                                                                    setForm({ ...form, travelMode: value });
                                                                    validateField("travelMode", value);
                                                                }}
                                                                className={`form-control ${errors.travelMode ? "is-invalid" : ""}`}
                                                                onBlur={(e) => validateField("travelMode", e.target.value)}
                                                            >
                                                                <option value="">Travel Mode</option>
                                                                <option value="By Bus">By Bus</option>
                                                                <option value="By Train">By Train</option>
                                                                <option value="By Plane">By Plane</option>
                                                                <option value="By Taxi">By Taxi</option>
                                                                <option value="By rental Car">By rental Car</option>
                                                            </select>
                                                            {errors.travelMode && (
                                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Travel Mode is Required</p>
                                                            )}
                                                        </div>

                                                        <div className="col-md-6 mb-3">
                                                            <label>Arrangement type</label>
                                                            <select id="arrangementType" value={form.arrangementType}
                                                                onChange={(e) => {
                                                                    const { value } = e.target;
                                                                    setForm({ ...form, arrangementType: value });
                                                                    validateField("arrangementType", value);
                                                                }}
                                                                className={`form-control ${errors.arrangementType ? "is-invalid" : ""}`}
                                                                onBlur={(e) => validateField("arrangementType", e.target.value)}
                                                            >
                                                                <option value="">Arrangement Type</option>
                                                                <option value="Hotel">Hotel</option>
                                                                <option value="Guest House">Guest House</option>
                                                                <option value="Motel">Motel</option>
                                                                <option value="Air BnB">Air BnB</option>
                                                            </select>
                                                            {errors.arrangementType && (
                                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Arrangement Type is Required</p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className='row'>
                                                        <div className="col-md-6 mb-3">
                                                            <label>Expected Travel Budget</label>
                                                            <input type="number" value={form.expectedTravelBudget}
                                                                onChange={(e) => {
                                                                    const { value } = e.target;
                                                                    setForm({ ...form, expectedTravelBudget: value });
                                                                    validateField("expectedTravelBudget", value);
                                                                }}
                                                                className={`form-control ${errors.expectedTravelBudget ? "is-invalid" : ""}`}
                                                                placeholder="Expected Travel Budget"
                                                                onBlur={(e) => validateField("expectedTravelBudget", e.target.value)}

                                                            />
                                                            {errors.expectedTravelBudget && (
                                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Expected Travel Budget is required!</p>)}
                                                        </div>


                                                        <div className="col-md-6 mb-3">
                                                            <label>Actual Travel Budget</label>
                                                            <input type="number" value={form.actualTravelBudget}
                                                                onChange={(e) => {
                                                                    const { value } = e.target;
                                                                    setForm({ ...form, actualTravelBudget: value });
                                                                    validateField("actualTravelBudget", value);
                                                                }}
                                                                className={`form-control ${errors.actualTravelBudget ? "is-invalid" : ""}`}
                                                                placeholder="Actual Travel Budget"
                                                                onBlur={(e) => validateField("actualTravelBudget", e.target.value)}

                                                            />
                                                            {errors.actualTravelBudget && (
                                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Actual Travel Budget is required!</p>)}
                                                        </div>

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
                                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Approval Status is Required</p>
                                                        )}
                                                    </div>

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
                                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>This Field is Required</p>
                                                        )}
                                                    </div>

                                                    <label>Travel Reason</label>
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
                                                            Travel Reason is Required
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

export default Travels;
