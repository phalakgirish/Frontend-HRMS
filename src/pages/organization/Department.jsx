import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import './organization.css';
import { getDepartment, createDepartment, updateDepartment, deleteDepartment } from '../../api/departmentApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Department = () => {

    // const [showModal, setShowModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [department, setDepartment] = useState([]);
    // const [paginated, setPaginated] = useState([]);
    const [editId, setEditId] = useState(null);

    const [form, setForm] = useState({
        departmentName: '',
        company: '',
        location: '',
        departmentHead: '',
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
        fetchDepartment();
    }, []);

    const fetchDepartment = async () => {
        try {
            const response = await getDepartment();
            setDepartment(response.data);
            paginate(response.data, currentPage);
        } catch (error) {
            console.error('Error fetching department:', error);
        }
    };

    const validateField = (fieldName, value = "") => {
        let error = "";

        const displayName = fieldName
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, str => str.toUpperCase());

        value = value.toString();

        switch (fieldName) {
            case "departmentName": {
                const displayName = "Department Name";
                if (!value.trim()) {
                    error = `${displayName} is required`;
                } else if (!/^[A-Za-z\s]+$/.test(value)) {
                    error = `${displayName} must contain only letters`;
                }
                break;
            }


            case "company":
                if (!value.trim()) error = `${displayName} is required`;
                break;

            case "location":
                if (!value.trim()) error = `${displayName} is required`;
                break;

            case "departmentHead":
                if (!value.trim()) error = `${displayName} is required`;
                break;

            default:
                break;
        }

        setErrors(prev => ({ ...prev, [fieldName]: error }));
        return error;
    };


    const handleSubmit = async (e) => {

        e.preventDefault();
        if (validateForm()) {
            try {
                if (editId) {
                    await updateDepartment(editId, form);
                    toast.success("Department updated successfully!");

                } else {
                    await createDepartment(form);
                    toast.success("Department saved successfully!");
                }

                fetchDepartment();
                setForm({ departmentName: '', company: '', location: '', departmentHead: '' });
                setEditId("");
                setShowEditModal(false);
            } catch (err) {
                console.error("Error saving department:", err);
                toast.error("Failed to save department!");

            }
        }
    };


    const emptyForm = {
        departmentName: '',
        company: '',
        location: '',
        departmentHead: '',
    };

    const resetForm = () => {
        setForm(emptyForm);
        setEditId(null);
        setShowEditModal(false);
    };




    const handleEdit = (row) => {
        setForm({
            departmentName: row.departmentName,
            company: row.company,
            location: row.location,
            departmentHead: row.departmentHead,
        });
        setEditId(row._id);
        setShowEditModal(true);
        setSelectedRow(row);
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this department?");
        if (!confirmDelete) return;
        try {
            await deleteDepartment(id);
            fetchDepartment();
        } catch (err) {
            console.error("Error deleting department:", err);
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
        { name: 'Deparment Name', selector: row => row.departmentName },
        { name: 'Deparment Head', selector: row => row.departmentHead },
        { name: 'Company', selector: row => row.company },
        { name: 'Location', selector: row => row.location }
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

    const totalEntries = department.length;
    const totalPages = Math.ceil(totalEntries / rowsPerPage);

    const [paginated, setPaginated] = useState(department.slice(0, rowsPerPage));

    const paginate = (data, page) => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        setPaginated(data.slice(start, end));
        setCurrentPage(page);
    };

    const startEntry = (currentPage - 1) * rowsPerPage + 1;
    const endEntry = Math.min(currentPage * rowsPerPage, department.length);
    useEffect(() => {
        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        setPaginated(department.slice(start, end));
    }, [department, currentPage, rowsPerPage]);

    return (
        <div className="custom-container">
            <h5>Departments</h5>
            <p style={{ fontSize: '15px', color: 'rgb(98, 98, 98)' }}>
                <span style={{ color: 'red' }}>Home</span> / Departments
            </p>

            <div className="container-fluid px-3 mt-4">

                <div className="row g-4">
                    <div className="col-12 col-lg-4">
                        <div className="card no-radius h-100">
                            <div className="card-header d-flex justify-content-between align-items-center text-white new-emp-bg">
                                <span>Add New Departments</span>
                            </div>

                            <form className="p-3" onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-12 mb-3">
                                        <label>Name</label>
                                        <input
                                            type="text"
                                            value={form.departmentName}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setForm({ ...form, departmentName: value });
                                                validateField("departmentName", value);
                                            }}
                                            className={`form-control ${errors.departmentName ? "is-invalid" : ""}`}
                                            placeholder="Name"
                                            onBlur={(e) => validateField("departmentName", e.target.value)}

                                        />
                                        {errors.departmentName && (
                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>
                                                Department Name is Required!
                                            </p>
                                        )}
                                    </div>

                                    <div className="col-md-12 mb-3">
                                        <label>Company</label>
                                        <select
                                            id="company"
                                            value={form.company}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setForm({ ...form, company: value, location: "" });
                                                validateField("company", value);
                                            }}
                                            className={`form-control ${errors.company ? "is-invalid" : ""}`}
                                            onBlur={(e) => validateField("company", e.target.value)}

                                        >
                                            <option value="">Company</option>
                                            <option value="UBI Services Ltd.">UBI Services Ltd.</option>
                                        </select>
                                        {errors.company && (
                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>
                                                Company Name is Required!
                                            </p>
                                        )}
                                    </div>

                                    <div className="col-md-12 mb-3">
                                        <label>Location</label>
                                        <select
                                            id="location"
                                            value={form.location}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setForm({ ...form, location: value });
                                                validateField("location", value);
                                            }}
                                            className={`form-control ${errors.location ? "is-invalid" : ""}`}
                                            onBlur={(e) => validateField("location", e.target.value)}

                                        >
                                            <option value="">Location</option>
                                            {form.company === "UBI Services Ltd." && (
                                                <>
                                                    <option value="Head Office - Mumbai">Head Office - Mumbai</option>
                                                    <option value="Bangalore">Bangalore</option>
                                                </>
                                            )}
                                        </select>
                                        {errors.location && (
                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>
                                                Location is Required!
                                            </p>
                                        )}
                                    </div>

                                    <div className="col-md-12 mb-3">
                                        <label>Department Head</label>
                                        <select
                                            id="departmentHead"
                                            value={form.departmentHead}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setForm({ ...form, departmentHead: value });
                                                validateField("departmentHead", value);
                                            }}
                                            className={`form-control ${errors.departmentHead ? "is-invalid" : ""}`}
                                            onBlur={(e) => validateField("departmentHead", e.target.value)}

                                        >
                                            <option value="">Department Head</option>
                                            <option value="Admin">Admin Admin</option>
                                            <option value="Anjali Patle">Anjali Patle</option>
                                            <option value="Amit Kumar">Amit Kumar</option>
                                            <option value="Aniket Rane">Aniket Rane</option>
                                            <option value="Shubham Kadam">Shubham Kadam</option>
                                            <option value="Abhijieet Tawate">Abhijieet Tawate</option>
                                            <option value="Pravin Bildlan">Pravin Bildlan</option>
                                            <option value="Amit Pednekar">Amit Pednekar</option>
                                            <option value="Mahendra Chaudhary">Mahendra Chaudhary</option>
                                            <option value="Hamsa Dhwjaa">Hamsa Dhwjaa</option>
                                            <option value="Manoj Kumar Sinha">Manoj Kumar Sinha</option>
                                        </select>
                                        {errors.departmentHead && (
                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>
                                                Department Head is Required!
                                            </p>
                                        )}
                                    </div>

                                    <div className="text-start">
                                        <button type="submit" className="btn btn-sm add-btn">Save</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="col-12 col-lg-8">
                        <div className="card no-radius h-100">
                            <div className="card-header d-flex justify-content-between align-items-center text-white new-emp-bg">
                                <span>List All Departments</span>
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
                                                    <h5 className="modal-title">Edit Department</h5>
                                                    <button
                                                        type="button"
                                                        className="btn-close"
                                                        onClick={() => setShowEditModal(false)}
                                                    ></button>
                                                </div>
                                                <div className="modal-body">
                                                    <form onSubmit={handleSubmit}>
                                                        <div className="row">
                                                            <div className="col-md-12 mb-3">
                                                                <label>Name</label>
                                                                <input
                                                                    type="text"
                                                                    value={form.departmentName}
                                                                    onChange={(e) => {
                                                                        const { value } = e.target;
                                                                        setForm({ ...form, departmentName: value });
                                                                        validateField("departmentName", value);
                                                                    }}
                                                                    className={`form-control ${errors.departmentName ? "is-invalid" : ""}`}
                                                                    placeholder="Name"
                                                                    onBlur={(e) => validateField("departmentName", e.target.value)}

                                                                />
                                                                {errors.departmentName && (
                                                                    <p className="text-danger mb-0" style={{ fontSize: '13px' }}>
                                                                        Department Name is Required!
                                                                    </p>
                                                                )}
                                                            </div>

                                                            <div className="col-md-12 mb-3">
                                                                <label>Company</label>
                                                                <select
                                                                    id="company"
                                                                    value={form.company}
                                                                    onChange={(e) => {
                                                                        const { value } = e.target;
                                                                        setForm({ ...form, company: value, location: "" });
                                                                        validateField("company", value);
                                                                    }}
                                                                    className={`form-control ${errors.company ? "is-invalid" : ""}`}
                                                                    onBlur={(e) => validateField("company", e.target.value)}

                                                                >
                                                                    <option value="">Company</option>
                                                                    <option value="UBI Services Ltd.">UBI Services Ltd.</option>
                                                                </select>
                                                                {errors.company && (
                                                                    <p className="text-danger mb-0" style={{ fontSize: '13px' }}>
                                                                        Company Name is Required!
                                                                    </p>
                                                                )}
                                                            </div>

                                                            <div className="col-md-12 mb-3">
                                                                <label>Location</label>
                                                                <select
                                                                    id="location"
                                                                    value={form.location}
                                                                    onChange={(e) => {
                                                                        const { value } = e.target;
                                                                        setForm({ ...form, location: value });
                                                                        validateField("location", value);
                                                                    }}
                                                                    className={`form-control ${errors.location ? "is-invalid" : ""}`}
                                                                    onBlur={(e) => validateField("location", e.target.value)}

                                                                >
                                                                    <option value="">Location</option>
                                                                    {form.company === "UBI Services Ltd." && (
                                                                        <>
                                                                            <option value="Head Office - Mumbai">Head Office - Mumbai</option>
                                                                            <option value="Bangalore">Bangalore</option>
                                                                        </>
                                                                    )}
                                                                </select>
                                                                {errors.location && (
                                                                    <p className="text-danger mb-0" style={{ fontSize: '13px' }}>
                                                                        Location is Required!
                                                                    </p>
                                                                )}
                                                            </div>

                                                            <div className="col-md-12 mb-3">
                                                                <label>Department Head</label>
                                                                <select
                                                                    id="departmentHead"
                                                                    value={form.departmentHead}
                                                                    onChange={(e) => {
                                                                        const { value } = e.target;
                                                                        setForm({ ...form, departmentHead: value });
                                                                        validateField("departmentHead", value);
                                                                    }}
                                                                    className={`form-control ${errors.departmentHead ? "is-invalid" : ""}`}
                                                                    onBlur={(e) => validateField("departmentHead", e.target.value)}

                                                                >
                                                                    <option value="">Department Head</option>
                                                                    <option value="Admin">Admin Admin</option>
                                                                    <option value="Anjali Patle">Anjali Patle</option>
                                                                    <option value="Amit Kumar">Amit Kumar</option>
                                                                    <option value="Aniket Rane">Aniket Rane</option>
                                                                    <option value="Shubham Kadam">Shubham Kadam</option>
                                                                    <option value="Abhijieet Tawate">Abhijieet Tawate</option>
                                                                    <option value="Pravin Bildlan">Pravin Bildlan</option>
                                                                    <option value="Amit Pednekar">Amit Pednekar</option>
                                                                    <option value="Mahendra Chaudhary">Mahendra Chaudhary</option>
                                                                    <option value="Hamsa Dhwjaa">Hamsa Dhwjaa</option>
                                                                    <option value="Manoj Kumar Sinha">Manoj Kumar Sinha</option>
                                                                </select>
                                                                {errors.departmentHead && (
                                                                    <p className="text-danger mb-0" style={{ fontSize: '13px' }}>
                                                                        Department Head is Required!
                                                                    </p>
                                                                )}
                                                            </div>

                                                            <div className="text-start">
                                                                <button type="submit" className="btn btn-sm add-btn">Save</button>
                                                            </div>
                                                        </div>
                                                        <div className="text-end">
                                                            <button type="button" className="btn btn-sm btn-light me-2" onClick={() => { resetForm(); setShowEditModal(false) }}>Close</button>
                                                            <button type="submit" className="btn btn-sm add-btn" onClick={(e) => handleSubmit(e)}>Update</button>
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
                </div>
            </div>
        </div>
    );
};
export default Department;
