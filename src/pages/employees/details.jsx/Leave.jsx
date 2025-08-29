import React from "react";
import { useState, useRef } from "react";
import DataTable from 'react-data-table-component';

const Leave = ({ form, setForm, handleSubmit }) => {

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

    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleBrowseClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

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
        { name: 'Account Title', selector: row => row.documentType },
        { name: 'Account Number', selector: row => row.title },
        { name: 'Bank Name', selector: row => row.notificationEmail },
        { name: 'Bank Code', selector: row => row.notificationEmail },
        { name: 'Bank Branch', selector: row => row.notificationEmail }


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

     const leaveStats = [
        { type: 'Casual Leave', taken: 0, total: 15 },
        { type: 'Medical Leave', taken: 1, total: 2 },
        { type: 'Maternity Leave', taken: 50, total: 90 },
        { type: 'Half Day', taken: 2, total: 5 },
        { type: 'COM OFF', taken: 4, total: 10 },
        { type: 'Casual Leave', taken: 0, total: 10 },
        { type: 'Sick Leave', taken: 6, total: 10 },
        { type: 'Medical Leave', taken: 0, total: 5 },
        { type: 'Earning Leave', taken: 0, total: 57.75 },
    ];

    return (
        <div>
            {/* <div className="container-fluid mt-4">
                <form>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label>Account Title</label>
                                <input type="text" className="form-control" placeholder="Account Title" />
                            </div>

                            <div className="mb-3">
                                <label>Account Number</label>
                                <input type="text" className="form-control" placeholder="Account Number" />                            </div>
                        </div>

                        <div className="col-md-6">

                            <div className="mb-3">
                                <label>Bank Name</label>
                                <input type="text" className="form-control" placeholder="Bank Name" />
                            </div>

                            <div className="mb-3">
                                <label>Bank Code</label>
                                <input type="text" className="form-control" placeholder="Bank Code" />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label>Bank Branch</label>
                            <input type="text" className="form-control" placeholder="Bank Branch" />
                        </div>

                        <div className="mb-3">
                            <label>Document File</label>
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: "none" }}
                                onChange={handleFileChange}
                                accept="image/*"
                            />
                            <div className="text-start">
                                <button type="button" className="btn btn-sm add-btn" onClick={handleBrowseClick}>
                                    Browse
                                </button>
                            </div>
                        </div>

                    </div>

                    <div className="text-start mb-4">
                        <button type="submit" className="btn btn-sm add-btn">Save</button>
                    </div>
                </form>
            </div> */}

            <div className="card no-radius">
                {/* <div className="card-header d-flex justify-content-between align-items-center text-white new-emp-bg"> */}
                    {/* <span>List All Leaves</span> */}
                    {/* <button className="btn btn-sm add-btn" onClick={toggleAddForm}>{showAddForm ? '- Hide' : '+ Add New'}</button> */}
                {/* </div> */}

 <div className="card-body mt-2">
                            {leaveStats.map((item, index) => {
                                const percent = (item.taken / item.total) * 100;
                                return (
                                    <div key={index} className="mb-3">
                                        <div className="fw-semibold small">{item.type} ({item.taken}/{item.total})</div>
                                        <div className="progress mt-2" style={{ height: '8px' }}>
                                            <div
                                                className="progress-bar bg-secondary"
                                                role="progressbar"
                                                style={{ width: `${percent}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
        


            </div>
        </div>

    );
};
export default Leave;