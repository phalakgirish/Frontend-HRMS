import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import './training.css';
import { useNavigate } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { getTrainingList, createTrainingList, updateTrainingList, deleteTrainingList } from '../../api/trainingListApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from "react-select";
import axios from "axios";
import { useLocation } from "react-router-dom";

const TrainingList = () => {

    const employeeOptions = [
        { value: "Admin", label: "Admin Admin" },
        { value: "Anjali Patle", label: "Anjali Patle" },
        { value: "Amit Kumar", label: "Amit Kumar" },
        { value: "Aniket Rane", label: "Aniket Rane" },
        { value: "Shubham Kadam", label: "Shubham Kadam" },
        { value: "Abhijieet Tawate", label: "Abhijieet Tawate" },
        { value: "Pravin Bildlan", label: "Pravin Bildlan" },
        { value: "Amit Pednekar", label: "Amit Pednekar" },
        { value: "Mahendra Chaudhary", label: "Mahendra Chaudhary" },
        { value: "Hamsa Dhwjaa", label: "Hamsa Dhwjaa" },
        { value: "Manoj Kumar Sinha", label: "Manoj Kumar Sinha" }
    ];

    const [showModal, setShowModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [description, setDescription] = useState('');
    const navigate = useNavigate();
    const [data, setData] = useState([]);


    //from backend
    const [TrainingList, setTrainingList] = useState([]);
    const [paginated, setPaginated] = useState([]);

    const [editId, setEditId] = useState(null);

    const [form, setForm] = useState({
        trainingType: '',
        trainer: '',
        trainingCost: '',
        startDate: '',
        endDate: '',
        department: '',
        employee: [],
        // status: '',
        description: '',
        // performance:'',
        // remarks:''
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
        fetchTrainingList();
    }, []);

    const fetchTrainingList = async () => {
        try {
            const response = await getTrainingList();
            setTrainingList(response.data);
            paginate(response.data, currentPage);
        } catch (error) {
            console.error('Error fetching TrainingList:', error);
        }
    };
    const location = useLocation();

    useEffect(() => {
        if (location.state?.updatedList) {
            setData(location.state.updatedList);
        } else {
            fetchData();
        }
    }, [location.state]);
    const fetchData = async () => {
        try {
            const res = await axios.get("http://localhost:3000/trainingList");
            setData(res.data);
        } catch (err) {
            console.error("Error fetching training list:", err);
        }
    };

    const validateField = (fieldName, value = "") => {
        let error = "";

        switch (fieldName) {
            case "trainingType":
                if (!value.trim()) {
                    error = "Training Type is required";
                }
                break;

            case "trainer":
                if (!value.trim()) {
                    error = "Trainer is required";
                }
                break;

            case "trainingCost":
                if (!value.trim()) {
                    error = "Training Cost is required";
                }
                break;

            case "startDate":
                if (!value.trim()) {
                    error = "Start Date is required";
                }
                break;

            case "endDate":
                if (!value.trim()) {
                    error = "End Date is required";
                }
                break;

            case "department":
                if (!value.trim()) {
                    error = "Department is required";
                }
                break;

            case "employee":
                if (!value || value.length === 0) {
                    error = "Employee is required";
                }
                break;


            // case "status":
            //     if (!value.trim()) {
            //         error = "Status is required";
            //     }
            //     break;

            case "description":
                if (!value.trim()) {
                    error = "Description is required";
                }
                break;

            default:
                break;
        }

        setErrors((prev) => ({ ...prev, [fieldName]: error }));
        return !error; // true if valid
    };



    const handleSubmit = async (e) => {
    console.log("Form before validation:", form);
console.log("Validation result:", validateForm());

        e.preventDefault();
        if (validateForm()) {
            try {
                if (editId) {
                    console.log("Submitting form:", form);

                    await updateTrainingList(editId, form);
                    toast.success("Training List updated successfully!");

                } else {
                    await createTrainingList(form);
                    toast.success("Training List saved successfully!");

                }
                fetchTrainingList();
                setForm({
                    trainingType: '',
                    trainer: '',
                    trainingCost: '',
                    startDate: '',
                    endDate: '',
                    department: '',
                    employee: [],
                    status: '',
                    description: '',
                     performance:'',
        remarks:''
                });
                setEditId("");
                setShowEditModal(false);
            } catch (err) {
                console.error("Error saving TrainingList:", err);
                toast.error("Training List failed to save!");

            }
        }
    };

    const emptyForm = {
        trainingType: '',
        trainer: '',
        trainingCost: '',
        startDate: '',
        endDate: '',
        department: '',
        employee: [],
        // status: '',
        description: ''
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
        setForm({
            trainingType: row.trainingType,
            trainer: row.trainer,
            trainingCost: row.trainingCost,
            startDate: row.startDate,
            endDate: row.endDate,
            department: row.department,
            employee: Array.isArray(row.employee) ? row.employee : [row.employee], // ensure array
            status: row.status,
            description: row.description,
             performance:row.performance,
        remarks:row.remarks
        });
        setEditId(row._id);
        setShowEditModal(true);
        setSelectedRow(row);
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this Training List?");
        if (!confirmDelete) return;
        try {
            await deleteTrainingList(id);
            fetchTrainingList();
        } catch (err) {
            console.error("Error deleting TrainingList:", err);
        }
    };




    const columns = [
        {
            name: 'Action',
            cell: (row) => (
                <div className="d-flex">
                    <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => navigate(`/trainingDetail/${row.trainer}`, { state: { employee: row, employeesList: data } })}
                    >
                        <i className="fas fa-arrow-right"></i>
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
        {
            name: 'Employee',
            cell: row => (
                <div className="d-flex flex-wrap">
                    {row.employee && row.employee.length > 0 ? (
                        row.employee.map((emp, index) => (
                            <div
                                key={index}
                                className="d-flex align-items-center me-3 mb-2"
                            >
                                <img
                                    src={emp.avatar2 || '/avatar2.jpg'}
                                    alt="avatar"
                                    className="rounded-circle me-2"
                                    width="32"
                                    height="32"
                                />
                                <span>{emp.name || emp}</span>
                            </div>
                        ))
                    ) : (
                        <span className="text-muted">No Employees</span>
                    )}
                </div>
            )
        },


        { name: 'Training Type', selector: row => row.trainingType },
        { name: 'Trainer', selector: row => row.trainer },
        {
            name: 'Training Duration',
            selector: row => {
                if (!row.startDate || !row.endDate) return "";
                const options = { day: "2-digit", month: "short", year: "numeric" };
                const start = new Date(row.startDate).toLocaleDateString("en-GB", options);
                const end = new Date(row.endDate).toLocaleDateString("en-GB", options);
                return `${start} to ${end}`;
            }
        },
        { name: 'Cost', selector: row => row.trainingCost },
        { name: 'Status', selector: row => row.status }

    ];


    const customStyles = {
        headCells: {
            style: {
                backgroundColor: '#2b528c',
                color: 'white',
                fontSize: '14px',
                whiteSpace: 'nowrap',
            },
        },
        cells: {
            style: {
                fontSize: '14px',
                whiteSpace: 'normal',
                wordBreak: 'break-word',
            },
        },
    };


    const conditionalRowStyles = [
        {
            when: (row, index) => index % 2 === 0,
            style: {
                backgroundColor: 'white',
                minHeight: '60px',
                paddingTop: '10px',
                paddingBottom: '10px',
                whiteSpace: 'normal',
                wordBreak: 'break-word',
            },
        },
        {
            when: (row, index) => index % 2 !== 0,
            style: {
                backgroundColor: '#f8f9fa',
                minHeight: '60px',
                paddingTop: '10px',
                paddingBottom: '10px',
                whiteSpace: 'normal',
                wordBreak: 'break-word',
            },
        },
    ];


    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const totalEntries = TrainingList.length;
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

    return (
        <div className="custom-container">
            <h5>Training</h5>
            <p style={{ fontSize: '15px', color: 'rgb(98, 98, 98)' }}>
                <span style={{ color: 'red' }}>Home</span> / Training
            </p>


            {showAddForm && (
                <div className="card mb-3 form-slide-container">
                    <div className="card-header d-flex justify-content-between align-items-center text-white new-emp-bg">
                        <span>Add New Training</span>
                        <button className="btn btn-sm add-btn" onClick={toggleAddForm}>
                            - Hide
                        </button>
                    </div>

                    <div className="container mt-4">
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                {/* Left Column */}
                                <div className="col-md-6">
                                    <div className="col-md-12 mb-3">
                                        <label>Training Type</label>
                                        <select
                                            value={form.trainingType}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setForm({ ...form, trainingType: value });
                                                validateField("trainingType", value);
                                            }}
                                            className={`form-control ${errors.trainingType ? "is-invalid" : ""}`}
                                            onBlur={(e) => validateField("trainingType", e.target.value)}
                                        >
                                            <option value="">Training Type</option>
                                            <option value="Job Training">Job Training</option>
                                            <option value="Promotional Training">Promotional Training</option>
                                            <option value="Workshop">Workshop</option>
                                            <option value="Webinar">Webinar</option>
                                            <option value="Seminar">Seminar</option>
                                            <option value="Online Training">Online Training</option>
                                        </select>
                                        {errors.trainingType && (
                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.trainingType}</p>
                                        )}
                                    </div>

                                    <div className='row'>
                                        <div className="col-md-6 mb-3">
                                            <label>Trainer</label>
                                            <select
                                                value={form.trainer}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, trainer: value });
                                                    validateField("trainer", value);
                                                }}
                                                className={`form-control ${errors.trainer ? "is-invalid" : ""}`}
                                                onBlur={(e) => validateField("trainer", e.target.value)}
                                            >
                                                <option value="">Trainer</option>
                                                <option value="Manoj Sinha">Manoj Sinha</option>
                                                <option value="Admin Admin">Admin Admin</option>
                                                <option value="Shubham Kadam">Shubham Kadam</option>
                                                <option value="Anjali">Anjali</option>

                                            </select>
                                            {errors.trainer && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.trainer}</p>
                                            )}
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label>Training Cost</label>
                                            <input
                                                type="number"
                                                value={form.trainingCost}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, trainingCost: value });
                                                    validateField("trainingCost", value);
                                                }}
                                                className={`form-control ${errors.trainingCost ? "is-invalid" : ""}`}
                                                placeholder="Training Cost"
                                                onBlur={(e) => validateField("trainingCost", e.target.value)}

                                            />
                                            {errors.trainingCost && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}> Training Cost is Required!</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className="col-md-6 mb-3">
                                            <label>Start Date</label>
                                            <input
                                                type="date"
                                                value={form.startDate}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, startDate: value });
                                                    validateField("startDate", value);
                                                }}
                                                className={`form-control ${errors.startDate ? "is-invalid" : ""}`}
                                                placeholder="Start Date"
                                                onBlur={(e) => validateField("startDate", e.target.value)}

                                            />
                                            {errors.startDate && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}> Start Date is Required!</p>
                                            )}
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label>End Date</label>
                                            <input
                                                type="date"
                                                value={form.endDate}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, endDate: value });
                                                    validateField("endDate", value);
                                                }}
                                                className={`form-control ${errors.endDate ? "is-invalid" : ""}`}
                                                placeholder="End Date"
                                                onBlur={(e) => validateField("endDate", e.target.value)}

                                            />
                                            {errors.endDate && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}> End Date is Required!</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className="col-md-6 mb-3">
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
                                                <option value="">Department</option>
                                                <option value="Accounts">Accounts</option>
                                                <option value="HR">HR</option>
                                                <option value="IT">IT</option>
                                                <option value="Management">Management</option>
                                            </select>
                                            {errors.department && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.department}</p>
                                            )}
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label>Employee</label>
                                            <Select
                                                isMulti
                                                options={employeeOptions}
                                                value={employeeOptions.filter(opt => form.employee?.includes(opt.value))}
                                                onChange={(selected) => {
                                                    const selectedValues = selected.map(opt => opt.value);
                                                    setForm({ ...form, employee: selectedValues });
                                                    validateField("employee", selectedValues);
                                                }}
                                                classNamePrefix="react-select"
                                                className={errors.employee ? "is-invalid" : ""}
                                            />
                                            {errors.employee && (
                                                <p className="text-danger mb-0" style={{ fontSize: "13px" }}>
                                                    {errors.employee}
                                                </p>
                                            )}
                                        </div>

                                    </div>



                                </div>

                                {/* Right Column */}
                                <div className="col-md-6">
                                    {/* <div className="col-md-12 mb-3">
                                        <label>Status</label>
                                        <select id="status"
                                            value={form.status}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setForm({ ...form, status: value });
                                                validateField("status", value);
                                            }}
                                            className={`form-control ${errors.employee ? "is-invalid" : ""}`}
                                            onBlur={(e) => validateField("status", e.target.value)}
                                        >
                                            <option value="">Status</option>
                                            <option value="pending">Pending</option>
                                            <option value="accepted">Accepted</option>
                                            <option value="rejected">Rejected</option>
                                        </select>
                                        {errors.status && (
                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.status}</p>
                                        )}
                                    </div> */}

                                    <div className="col-md-12 mb-3">
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
                                                Description is Required
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
                    <span>List All Training</span>
                    <button className="btn btn-sm add-btn" onClick={toggleAddForm}>{showAddForm ? '- Hide' : '+ Add New'}</button>
                </div>


                <div className="px-3 mt-3">
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
                            <div className="modal-dialog modal-dialog-centered edit-modal">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Edit Training</h5>
                                        <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                                    </div>
                                    <div className="modal-body">
                                        <form onSubmit={handleSubmit}>
                                            <div className="row">
                                                {/* Left Column */}
                                                <div className="col-md-6">
                                                    <div className="col-md-12 mb-3">
                                                        <label>Training Type</label>
                                                        <select
                                                            value={form.trainingType}
                                                            onChange={(e) => {
                                                                const { value } = e.target;
                                                                setForm({ ...form, trainingType: value });
                                                                validateField("trainingType", value);
                                                            }}
                                                            className={`form-control ${errors.trainingType ? "is-invalid" : ""}`}
                                                            onBlur={(e) => validateField("trainingType", e.target.value)}
                                                        >
                                                            <option value="">Training Type</option>
                                                            <option value="Job Training">Job Training</option>
                                                            <option value="Promotional Training">Promotional Training</option>
                                                            <option value="Workshop">Workshop</option>
                                                            <option value="Webinar">Webinar</option>
                                                            <option value="Seminar">Seminar</option>
                                                            <option value="Online Training">Online Training</option>
                                                        </select>
                                                        {errors.trainingType && (
                                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.trainingType}</p>
                                                        )}
                                                    </div>

                                                    <div className='row'>
                                                        <div className="col-md-6 mb-3">
                                                            <label>Trainer</label>
                                                            <select
                                                                value={form.trainer}
                                                                onChange={(e) => {
                                                                    const { value } = e.target;
                                                                    setForm({ ...form, trainer: value });
                                                                    validateField("trainer", value);
                                                                }}
                                                                className={`form-control ${errors.trainer ? "is-invalid" : ""}`}
                                                                onBlur={(e) => validateField("trainer", e.target.value)}
                                                            >
                                                                <option value="">Trainer</option>
                                                                <option value="Manoj Sinha">Manoj Sinha</option>
                                                            </select>
                                                            {errors.trainer && (
                                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.trainer}</p>
                                                            )}
                                                        </div>

                                                        <div className="col-md-6 mb-3">
                                                            <label>Training Cost</label>
                                                            <input
                                                                type="number"
                                                                value={form.trainingCost}
                                                                onChange={(e) => {
                                                                    const { value } = e.target;
                                                                    setForm({ ...form, trainingCost: value });
                                                                    validateField("trainingCost", value);
                                                                }}
                                                                className={`form-control ${errors.trainingCost ? "is-invalid" : ""}`}
                                                                placeholder="Training Cost"
                                                                onBlur={(e) => validateField("trainingCost", e.target.value)}

                                                            />
                                                            {errors.trainingCost && (
                                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}> Training Cost is Required!</p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className='row'>
                                                        <div className="col-md-6 mb-3">
                                                            <label>Start Date</label>
                                                            <input
                                                                type="date"
                                                                value={form.startDate}
                                                                onChange={(e) => {
                                                                    const { value } = e.target;
                                                                    setForm({ ...form, startDate: value });
                                                                    validateField("startDate", value);
                                                                }}
                                                                className={`form-control ${errors.startDate ? "is-invalid" : ""}`}
                                                                placeholder="Start Date"
                                                                onBlur={(e) => validateField("startDate", e.target.value)}

                                                            />
                                                            {errors.startDate && (
                                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}> Start Date is Required!</p>
                                                            )}
                                                        </div>

                                                        <div className="col-md-6 mb-3">
                                                            <label>End Date</label>
                                                            <input
                                                                type="date"
                                                                value={form.endDate}
                                                                onChange={(e) => {
                                                                    const { value } = e.target;
                                                                    setForm({ ...form, endDate: value });
                                                                    validateField("endDate", value);
                                                                }}
                                                                className={`form-control ${errors.endDate ? "is-invalid" : ""}`}
                                                                placeholder="End Date"
                                                                onBlur={(e) => validateField("endDate", e.target.value)}

                                                            />
                                                            {errors.endDate && (
                                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}> End Date is Required!</p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className='row'>
                                                        <div className="col-md-6 mb-3">
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
                                                                <option value="">Department</option>
                                                                <option value="acc">Accounts</option>
                                                            </select>
                                                            {errors.department && (
                                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.department}</p>
                                                            )}
                                                        </div>

                                                        <div className="col-md-6 mb-3">
                                                            <label>Employee</label>
                                                            <Select
                                                                isMulti
                                                                options={employeeOptions}
                                                                value={employeeOptions.filter(opt => form.employee?.includes(opt.value))}
                                                                onChange={(selected) => {
                                                                    const selectedValues = selected.map(opt => opt.value);
                                                                    setForm({ ...form, employee: selectedValues });
                                                                    validateField("employee", selectedValues);
                                                                }}
                                                                classNamePrefix="react-select"
                                                                className={errors.employee ? "is-invalid" : ""}
                                                            />
                                                            {errors.employee && (
                                                                <p className="text-danger mb-0" style={{ fontSize: "13px" }}>
                                                                    {errors.employee}
                                                                </p>
                                                            )}
                                                        </div>

                                                    </div>



                                                </div>

                                                {/* Right Column */}
                                                <div className="col-md-6">
                                                    {/* <div className="col-md-12 mb-3">
                                                        <label>Status</label>
                                                        <select id="status"
                                                            value={form.status}
                                                            onChange={(e) => {
                                                                const { value } = e.target;
                                                                setForm({ ...form, status: value });
                                                                validateField("status", value);
                                                            }}
                                                            className={`form-control ${errors.employee ? "is-invalid" : ""}`}
                                                            onBlur={(e) => validateField("status", e.target.value)}
                                                        >
                                                            <option value="">Status</option>
                                                            <option value="pending">Pending</option>
                                                            <option value="accepted">Accepted</option>
                                                            <option value="rejected">Rejected</option>
                                                        </select>
                                                        {errors.status && (
                                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.status}</p>
                                                        )}
                                                    </div> */}

                                                    <div className="col-md-12 mb-3">
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
                                                                Description is Required
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
        </div>
    );
};

export default TrainingList;
