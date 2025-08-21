import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
// import './organization.css';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';



const OfficeShifts = () => {

    const [showModal, setShowModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [description, setDescription] = useState('');

    const handleView = (row) => {
        setSelectedRow(row);
        setShowModal(true);
    };


    const handleEdit = (row) => {
        setSelectedRow(row);
        setShowEditModal(true);
    };

    const handleDelete = (row) => {
        if (window.confirm('Are you sure to delete this record?')) {
            console.log('Deleting:', row);
            // Make API call to delete
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
                        onClick={() => handleDelete(row)}
                    >
                        <i className="fas fa-trash-alt text-white"></i>
                    </button>

                    <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => handleView(row)}
                    >
                        <i className="fas fa-clock"></i>
                    </button>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
        { name: 'Day', selector: row => row.day, sortable: true },
        { name: 'Monday', selector: row => row.monday },
        { name: 'Tuesday', selector: row => row.tuesday },
        { name: 'Wednesday', selector: row => row.wednesday },
        { name: 'Thursday', selector: row => row.thursday },
        { name: 'Friday', selector: row => row.friday },
        { name: 'Saturday', selector: row => row.saturday },
        { name: 'Sunday', selector: row => row.sunday },

    ];

    const data = [
        {
            action: '-',
            day: 'Morning Shift',
            monday: '10:00 am to 06:30 am',
            tuesday: '10:00 am to 06:30 am',
            wednesday: '10:00 am to 06:30 am',
            thursday: '10:00 am to 06:30 am',
            friday: '10:00 am to 06:30 am',
            saturday: '10:00 am to 02:30 am',
            sunday: '-'
        },
        {
            action: '-',
            day: 'Morning Shift',
            monday: '10:00 am to 06:30 am',
            tuesday: '10:00 am to 06:30 am',
            wednesday: '10:00 am to 06:30 am',
            thursday: '10:00 am to 06:30 am',
            friday: '10:00 am to 06:30 am',
            saturday: '10:00 am to 02:30 am',
            sunday: '-'
        }, {
            action: '-',
            day: 'Morning Shift',
            monday: '10:00 am to 06:30 am',
            tuesday: '10:00 am to 06:30 am',
            wednesday: '10:00 am to 06:30 am',
            thursday: '10:00 am to 06:30 am',
            friday: '10:00 am to 06:30 am',
            saturday: '10:00 am to 02:30 am',
            sunday: '-'
        },
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

    return (
        <div className="custom-container">
            <h5>Office Shift</h5>
            <p style={{ fontSize: '15px', color: 'rgb(98, 98, 98)' }}>
                <span style={{ color: 'red' }}>Home</span> / Office Shift
            </p>


            {showAddForm && (
                <div className="card mb-3 form-slide-container">
                    <div className="card-header d-flex justify-content-between align-items-center text-white new-emp-bg">
                        <span>Add New Office Shift</span>
                        <button className="btn btn-sm add-btn" onClick={toggleAddForm}>
                            - Hide
                        </button>
                    </div>

                    <div className="container mt-4">
                        <form>
                            <div className="row">
                                {/* Left Column */}
                                <div className="col-md-12">
                                    <div className="row mb-3 ms-1">
                                        <div className="col-md-7">
                                            <label className="form-label">Shift Name</label>
                                            <input type="text" className="form-control" placeholder="Shift Name" />
                                        </div>
                                    </div>

                                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                                        <div className="row mb-3 align-items-end ms-1" key={day}>
                                            <div className="col-md-2">
                                                <label className="form-label">{day}</label>
                                            </div>

                                            <div className="col-md-3">
                                                <label className="form-label small">In Time</label>
                                                <input type="time" className="form-control" />
                                            </div>

                                            <div className="col-md-3">
                                                <label className="form-label small">Out Time</label>
                                                <input type="time" className="form-control" />
                                            </div>

                                            <div className="col-md-2">
                                                <button className="btn btn-sm add-btn mt-4">Clear</button>
                                            </div>
                                        </div>
                                    ))}
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
                    <span>List Office Shifts</span>
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

                {showModal && selectedRow && (
                    <div className="modal show fade d-block" tabIndex="-1" role="dialog">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">View Office Shift</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setShowModal(false)}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <p><strong>Location Name:</strong> {selectedRow.locationName}</p>
                                    <p><strong>Company:</strong> {selectedRow.company}</p>
                                    <p><strong>Location Head:</strong> {selectedRow.locationHead}</p>
                                    <p><strong>City:</strong> {selectedRow.city}</p>
                                    <p><strong>Country:</strong> {selectedRow.country}</p>
                                    <p><strong>Added By:</strong> {selectedRow.addedBy}</p>
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
                                        <h5 className="modal-title">Edit Office Shift</h5>
                                        <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                                    </div>
                                    <div className="modal-body">
                                        <form>
                                            <div className="row">
                                                {/* Left Column */}
                                                <div className="col-md-12">
                                                    <div className="row mb-3 ms-1">
                                                        <div className="col-md-7">
                                                            <label className="form-label">Shift Name</label>
                                                            <input type="text" className="form-control" placeholder="Shift Name" />
                                                        </div>
                                                    </div>

                                                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                                                        <div className="row mb-3 align-items-end ms-1" key={day}>
                                                            <div className="col-md-2">
                                                                <label className="form-label">{day}</label>
                                                            </div>

                                                            <div className="col-md-3">
                                                                <label className="form-label small">In Time</label>
                                                                <input type="time" className="form-control" />
                                                            </div>

                                                            <div className="col-md-3">
                                                                <label className="form-label small">Out Time</label>
                                                                <input type="time" className="form-control" />
                                                            </div>

                                                            <div className="col-md-2">
                                                                <button className="btn btn-sm add-btn mt-4">Clear</button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                            </div>

                                            <div className="text-end">
                                                <button type="button" className="btn btn-sm btn-light me-2" onClick={() => setShowEditModal(false)}>Close</button>
                                                <button type="submit" className="btn btn-sm add-btn">Update</button>
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

export default OfficeShifts;
