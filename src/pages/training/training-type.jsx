import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
// import './organization.css';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { getTrainingType, createTrainingType, updateTrainingType, deleteTrainingType } from '../../api/trainingTypeApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const TrainingType = () => {

    // const [showModal, setShowModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [description, setDescription] = useState('<div class="mb-3"><label>Hello, Your Payslip is generated</label></div>');

    //from backend
    const [TrainingType, setTrainingType] = useState([]);
    // const [paginated, setPaginated] = useState([]);

    const [editId, setEditId] = useState(null);

    const [form, setForm] = useState({
        trainingType: ''
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
        fetchTrainingType();
    }, []);

    const fetchTrainingType = async () => {
        try {
            const response = await getTrainingType();
            setTrainingType(response.data);
            paginate(response.data, currentPage);
        } catch (error) {
            console.error('Error fetching TrainingType:', error);
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

            default:
                break;
        }

        setErrors((prev) => ({ ...prev, [fieldName]: error }));
        return !error; // true if valid
    };




    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                if (editId) {
                    console.log("Submitting form:", form);

                    await updateTrainingType(editId, form);
                    toast.success("Training Type updated successfully!");

                } else {
                    await createTrainingType(form);
                    toast.success("Training Type saved successfully!");

                }
                fetchTrainingType();
                setForm({
                    trainingType: ''
                });
                setEditId("");
                setShowEditModal(false);
            } catch (err) {
                console.error("Error saving TrainingType:", err);
                toast.error("Training Type failed to save!");

            }
        }
    };

    const emptyForm = {
        trainingType: ''
    };

    const resetForm = () => {
        setForm(emptyForm);
        setEditId(null);
        setShowEditModal(false);
    };

    // const handleView = (row) => {
    //     setSelectedRow(row);
    //     setShowModal(true);
    // };

    const handleEdit = (row) => {
        setForm({
            trainingType: row.trainingType
        });
        setEditId(row._id);
        setShowEditModal(true);
        setSelectedRow(row);
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this Training Type?");
        if (!confirmDelete) return;
        try {
            await deleteTrainingType(id);
            fetchTrainingType();
        } catch (err) {
            console.error("Error deleting TrainingType:", err);
        }
    };





    const columns = [
        {
            name: 'Action',
            cell: (row) => (
                <div className="d-flex">
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
        { name: 'Sr. No', cell: (row, index) => index + 1, },
        { name: 'Type', selector: row => row.trainingType }
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

    const totalEntries = TrainingType.length;
    const totalPages = Math.ceil(totalEntries / rowsPerPage);
   const [paginated, setPaginated] = useState(TrainingType.slice(0, rowsPerPage));
 
     const paginate = (data, page) => {
         const start = (page - 1) * rowsPerPage;
         const end = start + rowsPerPage;
         setPaginated(data.slice(start, end));
         setCurrentPage(page);
     };
 
     const startEntry = (currentPage - 1) * rowsPerPage + 1;
     const endEntry = Math.min(currentPage * rowsPerPage, TrainingType.length);
     useEffect(() => {
         const start = (currentPage - 1) * rowsPerPage;
         const end = start + rowsPerPage;
         setPaginated(TrainingType.slice(start, end));
     }, [TrainingType, currentPage, rowsPerPage]);

    // const [showAddForm, setShowAddForm] = useState(false);

    // const toggleAddForm = () => {
    //     setShowAddForm((prev) => !prev);
    // };

    return (
        <div className="custom-container">
            <h5>Training Type</h5>
            <p style={{ fontSize: '15px', color: 'rgb(98, 98, 98)' }}>
                <span style={{ color: 'red' }}>Home</span> / Training Type
            </p>


            <div className="container-fluid px-3 mt-4">

                <div className="row g-4">
                    <div className="col-12 col-lg-4">
                        <div className="card no-radius h-100">
                            <div className="card-header d-flex justify-content-between align-items-center text-white new-emp-bg">
                                <span>Add New Type</span>
                            </div>

                            <form className="p-3" onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-12 mb-3">
                                        <label className="form-label mb-2" style={{ minWidth: "120px" }}>Training Type</label>
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

                                    <div className="text-start">
                                        <button type="submit" className="btn btn-sm add-btn">Save</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>


                    <div className="col-12 col-lg-8">
                        <div className="card no-radius h-100">
                            <div className="card-header d-flex justify-content-between align-items-center text-white new-emp-bg">
                                <span>List All Training Types</span>
                                {/* <button className="btn btn-sm add-btn" onClick={toggleAddForm}>{showAddForm ? '- Hide' : '+ Add New'}</button> */}
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
                                                    <h5 className="modal-title">Edit Training</h5>
                                                    <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                                                </div>
                                                <div className="modal-body">
                                                    <form className="p-3" onSubmit={handleSubmit}>
                                                        <div className="row">
                                                            <div className="col-md-12 mb-3">
                                                                <label className="form-label mb-2" style={{ minWidth: "120px" }}>Training Type</label>
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

                                                            <div className="text-end">
                                                                <button type="button" className="btn btn-sm btn-light me-2" onClick={() => { resetForm(); setShowEditModal(false) }}>Close</button>
                                                                <button type="submit" onClick={(e) => handleSubmit(e)} className="btn btn-sm add-btn">Update</button>
                                                            </div>
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
                </div>
            </div>




        </div>
    );
};

export default TrainingType;
