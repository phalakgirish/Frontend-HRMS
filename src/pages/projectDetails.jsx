import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { useLocation, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';


const ProjectDetails = () => {
    const location = useLocation();
    const { state } = useLocation();
    const { id } = useParams();
    const [selectedDepartment, setSelectedDepartment] = useState('Overview');


    const [showModal, setShowModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [description, setDescription] = useState('');


    const handleEdit = (row) => {
        setSelectedRow(row);
        setShowEditModal(true);
    };

    const discussionColumns = [
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
        { name: 'Project Discussion', selector: row => row.discussion }
    ];

    const discussionData = [
        {
            action: '-',
            discussion: 'abcd'
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

    const handleDelete = (row) => {
        if (window.confirm('Are you sure to delete this record?')) {
            console.log('Deleting:', row);
            // Make API call to delete
        }
    };

    const bugsColumns = [
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
        { name: 'All Bugs/Issues', selector: row => row.bugs }
    ];

    const bugsData = [
        {
            action: '-',
            bugs: 'abcd'
        },

    ];

    const taskColumns = [
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
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
        { name: 'Title', selector: row => row.title },
        { name: 'End Date', selector: row => row.endDate },
        { name: 'Status', selector: row => row.status },
        { name: 'Assigned To', selector: row => row.assignedTo },
        { name: 'Created By', selector: row => row.createdBy },
        { name: 'Progress', selector: row => row.progress }


    ];

    const taskData = [
        {
            action: '-',
            title: 'abcd',
            endDate: '',
            status: '',
            assignedTo: '',
            createdBy: '',
            progress: ''
        },

    ];

    const fileColumns = [
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
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
        { name: 'Title', selector: row => row.title },
        { name: 'Description', selector: row => row.description },
        { name: 'Date & Time', selector: row => row.dateandtime }


    ];

    const fileData = [
        {
            action: '-',
            title: 'abcd',
            description: '',
            dateandtime: ''
        },

    ];


    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const totalEntries = discussionData.length;
    const totalPages = Math.ceil(totalEntries / rowsPerPage);

    const paginatedDiscussion = discussionData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );


    const startEntry = (currentPage - 1) * rowsPerPage + 1;
    const endEntry = Math.min(currentPage * rowsPerPage, totalEntries);

    const [showAddForm, setShowAddForm] = useState(false);

    const toggleAddForm = () => {
        setShowAddForm((prev) => !prev);
    };
    const [remarks, setRemarks] = useState('');


    const employee = state?.employee;
    if (!employee) {
        return <p>Employee data not found. Please go back and try again.</p>;
    }

    const renderContent = () => {
        switch (selectedDepartment) {
            case 'Overview':
                return (
                    <div>
                        <h6 className="mb-3">Overview: {employee.projectSummaryText}</h6>
                        <p><strong>Status: </strong>{employee.priority}</p>
                        <p><strong>Start Date: </strong>{employee.startDate}</p>
                        <p><strong>End Date: </strong>{employee.endDate}</p>
                        <p>
                            <strong>Priority:</strong>{' '}
                            <span
                                className={`badge ${employee.priority === 'Lowest' ? 'bg-success' : employee.priority === 'Medium'
                                    ? 'bg-warning' : 'bg-danger'}`}
                            >
                                {employee.priority}
                            </span>
                        </p>
                    </div>
                );

            case 'Assigned to':
                return (
                    <div>
                        <div className="card no-radius">
                            <div className='row'>
                                <div className='col-md-6'>
                                    <div className="card-header text-dark">Update Users</div>
                                    <div className="card-body">
                                        <div className="mb-3">
                                            <label className="form-label">Employee</label>
                                            <select id="ticket" className="form-select">
                                                <option value="admin">Admin Admin</option>
                                                <option value="anjali">Anjali Patle</option>
                                                <option value="amit">Amit Kumar</option>
                                                <option value="aniket">Aniket Rane</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="text-start mb-2 ms-3">
                                        <button type="submit" className="btn btn-sm add-btn">Save</button>
                                    </div>
                                </div>

                                <div className='col-md-6'>
                                    <div className="card-header text-dark">Assigned To</div>
                                    <div className="card-body">
                                        <div className="mb-3">
                                            <div className="d-flex flex-wrap align-items-center gap-3">
                                                {employee.assignedUsers && employee.assignedUsers.length > 0 ? (
                                                    employee.assignedUsers.map((img, index) => (
                                                        <div key={index} className="d-flex flex-column align-items-center">
                                                            <img
                                                                src={img}
                                                                alt={employee.employeeNames?.[index] || `User ${index + 1}`}
                                                                className="rounded-circle"
                                                                style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                                            />
                                                            <small className="mt-1 text-center">
                                                                {employee.employeeNames?.[index] ?? `User ${index + 1}`}
                                                            </small>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-muted">No assigned users</p>
                                                )}
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'Progress':
                return (
                    <div>
                        <div className="card no-radius">
                            <div className='row'>
                                <div className='col-md-6'>
                                    <div className="card-body">
                                        <div className="mb-3">
                                            <label className="form-label">Progress</label>
                                            <div className="progress" style={{ height: '20px' }}>
                                                <div
                                                    className="progress-bar bg-danger"
                                                    role="progressbar"
                                                    style={{ width: '45%' }}
                                                    aria-valuenow="45"
                                                    aria-valuemin="0"
                                                    aria-valuemax="100"
                                                >
                                                    45%
                                                </div>
                                            </div>
                                        </div>

                                    </div>

                                    <div className="text-start mb-2 ms-3">
                                        <button type="submit" className="btn btn-sm add-btn">Save</button>
                                    </div>
                                </div>

                                <div className='col-md-6'>
                                    <div className="card-body">
                                        <div className="mb-3">
                                            <label>Status</label>
                                            <select id="status" className="form-control">
                                                <option value="notstarted">Not Started</option>
                                                <option value="inprogress">In Progress</option>
                                                <option value="completed">Completed</option>
                                                <option value="deferred">Deferred</option>
                                            </select>
                                        </div>

                                        <div className="mb-3">
                                            <label>Priority</label>
                                            <select id="priority" className="form-control">
                                                <option value="low">Low</option>
                                                <option value="medium">Medium</option>
                                                <option value="high">High</option>
                                                <option value="critical">Critical</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'Discussion':
                return (
                    <div>
                        <div className="mb-3">
                            <textarea
                                className="form-control"
                                id="exampleTextarea"
                                rows="4"
                                placeholder="Message"
                            ></textarea>
                        </div>

                        <div className=" mb-3">
                            <input type="file" className="form-control" />
                        </div>

                        <div className="text-end mb-2 ms-3">
                            <button type="submit" className="btn btn-sm add-btn">Save</button>
                        </div>

                        <div className="card no-radius">
                           
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
                                    columns={discussionColumns}
                                    data={paginatedDiscussion}
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

            case 'Bugs/Issues':
                return (
                    <div>
                        <div className="mb-3">
                            <input type="text" className="form-control" placeholder='Title' />
                        </div>

                        <div className=" mb-3">
                            <input type="file" className="form-control" />
                        </div>

                        <div className="text-end mb-2 ms-3">
                            <button type="submit" className="btn btn-sm add-btn">Save</button>
                        </div>

                        <div className="card no-radius">

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
                                    columns={bugsColumns}
                                    data={paginatedDiscussion}
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

            case 'Tasks':
                return (
                    <div>
                        <div className="row">
                            {/* Left Column */}
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label>Title</label>
                                    <input type="text" className="form-control" placeholder="Title" />
                                </div>

                                <div className='row'>
                                    <div className="col-md-6 mb-3">
                                        <label>Start Date</label>
                                        <input type="date" className="form-control" />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label>End date</label>
                                        <input type="date" className="form-control" />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label>Estimated Hour</label>
                                    <input type="text" className="form-control" placeholder="Estimated Hour" />
                                </div>

                            </div>

                            {/* Right Column */}
                            <div className="col-md-6">

                                <label>Description</label>
                                <CKEditor
                                    editor={ClassicEditor}
                                    data={description}
                                    onChange={(event, editor) => {
                                        const newData = editor.getData();
                                        setDescription(newData);
                                    }}
                                />
                            </div>

                            <div className="col-md-12 mb-3">
                                <label>Assigned To</label>
                                <select id="assignedTo" className="form-control">
                                    <option value="admin">Admin Admin</option>
                                    <option value="anjali">Anjali Patle</option>
                                    <option value="amit">Amit Kumar</option>
                                    <option value="aniket">Aniket Rane</option>
                                </select>
                            </div>
                            <div className="text-end mb-2">
                                <button type="submit" className="btn btn-sm add-btn">Save</button>
                            </div>
                        </div>


                        <div className="card no-radius">

                            <div className="px-3 mt-4">


                                <DataTable
                                    columns={taskColumns}
                                    data={paginatedDiscussion}
                                    fixedHeader
                                    highlightOnHover
                                    customStyles={customStyles}
                                    conditionalRowStyles={conditionalRowStyles}
                                    responsive
                                    subHeader
                                    subHeaderAlign="right"
                                    subHeaderComponent={
                                        <div className="d-flex flex-wrap justify-content-between align-items-center w-100 gap-2">
                                            {/* <div className="d-flex flex-wrap gap-2">
                                                <button className="btn btn-sm btn-outline-dark">Copy</button>
                                                <button className="btn btn-sm btn-outline-dark">CSV</button>
                                                <button className="btn btn-sm btn-outline-dark">PDF</button>
                                                <button className="btn btn-sm btn-outline-dark">Print</button>
                                            </div> */}

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

            case 'Files':
                return (
                    <div>
                        <div className="row">
                            <div className="mb-3">
                                <label>Title</label>
                                <input type="text" className="form-control" placeholder="Title" />
                            </div>

                            <div className="mb-3">
                                <input type="file" className="form-control" />
                                <p style={{ fontSize: '10px' }}>Upload files only: gif,png,jpg,jpeg,txt,doc,docx,xls,xlsx
                                </p>

                            </div>

                            <div className="mb-3">

                                <textarea
                                    className="form-control"
                                    id="exampleTextarea"
                                    rows="4"
                                    placeholder="Message"
                                ></textarea>
                            </div>

                        </div>

                        <div className="text-start mb-2">
                            <button type="submit" className="btn btn-sm add-btn">Save</button>
                        </div>


                        <div className="card no-radius">

                            <div className="px-3 mt-4">


                                <DataTable
                                    columns={fileColumns}
                                    data={paginatedDiscussion}
                                    fixedHeader
                                    highlightOnHover
                                    customStyles={customStyles}
                                    conditionalRowStyles={conditionalRowStyles}
                                    responsive
                                    subHeader
                                    subHeaderAlign="right"
                                    subHeaderComponent={
                                        <div className="d-flex flex-wrap justify-content-between align-items-center w-100 gap-2">
                                            {/* <div className="d-flex flex-wrap gap-2">
                                                <button className="btn btn-sm btn-outline-dark">Copy</button>
                                                <button className="btn btn-sm btn-outline-dark">CSV</button>
                                                <button className="btn btn-sm btn-outline-dark">PDF</button>
                                                <button className="btn btn-sm btn-outline-dark">Print</button>
                                            </div> */}

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

            case 'Note':
                return (
                    <div>
                        <div className="mb-3">

                            <textarea
                                className="form-control"
                                id="exampleTextarea"
                                rows="4"
                                placeholder="Project Note"
                            ></textarea>
                        </div>

                        <div className="text-start mb-2">
                            <button type="submit" className="btn btn-sm add-btn">Save</button>
                        </div>
                    </div>
                );
            default:
            // return <p>{selectedDepartment} Section Coming Soon...</p>;
        }
    };

    return (
        <div className="custom-container">
            <h5>Project Details</h5>
            <p style={{ fontSize: '15px', color: 'rgb(98, 98, 98)' }}>
                <span style={{ color: 'red' }}>Home</span> / Project Details
            </p>

            <div className="row">

                <div className="col-md-3 mb-3">
                    <div className="card h-100">
                        <div className="card-body p-2">
                           <ul className="list-group list-group-flush">
  {[
    'Project Details', 'Overview', 'Assigned to', 'Progress', 'Discussion',
    'Bugs/Issues', 'Tasks', 'Files', 'Note'
  ].map((dept, index) => {
    const icons = {
      'Overview': 'fas fa-chart-pie',
      'Assigned to': 'fas fa-user-tag',
      'Progress': 'fas fa-chart-line',
      'Discussion': 'fas fa-comments',
      'Bugs/Issues': 'fas fa-bug',
      'Tasks': 'fas fa-check-square',
      'Files': 'fas fa-folder-open',
      'Note': 'fas fa-sticky-note'
    };

    const isHeading = dept === 'Project Details';

    return (
      <li
        key={index}
        className={`list-group-item department-item ${selectedDepartment === dept && !isHeading ? 'active' : ''}`}
        style={{
          cursor: isHeading ? 'default' : 'pointer',
          fontWeight: isHeading ? 'bold' : 'normal',
          backgroundColor: isHeading ? '#f8f9fa' : '',
          color: isHeading ? '#333' : ''
        }}
        onClick={() => {
          if (!isHeading) {
            setSelectedDepartment(dept);
          }
        }}
      >
        {icons[dept] && <i className={`${icons[dept]} me-2 fs-6 text-secondary`}></i>}
        {dept}
      </li>
    );
  })}
</ul>

                        </div>
                    </div>
                </div>

                <div className="col-md-9">
                    <div className="card no-radius">
                        <div className="card-header d-flex justify-content-between align-items-center text-white new-emp-bg">
                            <span>Project {selectedDepartment}</span>
                        </div>
                        <div className="card-body p-3">
                            {renderContent()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetails;
