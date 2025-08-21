import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
// import './organization.css';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useNavigate } from 'react-router-dom';



const PaymentHistory = () => {
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [description, setDescription] = useState('<div class="mb-3"><label>Hello, Your Payslip is generated</label></div>');


const handleView = (row) => {
    setSelectedRow(row);
    setShowModal(true);
};

const handleClose = () => {
    setShowModal(false);
    setSelectedRow(null);
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
                        <i className="fas fa-arrow-right"></i>
                    </button>
                     {showModal && (
                        <>
                            <div className="modal-backdrop fade show"></div>

                            <div className={`modal fade ${showModal ? 'show d-block' : ''}`} tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', transition: 'opacity 0.3s ease-in-out' }}>

                                <div className="modal-dialog modal-dialog-centered" role="document">
                                    <div className="modal-content">

                                        <div className="modal-header">
                                            <h5 className="modal-title">Salary Details</h5>
                                            <button type="button" className="btn-close" onClick={handleClose}></button>
                                        </div>

                                        <div className="modal-body">
                                            <div className="card-header d-flex justify-content-between align-items-center text-dark">
                                                <span className='fw-bold'>Employee</span>
                                            </div>

                                            <div className="d-flex align-items-start gap-3 mt-2">
                                                <img
                                                    src="/avatar2.jpg"
                                                    alt="avatar"
                                                    style={{ height: '70px', width: '70px' }}
                                                    className="mt-2"
                                                />
                                                <div className="mt-2">
                                                    <p className="mb-1">EMP ID :</p>
                                                    <p className="mb-1">Department :</p>
                                                    <p className="mb-1">Designation :</p>
                                                    <p className="mb-1">Joining Date :</p>
                                                </div>
                                            </div>

                                        </div>

                                        <div className="modal-body">
                                            <div className="card-header d-flex justify-content-between align-items-center text-dark">
                                                <span className='fw-bold'>SALARY DETAILS</span>
                                            </div>

                                            <div className="align-items-start gap-3 mt-2">
                                                <div className='ms-3'>
                                                    <p className="mb-1 mt-2">Salary Month :</p>
                                                    <p className="mb-1 mt-2">Grooss Salary :</p>
                                                    <p className="mb-1 mt-2">Overtime Per Hour :</p>
                                                    <p className="mb-1 mt-2">Status :</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="modal-body">
                                            <div className="card-header d-flex justify-content-between align-items-center text-dark">
                                                <span className='fw-bold'>ALLOWANCES</span>
                                            </div>

                                            <div className="align-items-start gap-3 mt-2">
                                                <div className='ms-3'>
                                                    <p className="mb-1 mt-2">House Rental Allowance :</p>
                                                    <p className="mb-1 mt-2">Medical Allowance :</p>
                                                    <p className="mb-1 mt-2">Travelling Allowance :</p>
                                                    <p className="mb-1 mt-2">Dearness Allowance :</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="modal-body">
                                            <div className="card-header d-flex justify-content-between align-items-center text-dark">
                                                <span className='fw-bold'>DEDUCTIONS</span>
                                            </div>

                                            <div className="align-items-start gap-3 mt-2">
                                                <div className='ms-3'>
                                                    <p className="mb-1 mt-2">Provident Fund :</p>
                                                    <p className="mb-1 mt-2">Tax Deduction :</p>
                                                    <p className="mb-1 mt-2">Security Deposit :</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="modal-body">
                                            <div className="card-header d-flex justify-content-between align-items-center text-dark">
                                                <span className='fw-bold'>TOTAL SALARY DETAILS</span>
                                            </div>

                                            <div className="align-items-start gap-3 mt-2">
                                                <div className='ms-3'>
                                                    <p className="mb-1 mt-2">Gross Salary :</p>
                                                    <p className="mb-1 mt-2">Total Allowance :</p>
                                                    <p className="mb-1 mt-2">Total Deduction :</p>
                                                    <p className="mb-1 mt-2">Net Salary :</p>
                                                    <p className="mb-1 mt-2">Paid Amount :</p>
                                                    <p className="mb-1 mt-2">Payment Method :</p>
                                                    <p className="mb-1 mt-2">Comments :</p>

                                                </div>
                                            </div>
                                        </div>

                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary btn-sm" onClick={handleClose}>Close</button>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
        {
            name: 'Employee ID',
            cell: (row) => (
                <span
                    className="text-primary"
                    style={{ cursor: 'pointer' }}
                >
                    {row.empId}
                </span>
            ),
        },
        { name: 'Employee Name', selector: row => row.empName },
        { name: 'Paid Amount', selector: row => row.paidAmt },
        { name: 'Payment Month', selector: row => row.paymentMonth },
        { name: 'Payment Date', selector: row => row.paymentDate },
        { name: 'Payment Type', selector: row => row.paymentType },
        {
            name: 'Payslip',
            cell: (row) => (
                <span
                    className="text-success"
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                        navigate(`/payslip/${row.empId}`, {
                            state: {
                                paymentMonth: row.paymentMonth,
                                empName: row.empName,
                                paidAmt: row.paidAmt,
                                paymentDate: row.paymentDate,
                                paymentType: row.paymentType,
                            }
                        });
                    }}


                >
                    {row.payslip}
                </span>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            // button: true
        }
    ];

    const data = [
        {
            action: '-',
            empId: 'ATOZ053',
            empName: 'Mahendra Chaudhary',
            paidAmt: 'Rs.27164',
            paymentMonth: 'November, 2021',
            paymentDate: '18-Nov-2021',
            paymentType: 'Cash',
            payslip: 'Generate Payslip'
        },
        {
            action: '-',
            empId: 'ATOZ057',
            empName: 'Mahendra Chaudhary',
            paidAmt: 'Rs.27164',
            paymentMonth: 'November, 2021',
            paymentDate: '18-Nov-2021',
            paymentType: 'Cash',
            payslip: 'Generate Payslip'
        }, {
            action: '-',
            empId: 'ATOZ023',
            empName: 'Mahendra Chaudhary',
            paidAmt: 'Rs.27164',
            paymentMonth: 'November, 2021',
            paymentDate: '18-Nov-2021',
            paymentType: 'Cash',
            payslip: 'Generate Payslip'
        }, {
            action: '-',
            empId: 'ATOZ056',
            empName: 'Mahendra Chaudhary',
            paidAmt: 'Rs.27164',
            paymentMonth: 'November, 2021',
            paymentDate: '18-Nov-2021',
            paymentType: 'Cash',
            payslip: 'Generate Payslip'
        }, {
            action: '-',
            empId: 'ATOZ051',
            empName: 'Mahendra Chaudhary',
            paidAmt: 'Rs.27164',
            paymentMonth: 'November, 2021',
            paymentDate: '18-Nov-2021',
            paymentType: 'Cash',
            payslip: 'Generate Payslip'
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
            <h5>Payment History</h5>
            <p style={{ fontSize: '15px', color: 'rgb(98, 98, 98)' }}>
                <span style={{ color: 'red' }}>Home</span> / Payment History
            </p>



            <div className="card no-radius">
                <div className="card-header d-flex justify-content-between align-items-center text-white new-emp-bg">
                    <span>List all Payment History</span>
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

export default PaymentHistory;
