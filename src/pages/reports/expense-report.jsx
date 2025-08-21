import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
// import './organization.css';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';



const ExpenseReport = () => {

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
        { name: 'Date', selector: row => row.date },
        { name: 'Account', selector: row => row.account },
        { name: 'Category', selector: row => row.category },
        { name: 'Payee', selector: row => row.payee },
        { name: 'Ref#', selector: row => row.ref },
        { name: 'Amount', selector: row => row.amount }
    ];

    const data = [
        {
            date: '-',
            account: '-',
            category: '-',
            payee: '-',
            ref: '-',
            amount: '-'
        },
        {
            date: '-',
            account: '-',
            category: '-',
            payee: '-',
            ref: '-',
            amount: '-'
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
            <h5>Expense Report</h5>
            <p style={{ fontSize: '15px', color: 'rgb(98, 98, 98)' }}>
                <span style={{ color: 'red' }}>Home</span> / Expense Report
            </p>

            <div className="card no-radius mb-3 col-md-12">
                <div className="card-header text-white new-emp-bg fw-bold">Expense Report</div>
                <div className="card-body d-flex align-items-start gap-3 border p-4 mt-2 ms-2 me-2">

                    <select id="type" className="form-control">
                        <option value="">All</option>
                        <option value="deposit">Deposit</option>
                        <option value="expense">Expense</option>
                        <option value="transfer">Transfer</option>

                    </select>

                    <input type="date" name="" id="" className='form-control' />
                    <input type="date" name="" id="" className='form-control' />

                    <button className="btn btn-sm add-btn ms-4">Get</button>

                </div>
                {/* </div>


            <div className="card no-radius"> */}
                {/* <div className="card-header d-flex justify-content-between align-items-center text-white new-emp-bg">
                    <span>Attendance for</span>
                </div> */}


                <div className="px-3 mt-4">
                    <div className="d-flex flex-wrap justify-content-between align-items-center mb-2">
                        <div className="d-flex flex-wrap align-items-center gap-2">
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

export default ExpenseReport;
