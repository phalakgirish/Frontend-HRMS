import React from "react";
import { useState,useRef } from "react";
import DataTable from 'react-data-table-component';

const FamilyDetails = ({ form, setForm, handleSubmit }) => {

        const [showModal, setShowModal] = useState(false);
        const [selectedRow, setSelectedRow] = useState(null);
        const [showEditModal, setShowEditModal] = useState(false);
        const [description, setDescription] = useState('');
        const editorRef = useRef(null);
        const [editorKey, setEditorKey] = useState(0);
    
        //from backend
        const [Promotion, setPromotion] = useState([]);
        const [paginated, setPaginated] = useState([]);
    
        const [editId, setEditId] = useState(null);
    
        // const [form, setForm] = useState({
        //     employeeName: '',
        //     PromotionTitle: '',
        //     PromotionDate: '',
        //     addedBy: '',
        //     description: ''
        // });
    
        // const [errors, setErrors] = useState({});
     
        // const validateForm = () => {
        //     let newErrors = {};
    
        //     Object.keys(form).forEach((field) => {
        //         if (!form[field] || form[field].toString().trim() === "") {
        //             newErrors[field] = `${field.replace(/([A-Z])/g, " $1")} is required`;
        //         }
        //     });
    
        //     setErrors(newErrors);
        //     return Object.keys(newErrors).length === 0;
        // };
    
        // useEffect(() => {
        //     fetchPromotion();
        // }, []);
    
        // const fetchPromotion = async () => {
        //     try {
        //         const response = await getPromotion();
        //         setPromotion(response.data);
        //         paginate(response.data, currentPage);
        //     } catch (error) {
        //         console.error('Error fetching Promotion:', error);
        //     }
        // };
    
        // const validateField = (fieldName, value = "") => {
        //     let error = "";
    
        //     let displayName = fieldName
        //         .replace(/([A-Z])/g, " $1")
        //         .replace(/^./, str => str.toUpperCase());
    
        //     value = value.toString();
    
        //     switch (fieldName) {
        //         case "employeeName":
        //             if (!value.trim()) error = `${displayName} is required`;
        //             break;
    
        //         case "PromotionTitle":
        //             if (!value.trim()) error = `${displayName} is required`;
        //             break;
    
        //         case "PromotionDate":
        //             if (!value.trim()) error = `${displayName} is required`;
        //             break;
    
        //         case "description":
        //             if (!value.trim()) error = `${displayName} is required`;
        //             break;
    
        //         case "addedBy":
        //             if (!value.trim()) error = `${displayName} is required`;
        //             break;
    
        //         default:
        //             break;
        //     }
    
        //     setErrors(prev => ({ ...prev, [fieldName]: error }));
        //     return error;
        // };
    
    
        // const handleSubmit = async (e) => {
        //     e.preventDefault();
        //     if (validateForm()) {
    
        //         try {
        //             const payload = { ...form, description };
        //             if (editId) {
        //                 await updatePromotion(editId, form);
        //                 toast.success("Promotion updated successfully!");
    
        //             } else {
        //                 await createPromotion(form);
        //                 toast.success("Promotion saved successfully!");
    
        //             }
        //             fetchPromotion();
        //             setForm({
        //                 employeeName: '',
        //                 PromotionTitle: '',
        //                 PromotionDate: '',
        //                 addedBy: '',
        //                 description: ''
        //             });
        //             setDescription("");
        //             setEditId("");
        //             setShowEditModal(false);
        //         } catch (err) {
        //             console.error("Error saving Promotion:", err);
        //             toast.error("Promotion failedd to save!");
    
        //         }
        //     }
        // };
    
    
    
        // const handleEdit = (row) => {
        //     setForm({
        //         employeeName: row.employeeName,
        //         PromotionTitle: row.PromotionTitle,
        //         PromotionDate: row.PromotionDate,
        //         addedBy: row.addedBy,
        //         description: row.description
        //     });
        //     setEditId(row._id);
        //     setShowEditModal(true);
        //     setSelectedRow(row);
        // };
    
        // const handleDelete = async (id) => {
        //     const confirmDelete = window.confirm("Are you sure you want to delete this Promotion?");
        //     if (!confirmDelete) return;
        //     try {
        //         await deletePromotion(id);
        //         fetchPromotion();
        //     } catch (err) {
        //         console.error("Error deleting Promotion:", err);
        //     }
        // };
    
        const handleView = (row) => {
            setSelectedRow(row);
            setShowModal(true);
        };
    
    
        // const emptyForm = {
        //     employeeName: '',
        //     PromotionTitle: '',
        //     PromotionDate: '',
        //     addedBy: '',
        //     description: ''
        // };
    
        // const resetForm = () => {
        //     setForm(emptyForm);
        //     setEditId(null);
        //     setShowEditModal(false);
        // };
        
    
    
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
                            // onClick={() => handleEdit(row)}
                        >
                            <i className="fas fa-edit"></i>
                        </button>
                        <button
                            className="btn btn-danger btn-sm"
                            // onClick={() => handleDelete(row._id)}
                        >
                            <i className="fas fa-trash-alt text-white"></i>
                        </button>
                    </div>
                ),
                ignoreRowClick: true,
                allowOverflow: true,
                button: true,
            },
            { name: 'Name', selector: row => row.name },
            { name: 'Relation', selector: row => row.relation },
            { name: 'Email', selector: row => row.email },
            { name: 'Mobile', selector: row => row.mobile },
            { name: 'Date of Birth', selector: row => row.dateOfBirth }

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
    
        const totalEntries = Promotion.length;
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
    
        const [showAddForm, setShowAddForm] = useState(false);
    
        const toggleAddForm = () => {
            setShowAddForm((prev) => !prev);
        };

    return (
        <div>
            <div className="container-fluid mt-4">
                <form>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label>Relation</label>
                                <select id="relation"
                                    className="form-control">
                                    <option value="">Select One</option>
                                    <option value="Self">Self</option>
                                    <option value="Parent">Parent</option>
                                    <option value="Spouse">Spouse</option>
                                    <option value="Child">Child</option>
                                    <option value="Sibling">Sibling</option>
                                    <option value="In Laws">In Laws</option>
                                </select>
                            </div>

                            <div className="mb-3 d-flex gap-3 align-items-center">
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="primaryContact"
                                        style={{ width: "16px", height: "16px" }}
                                    />
                                    <label className="form-check-label ms-2" htmlFor="primaryContact">
                                        Primary Contact
                                    </label>
                                </div>

                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="dependant"
                                        style={{ width: "16px", height: "16px" }}
                                    />
                                    <label className="form-check-label ms-2" htmlFor="dependant">
                                        Dependant
                                    </label>
                                </div>
                            </div>

                            <div className="mb-3">
                                <label>Name</label>
                                <input type="text" className="form-control" placeholder="Name" />
                            </div>

                            <div className="mb-3 col-md-12">
                                <label>Phone</label>
                                <div className="d-flex gap-4">
                                    <input type="text" className="form-control" placeholder="Work" />
                                    <input type="text" className="form-control" style={{ width: "150px" }} placeholder="Ext" />
                                </div>
                            </div>

                            <div className="mb-3 col-md-12">
                                <input type="text" className="form-control mb-3" placeholder="Mobile" />
                                <input type="text" className="form-control" placeholder="Home" />
                            </div>

                            <div className="mb-3 col-md-12">
                                <label>Date of Birth</label>
                                <input type="date" className="form-control" placeholder="Mobile" />
                            </div>


                        </div>

                        {/* Right Column */}
                        <div className="col-md-6">

                            <div className="mb-3">
                                <label>Email</label>
                                <input type="text" className="form-control mb-3" placeholder="Work" />
                                <input type="text" className="form-control" placeholder="Personal" />
                            </div>

                            <div className="mb-3">
                                <label>Address</label>
                                <input type="text" className="form-control mb-3" placeholder="Address Line 1" />
                                <input type="text" className="form-control" placeholder="Address Line 2" />
                            </div>

                            <div className="row mb-3">
                                <div className="col-md-4">
                                    <input type="text" className="form-control" placeholder="City" />
                                </div>
                                <div className="col-md-4">
                                    <input type="text" className="form-control" placeholder="State" />
                                </div>
                                <div className="col-md-4">
                                    <input type="text" className="form-control" placeholder="Zip Code" />
                                </div>
                            </div>

                            <div className="mb-3">
                                <label>Country</label>
                                <select className="form-select">
                                    <option value="">Select Country</option>
                                    <option value="US">United States</option>
                                    <option value="CA">Canada</option>
                                    <option value="GB">United Kingdom</option>
                                    <option value="AU">Australia</option>
                                    <option value="IN">India</option>
                                    <option value="DE">Germany</option>
                                    <option value="FR">France</option>
                                    <option value="JP">Japan</option>
                                    <option value="CN">China</option>
                                    <option value="BR">Brazil</option>
                                    <option value="ZA">South Africa</option>
                                    <option value="RU">Russia</option>
                                    <option value="MX">Mexico</option>
                                    <option value="IT">Italy</option>
                                    <option value="ES">Spain</option>
                                </select>
                            </div>
                        </div>

                    </div>

                    <div className="text-start mb-4">
                        <button type="submit" className="btn btn-sm add-btn">Save</button>
                    </div>
                </form>
            </div>

            <div className="card no-radius">
                <div className="card-header d-flex justify-content-between align-items-center text-white new-emp-bg">
                    <span>List All Member</span>
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

                {/* {showModal && selectedRow && (
                    <div className="modal show fade d-block" tabIndex="-1" role="dialog">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">View Promotion</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setShowModal(false)}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <p><strong>Promotion For:</strong> {selectedRow.employeeName}</p>
                                    <p><strong>Promotion Title:</strong> {selectedRow.PromotionTitle}</p>
                                    <p><strong>Promotion Date:</strong> {selectedRow.PromotionDate}</p>
                                    <p>
                                        <strong>Description:</strong> {selectedRow.description.replace(/<[^>]+>/g, '')}
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
                                        <h5 className="modal-title">Edit Promotion</h5>
                                        <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                                    </div>
                                    <div className="modal-body">
                                        <form onSubmit={handleSubmit}>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="mb-3">
                                                        <label>Promotion For</label>
                                                        <select id="resignEmployee" value={form.employeeName}
                                                            onChange={(e) => {
                                                                const { value } = e.target;
                                                                setForm({ ...form, employeeName: value });
                                                                validateField("employeeName", value);
                                                            }}
                                                            className={`form-control ${errors.employeeName ? "is-invalid" : ""}`}
                                                            onBlur={(e) => validateField("employeeName", e.target.value)}
                                                        >
                                                            <option value="">Select Department</option>
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
                                                        {errors.employeeName && (
                                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Employee Name is required!</p>)}
                                                    </div>

                                                    <div className="mb-3">
                                                        <label>Promotion Title</label>
                                                        <input type="text" value={form.PromotionTitle}
                                                            onChange={(e) => {
                                                                const { value } = e.target;
                                                                setForm({ ...form, PromotionTitle: value });
                                                                validateField("PromotionTitle", value);
                                                            }}
                                                            className={`form-control ${errors.PromotionTitle ? "is-invalid" : ""}`}
                                                            placeholder="Promotion Title"
                                                            onBlur={(e) => validateField("PromotionTitle", e.target.value)}

                                                        />
                                                        {errors.PromotionTitle && (
                                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Promotion Title is required!</p>)}
                                                    </div>

                                                    <div className="mb-3">
                                                        <label>Promotion Date</label>
                                                        <input type="date" value={form.PromotionDate}
                                                            onChange={(e) => {
                                                                const { value } = e.target;
                                                                setForm({ ...form, PromotionDate: value });
                                                                validateField("PromotionDate", value);
                                                            }}
                                                            className={`form-control ${errors.PromotionDate ? "is-invalid" : ""}`}
                                                            placeholder="Promotion Date"
                                                            onBlur={(e) => validateField("PromotionDate", e.target.value)}

                                                        />
                                                        {errors.PromotionDate && (
                                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>Promotion Date is required!</p>)}
                                                    </div>

                                                </div>

                                                <div className="col-md-6">

                                                    <div className="mb-3">
                                                        <label>Added By</label>
                                                        <select id="addedBy" value={form.addedBy}
                                                            onChange={(e) => {
                                                                const { value } = e.target;
                                                                setForm({ ...form, addedBy: value });
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
                                                        </select>
                                                        {errors.addedBy && (
                                                            <p className="text-danger mb-0" style={{ fontSize: '13px' }}>This field is required!</p>)}
                                                    </div>

                                                    <label>Description</label>
                                                    <CKEditor
                                                        editor={ClassicEditor}
                                                        data={form.description || ""}
                                                        onChange={(event, editor) => {
                                                            const newData = editor.getData();
                                                            setForm({ ...form, description: newData });
                                                        }}
                                                        onBlur={() => validateField("description", form.description)}
                                                    />
                                                    {errors.description && (
                                                        <p className="text-danger mb-0" style={{ fontSize: '13px' }}>
                                                            Description is Required
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
                )} */}


            </div>
        </div>

    );
};
export default FamilyDetails;