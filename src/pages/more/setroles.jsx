import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import './more.css';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { getSetRoles, createSetRoles, updateSetRoles, deleteSetRoles } from '../../api/setRolesApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SetRoles = () => {

    const [showModal, setShowModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [description, setDescription] = useState('');

    //from backend
    const [SetRoles, setSetRoles] = useState([]);
    // const [paginated, setPaginated] = useState([]);

    const [editId, setEditId] = useState(null);

    const [form, setForm] = useState({
        roleName: '',
        menuPermission: '',
        // addedDate: ''
    });

    const [errors, setErrors] = useState({});
    const validateForm = () => {
        let newErrors = {};

        Object.keys(form).forEach((field) => {
            if (!form[field] || form[field].toString().trim() === "") {
                newErrors[field] = `${field.replace(/([A-Z])/g, " $1")} is required`;
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    useEffect(() => {
        fetchSetRoles();
    }, []);

    const fetchSetRoles = async () => {
        try {
            const response = await getSetRoles();
            setSetRoles(response.data);
            paginate(response.data, currentPage);
        } catch (error) {
            console.error('Error fetching SetRoles:', error);
        }
    };

    const validateField = (fieldName, value = "") => {
        let error = "";

        switch (fieldName) {
            case "roleName":
                if (!value.trim()) {
                    error = "Role Name is required";
                }
                break;

            case "menuPermission":
                if (!value.trim()) {
                    error = "Role Name is required";
                }
                break;

            default:
                break;
        }

        setErrors((prev) => ({ ...prev, [fieldName]: error }));
        return !error;
    };




    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("Editing ID:", editId);
        console.log("Submitting form:", form);

        if (!validateForm()) return;

        try {
            if (editId) {
                const updated = await updateSetRoles(editId, form);
                console.log("Update response:", updated);
                toast.success("Set Roles updated successfully!");
            } else {
                const created = await createSetRoles(form);
                console.log("Create response:", created);
                toast.success("Set Roles saved successfully!");
            }

            await fetchSetRoles();

            setForm({ roleName: '', menuPermission: '' });
            setEditId("");
            setShowEditModal(false);
        } catch (err) {
            console.error("Error saving SetRoles:", err);
            toast.error("Set Roles failed to save!");
        }
    };


    const emptyForm = {
        SetRoles: ''
    };

    const resetForm = () => {
        setForm(emptyForm);
        setEditId(null);
        setShowEditModal(false);
    };

    // const handleView = (row) => {
    //     setSelectedRow(row);
    //     setShowModal(true);
    // };

    const handleEdit = (row) => {
        setForm({
            roleName: row.roleName,
            menuPermission: row.menuPermission
        });
        setEditId(row._id);
        setShowEditModal(true);
        setSelectedRow(row);
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this set role?");
        if (!confirmDelete) return;
        try {
            await deleteSetRoles(id);
            fetchSetRoles();
        } catch (err) {
            console.error("Error deleting SetRoles:", err);
        }
    };






    const columns = [
        {
            name: 'Action',
            cell: (row) => (
                <div className="d-flex">
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
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(row._id)}
                    >
                        <i className="fas fa-trash-alt text-white"></i>
                    </button>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },

        { name: 'Role ID', cell: (row, index) => index + 1, },
        { name: 'Role Name', selector: row => row.roleName },
        { name: 'Menu Permission', selector: row => row.menuPermission },
        { name: 'Added Date', selector: row => row.addedDate },

    ];

    // const data = [
    //     {
    //         action: '-',
    //         roleId: '1',
    //         roleName: 'Super Admin',
    //         menuPermission: 'All Menu Access',
    //         addedDate: '20-Nov-2016',
    //     },
    //     {
    //         action: '-',
    //         roleId: '2',
    //         roleName: 'Employee',
    //         menuPermission: 'Custom Menu Access',
    //         addedDate: '28-Apr-2017',
    //     },

    // ];

    const customStyles = {
        headCells: {
            style: {
                backgroundColor: '#2b528c',
                color: 'white',
                fontSize: '14px',
                whiteSpace: 'nowrap',
            },
        },
        cells: {
            style: {
                fontSize: '14px',
                whiteSpace: 'normal', // allow text to wrap
                wordBreak: 'break-word',
            },
        },
    };


    const conditionalRowStyles = [
        {
            when: (row, index) => index % 2 === 0,
            style: {
                backgroundColor: 'white',
                minHeight: '60px', // ensure taller row
                paddingTop: '10px',
                paddingBottom: '10px',
                whiteSpace: 'normal', // wrap text
                wordBreak: 'break-word',
            },
        },
        {
            when: (row, index) => index % 2 !== 0,
            style: {
                backgroundColor: '#f8f9fa',
                minHeight: '60px',
                paddingTop: '10px',
                paddingBottom: '10px',
                whiteSpace: 'normal',
                wordBreak: 'break-word',
            },
        },
    ];


    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const totalEntries = SetRoles.length;
    const totalPages = Math.ceil(totalEntries / rowsPerPage);
      const [paginated, setPaginated] = useState(SetRoles.slice(0, rowsPerPage));
    
        const paginate = (data, page) => {
            const start = (page - 1) * rowsPerPage;
            const end = start + rowsPerPage;
            setPaginated(data.slice(start, end));
            setCurrentPage(page);
        };
    
        const startEntry = (currentPage - 1) * rowsPerPage + 1;
        const endEntry = Math.min(currentPage * rowsPerPage, SetRoles.length);
        useEffect(() => {
            const start = (currentPage - 1) * rowsPerPage;
            const end = start + rowsPerPage;
            setPaginated(SetRoles.slice(start, end));
        }, [SetRoles, currentPage, rowsPerPage]);

    const [showAddForm, setShowAddForm] = useState(false);

    const toggleAddForm = () => {
        setShowAddForm((prev) => !prev);
    };

    const [expandedItems, setExpandedItems] = useState({});


    const permissionsData = {
        Organization: ["Company", "Location", "Department", "Designation", "Announcements", "Policies", "Expense"],
        Employees: ["Employees", "Set Roles", "Awards", "Transfers", "Resignations", "Travels", "Promotions", "Complaints", "Warnings", "Terminations", "Employee Last Login", "Employee Exit"],
        Performance: ["Performance Indicator", "Performance Appraisal"],
        Timesheet: ["Attendance", "Date Wise Attendance", "Update Attendance", "Import Attendance", "Leaves", "Office Shifts", "Holidays"],
        Payroll: ["Payroll Templates", "Hourly Wages", "Manage Salary", "Advance Salary", "Advance Salary Report", "Generate Payslip", "Payment History"],
        Projects: [""],
        Worksheets: [""],
        SupportRequest: [""],
        Recruitment: ["Jobs Listing", "Job Posts", "Job Candidates", "Job Interviews"],
        Training: ["Training List", "Training Type", "Trainers List"],
        Reports: ["Account Statement", "Expense Report", "Income Report", "Transfer Report"],
        FilesManager: [""],
        EmployeesDirectory: [""],
        Settings: [""],
        Constants: [""],
        EmailTemplates: [""],
        DatabaseBackup: [""]
    };

    const subPermissions = ["View", "Add", "Edit", "Delete", "List"];

    const [expandedResources, setExpandedResources] = useState({});
    const [expandedSubfields, setExpandedSubfields] = useState({});

    const toggleResource = (res) => {
        setExpandedResources((prev) => ({ ...prev, [res]: !prev[res] }));
    };

    const toggleSubfield = (res, sub) => {
        setExpandedSubfields((prev) => ({
            ...prev,
            [`${res}-${sub}`]: !prev[`${res}-${sub}`],
        }));
    };

    const toggleExpand = (item) => {
        setExpandedItems((prev) => ({
            ...prev,
            [item]: !prev[item],
        }));
    };

    return (
        <div className="custom-container">
            <h5>User Roles</h5>
            <p style={{ fontSize: '15px', color: 'rgb(98, 98, 98)' }}>
                <span style={{ color: 'red' }}>Home</span> / User Roles
            </p>


            {showAddForm && (
                <div className="card mb-3 form-slide-container">
                    <div className="card-header d-flex justify-content-between align-items-center text-white new-emp-bg">
                        <span>Set New Role</span>
                        <button className="btn btn-sm add-btn" onClick={toggleAddForm}>
                            - Hide
                        </button>
                    </div>

                    <div className="container mt-4">
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="row">
                                    {/* Left Column */}
                                    <div className="col-md-5">
                                        <div className="mb-3">
                                            <label>Role Name</label>
                                            <input type="text" value={form.roleName}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, roleName: value });
                                                    validateField("roleName", value);
                                                }}
                                                className={`form-control ${errors.roleName ? "is-invalid" : ""}`}
                                                placeholder="Role Name"
                                                onBlur={(e) => validateField("roleName", e.target.value)}

                                            />
                                            {errors.roleName && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Role Name is required!</p>)}
                                        </div>

                                        <div className="mb-3">
                                            <label>Select Access</label>
                                            <select
                                                value={form.menuPermission}
                                                onChange={(e) => {
                                                    const { value } = e.target;
                                                    setForm({ ...form, menuPermission: value });
                                                    validateField("menuPermission", value);
                                                }}
                                                className={`form-control ${errors.menuPermission ? "is-invalid" : ""}`}
                                                onBlur={(e) => validateField("menuPermission", e.target.value)}
                                            >
                                                <option value="">Select Access</option>
                                                <option value="All Menu Access">All Menu Access</option>
                                                <option value="Custom Menu Access">Custom Menu Access</option>
                                            </select>
                                            {errors.menuPermission && (
                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.menuPermission}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right Column */}
                                    <div className="col-md-7">
                                        <div className="row">
                                            {/* First Half */}
                                            <h6>Resources</h6>
                                            <div className="col-6">
                                                <ul className="list-unstyled">
                                                    {Object.keys(permissionsData)
                                                        .slice(0, Math.ceil(Object.keys(permissionsData).length / 2))
                                                        .map((res, index) => (
                                                            <React.Fragment key={index}>
                                                                <li className="d-flex align-items-start mb-1">
                                                                    <span
                                                                        style={{ cursor: "pointer", width: "20px", display: "inline-block" }}
                                                                        onClick={() => toggleResource(res)}
                                                                    >
                                                                        {expandedResources[res] ? "−" : "+"}
                                                                    </span>
                                                                    <span>{res}</span>
                                                                </li>

                                                                {expandedResources[res] && (
                                                                    <>
                                                                        {(permissionsData[res].length > 0 && permissionsData[res][0] !== "")
                                                                            ? permissionsData[res].map((subfield, subIndex) => (
                                                                                <React.Fragment key={subIndex}>
                                                                                    <li className="d-flex align-items-start mb-1 ps-4">
                                                                                        <span
                                                                                            style={{ width: "20px", display: "inline-block", cursor: "pointer" }}
                                                                                            onClick={() => toggleSubfield(res, subfield)}
                                                                                        >
                                                                                            {expandedSubfields[`${res}-${subfield}`] ? "−" : "+"}
                                                                                        </span>
                                                                                        <span>{subfield}</span>
                                                                                    </li>

                                                                                    {expandedSubfields[`${res}-${subfield}`] &&
                                                                                        subPermissions.map((perm, i) => (
                                                                                            <li
                                                                                                key={i}
                                                                                                className="d-flex align-items-center mb-1 ps-5"
                                                                                                style={{ gap: "5px" }}
                                                                                            >
                                                                                                <input type="checkbox" className="me-2" />
                                                                                                <span>{perm}</span>
                                                                                            </li>
                                                                                        ))}
                                                                                </React.Fragment>
                                                                            ))
                                                                            : // Empty arrays → show subPermissions directly
                                                                            subPermissions.map((perm, i) => (
                                                                                <li
                                                                                    key={i}
                                                                                    className="d-flex align-items-center mb-1 ps-4"
                                                                                    style={{ gap: "5px" }}
                                                                                >
                                                                                    <input type="checkbox" className="me-2" />
                                                                                    <span>{perm}</span>
                                                                                </li>
                                                                            ))}
                                                                    </>
                                                                )}
                                                            </React.Fragment>
                                                        ))}
                                                </ul>
                                            </div>

                                            {/* Second Half */}
                                            <div className="col-6">
                                                <ul className="list-unstyled">
                                                    {Object.keys(permissionsData)
                                                        .slice(Math.ceil(Object.keys(permissionsData).length / 2))
                                                        .map((res, index) => (
                                                            <React.Fragment key={index}>
                                                                <li className="d-flex align-items-start mb-1">
                                                                    <span
                                                                        style={{ cursor: "pointer", width: "20px", display: "inline-block" }}
                                                                        onClick={() => toggleResource(res)}
                                                                    >
                                                                        {expandedResources[res] ? "−" : "+"}
                                                                    </span>
                                                                    <span>{res}</span>
                                                                </li>

                                                                {expandedResources[res] && (
                                                                    <>
                                                                        {(permissionsData[res].length > 0 && permissionsData[res][0] !== "")
                                                                            ? permissionsData[res].map((subfield, subIndex) => (
                                                                                <React.Fragment key={subIndex}>
                                                                                    <li className="d-flex align-items-start mb-1 ps-4">
                                                                                        <span
                                                                                            style={{ width: "20px", display: "inline-block", cursor: "pointer" }}
                                                                                            onClick={() => toggleSubfield(res, subfield)}
                                                                                        >
                                                                                            {expandedSubfields[`${res}-${subfield}`] ? "−" : "+"}
                                                                                        </span>
                                                                                        <span>{subfield}</span>
                                                                                    </li>

                                                                                    {expandedSubfields[`${res}-${subfield}`] &&
                                                                                        subPermissions.map((perm, i) => (
                                                                                            <li
                                                                                                key={i}
                                                                                                className="d-flex align-items-center mb-1 ps-5"
                                                                                                style={{ gap: "5px" }}
                                                                                            >
                                                                                                <input type="checkbox" className="me-2" />
                                                                                                <span>{perm}</span>
                                                                                            </li>
                                                                                        ))}
                                                                                </React.Fragment>
                                                                            ))
                                                                            : // Empty arrays → show subPermissions directly
                                                                            subPermissions.map((perm, i) => (
                                                                                <li
                                                                                    key={i}
                                                                                    className="d-flex align-items-center mb-1 ps-4"
                                                                                    style={{ gap: "5px" }}
                                                                                >
                                                                                    <input type="checkbox" className="me-2" />
                                                                                    <span>{perm}</span>
                                                                                </li>
                                                                            ))}
                                                                    </>
                                                                )}
                                                            </React.Fragment>
                                                        ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                </div>



                                <div className='text-start mb-2'>
                                    <button className="btn btn-sm add-btn">Save</button>
                                </div>
                            </div>
                        </form>
                    </div>

                </div>
            )}



            <div className="card no-radius">
                <div className="card-header d-flex justify-content-between align-items-center text-white new-emp-bg">
                    <span>List All Roles</span>
                    <button className="btn btn-sm add-btn" onClick={toggleAddForm}>{showAddForm ? '- Hide' : '+ Set New Role'}</button>
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
                                    data={paginated}
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
                                        <h5 className="modal-title">Edit Set Roles List</h5>
                                        <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                                    </div>
                                    <div className="modal-body">
                                        <form onSubmit={handleSubmit}>
                                            <div className="row">
                                                <div className="row">
                                                    {/* Left Column */}
                                                    <div className="col-md-5">
                                                        <div className="mb-3">
                                                            <label>Role Name</label>
                                                            <input type="text" value={form.roleName}
                                                                onChange={(e) => {
                                                                    const { value } = e.target;
                                                                    setForm({ ...form, roleName: value });
                                                                    validateField("roleName", value);
                                                                }}
                                                                className={`form-control ${errors.roleName ? "is-invalid" : ""}`}
                                                                placeholder="Role Name"
                                                                onBlur={(e) => validateField("roleName", e.target.value)}

                                                            />
                                                            {errors.roleName && (
                                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Role Name is required!</p>)}
                                                        </div>

                                                        <div className="mb-3">
                                                            <label>Select Access</label>
                                                            <select
                                                                value={form.menuPermission}
                                                                onChange={(e) => {
                                                                    const { value } = e.target;
                                                                    setForm({ ...form, menuPermission: value });
                                                                    validateField("menuPermission", value);
                                                                }}
                                                                className={`form-control ${errors.menuPermission ? "is-invalid" : ""}`}
                                                                onBlur={(e) => validateField("menuPermission", e.target.value)}
                                                            >
                                                                <option value="">Select Access</option>
                                                                <option value="All Menu Access">All Menu Access</option>
                                                                <option value="Custom Menu Access">Custom Menu Access</option>
                                                            </select>
                                                            {errors.menuPermission && (
                                                                <p className="text-danger mb-0" style={{ fontSize: '13px' }}>{errors.menuPermission}</p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Right Column */}
                                                    <div className="col-md-7">
                                                        <div className="row">
                                                            {/* First Half */}
                                                            <h6>Resources</h6>
                                                            <div className="col-6">
                                                                <ul className="list-unstyled">
                                                                    {Object.keys(permissionsData)
                                                                        .slice(0, Math.ceil(Object.keys(permissionsData).length / 2))
                                                                        .map((res, index) => (
                                                                            <React.Fragment key={index}>
                                                                                <li className="d-flex align-items-start mb-1">
                                                                                    <span
                                                                                        style={{ cursor: "pointer", width: "20px", display: "inline-block" }}
                                                                                        onClick={() => toggleResource(res)}
                                                                                    >
                                                                                        {expandedResources[res] ? "−" : "+"}
                                                                                    </span>
                                                                                    <span>{res}</span>
                                                                                </li>

                                                                                {expandedResources[res] && (
                                                                                    <>
                                                                                        {(permissionsData[res].length > 0 && permissionsData[res][0] !== "")
                                                                                            ? permissionsData[res].map((subfield, subIndex) => (
                                                                                                <React.Fragment key={subIndex}>
                                                                                                    <li className="d-flex align-items-start mb-1 ps-4">
                                                                                                        <span
                                                                                                            style={{ width: "20px", display: "inline-block", cursor: "pointer" }}
                                                                                                            onClick={() => toggleSubfield(res, subfield)}
                                                                                                        >
                                                                                                            {expandedSubfields[`${res}-${subfield}`] ? "−" : "+"}
                                                                                                        </span>
                                                                                                        <span>{subfield}</span>
                                                                                                    </li>

                                                                                                    {expandedSubfields[`${res}-${subfield}`] &&
                                                                                                        subPermissions.map((perm, i) => (
                                                                                                            <li
                                                                                                                key={i}
                                                                                                                className="d-flex align-items-center mb-1 ps-5"
                                                                                                                style={{ gap: "5px" }}
                                                                                                            >
                                                                                                                <input type="checkbox" className="me-2" />
                                                                                                                <span>{perm}</span>
                                                                                                            </li>
                                                                                                        ))}
                                                                                                </React.Fragment>
                                                                                            ))
                                                                                            : // Empty arrays → show subPermissions directly
                                                                                            subPermissions.map((perm, i) => (
                                                                                                <li
                                                                                                    key={i}
                                                                                                    className="d-flex align-items-center mb-1 ps-4"
                                                                                                    style={{ gap: "5px" }}
                                                                                                >
                                                                                                    <input type="checkbox" className="me-2" />
                                                                                                    <span>{perm}</span>
                                                                                                </li>
                                                                                            ))}
                                                                                    </>
                                                                                )}
                                                                            </React.Fragment>
                                                                        ))}
                                                                </ul>
                                                            </div>

                                                            {/* Second Half */}
                                                            <div className="col-6">
                                                                <ul className="list-unstyled">
                                                                    {Object.keys(permissionsData)
                                                                        .slice(Math.ceil(Object.keys(permissionsData).length / 2))
                                                                        .map((res, index) => (
                                                                            <React.Fragment key={index}>
                                                                                <li className="d-flex align-items-start mb-1">
                                                                                    <span
                                                                                        style={{ cursor: "pointer", width: "20px", display: "inline-block" }}
                                                                                        onClick={() => toggleResource(res)}
                                                                                    >
                                                                                        {expandedResources[res] ? "−" : "+"}
                                                                                    </span>
                                                                                    <span>{res}</span>
                                                                                </li>

                                                                                {expandedResources[res] && (
                                                                                    <>
                                                                                        {(permissionsData[res].length > 0 && permissionsData[res][0] !== "")
                                                                                            ? permissionsData[res].map((subfield, subIndex) => (
                                                                                                <React.Fragment key={subIndex}>
                                                                                                    <li className="d-flex align-items-start mb-1 ps-4">
                                                                                                        <span
                                                                                                            style={{ width: "20px", display: "inline-block", cursor: "pointer" }}
                                                                                                            onClick={() => toggleSubfield(res, subfield)}
                                                                                                        >
                                                                                                            {expandedSubfields[`${res}-${subfield}`] ? "−" : "+"}
                                                                                                        </span>
                                                                                                        <span>{subfield}</span>
                                                                                                    </li>

                                                                                                    {expandedSubfields[`${res}-${subfield}`] &&
                                                                                                        subPermissions.map((perm, i) => (
                                                                                                            <li
                                                                                                                key={i}
                                                                                                                className="d-flex align-items-center mb-1 ps-5"
                                                                                                                style={{ gap: "5px" }}
                                                                                                            >
                                                                                                                <input type="checkbox" className="me-2" />
                                                                                                                <span>{perm}</span>
                                                                                                            </li>
                                                                                                        ))}
                                                                                                </React.Fragment>
                                                                                            ))
                                                                                            : // Empty arrays → show subPermissions directly
                                                                                            subPermissions.map((perm, i) => (
                                                                                                <li
                                                                                                    key={i}
                                                                                                    className="d-flex align-items-center mb-1 ps-4"
                                                                                                    style={{ gap: "5px" }}
                                                                                                >
                                                                                                    <input type="checkbox" className="me-2" />
                                                                                                    <span>{perm}</span>
                                                                                                </li>
                                                                                            ))}
                                                                                    </>
                                                                                )}
                                                                            </React.Fragment>
                                                                        ))}
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>

                                            <div className="text-end">
                                                <button type="button" className="btn btn-sm btn-light me-2" onClick={() => { resetForm(); setShowEditModal(false) }}>Close</button>
                                                <button type="submit" onClick={(e) => handleSubmit(e)} className="btn btn-sm add-btn">Update</button>
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

export default SetRoles;
