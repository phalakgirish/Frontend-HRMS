import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { getAllPayrolls } from '../../api/payrollApi';

const GeneratePayslip = () => {

    const [selectedRow, setSelectedRow] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [description, setDescription] = useState('<div class="mb-3"><label>Hello, Your Payslip is generated</label></div>');
    const navigate = useNavigate();
    // const [paginated, setPaginated] = useState([]);

    const [employees, setEmployees] = useState([]);
    const [payrolls, setPayrolls] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const empRes = await axios.get("http://localhost:3000/employee");
                setEmployees(empRes.data);

                const payrollRes = await getAllPayrolls();
                setPayrolls(payrollRes);

                setLoading(false);
            } catch (err) {
                console.error("❌ Error fetching data:", err);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const payrollMap = payrolls.reduce((acc, p) => {
        acc[p.empId] = p.netSalary;
        return acc;
    }, {});

    const [mergedData, setMergedData] = useState([]);

    useEffect(() => {
        if (employees.length && payrolls.length) {
            const payrollMap = payrolls.reduce((acc, p) => {
                acc[p.empId] = p;
                return acc;
            }, {});

            const merged = employees.map(emp => ({
                ...emp,
                netSalary: payrollMap[emp.id]?.netSalary || "—"
            }));

            setMergedData(merged);
        } else {
            setMergedData(employees); // fallback when no payrolls yet
        }
    }, [employees, payrolls]);


    const handleEdit = (row) => {
        navigate(`/payroll-monthly/${row.id}`);
    };

    useEffect(() => {
        if (employees.length && payrolls.length) {
            const payrollMap = payrolls.reduce((acc, p) => {
                acc[p.empId] = p;
                return acc;
            }, {});

            const merged = employees.map(emp => ({
                ...emp,
                netSalary: payrollMap[emp.id]?.netSalary || "—",
                paymentStatus: payrollMap[emp.id]?.paymentStatus || 'Unpaid',
            }));

            setMergedData(merged);
        } else {
            const merged = employees.map(emp => ({
                ...emp,
                netSalary: "—",
                paymentStatus: 'Unpaid',
            }));
            setMergedData(merged);
        }
    }, [employees, payrolls]);



    const columns = [
        { name: 'Employee ID', selector: row => row.id },
        { name: 'Name', selector: row => `${row.firstName} ${row.lastName}` },
        { name: 'Salary Type', selector: row => `${row.id} (Monthly)` },
        { name: 'CTC', selector: row => row.employeeCtc },
        {
            name: 'Net Salary',
            selector: row => row.netSalary

        },
        {
            name: 'Employee Status',
            cell: (row) => (
                <span className={`badge ${row.status === 'Active' ? 'bg-success' : 'bg-danger'}`}>
                    {row.status}
                </span>
            ),
            selector: row => row.status
        },
        {
            name: 'Status',
            cell: row => (
                <span className={`badge ${row.paymentStatus.toLowerCase() === 'paid' ? 'bg-success' : 'bg-danger'}`}>
                    {row.paymentStatus}
                </span>
            ),
            selector: row => row.paymentStatus,
        },
        {
            name: 'Action',
            cell: (row) => (
                <div className="d-flex">

                    <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => handleEdit(row)}
                    >
                        <i className="fas fa-money-bill-wave"></i>
                    </button>
                </div>
            ),
            selector: row => row.action
        },
    ];

    useEffect(() => {
        if (employees.length && payrolls.length) {
            const payrollMap = payrolls.reduce((acc, p) => { acc[p.empId] = p; return acc; }, {});
            const merged = employees.map(emp => ({
                ...emp,
                netSalary: payrollMap[emp.id]?.netSalary || "—",
                paymentStatus: payrollMap[emp.id]?.paymentStatus || 'Unpaid',
            }));
            setMergedData(merged);
        }
    }, [employees, payrolls]);


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
    const [data, setData] = useState([]);

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


    return (
        <div className="custom-container">
            <h5>Generate Payslip</h5>
            <p style={{ fontSize: '15px', color: 'rgb(98, 98, 98)' }}>
                <span style={{ color: 'red' }}>Home</span> / Generate Payslip
            </p>

            <div className="d-flex gap-3">
                <div className="card no-radius mb-3 col-md-6">
                    <div className="card-header text-white new-emp-bg fw-bold">
                        Generate Payslip
                    </div>

                    <div className="card-body">
                        <div className="mb-3">
                            <label htmlFor="employee" className="form-label">Employee</label>
                            <select id="employee" className="form-control">
                                <option value="">All Employees</option>
                                {data.map(emp => (
                                    <option key={emp.id} value={emp.id}>
                                        {emp.firstName} {emp.lastName}
                                    </option>
                                ))}
                            </select>

                        </div>

                        <div className="mb-3">
                            <label htmlFor="monthPayslip" className="form-label">Select Month</label>
                            <input
                                type="month"
                                id="monthPayslip"
                                className="form-control"
                            />
                        </div>

                        <div className="text-start">
                            <button className="btn btn-sm add-btn">Search</button>
                        </div>
                    </div>
                </div>

                <div className="card no-radius mb-3 col-md-6">
                    <div className="card-header text-white new-emp-bg fw-bold">
                        Export for NEFT
                    </div>

                    <div className="card-body">
                        <div className="mb-3">
                            <label htmlFor="monthNeft" className="form-label">Select Month</label>
                            <input
                                type="month"
                                id="monthNeft"
                                className="form-control"
                            />
                        </div>

                        <div className="text-start">
                            <button className="btn btn-sm add-btn">Export</button>
                        </div>
                    </div>
                </div>
            </div>



            <div className="card no-radius">
                <div className="card-header text-white new-emp-bg d-flex">
                    <span>Payment Info for &nbsp;</span>
                    {`${new Date().toLocaleString("default", {
                        month: "long",
                        year: "numeric",
                    })}`}
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
                        progressPending={loading}
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

export default GeneratePayslip;
