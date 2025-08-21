import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import { useNavigate } from 'react-router-dom';


const JobCandidates = () => {
    const navigate = useNavigate();

    // const [showModal, setShowModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [description, setDescription] = useState('<div class="mb-3"><label>Hello, Your Payslip is generated</label></div>');

    // const handleView = (row) => {
    //     setSelectedRow(row);
    //     setShowModal(true);
    // };


    const handleEdit = (row) => {
        setSelectedRow(row);
        setShowEditModal(true);
    };

    const handleDelete = (row) => {
        if (window.confirm('Are you sure to delete this record?')) {
            console.log('Deleting:', row);
        }
    };

    const handleSend = (row) => {
        setSelectedRow(row);
        setShowEditModal(true);
    }


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

                    {/* <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => handleView(row)}
                    >
                        <i className="fas fa-eye"></i>
                    </button> */}
                    <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => handleEdit(row)}
                    >
                        <i className="fas fa-edit"></i>
                    </button>

                    <button
                        className="btn btn-outline-secondary btn-sm"
                        title="Offer Letter"
                        onClick={() => {
                            handleSend(row)
                            navigate(`/offer/${row.candidateName}`, {});
                        }}
                    >
                        <i className="fas fa-paper-plane"></i>
                    </button>

                    <button
                        className="btn btn-outline-secondary btn-sm"
                        title="Appointment Letter"
                        onClick={() => {
                            handleSend(row)
                            navigate(`/appointment/${row.candidateName}`, {});
                        }}
                    >
                        <i className="fas fa-paper-plane"></i>
                    </button>
                </div>
            ),
            width: '150px',
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
        { name: 'Job Title', selector: row => row.jobTitle },
        { name: 'Candidate Name', selector: row => row.candidateName },
        { name: 'Email', selector: row => row.email },
        { name: 'Status', selector: row => row.status },
        { name: 'Apply Date', selector: row => row.applyDate },
    ];

    const data = [
        {
            action: '-',
            jobTitle: 'Software Engineer',
            candidateName: 'Rahul Sharma',
            email: 'inf@ubisl.co.in',
            status: 'Applied ',
            applyDate: '12-Aug-2021'
        },

        // Add more records as needed
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

    // const [showAddForm, setShowAddForm] = useState(false);

    // const toggleAddForm = () => {
    //     setShowAddForm((prev) => !prev);
    // };

    return (
        <div className="custom-container">
            <h5>Job Candidates</h5>
            <p style={{ fontSize: '15px', color: 'rgb(98, 98, 98)' }}>
                <span style={{ color: 'red' }}>Home</span> / Job Candidates
            </p>



            <div className="card no-radius">
                <div className="card-header d-flex justify-content-between align-items-center text-white new-emp-bg">
                    <span>List All Job Candidates</span>
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
        </div>
    );
};

export default JobCandidates;
