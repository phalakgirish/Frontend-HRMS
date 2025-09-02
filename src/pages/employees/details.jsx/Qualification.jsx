import React from "react";
import { useState, useRef, useEffect } from "react";
import DataTable from 'react-data-table-component';
import { getEmployeeQuali, createEmployeeQuali, updateEmployeeQuali, deleteEmployeeQuali } from "./apis/qualificationDetailsApi";
import { toast } from "react-toastify";

const Qualification = ({ mode,employeeId  }) => {

     useEffect(() => {
  }, [employeeId]);

    const [showModal, setShowModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [description, setDescription] = useState('');
    const editorRef = useRef(null);
    const [editorKey, setEditorKey] = useState(0);
    const [qualificationList, setQualificationList] = useState([]);

    //from backend
    const [paginated, setPaginated] = useState([]);

    const [editId, setEditId] = useState(null);

    const [form, setForm] = useState({
        employee_school_university: "",
        employee_education_level: "",
        employee_passout_year: "",
        education_desc: "",
    });

    const handleView = (row) => {
        setSelectedRow(row);
        setShowModal(true);
    };



    // Reset form
    const resetForm = () => {
        setForm({
            employee_school_university: "",
            employee_education_level: "",
            employee_passout_year: "",
            education_desc: "",
        });
        setEditId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!employeeId) return toast.error("Employee ID missing");
        console.log("employeeId from route:", employeeId);

        const payload = { ...form, employeeId: employeeId };
        console.log("this is sent data:", payload);

        try {
            if (editId) {
                await updateEmployeeQuali(editId, payload);
                toast.success("Qualification detail updated!");
            } else {
                await createEmployeeQuali(payload);
                toast.success("Qualification detail added!");
            }

            fetchQualification();
            resetForm();
            setShowEditModal(false);
        } catch (err) {
            console.error("Error saving Qualification detail:", err);
            toast.error("Failed to save!");
        }
    };

    const fetchQualification = async () => {
        if (!employeeId) return;
        try {
            const res = await getEmployeeQuali(employeeId);
            console.log("Qualification list:", res.data);
            setQualificationList(res.data);
        } catch (err) {
            console.error("Error fetching Qualification:", err);
        }
    };

    useEffect(() => {
        fetchQualification();
    }, [employeeId]);


    const handleEdit = (row) => {
        setForm({
            employee_school_university: row.employee_school_university || '',
            employee_education_level: row.employee_education_level || '',
            employee_passout_year: row.employee_passout_year || '',
            education_desc: row.education_desc || '',
        });

        setEditId(row._id);
        setShowEditModal(true);
        setSelectedRow(row);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this record?")) return;

        try {
            await deleteEmployeeQuali(id);
            fetchQualification();
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
        { name: 'School/University', selector: row => row.employee_school_university },
        { name: 'Time Period', selector: row => row.employee_passout_year },
        { name: 'Education Level', selector: row => row.employee_education_level }

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

    const totalEntries = qualificationList.length;
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
        paginate(qualificationList, currentPage);
    }, [qualificationList, currentPage, rowsPerPage]);


    return (
        <div>
            {mode === "edit" && (

                <div className="container-fluid mt-4">
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label>School/University</label>
                                    <input
                                        type="text"
                                        placeholder="School"
                                        className="form-control"
                                        name="employee_school_university"
                                        value={form.employee_school_university}
                                        onChange={(e) => setForm({ ...form, employee_school_university: e.target.value })}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label>Passout Year</label>
                                    <input
                                        type="date"
                                        placeholder="School"
                                        className="form-control"
                                        name="employee_passout_year"
                                        value={form.employee_passout_year}
                                        onChange={(e) => setForm({ ...form, employee_passout_year: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="col-md-6">

                                <div className="mb-3">
                                    <label>Education Level</label>
                                    <select
                                        name="employee_education_level"
                                        className="form-control"
                                        value={form.employee_education_level}
                                        onChange={(e) => setForm({ ...form, employee_education_level: e.target.value })}
                                    >
                                        <option value="">Choose One</option>
                                        <option value="High School Diploma / GED">High School Diploma / GED</option>
                                        <option value="Associate Degree">Associate Degree</option>
                                        <option value="Graduate">Graduate</option>
                                        <option value="Post Graduate">Post Graduate</option>
                                        <option value="Doctorate">Doctorate</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mb-3">
                                <label>Description</label>
                                <textarea type="text" className="form-control" placeholder="Description"
                                    name="education_desc"
                                    value={form.education_desc}
                                    onChange={(e) => setForm({ ...form, education_desc: e.target.value })}
                                />
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
                    <span>List All Qualifications</span>
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
                                    <h5 className="modal-title">View Qualifications</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setShowModal(false)}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <p><strong>School/University:</strong> {selectedRow.employee_school_university}</p>
                                    <p><strong>Education Level:</strong> {selectedRow.employee_education_level}</p>
                                    <p><strong>Passout Year:</strong> {selectedRow.employee_passout_year}</p>
                                    <p>
                                        <strong>Description:</strong> {selectedRow.education_desc.replace(/<[^>]+>/g, '')}
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
                                        <h5 className="modal-title">Edit Qualification</h5>
                                        <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                                    </div>
                                    <div className="modal-body">
                                        <form onSubmit={handleSubmit}>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="mb-3">
                                                        <label>School/University</label>
                                                        <input
                                                            type="text"
                                                            placeholder="School"
                                                            className="form-control"
                                                            name="employee_school_university"
                                                            value={form.employee_school_university}
                                                            onChange={(e) => setForm({ ...form, employee_school_university: e.target.value })}
                                                        />
                                                    </div>

                                                    <div className="mb-3">
                                                        <label>Passout Year</label>
                                                        <input
                                                            type="date"
                                                            placeholder="School"
                                                            className="form-control"
                                                            name="employee_passout_year"
                                                            value={form.employee_passout_year}
                                                            onChange={(e) => setForm({ ...form, employee_passout_year: e.target.value })}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Right Column */}
                                                <div className="col-md-6">

                                                    <div className="mb-3">
                                                        <label>Education Level</label>
                                                        <select
                                                            name="employee_education_level"
                                                            className="form-control"
                                                            value={form.employee_education_level}
                                                            onChange={(e) => setForm({ ...form, employee_education_level: e.target.value })}
                                                        >
                                                            <option value="">Choose One</option>
                                                            <option value="High School Diploma / GED">High School Diploma / GED</option>
                                                            <option value="Associate Degree">Associate Degree</option>
                                                            <option value="Graduate">Graduate</option>
                                                            <option value="Post Graduate">Post Graduate</option>
                                                            <option value="Doctorate">Doctorate</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="mb-3">
                                                    <label>Description</label>
                                                    <textarea type="text" className="form-control" placeholder="Description"
                                                        name="education_desc"
                                                        value={form.education_desc}
                                                        onChange={(e) => setForm({ ...form, education_desc: e.target.value })}
                                                    />
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
export default Qualification;