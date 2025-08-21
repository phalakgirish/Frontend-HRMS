import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
// import './organization.css';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getUpdateAttendance, createUpdateAttendance, updateUpdateAttendance, deleteUpdateAttendance } from '../../api/updateAttendanceApi';


const UpdateAttendance = () => {

    const [showModal, setShowModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [description, setDescription] = useState('<div class="mb-3"><label>Hello, Your Payslip is generated</label></div>');
    const [showAddModal, setShowAddModal] = useState(false);

    const [UpdateAttendance, setUpdateAttendance] = useState([]);
    const [paginated, setPaginated] = useState([]);

    const [editId, setEditId] = useState(null);

    const [form, setForm] = useState({
        date: '',
        employee:''
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
        fetchUpdateAttendance();
    }, []);

    const fetchUpdateAttendance = async () => {
        try {
            const response = await getUpdateAttendance();
            setUpdateAttendance(response.data);
            paginate(response.data, currentPage);
        } catch (error) {
            console.error('Error fetching UpdateAttendance:', error);
        }
    };

    const validateField = (fieldName, value = "") => {
        let error = "";

        switch (fieldName) {
            case "date":
                if (!value.trim()) {
                    error = "Date is required";
                }
                break;

                 case "employee":
                if (!value.trim()) {
                    error = "Employee Name is required";
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

                    await updateUpdateAttendance(editId, form);
                    toast.success("Training Type updated successfully!");

                } else {
                    await createUpdateAttendance(form);
                    toast.success("Training Type saved successfully!");

                }
                fetchUpdateAttendance();
                setForm({
                    UpdateAttendance: ''
                });
                setEditId("");
                setShowEditModal(false);
            } catch (err) {
                console.error("Error saving UpdateAttendance:", err);
                toast.error("Training Type failed to save!");

            }
        }
    };


    const emptyForm = {
        date: '',
        employee:''
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

    // const handleEdit = (row) => {
    //     setForm({
    //         UpdateAttendance: row.UpdateAttendance
    //     });
    //     setEditId(row._id);
    //     setShowEditModal(true);
    //     setSelectedRow(row);
    // };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this Training Type?");
        if (!confirmDelete) return;
        try {
            await deleteUpdateAttendance(id);
            fetchUpdateAttendance();
        } catch (err) {
            console.error("Error deleting UpdateAttendance:", err);
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
        { name: 'In Time', selector: row => row.inTime },
        { name: 'Out Time', selector: row => row.outTime },
        { name: 'Late', selector: row => row.late },
        { name: 'Total Work', selector: row => row.totalWork },
        { name: 'Reason', selector: row => row.reason },
    ];

    // const data = [
    //     {
    //         action: '-',
    //         inTime: '00:00',
    //         outTime: '00:00',
    //         late: '00:00',
    //         totalWork: '00:00',
    //         reason: 'abc'
    //     },
    //     {
    //         action: '-',
    //         inTime: '00:00',
    //         outTime: '00:00',
    //         late: '00:00',
    //         totalWork: '00:00',
    //         reason: 'abc'
    //     }, {
    //         action: '-',
    //         inTime: '00:00',
    //         outTime: '00:00',
    //         late: '00:00',
    //         totalWork: '00:00',
    //         reason: 'abc'
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

    const totalEntries = UpdateAttendance.length;
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

    // const toggleAddForm = () => {
    //     setShowAddForm((prev) => !prev);
    // };

    return (
        <div className="custom-container">
            <h5>Update Attendance</h5>
            <p style={{ fontSize: '15px', color: 'rgb(98, 98, 98)' }}>
                <span style={{ color: 'red' }}>Home</span> / Update Attendance
            </p>

           
            <div className="container-fluid px-3 mt-4">

                <div className="row g-4">
                    <div className="col-12 col-lg-4">
                        <div className="card no-radius h-100">
                            <div className="card-header d-flex justify-content-between align-items-center text-white new-emp-bg">
                                <span>Update Attendance</span>
                            </div>

                            <form className="p-3" onSubmit={handleSubmit}>
                                 <div className="row">
                                <div className="mb-3">
                                    <label>Date</label>
                                    <input type="date" value={form.date}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, date: value });
                                                    validateField("date", value);
                                                }}
                                                className={`form-control ${errors.date ? "is-invalid" : ""}`}
                                                onBlur={(e) => validateField("date", e.target.value)}

                                            />
                                            {errors.date && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.date}</p>)}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Employee</label>
                                   <select id="leaveEmp" value={form.employee}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setForm({ ...form, employee: value });
                                                validateField("employee", value);
                                            }}
                                            className={`form-control ${errors.employee ? "is-invalid" : ""}`}
                                            onBlur={(e) => validateField("employee", e.target.value)}
                                        >
                                        <option value="">Choose an Employee...</option>
                                        <option value="admin">Admin Admin</option>
                                        <option value="anjali">Anjali Patle</option>
                                        <option value="amit">Amit Kumar</option>
                                        <option value="aniket">Aniket Rane</option>
                                    </select>
                                     {errors.employee && (
                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.employee}</p>)}
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
                                <span>List All Updated Attendance</span>
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

                        </div>
                    </div>

                     {showModal && selectedRow && (
                                <div className="modal show fade d-block" tabIndex="-1" role="dialog">
                                    <div className="modal-dialog modal-dialog-centered" role="document">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title">View Policy</h5>
                                                <button
                                                    type="button"
                                                    className="btn-close"
                                                    onClick={() => setShowModal(false)}
                                                ></button>
                                            </div>
                                            <div className="modal-body">
                                                <p><strong>Company:</strong> {selectedRow.company}</p>
                                                <p><strong>Title:</strong> {selectedRow.title}</p>
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

                </div>
            </div>

        </div>
    );
};

export default UpdateAttendance;
