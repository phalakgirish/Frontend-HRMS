import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
// import './organization.css';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';



const PaymentHistory = ({ empId }) => {
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [description, setDescription] = useState('<div class="mb-3"><label>Hello, Your Payslip is generated</label></div>');
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [payrolls, setPayrolls] = useState([]);
    const [paidDate, setPaidDate] = useState(null);

    const handleView = (row) => {
        setSelectedRow(row);
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setSelectedRow(null);
    };

    useEffect(() => {
        axios.get("http://localhost:3000/employee")
            .then(res => setEmployees(res.data))
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        axios.get("http://localhost:3000/payroll")
            .then(res => setPayrolls(res.data))
            .catch(err => console.error(err));
    }, []);

    const [mergedData, setMergedData] = useState([]);

    useEffect(() => {
        if (employees.length && payrolls.length) {
            const data = payrolls.map(payroll => {
                const emp = employees.find(e => e.id === payroll.empId) || {};

                const paidDate = payroll.paidDate ? new Date(payroll.paidDate) : null;

                return {
                    ...emp,
                    ...payroll, 
                    paidDate: paidDate ? paidDate.toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' }) : '-',
                    paymentMonth: payroll.month ? `${payroll.month} ${payroll.year}` : '-'
                };
            });

            setMergedData(data);
            setLoading(false);
        }
    }, [employees, payrolls]);


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

                    {showModal && selectedRow && (
                        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(56, 56, 56, 0.2)', zIndex: 2000 }}>
                            <div className="modal-dialog modal-dialog-centered modal-lg">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Salary Details</h5>
                                        <button type="button" className="btn-close" onClick={handleClose}></button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="d-flex align-items-start gap-3 mb-3">
                                            <img src="/avatar2.jpg" alt="avatar" style={{ height: '70px', width: '70px' }} />
                                            <div>
                                                <p className="mb-1">EMP ID: {selectedRow.id}</p>
                                                <p className="mb-1">Department: {selectedRow.department || '-'}</p>
                                                <p className="mb-1">Designation: {selectedRow.designation || '-'}</p>
                                                <p className="mb-1">Joining Date: {selectedRow.joiningDate || '-'}</p>
                                            </div>
                                        </div>

                                        <h6 className="fw-bold">SALARY DETAILS</h6>
                                        <div className="ms-3 mb-3">
                                            <p className="mb-1">Salary Month: {selectedRow.paymentMonth}</p>
                                            <p className="mb-1">Gross Salary: {selectedRow.grossSalary}</p>
                                            <p className="mb-1">Overtime Per Hour: {selectedRow.overtime || '-'}</p>
                                            <p className="mb-1">Status: {selectedRow.paymentStatus}</p>
                                        </div>

                                        <h6 className="fw-bold">ALLOWANCES</h6>
                                        <div className="ms-3 mb-3">
                                            <p className="mb-1">House Rental Allowance: {selectedRow.hra}</p>
                                            <p className="mb-1">Medical Allowance: {selectedRow.medical}</p>
                                            <p className="mb-1">Travelling Allowance: {selectedRow.lta}</p>
                                            <p className="mb-1">Dearness Allowance: {selectedRow.allowance}</p>
                                        </div>

                                        <h6 className="fw-bold">DEDUCTIONS</h6>
                                        <div className="ms-3 mb-3">
                                            <p className="mb-1">Provident Fund: {selectedRow.pfEmployer}</p>
                                            <p className="mb-1">Tax Deduction: {selectedRow.tds}</p>
                                            <p className="mb-1">Security Deposit: {selectedRow.esc}</p>
                                        </div>

                                        <h6 className="fw-bold">TOTAL SALARY DETAILS</h6>
                                        <div className="ms-3 mb-3">
                                            <p className="mb-1">Gross Salary: {selectedRow.grossSalary}</p>
                                            <p className="mb-1">Total Allowance: {selectedRow.allowance + selectedRow.hra + selectedRow.medical + selectedRow.lta}</p>
                                            <p className="mb-1">Total Deduction: {selectedRow.totalDeductions}</p>
                                            <p className="mb-1">Net Salary: {selectedRow.netSalary}</p>
                                            <p className="mb-1">Paid Amount: {selectedRow.netSalary}</p>
                                            <p className="mb-1">Payment Method: {selectedRow.paymentMethod}</p>
                                            <p className="mb-1">Comments: {selectedRow.comments || '-'}</p>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary btn-sm" onClick={handleClose}>Close</button>
                                    </div>
                                </div>
                            </div>
                        </div>
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
                    {row.id}
                </span>
            ),
        },
        { name: 'Employee Name', selector: row => `${row.firstName} ${row.lastName}` },
        { name: 'Paid Amount', selector: row => row.netSalary },
        { name: 'Payment Month', selector: row => row.paymentMonth },
        { name: 'Payment Date', selector: row => row.paidDate },
        { name: 'Payment Type', selector: row => row.paymentMethod },
        // {
        //     name: 'Payslip',
        //     cell: (row) => (
        //         <span
        //             className="text-success"
        //             style={{ cursor: 'pointer' }}
        //             onClick={() => {
        //                 navigate(`/payslip/${row.id}`, {
        //                     // state: {
        //                     //     paymentMonth: row.paymentMonth,
        //                     //     empName: row.empName,
        //                     //     paidAmt: row.paidAmt,
        //                     //     paymentDate: row.paymentDate,
        //                     //     paymentType: row.paymentType,
        //                     // }
        //                 });
        //             }}


        //         >
        //             {/* {row.payslip} */}
        //         </span>
        //     ),
        //     ignoreRowClick: true,
        //     allowOverflow: true,
        //     // button: true
        // }
        {
            name: 'Payslip',
            cell: (row) => (
                <span
                    className="text-success"
                    style={{ cursor: 'pointer', textDecoration: 'none' }}
                    onClick={() => {
                        navigate(`/payslip/${row.id}`, {
                            state: {
                                paymentMonth: row.paymentMonth,
                                empName: `${row.firstName} ${row.lastName}`,
                                paidAmt: row.paidAmt,
                                paymentDate: row.paymentDate,
                                paymentType: row.paymentType
                            }
                        });
                    }}
                >
                    Generate Payslip
                </span>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
        }

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

    const [paginated, setPaginated] = useState(data.slice(0, rowsPerPage));

    const paginate = (data, page) => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        setPaginated(data.slice(start, end));
        setCurrentPage(page);
    };

    const startEntry = (currentPage - 1) * rowsPerPage + 1;
    const endEntry = Math.min(currentPage * rowsPerPage, data.length);
    useEffect(() => {
        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        setPaginated(data.slice(start, end));
    }, [data, currentPage, rowsPerPage]);

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


                <div className="px-3">
                    <div className="d-flex justify-content-between align-items-center mb-2 mt-3">
                        <div className="d-flex align-items-center gap-2">
                            <label htmlFor="entriesSelect" className="mb-0 ms-4">Show</label>
                            <select
                                value={rowsPerPage}
                                onChange={(e) => {
                                    setRowsPerPage(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                            >
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                            <span className="ms-1">entries</span>
                        </div>
                    </div>

                    <DataTable
                        columns={columns}
                        data={mergedData}
                        // data={paginated}
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
