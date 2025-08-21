import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
// import './organization.css';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';



const ManageSalary = () => {

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

    const monthlyCodes = [
        'UBISL0016', 'UBISL0001', 'UBISL0002',
        'UBISL0003', 'UBISL0004', 'UBISL0010', 'UBISL0020'
    ];
    const columns = [
        { name: 'Employee ID', selector: row => row.employeeId },
        { name: 'Employee Name', selector: row => row.employeeName },
        { name: 'Username', selector: row => row.username },
        { name: 'Designation', selector: row => row.designation },
        { name: 'Status', selector: row => row.status },
        {
            name: 'Monthly',
            cell: (row) => (
                <div className="d-flex align-items-center gap-2">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        style={{ width: '18px', height: '18px' }}
                        checked={row.monthlyEnabled}
                        onChange={(e) => {
                            const updated = data.map((item) =>
                                item.employeeId === row.employeeId
                                    ? {
                                        ...item,
                                        monthlyEnabled: e.target.checked,
                                        monthly: e.target.checked ? item.monthly : '',
                                    }
                                    : item
                            );
                            setData(updated);
                        }}
                    />
                    <select
                        className="form-control form-control-sm"
                        value={row.monthly}
                        disabled={!row.monthlyEnabled}
                        style={{ cursor: row.monthlyEnabled ? 'pointer' : 'not-allowed' }}
                        onChange={(e) => {
                            const updated = data.map((item) =>
                                item.employeeId === row.employeeId
                                    ? { ...item, monthly: e.target.value }
                                    : item
                            );
                            setData(updated);
                        }}
                    >
                        <option value="">Select Code</option>
                        {monthlyCodes.map((code) => (
                            <option key={code} value={code}>
                                {code}
                            </option>
                        ))}
                    </select>

                </div>
            ),
        },
    ];

    const [data, setData] = useState([
        {
            employeeId: 'ATOZ053',
            employeeName: 'Aashita Solanki',
            username: 'Aashita',
            designation: 'Asst. Dealer(Dealing)',
            status: 'Active',
            monthly: ''
        },
        {
            employeeId: 'ATOZ055',
            employeeName: 'Manoj Ghate',
            username: 'Manoj',
            designation: 'IT Manager(IT)',
            status: 'Active',
            monthly: ''
        }, {
            employeeId: 'ATZ070',
            employeeName: 'Rutuja Pawar',
            username: 'Rutuja',
            designation: 'HR Manager(Human Resource )',
            status: 'Active',
            monthly: ''
        },
    ]);

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
            <h5>Manage Salary</h5>
            <p style={{ fontSize: '15px', color: 'rgb(98, 98, 98)' }}>
                <span style={{ color: 'red' }}>Home</span> / Manage Salary
            </p>

            <div className="card no-radius mb-3 col-md-5">
                <div className="card-header text-white new-emp-bg fw-bold">Manage Salary</div>
                <div className="card-body d-flex align-items-start align-items-center gap-5">
                    <label>Employee</label>
                    <select id="employee" className="form-control">
                        <option value="">All Employees</option>
                        <option value="admin">Admin Admin</option>
                        <option value="anjali">Anjali Patle</option>
                        <option value="amit">Amit Kumar</option>
                        <option value="aniket">Aniket Rane</option>
                    </select>
                </div>

                <div className='text-start mb-2'>
                    <button className="btn btn-sm add-btn ms-4">Search</button>
                </div>

            </div>


            <div className="card no-radius">
                <div className="card-header d-flex justify-content-between align-items-center text-white new-emp-bg">
                    <span>List all Employee Salaries</span>
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

export default ManageSalary;
