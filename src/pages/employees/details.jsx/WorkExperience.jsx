import React from "react";
import { useState, useRef, useEffect } from "react";
import DataTable from 'react-data-table-component';
import { getEmployeeExperience, createEmployeeExperience, updateEmployeeExperience, deleteEmployeeExperience } from "./apis/employeeExperienceApi";
import { toast } from "react-toastify";

const WorkExperience = ({ mode, employeeId }) => {


    useEffect(() => {
    }, [employeeId]);

    const [showModal, setShowModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [description, setDescription] = useState('');
    const editorRef = useRef(null);
    const [editorKey, setEditorKey] = useState(0);
    const [experienceList, setExperienceList] = useState([]);

    //from backend
    const [Experience, setExperience] = useState([]);
    const [paginated, setPaginated] = useState([]);

    const [editId, setEditId] = useState(null);

    const [form, setForm] = useState({
        company_name: "",
        designation: "",
        from_date: "",
        to_date: "",
        desc: ""
    });

    const handleView = (row) => {
        setSelectedRow(row);
        setShowModal(true);
    };



    // Reset form
    const resetForm = () => {
        setForm({
            company_name: "",
            designation: "",
            from_date: "",
            to_date: "",
            desc: ""
        });
        setEditId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("this is sending", form);
        console.log("employeeId before payload:", employeeId);

        if (!employeeId) return toast.error("Employee ID missing");
        console.log("employeeId from route:", employeeId);

        const payload = { ...form, employeeId: employeeId };
        console.log("this is sent data:", payload);

        try {
            if (editId) {
                await updateEmployeeExperience(editId, payload);
                toast.success("Experience detail updated!");
            } else {
                await createEmployeeExperience(payload);
                toast.success("Experience detail added!");
            }

            fetchExperience();
            resetForm();
            setShowEditModal(false);
        } catch (err) {
            console.error("Error saving Experience detail:", err);
            toast.error("Failed to save!");
        }
    };

    const fetchExperience = async () => {
        if (!employeeId) return;
        try {
            const res = await getEmployeeExperience(employeeId);
            console.log("Experience list:", res.data);
            setExperienceList(res.data);
        } catch (err) {
            console.error("Error fetching Experience:", err);
        }
    };

    useEffect(() => {
        fetchExperience();
    }, [employeeId]);


    const handleEdit = (row) => {
        setForm({
            company_name: row.company_name || "",
            designation: row.designation || "",
            from_date: row.from_date || "",
            to_date: row.to_date || "",
            desc: row.desc || ""
        });

        setEditId(row._id);
        setShowEditModal(true);
        setSelectedRow(row);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this record?")) return;

        try {
            await deleteEmployeeExperience(id);
            fetchExperience();
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
        { name: 'Company Name', selector: row => row.company_name },
        { name: 'From Date', selector: row => row.from_date },
        { name: 'To Date', selector: row => row.to_date },
        { name: 'Post', selector: row => row.designation },
        { name: 'Description', selector: row => row.desc }


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

    const totalEntries = experienceList.length;
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
        paginate(experienceList, currentPage);
    }, [experienceList, currentPage, rowsPerPage]);

    return (
        <div>
            {mode === "edit" && (

                <div className="container-fluid mt-4">
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label>Company Name</label>
                                    <input
                                        type="text"
                                        placeholder="Company Name"
                                        className="form-control"
                                        name="company_name"
                                        value={form.company_name}
                                        onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label>Time Period (From)</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        name="from_date"
                                        value={form.from_date}
                                        onChange={(e) => setForm({ ...form, from_date: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="col-md-6">

                                <div className="mb-3">
                                    <label>Post</label>
                                    <input
                                        type="text"
                                        placeholder="Post"
                                        className="form-control"
                                        name="designation"
                                        value={form.designation}
                                        onChange={(e) => setForm({ ...form, designation: e.target.value })}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label>Time Period (To)</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        name="to_date"
                                        value={form.to_date}
                                        onChange={(e) => setForm({ ...form, to_date: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="mb-3">
                                <label>Description</label>
                                <textarea type="text"
                                    name="desc"
                                    value={form.desc}
                                    onChange={(e) => setForm({ ...form, desc: e.target.value })}
                                    className="form-control" placeholder="Description" />
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
                    <span>List All Work Experience Details</span>
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
                                    <h5 className="modal-title">View Experience</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setShowModal(false)}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <p><strong>Company Name:</strong> {selectedRow.company_name}</p>
                                    <p><strong>Post:</strong> {selectedRow.designation}</p>
                                    <p><strong>Time period(from):</strong> {selectedRow.from_date}</p>
                                    <p><strong>Time period(to):</strong> {selectedRow.to_date}</p>
                                    <p>
                                        <strong>Description:</strong> {selectedRow.desc.replace(/<[^>]+>/g, '')}
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
                                        <h5 className="modal-title">Edit Experience</h5>
                                        <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                                    </div>
                                    <div className="modal-body">
                                        <form onSubmit={handleSubmit}>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="mb-3">
                                                        <label>Company Name</label>
                                                        <input
                                                            type="text"
                                                            placeholder="Company Name"
                                                            className="form-control"
                                                            name="company_name"
                                                            value={form.company_name}
                                                            onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                                                        />
                                                    </div>

                                                    <div className="mb-3">
                                                        <label>Time Period (From)</label>
                                                        <input
                                                            type="date"
                                                            className="form-control"
                                                            name="from_date"
                                                            value={form.from_date}
                                                            onChange={(e) => setForm({ ...form, from_date: e.target.value })}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Right Column */}
                                                <div className="col-md-6">

                                                    <div className="mb-3">
                                                        <label>Post</label>
                                                        <input
                                                            type="text"
                                                            placeholder="Post"
                                                            className="form-control"
                                                            name="designation"
                                                            value={form.designation}
                                                            onChange={(e) => setForm({ ...form, designation: e.target.value })}
                                                        />
                                                    </div>

                                                    <div className="mb-3">
                                                        <label>Time Period (To)</label>
                                                        <input
                                                            type="date"
                                                            className="form-control"
                                                            name="to_date"
                                                            value={form.to_date}
                                                            onChange={(e) => setForm({ ...form, to_date: e.target.value })}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="mb-3">
                                                    <label>Description</label>
                                                    <textarea type="text"
                                                        name="desc"
                                                        value={form.desc}
                                                        onChange={(e) => setForm({ ...form, desc: e.target.value })}
                                                        className="form-control" placeholder="Description" />
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
export default WorkExperience;