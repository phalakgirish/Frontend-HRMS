import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
// import './organization.css';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';



const EmployeeLastLogin = () => {

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

    // const handleDelete = (row) => {
    //     if (window.confirm('Are you sure to delete this record?')) {
    //         console.log('Deleting:', row);
    //     }
    // };


    const columns = [
        { name: 'ID', selector: row => row.id, sortable: true },
        { name: 'Name', selector: row => row.name, sortable: true },
        { name: 'Username', selector: row => row.username, sortable: true },
        { name: 'Last Login Date', selector: row => row.lastLoginDate, sortable: true },
        { name: 'Last Login Time', selector: row => row.lastLoginTime, sortable: true },
        { name: 'Role', selector: row => row.role, sortable: true },
        { name: 'Status', selector: row => row.status, sortable: true },
    ];

    const data = [
        {
            id: 'ATOZ053',
            name: 'Aashita Solanki',
            username: 'Aashita',
            lastLoginDate: '12-Jul-2025',
            lastLoginTime:'02:17 pm	',
            role:'Employee',
            status:'Active'
        },
        {
            id: 'ATOZ053',
            name: 'Aashita Solanki',
            username: 'Aashita',
            lastLoginDate: '12-Jul-2025',
            lastLoginTime:'02:17 pm	',
            role:'Employee',
            status:'Active'
        },{
            id: 'ATOZ053',
            name: 'Aashita Solanki',
            username: 'Aashita',
            lastLoginDate: '12-Jul-2025',
            lastLoginTime:'02:17 pm	',
            role:'Employee',
            status:'Active'
        },{
            id: 'ATOZ042',
            name: 'Manoj Ghate',
            username: 'Manoj',
            lastLoginDate: '1-Jun-2025',
            lastLoginTime:'02:17 pm	',
            role:'Employee',
            status:'Active'
        },{
            id: 'ATOZ053',
            name: 'Aashita Solanki',
            username: 'Aashita',
            lastLoginDate: '12-Jul-2025',
            lastLoginTime:'02:17 pm	',
            role:'Employee',
            status:'Active'
        },{
            id: 'ATOZ053',
            name: 'Aashita Solanki',
            username: 'Aashita',
            lastLoginDate: '12-Jul-2025',
            lastLoginTime:'02:17 pm	',
            role:'Employee',
            status:'Active'
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

    // const [showAddForm, setShowAddForm] = useState(false);

    // const toggleAddForm = () => {
    //     setShowAddForm((prev) => !prev);
    // };

    return (
        <div className="custom-container">
            <h5>Employee Last Login</h5>
            <p style={{ fontSize: '15px', color: 'rgb(98, 98, 98)' }}>
                <span style={{ color: 'red' }}>Home</span> / Employee Last Login
            </p>



            <div className="card no-radius">
                <div className="card-header d-flex justify-content-between align-items-center text-white new-emp-bg">
                    <span>Employee Last Login</span>
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


                {showEditModal && selectedRow && (
                    <>

                        <div className="custom-backdrop"></div>
                        <div className="modal show fade d-block" tabIndex="-1">
                            <div className="modal-dialog modal-dialog-centered edit-modal">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Edit Email Template</h5>
                                        <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                                    </div>
                                    <div className="modal-body">
                                        <form>
                                            <div className="row">
                                                {/* Left Column */}
                                                <div className="col-md-12">
                                                    <div className="mb-3">
                                                        <label>Template Name</label>
                                                        <input type="text" className="form-control" defaultValue={selectedRow.templateName} placeholder="Title" />
                                                    </div>

                                                    <div className='row'>
                                                        <div className="col-md-6 mb-3">
                                                            <label>Subject</label>
                                                            <input type="text" className="form-control" defaultValue={selectedRow.subject} placeholder="Start Date" />
                                                        </div>

                                                        <div className="col-md-6 mb-3">
                                                            <label>Status</label>
                                                            <input type="text" className="form-control" defaultValue={selectedRow.status} placeholder="End Date" />
                                                        </div>
                                                    </div>

                                                    <div className="mb-3">
                                                        <label>Message</label>
                                                        <CKEditor
                                                            editor={ClassicEditor}
                                                            data={description}
                                                            onChange={(event, editor) => {
                                                                const newData = editor.getData();
                                                                setDescription(newData);
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="text-end">
                                                <button type="submit" className="btn btn-sm add-btn">Save</button>
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

export default EmployeeLastLogin;
