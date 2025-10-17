import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { getAllPayrolls } from '../../api/payrollApi';
import { FaFilter } from 'react-icons/fa';

const GeneratePayslip = () => {

    const [selectedRow, setSelectedRow] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [description, setDescription] = useState('<div class="mb-3"><label>Hello, Your Payslip is generated</label></div>');
    const navigate = useNavigate();
    const [payrolls, setPayrolls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [employees, setEmployees] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [sortMenuOpen, setSortMenuOpen] = useState(false);
    const [sortOrder, setSortOrder] = useState('newest');
    const [searchClicked, setSearchClicked] = useState(false);

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
            setMergedData(employees);
        }
    }, [employees, payrolls]);


    const handleEdit = (row) => {
        navigate(`/payroll-monthly/${row.id}`);
    };

    const payrollMap = payrolls.reduce((acc, p) => {
        const key = `${p.empId}-${p.month}-${p.year}`;
        acc[key] = p;
        return acc;
    }, {});


    // useEffect(() => {
    //     if (employees.length && payrolls.length) {
    //         const merged = employees.map(emp => {
    //             const currentMonth = selectedMonth
    //                 ? new Date(selectedMonth).toLocaleString('default', { month: 'long' })
    //                 : new Date().toLocaleString('default', { month: 'long' });

    //             const currentYear = selectedMonth
    //                 ? new Date(selectedMonth).getFullYear()
    //                 : new Date().getFullYear();

    //             const key = `${emp.id}-${currentMonth}-${currentYear}`;
    //             const payrollForMonth = payrollMap[key];

    //             return {
    //                 ...emp,
    //                 netSalary: payrollForMonth?.netSalary || '—',
    //                 paymentStatus: payrollForMonth?.paymentStatus || 'Unpaid',
    //                 paidDate: payrollForMonth?.paidDate || null,
    //                 month: payrollForMonth?.month || currentMonth,
    //                 year: payrollForMonth?.year || currentYear,
    //             };
    //         });

    //         setMergedData(merged);
    //         setFilteredData(merged); // initially show same as merged
    //     } else {
    //         setMergedData(employees);
    //         setFilteredData(employees);
    //     }
    // }, [employees, payrolls, selectedMonth]);

    useEffect(() => {
        if (employees.length && payrolls.length) {
            const payrollMap = payrolls.reduce((acc, p) => {
                const key = `${p.empId}-${p.month}-${p.year}`;
                acc[key] = p;
                return acc;
            }, {});

            const merged = employees.map(emp => {
                const currentMonth = selectedMonth
                    ? new Date(selectedMonth).toLocaleString('default', { month: 'long' })
                    : new Date().toLocaleString('default', { month: 'long' });

                const currentYear = selectedMonth
                    ? new Date(selectedMonth).getFullYear()
                    : new Date().getFullYear();

                const key = `${emp.id}-${currentMonth}-${currentYear}`;
                const payrollForMonth = payrollMap[key];

                return {
                    ...emp,
                    netSalary: payrollForMonth?.netSalary || '—',
                    paymentStatus: payrollForMonth?.paymentStatus || 'Unpaid',
                    paidDate: payrollForMonth?.paidDate || null,
                    month: payrollForMonth?.month || currentMonth,
                    year: payrollForMonth?.year || currentYear,
                };
            });

            setMergedData(merged);
            setFilteredData(merged);
        } else {
            // fallback so employees still have month/year
            const currentMonth = new Date().toLocaleString('default', { month: 'long' });
            const currentYear = new Date().getFullYear();

            setMergedData(
                employees.map(emp => ({
                    ...emp,
                    month: currentMonth,
                    year: currentYear,
                    netSalary: '—',
                    paymentStatus: 'Unpaid',
                }))
            );
        }
    }, [employees, payrolls, selectedMonth]);


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
                <span className={`badge ${row.paymentStatus?.toLowerCase() === 'paid' ? 'bg-success' : 'bg-danger'}`}>
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

    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [filteredPayrolls, setFilteredPayrolls] = useState([]);

    const handleSearch = () => {
        setSearchClicked(true);

        let results = employees.map(emp => {
            if (!selectedMonth) {
                return {
                    ...emp,
                    netSalary: '—',
                    paymentStatus: 'Unpaid',
                    paidDate: null,
                    month: null,
                    year: null,
                };
            }

            const selected = new Date(selectedMonth);
            const selectedMonthName = selected.toLocaleString('default', { month: 'long' });
            const selectedYearNum = selected.getFullYear();

            const payrollForMonth = payrolls.find(
                p => p.empId === emp.id && p.month === selectedMonthName && p.year === selectedYearNum
            );

            if (selectedEmployee && emp._id !== selectedEmployee) return null;

            return {
                ...emp,
                netSalary: payrollForMonth?.netSalary || '—',
                paymentStatus: payrollForMonth?.paymentStatus || 'Unpaid',
                paidDate: payrollForMonth?.paidDate || null,
                month: payrollForMonth?.month || selectedMonthName,
                year: payrollForMonth?.year || selectedYearNum,
            };
        }).filter(r => r !== null);

        setFilteredData(results);
    };


    useEffect(() => {
        setMergedData(employees);
    }, [employees]);


    const [tableData, setTableData] = useState([]);

    // export function below
    const exportToCSV = () => {
        const dataToExport = searchClicked ? filteredData : mergedData;

        if (!dataToExport || dataToExport.length === 0) {
            alert("No data to export!");
            return;
        }

        if (!selectedMonth) {
            alert("Please select a month before exporting!");
            return;
        }

        const headers = Object.keys(dataToExport[0]).join(",");
        const rows = dataToExport
            .map((row) =>
                Object.values(row)
                    .map((val) => `"${val}"`)
                    .join(",")
            )
            .join("\n");

        const csvContent = `${headers}\n${rows}`;
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.setAttribute("download", `payslip_${selectedMonth}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };



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
                            <select
                                id="employee"
                                className="form-control"
                                value={selectedEmployee}
                                onChange={(e) => setSelectedEmployee(e.target.value)}
                            >
                                <option value="">All Employees</option>
                                {employees.map(emp => (
                                    <option key={emp._id} value={emp._id}>
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
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                            />
                        </div>

                        <div className="text-start">
                            <button className="btn btn-sm add-btn" onClick={handleSearch}>Search</button>
                        </div>
                    </div>
                </div>

                <div className="card no-radius mb-3 col-md-6">
                    <div className="card-header text-white new-emp-bg fw-bold">
                        Export for NEFT
                    </div>

                    <div className="card-body">
                        <div className="mb-3">
                            <label htmlFor="monthPayslip" className="form-label">
                                Select Month
                            </label>
                            <input
                                type="month"
                                id="monthPayslip"
                                className="form-control"
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                                style={{ width: "600px" }}
                            />
                        </div>

                        <div className="text-start">
                            <button className="btn btn-sm add-btn" onClick={exportToCSV}>
                                Export
                            </button>
                        </div>
                    </div>
                </div>
            </div>



            <div className="card no-radius">
                <div className="card-header text-white new-emp-bg d-flex">
                    <span>Payment Info&nbsp;</span>
                    {/* {`${new Date().toLocaleString("default", {
                        month: "long",
                        year: "numeric",
                    })}`} */}
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
                        // data={searchClicked ? filteredData : mergedData}
                        //                          data={
                        //     searchClicked
                        //       ? filteredData
                        //       : mergedData.filter(
                        //           (row) =>
                        //             row.month === new Date().toLocaleString("default", { month: "long" }) &&
                        //             row.year === new Date().getFullYear()
                        //         )
                        //   }
                        data={
                            searchClicked
                                ? filteredData
                                : mergedData.filter(
                                    (row) =>
                                        row.month === new Date().toLocaleString("default", { month: "long" }) &&
                                        row.year === new Date().getFullYear()
                                )
                        }

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
