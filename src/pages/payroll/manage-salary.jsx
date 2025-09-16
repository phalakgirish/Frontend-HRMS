import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
// import './organization.css';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import axios from 'axios';



const ManageSalary = () => {

    // const [showModal, setShowModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [description, setDescription] = useState('<div class="mb-3"><label>Hello, Your Payslip is generated</label></div>');
    const [selectedEmployee, setSelectedEmployee] = useState("");
    const [filteredData, setFilteredData] = useState([]);

    const handleSearch = () => {
        if (selectedEmployee) {
            const filtered = data.filter(emp => emp.id === selectedEmployee);
            setFilteredData(filtered);
        } else {
            // If "All Employees" selected, show full list
            setFilteredData(data);
        }
    };


    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get("http://localhost:3000/employee")
            .then((res) => {
                setData(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching employee:", err);
                setLoading(false);
            });
    }, []);



    const columns = [
        { name: 'Employee ID', selector: row => row.id },
        { name: 'Employee Name', selector: row => `${row.firstName} ${row.lastName}` },
        { name: 'Username', selector: row => row.username },
        { name: 'Designation', selector: row => `${row.designation} (${row.department})`, wrap: true },
        { name: 'Status', selector: row => row.status },
        {
            name: 'Monthly',
            cell: (row) => (
                <div className="d-flex align-items-center gap-2">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        style={{ width: '18px', height: '18px' }}
                        checked={row.monthlyEnabled ?? false}
                        onChange={async (e) => {
                            const updatedValue = e.target.checked;

                            const updated = data.map((item) =>
                                item.id === row.id
                                    ? { ...item, monthlyEnabled: updatedValue, monthly: updatedValue ? item.monthly : "" }
                                    : item
                            );
                            setData(updated);

                            try {
                                await axios.patch(`http://localhost:3000/employee/${row.id}/monthly`, {
                                    monthlyEnabled: updatedValue,
                                    monthly: updatedValue ? row.monthly : "",
                                });
                            } catch (err) {
                                console.error(err);
                            }
                        }}
                    />

                    <select
                        className="form-control form-control-sm"
                        value={row.monthly ?? ""}
                        disabled={!row.monthlyEnabled}
                        onChange={async (e) => {
                            const selectedId = e.target.value;

                            const updated = data.map((item) =>
                                item.id === row.id ? { ...item, monthly: selectedId } : item
                            );
                            setData(updated);

                            try {
                                await axios.patch(`http://localhost:3000/employee/${row.id}/monthly`, {
                                    monthlyEnabled: row.monthlyEnabled ?? false,
                                    monthly: selectedId,
                                });
                            } catch (err) {
                                console.error(err);
                            }
                        }}
                    >
                        <option value="">Select</option>
                        {data.map((emp) => (
                            <option key={emp.id} value={emp.id}>
                                {emp.id}
                            </option>
                        ))}
                    </select>
                </div>
            ),
        }


    ];

    // const [data, setData] = useState([
    //     {
    //         employeeId: 'ATOZ053',
    //         employeeName: 'Aashita Solanki',
    //         username: 'Aashita',
    //         designation: 'Asst. Dealer(Dealing)',
    //         status: 'Active',
    //         monthly: ''
    //     },
    //     {
    //         employeeId: 'ATOZ055',
    //         employeeName: 'Manoj Ghate',
    //         username: 'Manoj',
    //         designation: 'IT Manager(IT)',
    //         status: 'Active',
    //         monthly: ''
    //     }, {
    //         employeeId: 'ATZ070',
    //         employeeName: 'Rutuja Pawar',
    //         username: 'Rutuja',
    //         designation: 'HR Manager(Human Resource )',
    //         status: 'Active',
    //         monthly: ''
    //     },
    // ]);

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
                fontSize: '14px',
            },
        },
        {
            when: (row, index) => index % 2 !== 0,
            style: {
                backgroundColor: '#f8f9fa',
                fontSize: '14px',
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
                    <select
                        id="employee"
                        className="form-control"
                        value={selectedEmployee}
                        onChange={(e) => setSelectedEmployee(e.target.value)}
                    >
                        <option value="">All Employees</option>
                        {data.map((emp) => (
                            <option key={emp.id} value={emp.id}>
                                {emp.firstName} {emp.lastName}
                            </option>
                        ))}
                    </select>

                </div>

                <div className='text-start mb-2'>
                    <button className="btn btn-sm add-btn ms-4" onClick={handleSearch}>
                        Search
                    </button>

                </div>

            </div>


            <div className="card no-radius">
                <div className="card-header d-flex justify-content-between align-items-center text-white new-emp-bg">
                    <span>List all Employee Salaries</span>
                    {/* <button className="btn btn-sm add-btn" onClick={toggleAddForm}>{showAddForm ? '- Hide' : '+ Add New'}</button> */}
                </div>


                <div className="px-3">
                    <div className="d-flex justify-content-between align-items-center mb-2 mt-4">
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
                        data={filteredData.length ? filteredData : data} // show filtered or all

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
