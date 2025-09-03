import React, { useState, useEffect, useRef } from 'react';
import DataTable from 'react-data-table-component';
import './organization.css';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { getOrgpolicy, createOrgpolicy, updateOrgpolicy, deleteOrgpolicy } from '../../api/orgpolicyApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OrgPolicies = () => {

    const [showModal, setShowModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [description, setDescription] = useState('');
    const [Orgpolicy, setOrgpolicy] = useState([]);
    const [paginated, setPaginated] = useState([]);
    const editorRef = useRef(null);
    const [editorKey, setEditorKey] = useState(0);
    const [form, setForm] = useState({
        company: '',
        title: '',
        addedBy: '',
        description: ''
    });


    const [editId, setEditId] = useState(null);

    const [errors, setErrors] = useState({});
    const validateForm = () => {
        let newErrors = {};
        const requiredFields = ["company", "title", "addedBy", "description"];

        requiredFields.forEach((field) => {
            if (!form[field] || form[field].toString().trim() === "") {
                newErrors[field] = `${field.replace(/([A-Z])/g, " $1")} is required`;
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };




    useEffect(() => {
        fetchOrgpolicy();
    }, []);

    const fetchOrgpolicy = async () => {
        try {
            const response = await getOrgpolicy();
            setOrgpolicy(response.data);
            paginate(response.data, currentPage);
        } catch (error) {
            console.error('Error fetching Orgpolicy:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {

            try {
                if (editId) {
                    await updateOrgpolicy(editId, form);
                    toast.success("Policy updated successfully!");

                } else {
                    await createOrgpolicy(form);
                    toast.success("Policy saved successfully!");

                }
                fetchOrgpolicy();
                setForm({ company: '', title: '', addedBy: '', description: '' });
                setEditId(null);
                setShowEditModal(false);
            } catch (err) {
                console.error("Error saving Orgpolicy:", err);
                toast.error("Policy failed to save!");

            }
        }
    };

    const emptyForm = {
        company: '',
        title: '',
        addedBy: '',
        description: ''
    };

    const resetForm = () => {
        setForm(emptyForm);
        setEditId(null);
        setShowEditModal(false);
    };

    const validateField = (fieldName, value = "") => {
        let error = "";

        const displayName = fieldName
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, str => str.toUpperCase());

        value = value?.toString() || "";

        switch (fieldName) {
            case "company":
                if (!value.trim()) error = `${displayName} is required`;
                break;

            case "title":
                if (!value.trim()) error = `${displayName} is required`;
                break;

            case "addedBy":
                if (!value.trim()) error = `${displayName} is required`;
                break;

            case "description":
                if (!value.trim()) error = `${displayName} is required`;
                break;

            default:
                break;
        }

        setErrors(prev => ({ ...prev, [fieldName]: error }));
        return error;
    };



    const handleEdit = (row) => {
        setForm({
            company: row.company,
            title: row.title,
            createdAt: row.createdAt,
            addedBy: row.addedBy,
            description: row.description
        });
        setEditId(row._id);
        setShowEditModal(true);
        setSelectedRow(row);
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this policy?");
        if (!confirmDelete) return;
        try {
            await deleteOrgpolicy(id);
            fetchOrgpolicy();
        } catch (err) {
            console.error("Error deleting policy:", err);
        }
    };



    const handleView = (row) => {
        setSelectedRow(row);
        setShowModal(true);
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
                        <i className="fas fa-eye"></i>
                    </button>
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
        { name: 'Title', selector: row => row.title, sortable: true },
        { name: 'Company', selector: row => row.company },
        {
            name: 'Created At',
            selector: row => new Date(row.createdAt).toLocaleString(),
            sortable: true
        },
        { name: 'Added By', selector: row => row.addedBy }
    ];

    // const data = [
    //     {
    //         action: '-',
    //         title: 'Smoke-free work environment',
    //         company: 'All Companies',
    //         createdAt: '28-Apr-2017',
    //         addedBy: 'Admin Admin'
    //     },
    //     {
    //         action: '-',
    //         title: 'Smoke-free work environment',
    //         company: 'All Companies',
    //         createdAt: '28-Apr-2017',
    //         addedBy: 'Admin Admin'
    //     },
    //     {
    //         action: '-',
    //         title: 'Smoke-free work environment',
    //         company: 'All Companies',
    //         createdAt: '28-Apr-2017',
    //         addedBy: 'Admin Admin'
    //     },
    //     {
    //         action: '-',
    //         title: 'Smoke-free work environment',
    //         company: 'All Companies',
    //         createdAt: '28-Apr-2017',
    //         addedBy: 'Admin Admin'
    //     },
    // ];

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

    const totalEntries = Orgpolicy.length;
    const totalPages = Math.ceil(totalEntries / rowsPerPage);
    console.log('Paginated data:', paginated);

    const paginate = (data, page) => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        setPaginated(data.slice(start, end));
        setCurrentPage(page);
    };

    const startEntry = (currentPage - 1) * rowsPerPage + 1;
    const endEntry = Math.min(currentPage * rowsPerPage, totalEntries);

    // const [showAddForm, setShowAddForm] = useState(false);

    // const toggleAddForm = () => {
    //     setShowAddForm((prev) => !prev);
    // };

    return (
        <div className="custom-container">
            <h5>Policies</h5>
            <p style={{ fontSize: '15px', color: 'rgb(98, 98, 98)' }}>
                <span style={{ color: 'red' }}>Home</span> / Policies
            </p>

            <div className="container-fluid px-3 mt-4">

                <div className="row g-4">

                    <div className="col-12 col-lg-4">
                        <div className="card no-radius h-100">
                            <div className="card-header d-flex justify-content-between align-items-center text-white new-emp-bg">
                                <span>Add New Policies</span>
                            </div>

                            <form className="p-3" onSubmit={handleSubmit}>
                                <div className="row">

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
                                                Company Name is required!
                                            </p>
                                        )}
                                    </div>

                                    <div className="col-md-12 mb-3">
                                        <label>Title</label>
                                        <input
                                            type="text"
                                            value={form.title}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setForm({ ...form, title: value });
                                                validateField("title", value);
                                            }}
                                            className={`form-control ${errors.title ? "is-invalid" : ""}`}
                                            placeholder="Title"
                                            onBlur={(e) => validateField("title", e.target.value)}
                                        />
                                        {errors.title && (
                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>
                                                Title is required!
                                            </p>
                                        )}
                                    </div>
                                    {/* 
                                    <div className="col-md-12 mb-3">
                                        <label>Document File</label>
                                        <input type="file" className="form-control" placeholder="Title" />
                                        <label style={{ fontSize: '12px' }}>Upload files only: html</label>
                                    </div> */}

                                    <div className="col-md-12 mb-3">
                                        <label>Added By</label>
                                        <select
                                            id="addedBy"
                                            value={form.addedBy}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                setForm({ ...form, addedBy: value, location: "" });
                                                validateField("addedBy", value);
                                            }}
                                            className={`form-control ${errors.addedBy ? "is-invalid" : ""}`}
                                            onBlur={(e) => validateField("addedBy", e.target.value)}
                                        >
                                            <option value="">Added By</option>
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
                                        {errors.addedBy && (
                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>
                                                This Field is required!
                                            </p>
                                        )}
                                    </div>

                                    <div className="col-md-12 mb-3">
                                        <label>Description</label>
                                        <div className={errors.description ? "is-invalid" : ""}>

                                            <CKEditor
                                                key={editorKey}
                                                editor={ClassicEditor}
                                                data={form.description}
                                                onReady={(editor) => {
                                                    editorRef.current = editor;
                                                }}
                                                onChange={(event, editor) => {
                                                    const newData = editor.getData();
                                                    setForm(prev => ({ ...prev, description: newData }));
                                                }}
                                            />
                                        </div>
                                        {errors.description && (
                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>
                                                Description is required!
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
                                <span>List All Policies</span>
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


                            {showModal && selectedRow && (
                                <div className="modal show fade d-block" tabIndex="-1" role="dialog">
                                    <div className="modal-dialog modal-dialog-centered" role="document">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title">View Policy</h5>
                                                <button
                                                    type="button"
                                                    className="btn-close"
                                                    onClick={() => setShowModal(false)}
                                                ></button>
                                            </div>
                                            <div className="modal-body">
                                                <p><strong>Company:</strong> {selectedRow.company}</p>
                                                <p><strong>Title:</strong> {selectedRow.title}</p>
                                                <p>
                                                    <strong>Description:</strong> {(selectedRow?.description || '').replace(/<[^>]+>/g, '')}
                                                </p>

                                            </div>
                                            <div className="modal-footer">
                                                <button
                                                    type="button"
                                                    className="btn btn-secondary"
                                                    onClick={() => setShowModal(false)}>
                                                    Close
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}


                            {showEditModal && selectedRow && (

                                <>

                                    <div className="custom-backdrop"></div>


                                    <div className="modal show fade d-block" tabIndex="-1">
                                        <div className="modal-dialog modal-dialog-centered edit-modal">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h5 className="modal-title">Edit Policy</h5>
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
                                                                        Company Name is required!
                                                                    </p>
                                                                )}
                                                            </div>

                                                            <div className="col-md-12 mb-3">
                                                                <label>Title</label>
                                                                <input
                                                                    type="text"
                                                                    value={form.title}
                                                                    onChange={(e) => {
                                                                        const { value } = e.target;
                                                                        setForm({ ...form, title: value });
                                                                        validateField("title", value);
                                                                    }}
                                                                    className={`form-control ${errors.title ? "is-invalid" : ""}`}
                                                                    placeholder="Name"
                                                                    onBlur={(e) => validateField("title", e.target.value)}
                                                                />
                                                                {errors.title && (
                                                                    <p className="text-danger mb-0" style={{ fontSize: '13px' }}>
                                                                        Title is required!
                                                                    </p>
                                                                )}
                                                            </div>
                                                            {/* 
                                    <div className="col-md-12 mb-3">
                                        <label>Document File</label>
                                        <input type="file" className="form-control" placeholder="Title" />
                                        <label style={{ fontSize: '12px' }}>Upload files only: html</label>
                                    </div> */}

                                                            <div className="col-md-12 mb-3">
                                                                <label>Added By</label>
                                                                <select
                                                                    id="addedBy"
                                                                    value={form.addedBy}
                                                                    onChange={(e) => {
                                                                        const { value } = e.target;
                                                                        setForm({ ...form, addedBy: value, location: "" });
                                                                        validateField("addedBy", value);
                                                                    }}
                                                                    className={`form-control ${errors.addedBy ? "is-invalid" : ""}`}
                                                                    onBlur={(e) => validateField("addedBy", e.target.value)}
                                                                >
                                                                    <option value="">Added By</option>
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
                                                                {errors.addedBy && (
                                                                    <p className="text-danger mb-0" style={{ fontSize: '13px' }}>
                                                                        This Field is required!
                                                                    </p>
                                                                )}
                                                            </div>

                                                            <div className="col-md-12 mb-3">
                                                                <label>Description</label>
                                                                <div className={errors.description ? "is-invalid" : ""}>

                                                                    <CKEditor
                                                                        editor={ClassicEditor}
                                                                        data={form.description || ""}
                                                                        onChange={(event, editor) => {
                                                                            const newData = editor.getData();
                                                                            setForm({ ...form, description: newData });
                                                                        }}
                                                                        onBlur={() => validateField("description", form.description)}
                                                                    />
                                                                </div>
                                                                {errors.description && (
                                                                    <p className="text-danger mb-0" style={{ fontSize: '13px' }}>
                                                                        Description is required!
                                                                    </p>
                                                                )}
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
                </div>
            </div>

        </div>
    );
};
export default OrgPolicies;
