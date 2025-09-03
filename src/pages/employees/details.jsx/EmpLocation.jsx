import React from "react";
import { useState, useRef, useEffect } from "react";
import DataTable from 'react-data-table-component';
import { getLocation, createLocation, updateLocation, deleteLocation } from "./apis/locationApi";
import { toast } from "react-toastify";

const EmpLocation = ({ employeeId, mode }) => {


    useEffect(() => {
    }, [employeeId]);

    const [paginated, setPaginated] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [locationList, setLocationList] = useState([]);

    const [form, setForm] = useState({
        location_from_date: "",
        location_to_date: "",
        location_id: ""
    });
    const [editId, setEditId] = useState(null);

    const handleView = (row) => {
        setSelectedRow(row);
        setShowModal(true);
    };



    // Reset form
    const resetForm = () => {
        setForm({
            location_from_date: "",
            location_to_date: "",
            location_id: ""
        });
        setEditId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!employeeId) return toast.error("Employee ID missing");

        const payload = { ...form, employeeId: employeeId };
        console.log("this is sent data:", payload);

        try {
            if (editId) {
                await updateLocation(editId, payload);
                toast.success("Location detail updated!");
            } else {
                await createLocation(payload);
                toast.success("Location detail added!");
            }

            await fetchLocation();
            resetForm();
            setShowEditModal(false);
        } catch (err) {
            console.error("Error saving Location detail:", err);
            toast.error("Failed to save!");
        }
    };

    const fetchLocation = async () => {
        if (!employeeId) return;
        try {
            const res = await getLocation(employeeId);
            console.log("Location list:", res.data);
            setLocationList(res.data);
        } catch (err) {
            console.error("Error fetching Location:", err);
        }
    };

    useEffect(() => {
        fetchLocation();
    }, [employeeId]);


    const handleEdit = (row) => {
        setForm({
            location_from_date: row.location_from_date ? new Date(row.location_from_date).toISOString().split("T")[0] : "",
            location_to_date: row.location_to_date ? new Date(row.location_to_date).toISOString().split("T")[0] : "",
            location_id: row.location_id || ""
        });

        setEditId(row._id);
        setShowEditModal(true);
        setSelectedRow(row);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this record?")) return;

        try {
            await deleteLocation(id);
            fetchLocation();
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
        {
            name: 'Date',
            cell: row => {
                const from = new Date(row.location_from_date).toLocaleDateString();
                const to = new Date(row.location_to_date).toLocaleDateString();
                return `${from}  to  ${to}`;
            }
        }, { name: 'Location', selector: row => row.location_id }
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

    const totalEntries = locationList.length;
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
        paginate(locationList, currentPage);
    }, [locationList, currentPage, rowsPerPage]);

    return (
        <div>
            {mode === "edit" && (

                <div className="container-fluid mt-4">
                    <form onSubmit={handleSubmit}>
                        <div className="row d-flex">
                            <div className="col-md-4 mb-3">
                                <label>From Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    name="location_from_date"
                                    value={form.location_from_date}
                                    onChange={(e) => setForm({ ...form, location_from_date: e.target.value })}
                                />
                            </div>

                            <div className="col-md-4 mb-3">
                                <label>To Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    name="location_to_date"
                                    value={form.location_to_date}
                                    onChange={(e) => setForm({ ...form, location_to_date: e.target.value })}
                                />
                            </div>

                            <div className="col-md-4 mb-3">
                                <label>Office Location</label>
                                <select
                                    name="location_id"
                                    className="form-select"
                                    value={form.location_id}
                                    onChange={(e) => setForm({ ...form, location_id: e.target.value })}
                                >
                                    <option value="">Select One</option>
                                    <option value="Head Office - Mumbai">Head Office - Mumbai</option>
                                    <option value="Bangalore">Bangalore</option>
                                </select>
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
                    <span>List All Location Details</span>
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
                                    <h5 className="modal-title">View Promotion</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setShowModal(false)}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <p>
                                        <strong>From Date:</strong>{" "}
                                        {selectedRow?.location_from_date
                                            ? new Date(selectedRow.location_from_date).toLocaleDateString()
                                            : "N/A"}
                                    </p>
                                    <p><strong>To Date:</strong> {selectedRow.location_to_date ? new Date(selectedRow.location_to_date).toLocaleDateString()
                                        : "N/A"}</p>
                                    <p><strong>location:</strong> {selectedRow.location_id}</p>

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
                                        <h5 className="modal-title">Edit Promotion</h5>
                                        <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                                    </div>
                                    <div className="modal-body">
                                        <form onSubmit={handleSubmit}>
                                            <div className="row d-flex">
                                                <div className="col-md-4 mb-3">
                                                    <label>From Date</label>
                                                    <input
                                                        type="date"
                                                        className="form-control"
                                                        name="location_from_date"
                                                        value={form.location_from_date}
                                                        onChange={(e) => setForm({ ...form, location_from_date: e.target.value })}
                                                    />
                                                </div>

                                                <div className="col-md-4 mb-3">
                                                    <label>To Date</label>
                                                    <input
                                                        type="date"
                                                        className="form-control"
                                                        name="location_to_date"
                                                        value={form.location_to_date}
                                                        onChange={(e) => setForm({ ...form, location_to_date: e.target.value })}
                                                    />
                                                </div>

                                                <div className="col-md-4 mb-3">
                                                    <label>Office Location</label>
                                                    <select
                                                        name="location_id"
                                                        className="form-select"
                                                        value={form.location_id}
                                                        onChange={(e) => setForm({ ...form, location_id: e.target.value })}
                                                    >
                                                        <option value="">Select One</option>
                                                        <option value="Head Office - Mumbai">Head Office - Mumbai</option>
                                                        <option value="Bangalore">Bangalore</option>
                                                    </select>
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
export default EmpLocation;