import React from "react";
import { useState, useRef } from "react";
import DataTable from 'react-data-table-component';

const Form16 = ({ form, setForm, handleSubmit }) => {

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
        { name: 'Assets Type', selector: row => row.documentType },
        { name: 'Brand', selector: row => row.title },
        { name: 'Model No', selector: row => row.notificationEmail },
        { name: 'Serial No', selector: row => row.notificationEmail },
        { name: 'Cost', selector: row => row.notificationEmail },
        { name: 'Quantity', selector: row => row.notificationEmail },
        { name: 'Insurance', selector: row => row.notificationEmail }

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

    const [rows, setRows] = useState([{ id: 1 }]);

    const addRow = () => {
        setRows([...rows, { id: rows.length + 1 }]);
    };

    return (
        <div>
            <div className="container-fluid mt-4">
                <form>

                    <div className="text-center fw-bold fs-5">Form No. 16 <br />
                        [See rule 13(1)(a)] <br />
                        PART A</div>
                    <div className="row gx-3">

                        <div className="col-md-12 border p-2 rounded">
                            <div
                                style={{ fontSize: '14px', padding: '12px 20px' }}
                                className="text-center fw-bold bg-light bg-light-grey"
                            >
                                Certificate under section 203 of the Income-tax Act, 1961 for tax deducted at source on salary
                            </div>


                            {/* <h5>Monthly</h5><hr />
                            <h6>A. SALARY</h6><hr /> */}

                            <div className="row mb-3 mt-3">
                                <label className="col-sm-5 col-form-label">Certificate No.</label>
                                <label className="col-sm-5 col-form-label">Last Update On</label>
                            </div> <hr />


                            <div className="row mb-3">
                                <label className="col-sm-5 col-form-label">ABCDEFGH</label>
                                <div className="col-sm-6">
                                    <input type="date" className="form-control" />
                                </div>
                            </div> <hr />

                            <div className="row mb-3 mt-3">
                                <label className="col-sm-5 col-form-label">Name and address of the Employer	</label>
                                <label className="col-sm-5 col-form-label">Name and address of the Employee</label>
                            </div> <hr />

                            <div className="row mb-3 mt-3">
                                <label className="col-sm-5 col-form-label">UBI Services Ltd. <br />
                                    504 - 506 Centrum - Commercial Offices, Wagle Industrial Estate, Thane, Maharashtra 400604
                                    Mumbai
                                    Maharashtra 400064</label>
                                <label className="col-sm-5 col-form-label">Anjali Patle <br />
                                    Flat No. 1004, Nilgiri Apartment, Cosmos Hills, Upvan, Thane (W) Maharashtra - 400606</label>
                            </div> <hr />

                            <div className="row mb-3 mt-3 fw-bold">
                                <label className="col-sm-3 col-form-label">PAN of the Deductor</label>
                                <label className="col-sm-3 col-form-label">TAN of the Deductor</label>
                                <label className="col-sm-3 col-form-label">PAN of the Employee	</label>
                                <label className="col-sm-3 col-form-label">Employee Reference No. provided by the <br /> Employer(If available)</label>
                            </div> <hr />

                            <div className="row mb-3 mt-3">
                                <label className="col-sm-3 col-form-label">AB12CD34EF</label>
                                <label className="col-sm-3 col-form-label">MUM1234567</label>
                                <label className="col-sm-3 col-form-label">MUM1234567</label>
                                <div className="col-sm-2">
                                    <input type="text" className="form-control" placeholder="0" />
                                </div>
                            </div> <hr />

                            <div className="row mb-3 mt-3 fw-bold">
                                <label className="col-sm-3 col-form-label">CIT(TDS)</label>
                                <label className="col-sm-3 col-form-label"></label>
                                <label className="col-sm-3 col-form-label">Assessment Year</label>
                                <label className="col-sm-3 col-form-label">Period with the Employer</label>
                            </div> <hr />

                            <div className="row mb-3 mt-3">
                                <div className="col-sm-6">
                                    <textarea className="form-control" rows="3" placeholder="Enter text..." ></textarea>
                                </div>

                                <div className="col-sm-2">
                                    <input type="text" className="form-control" placeholder="0" />
                                </div>
                                <div className="col-sm-2">
                                    <input type="text" className="form-control" placeholder="0" />
                                </div>
                                <div className="col-sm-2">
                                    <input type="text" className="form-control" placeholder="0" />
                                </div>
                            </div>
                        </div>

                        <div className="col-md-12 border p-2 rounded mt-3">
                            <div
                                style={{ fontSize: '14px', padding: '12px 20px' }}
                                className="text-center fw-bold bg-light bg-light-grey"
                            >
                                Summary of amount paid/credited and tax deducted at source thereon in respect of the employee
                            </div>

                            <div className="row mb-3 mt-3 fw-bold">
                                <label className="col-sm-2 col-form-label">Quarter(s)</label>
                                <label className="col-sm-3 col-form-label">Receipt Numbers of original quarterly statements of TDS under sub-section(3) of section 200</label>
                                <label className="col-sm-2 col-form-label">Amount paid/credited</label>
                                <label className="col-sm-2 col-form-label">Amount of tax deducted(Rs.)</label>
                                <label className="col-sm-3 col-form-label">Amount of tax deposited/remitted(Rs.)</label>
                            </div> <hr />

                            <div className="row mb-3 mt-3">
                                <div className="col-sm-2">
                                    <input type="text" className="form-control" placeholder="Q1" disabled />
                                </div>
                                <div className="col-sm-3">
                                    <input type="text" className="form-control" placeholder="" />
                                </div>
                                <div className="col-sm-2">
                                    <input type="text" className="form-control" placeholder="0" />
                                </div>
                                <div className="col-sm-2">
                                    <input type="text" className="form-control" placeholder="0" />
                                </div>
                                <div className="col-sm-3">
                                    <input type="text" className="form-control" placeholder="0" />
                                </div>
                            </div> <hr />

                            <div className="row mb-3 mt-3">
                                <div className="col-sm-2">
                                    <input type="text" className="form-control" placeholder="Q2" disabled />
                                </div>
                                <div className="col-sm-3">
                                    <input type="text" className="form-control" placeholder="" />
                                </div>
                                <div className="col-sm-2">
                                    <input type="text" className="form-control" placeholder="0" />
                                </div>
                                <div className="col-sm-2">
                                    <input type="text" className="form-control" placeholder="0" />
                                </div>
                                <div className="col-sm-3">
                                    <input type="text" className="form-control" placeholder="0" />
                                </div>
                            </div> <hr />

                            <div className="row mb-3 mt-3">
                                <div className="col-sm-2">
                                    <input type="text" className="form-control" placeholder="Q3" disabled />
                                </div>
                                <div className="col-sm-3">
                                    <input type="text" className="form-control" placeholder="" />
                                </div>
                                <div className="col-sm-2">
                                    <input type="text" className="form-control" placeholder="0" />
                                </div>
                                <div className="col-sm-2">
                                    <input type="text" className="form-control" placeholder="0" />
                                </div>
                                <div className="col-sm-3">
                                    <input type="text" className="form-control" placeholder="0" />
                                </div>
                            </div> <hr />

                            <div className="row mb-3 mt-3">
                                <div className="col-sm-2">
                                    <input type="text" className="form-control" placeholder="Q4" disabled />
                                </div>
                                <div className="col-sm-3">
                                    <input type="text" className="form-control" placeholder="" />
                                </div>
                                <div className="col-sm-2">
                                    <input type="text" className="form-control" placeholder="0" />
                                </div>
                                <div className="col-sm-2">
                                    <input type="text" className="form-control" placeholder="0" />
                                </div>
                                <div className="col-sm-3">
                                    <input type="text" className="form-control" placeholder="0" />
                                </div>
                            </div> <hr />

                            <div className="row mb-3 mt-3">
                                <label className="col-sm-2 col-form-label fw-bold">Total</label>

                                <div className="col-sm-3">
                                    {/* <input type="text" className="form-control" placeholder="" /> */}
                                </div>
                                <div className="col-sm-2">
                                    <input type="text" className="form-control" placeholder="0" readOnly />
                                </div>
                                <div className="col-sm-2">
                                    <input type="text" className="form-control" placeholder="0" readOnly />
                                </div>
                                <div className="col-sm-3">
                                    <input type="text" className="form-control" placeholder="0" readOnly />
                                </div>
                            </div> <hr />
                        </div>

                        <div className="col-md-12 border p-2 rounded mt-3">
                            <div
                                style={{ fontSize: '14px', padding: '12px 20px' }}
                                className="text-center fw-bold bg-light bg-light-grey"
                            >
                                I. DETAILS OF TAX DEDUCTED AND DEPOSITED IN THE CENTRAL GOVERNMENT ACCOUNT THROUGH BOOK ADJUSTMENT
                                The deductor to provide payment wise details of tax deducted and deposited with respect to the deductee
                            </div>

                            <div className="row mb-3 mt-3 fw-bold">
                                <label className="col-sm-1 col-form-label">Sr. No.</label>
                                <label className="col-sm-2 col-form-label">Tax deposited in respect of the deductee (Rs.)</label>

                                <div className="col-sm-7">
                                    <div className="row">
                                        <label className="col-sm-12 col-form-label text-center">Book Identification Number (BIN)</label>
                                        <hr className="mt-1 mb-2" />
                                        <label className="col-sm-3 col-form-label">Receipt numbers of Form No. 24G</label>
                                        <label className="col-sm-3 col-form-label">DDO serial number in Form No. 24G</label>
                                        <label className="col-sm-3 col-form-label">Date of transfer voucher dd/mm/yyyy</label>
                                        <label className="col-sm-3 col-form-label">Status of matching with Form No. 24G</label>
                                    </div>
                                </div>
                            </div>
                            <hr />

                            {rows.map((row, index) => (
                                <div className="row mb-3 mt-3" key={row.id}>
                                    <div className="col-sm-1 d-flex align-items-center">
                                        <label>{index + 1}</label>
                                    </div>

                                    <div className="col-sm-2">
                                        <input type="text" className="form-control" placeholder="0" />
                                    </div>

                                    <div className="col-sm-7">
                                        <div className="row">
                                            <div className="col-sm-3">
                                                <input type="text" className="form-control" />
                                            </div>
                                            <div className="col-sm-3">
                                                <input type="date" className="form-control" />
                                            </div>
                                            <div className="col-sm-3">
                                                <input type="date" className="form-control" />
                                            </div>
                                            <div className="col-sm-3">
                                                <input type="text" className="form-control" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="row mb-3">
                                <div className="col-sm-12 text-end">
                                    <button
                                        type="button"
                                        className="btn btn-sm add-btn"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            addRow();
                                        }}
                                    >
                                        Add New
                                    </button>
                                </div>
                            </div>
                            <hr />

                            <div className="row mb-3 mt-3 fw-bold">
                                <label className="col-sm-2 col-form-label">Total(Rs).</label>
                                <div className="col-sm-2">
                                    <input type="text" className="form-control" placeholder="0" readOnly />
                                </div>
                            </div>



                        </div>

                        <div className="col-md-12 border p-2 rounded mt-3">
                            <div
                                style={{ fontSize: '14px', padding: '12px 20px' }}
                                className="text-center fw-bold bg-light bg-light-grey"
                            >
                                II. DETAILS OF TAX DEDUCTED AND DEPOSITED IN THE CENTRAL GOVERNMENT ACCOUNT THROUGH CHALLAN
                                The deductor to provide payment wise details of tax deducted and deposited with respect to the deductee
                            </div>

                            <div className="row mb-3 mt-3 fw-bold">
                                {/* Sr No */}
                                <label className="col-sm-1 col-form-label">Sr. No.</label>

                                {/* Tax Deposited */}
                                <label className="col-sm-2 col-form-label">
                                    Tax deposited in respect of the deductee (Rs.)
                                </label>

                                {/* CIN Section */}
                                <div className="col-sm-9">
                                    <div className="row">
                                        {/* Main CIN Heading */}
                                        <label className="col-sm-12 col-form-label text-center">
                                            Challan Identification Number (CIN)
                                        </label>
                                        <hr className="mt-1 mb-2" />

                                        {/* Sub-labels */}
                                        <label className="col-sm-2 col-form-label">BSR Code</label>
                                        <label className="col-sm-3 col-form-label">Date (dd/mm/yyyy)</label>
                                        <label className="col-sm-2 col-form-label">Challan No.</label>
                                        <label className="col-sm-2 col-form-label">Status</label>
                                        <label className="col-sm-2 col-form-label">Extra</label>
                                    </div>
                                </div>
                            </div>
                            <hr />

                            {[...Array(12)].map((_, i) => (
                                <div key={i}>
                                    <div className="row mb-3">
                                        <div className="col-sm-1">
                                            <label>{i + 1}</label>
                                        </div>

                                        <div className="col-sm-2">
                                            <input type="text" className="form-control" placeholder="0" />
                                        </div>

                                        <div className="col-sm-9">
                                            <div className="row">
                                                <div className="col-sm-2">
                                                    <input type="text" className="form-control" />
                                                </div>
                                                <div className="col-sm-3">
                                                    <input type="date" className="form-control" />
                                                </div>
                                                <div className="col-sm-2">
                                                    <input type="text" className="form-control" />
                                                </div>
                                                <div className="col-sm-2">
                                                    <input type="text" className="form-control" />
                                                </div>
                                                <div className="col-sm-2">
                                                    <input type="text" className="form-control" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <hr />
                                </div>
                            ))}

                            <div className="row mb-3 mt-3 fw-bold">
                                <label className="col-sm-2 col-form-label">Total(Rs).</label>
                                <div className="col-sm-2">
                                    <input type="text" className="form-control" placeholder="0" readOnly />
                                </div>
                            </div>


                        </div>

                        <div className="col-md-12 border p-2 rounded">
                            <div
                                style={{ fontSize: '14px', padding: '12px 20px' }}
                                className="text-center fw-bold bg-light"
                            >
                                Verification
                            </div>

                            <div className="row mb-3 mt-3">
                                <label className="col-sm-12 col-form-label">I, ...................... son/daughter of .................. working in the capacity of ...................(designation) do hereby certify that a sum of Rs. [Rs. (in words)] has been deducted and deposited to the credit of the Central Government. I further certify that the information given above is true, complete and correct and is based on the books of account, documents, TDS Statements, TDS Deposited and other available records.</label>
                            </div> <hr />


                            <div className="row mb-3">
                                <label className="col-sm-1 col-form-label">Place :</label>
                                <div className="col-sm-3">
                                    <label className="mt-2">Mumbai</label>
                                </div>
                            </div>
                            <hr className="w-50" />

                            <div className="row mb-3 align-items-center">
                                <label className="col-sm-1 col-form-label">Date :</label>
                                <div className="col-sm-2">
                                    <label className="mt-2">29-08-2025</label>
                                </div>
                                <div className="col-sm-7 text-end">
                                    <label className="mt-2">(Signature of person responsible for deduction of tax)</label>
                                </div>
                            </div>
                            <hr />

                            {/* Designation + Full Name Row */}
                            <div className="row mb-3 align-items-center">
                                <label className="col-sm-2 col-form-label">Designation :</label>
                                <div className="col-sm-2">
                                    <label className="mt-2"></label>
                                </div>
                                <div className="col-sm-2 text-end ms-5">
                                    {/* <hr className="mt-1 mb-1" /> */}
                                    <label className="mt-2">Full Name :</label>
                                    <label className="mt-2"></label>
                                </div>
                            </div>

                        </div>

                        <div className="col-md-12 border p-2 rounded">

                            <div className="text-start fw-bold">Notes:</div>
                            <div className="row mb-3 mt-3 px-4" style={{ fontSize: "14px" }}>
                                <ol>
                                    <li>Government deductors to fill information in item I if tax is paid without production of an income-tax challan and in item II if tax is paid accompanied by an income-tax challan.</li>
                                    <li>Non-Government deductors to fill information in item II.</li>
                                    <li>The deductor shall furnish the address of the Commissioner of Income-tax(TDS) having jurisdiction as regards TDS statements of the assessee.</li>
                                    <li>If an assessee is employed under one employer only during the year, certificate in Form No.16 issued for the quarter ending on 31st March of the financial year shall contain the details of tax deducted and deposited for all the quarters of the financial year.</li>
                                    <li>If an assessee is employed under more than one employer during the year, each of the employers shall issue Part A of the certificate in Form No.16 pertaining to the period for which such assessee was employed with each of the employers. Part B(Annexure) of the certificate in Form.16 may be issued by each of the employers or the last employer at the option of the assessee.</li>
                                    <li>In items I and II, in column for tax deposited in respect of deductee, furnish total amount of TDS and education cess.</li>
                                </ol>
                            </div>
                        </div>

                        <div className="text-center fw-bold fs-5">PART B(Annexure)</div>

                        <div className="col-md-12 border p-2 rounded">
                            <div
                                style={{ fontSize: '14px', padding: '12px 20px' }}
                                className="text-center fw-bold bg-light bg-light-grey"
                            >
                                Details of Salary paid and any other income and tax deducted
                            </div>

                            <div className="row mb-3 mt-3 fw-bold">
                                <label className="col-sm-5 col-form-label">1.Gross Salary</label>
                            </div> <hr />


                            <div className="row mb-3">
                                <label className="col-sm-5 col-form-label">(a) Salary as per provisions contained in sec.17(1)</label>
                                <div className="col-sm-3">
                                    <input type="text" className="form-control" placeholder="563970" />
                                </div>
                            </div> <hr />

                            <div className="row mb-3">
                                <label className="col-sm-5 col-form-label">(b) Value of perquisites u/s 17(2)(as per Form No. 12BA, wherever applicable)</label>
                                <div className="col-sm-3">
                                    <input type="text" className="form-control" placeholder="0" />
                                </div>
                            </div> <hr />

                            <div className="row mb-3">
                                <label className="col-sm-5 col-form-label">(c) Profits in lieu of salary under section 17(3)(as per Form No. 12BA, wherever applicable)	</label>
                                <div className="col-sm-3">
                                    <input type="text" className="form-control" placeholder="0" />
                                </div>
                            </div> <hr />

                            <div className="row mb-3">
                                <label className="col-sm-5 col-form-label">Total</label>
                                <div className="col-sm-3">
                                    <input type="text" className="form-control" placeholder="563970" readOnly />
                                </div>
                            </div> <hr />

                            <div className="row mb-3 mt-3 fw-bold">
                                <label className="col-sm-5 col-form-label">2. Less : Allowance to the extent exempt u/s 10</label>
                            </div> <hr />

                            <div style={{ fontSize: '14px' }} className="text-center fw-bold bg-light bg-light-grey">
                                <div className="row mb-3 mt-3 fw-bold">
                                    <label className="col-sm-1 col-form-label">Sr. No.</label>
                                    <label className="col-sm-3 col-form-label">Allowance</label>
                                    <label className="col-sm-3 col-form-label">Rs.</label>
                                </div>
                            </div>

                            {rows.map((row, index) => (
                                <div className="row mb-3 mt-3" key={row.id}>
                                    <div className="col-sm-1 d-flex align-items-center">
                                        <label>{index + 1}</label>
                                    </div>

                                    <div className="col-sm-3 ms-5">
                                        <input type="text" className="form-control" />
                                    </div>
                                    <div className="col-sm-3 ms-5">
                                        <input type="text" className="form-control" />
                                    </div>
                                    <div className="col-sm-3">
                                        <input type="text" className="form-control" />
                                    </div>


                                </div>
                            ))}

                            <div className="row mb-3">
                                <div className="col-sm-12 text-end">
                                    <button
                                        type="button"
                                        className="btn btn-sm add-btn"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            addRow();
                                        }}
                                    >
                                        Add New
                                    </button>
                                </div>
                            </div>
                            <hr />


                            <div className="row mb-3 mt-3 fw-bold">
                                <label className="col-sm-5 col-form-label">3. Balance (1-2)</label>
                                <div className="col-sm-3">
                                    <input type="text" className="form-control" placeholder="0" />
                                </div>
                            </div> <hr />

                            <div className="row mb-3 mt-3 fw-bold">
                                <label className="col-sm-5 col-form-label">4. Deductions :	</label>
                            </div> <hr />

                            <div className="row mb-3 mt-3 fw-bold">
                                <label className="col-sm-5 col-form-label">(a) Entertainment Allowance	</label>
                                <div className="col-sm-3">
                                    <input type="text" className="form-control" placeholder="0" />
                                </div>
                            </div> <hr />

                            <div className="row mb-3 mt-3 fw-bold">
                                <label className="col-sm-5 col-form-label">(b) Tax on employment</label>
                                <div className="col-sm-3">
                                    <input type="text" className="form-control" placeholder="0" />
                                </div>
                            </div> <hr />

                            <div className="row mb-3 mt-3 fw-bold">
                                <label className="col-sm-5 col-form-label">5. Aggregate of 4(a) and (b)	</label>
                                <div className="col-sm-3">
                                    <input type="text" className="form-control" placeholder="0" />
                                </div>
                            </div> <hr />

                            <div className="row mb-3 mt-3 fw-bold">
                                <label className="col-sm-5 col-form-label">6. Income chargeable under the head 'Salaries'(3-5)	</label>
                                <div className="col-sm-3">
                                    <input type="text" className="form-control" placeholder="0" />
                                </div>
                            </div> <hr />

                            <div className="row mb-3 mt-3 fw-bold">
                                <label className="col-sm-5 col-form-label">7. Add : Any other income reported by the employee	</label>
                            </div> <hr />

                            <div style={{ fontSize: '14px' }} className="text-center fw-bold bg-light bg-light-grey">
                                <div className="row mb-3 mt-3 fw-bold">
                                    <label className="col-sm-1 col-form-label">Sr. No.</label>
                                    <label className="col-sm-3 col-form-label">Allowance</label>
                                    <label className="col-sm-3 col-form-label">Rs.</label>
                                </div>
                            </div>

                            {rows.map((row, index) => (
                                <div className="row mb-3 mt-3" key={row.id}>
                                    <div className="col-sm-1 d-flex align-items-center">
                                        <label>{index + 1}</label>
                                    </div>

                                    <div className="col-sm-3 ms-5">
                                        <input type="text" className="form-control" />
                                    </div>
                                    <div className="col-sm-3 ms-5">
                                        <input type="text" className="form-control" />
                                    </div>
                                    <div className="col-sm-3">
                                        <input type="text" className="form-control" />
                                    </div>


                                </div>
                            ))}

                            <div className="row mb-3">
                                <div className="col-sm-12 text-end">
                                    <button
                                        type="button"
                                        className="btn btn-sm add-btn"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            addRow();
                                        }}
                                    >
                                        Add New
                                    </button>
                                </div>
                            </div>
                            <hr />

                            <div className="row mb-3 mt-3 fw-bold">
                                <label className="col-sm-5 col-form-label">8. Gross total income</label>
                                <div className="col-sm-3">
                                    <input type="text" className="form-control" placeholder="0" />
                                </div>
                            </div> <hr />

                            <div className="row mb-3 mt-3 fw-bold">
                                <label className="col-sm-5 col-form-label">9. Deductions under Chapter VI-A	</label>
                            </div> <hr />

                            <div style={{ fontSize: '14px' }} className="text-center fw-bold bg-light bg-light-grey">
                                <div className="row mb-3 mt-3 fw-bold">
                                    <label className="col-sm-5 col-form-label text-start">(A) sections 80C, 80CCC and 80CCD</label>
                                    <label className="col-sm-2 col-form-label">Gross Amount</label>
                                    <label className="col-sm-2 col-form-label">Qualifying Amount</label>
                                    <label className="col-sm-2 col-form-label">Deductible Amount</label>
                                </div>
                            </div>

                            <div className="row mb-3 mt-3 align-items-center ms-1">
                                <div className="col-sm-5">
                                    <label>(a) section 80C</label>
                                </div>
                                <div className="col-sm-2">
                                    <input type="text" className="form-control" placeholder="0" />
                                </div>
                                <div className="col-sm-2">
                                    <input type="text" className="form-control" placeholder="0" />
                                </div>
                                <div className="col-sm-2">
                                    <input type="text" className="form-control" placeholder="0" />
                                </div>
                            </div><hr />

                            <div className="row mb-3 mt-3 align-items-center ms-1">
                                <div className="col-sm-5">
                                    <label>(b) section 80CCC</label>
                                </div>
                                <div className="col-sm-2">
                                    <input type="text" className="form-control" placeholder="0" />
                                </div>
                                <div className="col-sm-2">
                                    <input type="text" className="form-control" placeholder="0" />
                                </div>
                                <div className="col-sm-2">
                                    <input type="text" className="form-control" placeholder="0" />
                                </div>
                            </div><hr />

                            <div className="row mb-3 mt-3 align-items-center ms-1">
                                <div className="col-sm-5">
                                    <label>(c) section 80CCD(1)</label>
                                </div>
                                <div className="col-sm-2">
                                    <input type="text" className="form-control" placeholder="0" />
                                </div>
                                <div className="col-sm-2">
                                    <input type="text" className="form-control" placeholder="0" />
                                </div>
                                <div className="col-sm-2">
                                    <input type="text" className="form-control" placeholder="0" />
                                </div>
                            </div><hr />

                            <div className="row mb-3 mt-3 align-items-center ms-1">
                                <label className="col-sm-5 col-form-label">(d) aggregate deduction under 80C,80CCC,80CCD(1)
                                    Note: Aggregate amount deductible under sections 80C,80CCC and 80CCD(1) shall not exceed one lakh rupees.</label>
                                <div className="col-sm-2">
                                    {/* <input type="text" className="form-control" placeholder="0" /> */}
                                </div>
                                <div className="col-sm-2">
                                    {/* <input type="text" className="form-control" placeholder="0" /> */}
                                </div>
                                <div className="col-sm-2">
                                    <input type="text" className="form-control" placeholder="0" />
                                </div>
                            </div> <hr />

                            <div style={{ fontSize: '14px' }} className="text-center fw-bold bg-light bg-light-grey">
                                <div className="row mb-3 mt-3 fw-bold">
                                    <label className="col-sm-6 col-form-label text-start">(B) Other sections (e.g. 80E, 80G, 80TTA, etc.) under Chapter VI-A</label>
                                </div>
                            </div>

                            <div style={{ fontSize: '14px' }} className="text-center fw-bold bg-light bg-light-grey">
                                <div className="row mb-3 mt-3 fw-bold">
                                    <label className="col-sm-3 col-form-label">Section</label>
                                    <label className="col-sm-3 col-form-label">Gross Amount</label>
                                    <label className="col-sm-3 col-form-label">Qualifying Amount</label>
                                    <label className="col-sm-3 col-form-label">Deductible Amount</label>
                                </div>
                            </div>

                            <div className="row mb-3 mt-3 align-items-center ms-1">
                                <div className="col-sm-3">
                                    <input type="text" className="form-control" placeholder="0" />
                                </div>
                                <div className="col-sm-3">
                                    <input type="text" className="form-control" placeholder="0" />
                                </div>
                                <div className="col-sm-3">
                                    <input type="text" className="form-control" placeholder="0" />
                                </div>
                                <div className="col-sm-3">
                                    <input type="text" className="form-control" placeholder="0" />
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-sm-12 text-end">
                                    <button
                                        type="button"
                                        className="btn btn-sm add-btn"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            addRow();
                                        }}
                                    >
                                        Add New
                                    </button>
                                </div>
                            </div>
                            <hr />

                            <div className="row mb-3 mt-3 align-items-center ms-1">
                                <label className="col-sm-5 col-form-label">10. Aggregate of deductible amount under Chapter VI-A</label>
                                <div className="col-sm-2"> </div>
                                <div className="col-sm-2"></div>
                                <div className="col-sm-3"><input type="text" className="form-control" placeholder="0" /></div>
                            </div> <hr />

                            <div className="row mb-3 mt-3 align-items-center ms-1">
                                <label className="col-sm-5 col-form-label">11. Total Income(8-10)</label>
                                <div className="col-sm-2"> </div>
                                <div className="col-sm-2"></div>
                                <div className="col-sm-3"><input type="text" className="form-control" placeholder="0" /></div>
                            </div> <hr />

                            <div className="row mb-3 mt-3 align-items-center ms-1">
                                <label className="col-sm-5 col-form-label">12. Tax on total Income</label>
                                <div className="col-sm-2"> </div>
                                <div className="col-sm-2"></div>
                                <div className="col-sm-3"><input type="text" className="form-control" placeholder="0" /></div>
                            </div> <hr />

                            <div className="row mb-3 mt-3 align-items-center ms-1">
                                <label className="col-sm-5 col-form-label">13. Education cess @3% (on tax computed at S. No. 12)</label>
                                <div className="col-sm-2"> </div>
                                <div className="col-sm-2"></div>
                                <div className="col-sm-3"><input type="text" className="form-control" placeholder="0" /></div>
                            </div> <hr />

                            <div className="row mb-3 mt-3 align-items-center ms-1">
                                <label className="col-sm-5 col-form-label">14. Tax payable(12+13)</label>
                                <div className="col-sm-2"> </div>
                                <div className="col-sm-2"></div>
                                <div className="col-sm-3"><input type="text" className="form-control" placeholder="0" /></div>
                            </div> <hr />

                            <div className="row mb-3 mt-3 align-items-center ms-1">
                                <label className="col-sm-5 col-form-label">15. Less : Relief under section89 (attach details)</label>
                                <div className="col-sm-2"> </div>
                                <div className="col-sm-2"></div>
                                <div className="col-sm-3"><input type="text" className="form-control" placeholder="0" /></div>
                            </div> <hr />

                            <div className="row mb-3 mt-3 align-items-center ms-1">
                                <label className="col-sm-5 col-form-label">16. Tax payable(14-15)</label>
                                <div className="col-sm-2"> </div>
                                <div className="col-sm-2"></div>
                                <div className="col-sm-3"><input type="text" className="form-control" placeholder="0" /></div>
                            </div>
                        </div>

                        <div className="col-md-12 border p-2 rounded mt-3">
                            <div
                                style={{ fontSize: '14px', padding: '12px 20px' }}
                                className="text-center fw-bold bg-light"
                            >
                                Verification
                            </div>

                            <div className="row mb-3 mt-3">
                                <label className="col-sm-12 col-form-label">I, ...................... son/daughter of .................. working in the capacity of ...................(designation) do hereby certify that a sum of Rs. [Rs. (in words)] has been deducted and deposited to the credit of the Central Government. I further certify that the information given above is true, complete and correct and is based on the books of account, documents, TDS Statements, TDS Deposited and other available records.</label>
                            </div> <hr />


                            <div className="row mb-3">
                                <label className="col-sm-1 col-form-label">Place :</label>
                                <div className="col-sm-3">
                                    <label className="mt-2">Mumbai</label>
                                </div>
                            </div>
                            <hr className="w-50" />

                            <div className="row mb-3 align-items-center">
                                <label className="col-sm-1 col-form-label">Date :</label>
                                <div className="col-sm-2">
                                    <label className="mt-2">29-08-2025</label>
                                </div>
                                <div className="col-sm-7 text-end">
                                    <label className="mt-2">(Signature of person responsible for deduction of tax)</label>
                                </div>
                            </div>
                            <hr />

                            {/* Designation + Full Name Row */}
                            <div className="row mb-3 align-items-center">
                                <label className="col-sm-2 col-form-label">Designation :</label>
                                <div className="col-sm-2">
                                    <label className="mt-2"></label>
                                </div>
                                <div className="col-sm-2 text-end ms-5">
                                    {/* <hr className="mt-1 mb-1" /> */}
                                    <label className="mt-2">Full Name :</label>
                                    <label className="mt-2"></label>
                                </div>
                            </div>

                        </div>



                    </div>

                    <div className="text-start mb-4 mt-3">
                        <button type="submit" className="btn btn-sm add-btn">Save</button>
                    </div>

                    <div className='text-start'>
                        <a href="/form16.pdf" download className='btn btn-sm down-btn mb-2'>
                            <i className="fas fa-download me-1"></i> Form 16
                        </a>
                    </div>

                </form>
            </div>


        </div>

    );
};
export default Form16;