import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { useLocation, useParams } from 'react-router-dom';
import { getConstants, addConstant, updateConstant, deleteConstant } from "../../api/constantsApi";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Constants = ({ type, columnName }) => {
    const location = useLocation();
    const { state } = useLocation();
    const { id } = useParams();
    const [selectedDepartment, setSelectedDepartment] = useState('Contract Type');
    const [formValues, setFormValues] = useState({});
    const [departmentData, setDepartmentData] = useState({});


    const columnsByDepartment = {
        "Contract Type": [{ key: "contract", label: "Contract", type: "text" }],
        Education: [{ key: "eduLevel", label: "Education Level", type: "text" }],
        Language: [{ key: "language", label: "Language Type", type: "text" }],
        Skill: [{ key: "skill", label: "Skill Type", type: "text" }],
        "Document type": [
            {
                key: "category",
                label: "Category",
                type: "select",
                options: ["Personal", "Family", "Education", "Immigration", "Others"]
            },
            { key: "documentType", label: "Document Type", type: "text" }
        ],
        "Award type": [{ key: "awardType", label: "Award Type", type: "text" }],
        "Employee Category": [{ key: "empCategory", label: "Employee Category", type: "text" }],

        "Leave Type": [
            {
                key: "leaveEmpCategory",
                label: "Employee Category",
                type: "select",
                options: ["Management Trainee", "Permanent Employee"]
            },
            { key: "leaveType", label: "Leave Type", type: "text" },
            { key: "daysPerYear", label: "Days Per Year", type: "text" }],

        "Warning Type": [{ key: "warningType", label: "Warning Type", type: "text" }],
        "Termination Type": [{ key: "terminationType", label: "Termination Type", type: "text" }],
        "Edit Expense Type": [{ key: "editExpenseType", label: "Edit Expense Type", type: "text" }],
        "Job Type": [{ key: "jobType", label: "Job Type", type: "text" }],
        "Employee Exit Type": [{ key: "employeeExitType", label: "Employee Exit Type", type: "text" }],
        "Employee Exit Checklist": [{ key: "employeeExitChecklist", label: "Employee Exit Checklist", type: "text" }],
        "Travel Arrangement Type": [{ key: "travelArrangementType", label: "Travel Arrangement Type", type: "text" }],
        "Payment Methods": [{ key: "paymentMethod", label: "Payment Method", type: "text" }],

        "Currency Type": [{ key: "currancyName", label: "Currency Name", type: "text" },
        { key: "currancyCode", label: "Currency Code", type: "text" },
        { key: "currancySymbol", label: "Currency Symbol", type: "text" }],

        "Assets Type": [{ key: "assetsType", label: "Assets Type", type: "text" }],

        "Payroll Deduction": [{ key: "deduction", label: "Deduction", type: "text" },
        { key: "remark", label: "Remark", type: "text" }],

        "Allowance": [
            { key: "allowanceType", label: "Allowance", type: "text" },
            {
                key: "allowance",
                label: "Allowance Mode",
                type: "select",
                options: ["Fixed", "Percentage"]
            },
            { key: "value", label: "Value", type: "text" }],

        "Grade": [{ key: "grade", label: "Grade", type: "text" },
        { key: "NoticePeriod", label: "notice Period", type: "text" }],

        "Payroll Deduction Slab": [
            {
                key: "payrollDeduction",
                label: "Payroll Deduction",
                type: "select",
                options: ["PF", "ESIC", "Pofessional Tax"]
            },
            { key: "account", label: "Account of Deduction", type: "text" },
            {
                key: "type",
                label: "Type",
                type: "select",
                options: ["Fixed", "Percentage"]
            },
            { key: "fromValue", label: "Deduction Slab Applicable From Value", type: "text" },
            { key: "toValue", label: "Deduction Slab Applicable To Value", type: "text" },
            { key: "applyValue", label: "Applies Fixed Value / % on given Range", type: "text" },
            {
                key: "gender",
                label: "Gender",
                type: "select",
                options: ["Male", "Female"]
            },
            { key: "agrFrom", label: "Deduction Applicable From Age", type: "text" },
            { key: "agrTo", label: "Deduction Applicable Upto Age", type: "text" },
            { key: "month", label: "Select Month", type: "date" },
            {
                key: "calculation",
                label: "calculation",
                type: "select",
                options: ["Basic Salary", "Gross Salary"]
            }, {
                key: "prYear",
                label: "Gender",
                type: "select",
                options: ["1 Year", "2 Year", "3 Year", "4 Year", "5 Year"]
            }],
    };




    const [showModal, setShowModal] = useState(false);
    const [description, setDescription] = useState('');
    const [Constants, setConstants] = useState([]);
    const [paginated, setPaginated] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);


    // edit from
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [editValue, setEditValue] = useState("");

    // for pagination
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;
    const totalEntries = Array.isArray(data) ? data.length : 0;
    const totalPages = Math.ceil(totalEntries / rowsPerPage) || 1;
    const currentData = departmentData[selectedDepartment] || [];
    const [newValue, setNewValue] = useState("");

    const paginate = (arr, page) => {
        if (!Array.isArray(arr)) {
            console.error("paginate called with non-array:", arr);
            return;
        }
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        setPaginated(arr.slice(start, end));
        setCurrentPage(page);
    };
    const startEntry = (currentPage - 1) * rowsPerPage + 1;
    const endEntry = Math.min(currentPage * rowsPerPage, totalEntries);

    const toggleAddForm = () => {
        setShowAddForm((prev) => !prev);
    };

    const [formats, setFormats] = useState([
        'doc', 'docx', 'jpeg', 'jpg', 'pdf', 'txt', 'excel'
    ]);

    const [formats1, setFormats1] = useState([
        'gif', 'png', 'pdf', 'txt', 'mp3', 'mp4', 'flv', 'doc', 'docs', 'xls', 'jpg', 'jpeg'
    ]);
    const [input, setInput] = useState('');

    const handleAddFormat = () => {
        const trimmed = input.trim().toLowerCase();
        if (trimmed && !formats.includes(trimmed)) {
            setFormats([...formats, trimmed]);
        }
        setInput('');
    };

    const departmentConfigs = {
        'Contract': {
            columns: [
                {
                    name: 'Action',
                    cell: (row) => (
                        <div className="d-flex">
                            <button className="btn btn-outline-secondary btn-sm" onClick={() => handleEdit(row)}>
                                <i className="fas fa-edit"></i>
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(row)}>
                                <i className="fas fa-trash-alt text-white"></i>
                            </button>
                        </div>
                    ),
                    ignoreRowClick: true,
                    allowOverflow: true,
                    button: true,
                },
                { name: 'Contract Type', selector: (row) => row.contract },
            ]
        },

        'Education': {
            // data: [
            //     { eduLevel: 'DrHigh School Diploma / GED' },
            //     { eduLevel: 'Associate Degree' },
            //     { eduLevel: 'Graduate' },
            //     { eduLevel: 'Post Graduate' },

            // ],
            columns: [
                {
                    name: 'Action',
                    cell: (row) => (
                        <div className="d-flex">
                            <button className="btn btn-outline-secondary btn-sm" onClick={() => handleEdit(row)}>
                                <i className="fas fa-edit"></i>
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(row)}>
                                <i className="fas fa-trash-alt text-white"></i>
                            </button>
                        </div>
                    ),
                    ignoreRowClick: true,
                    allowOverflow: true,
                    button: true,
                },
                { name: 'Education Level', selector: (row) => row.eduLevel },

            ]
        },

        'Language': {
            data: [
                { language: 'English' },
                { language: 'French' },
                { language: 'Arabic' },
                { language: 'Russian' },

            ],
            columns: [
                {
                    name: 'Action',
                    cell: (row) => (
                        <div className="d-flex">
                            <button className="btn btn-outline-secondary btn-sm" onClick={() => handleEdit(row)}>
                                <i className="fas fa-edit"></i>
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(row)}>
                                <i className="fas fa-trash-alt text-white"></i>
                            </button>
                        </div>
                    ),
                    ignoreRowClick: true,
                    allowOverflow: true,
                    button: true,
                },
                { name: 'Language', selector: (row) => row.language },

            ]
        },

        'Skill': {
            data: [
                { skill: 'PHP 4/5/6/7' },
                { skill: 'jQuery' },
                { skill: 'Ajax' },
                { skill: 'Magento' },

            ],
            columns: [
                {
                    name: 'Action',
                    cell: (row) => (
                        <div className="d-flex">
                            <button className="btn btn-outline-secondary btn-sm" onClick={() => handleEdit(row)}>
                                <i className="fas fa-edit"></i>
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(row)}>
                                <i className="fas fa-trash-alt text-white"></i>
                            </button>
                        </div>
                    ),
                    ignoreRowClick: true,
                    allowOverflow: true,
                    button: true,
                },
                { name: 'Skill', selector: (row) => row.skill },

            ]
        },

        'Document type': {
            data: [
                { documentType: 'Driving License' },
                { documentType: 'Passport' },
                { documentType: 'Visa' },
            ],
            columns: [
                {
                    name: 'Action',
                    cell: (row) => (
                        <div className="d-flex">
                            <button className="btn btn-outline-secondary btn-sm" onClick={() => handleEdit(row)}>
                                <i className="fas fa-edit"></i>
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(row)}>
                                <i className="fas fa-trash-alt text-white"></i>
                            </button>
                        </div>
                    ),
                    ignoreRowClick: true,
                    allowOverflow: true,
                    button: true,
                },
                { name: 'Document Type', selector: (row) => row.documentType },
            ]
        },

        'Award type': {
            data: [
                { awardType: 'Performer of the Year' },
                { awardType: 'Most Consistent Employee' },
                { awardType: 'Employee of the Month' },
                { awardType: 'Employee of the Month' },
            ],
            columns: [
                {
                    name: 'Action',
                    cell: (row) => (
                        <div className="d-flex">
                            <button className="btn btn-outline-secondary btn-sm" onClick={() => handleEdit(row)}>
                                <i className="fas fa-edit"></i>
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(row)}>
                                <i className="fas fa-trash-alt text-white"></i>
                            </button>
                        </div>
                    ),
                    ignoreRowClick: true,
                    allowOverflow: true,
                    button: true,
                },
                { name: 'Award Type', selector: (row) => row.awardType },
            ]
        },

        'Employee Category': {
            data: [
                { employeeCategory: 'Management trainee' },
                { employeeCategory: 'Management trainee' },
                { employeeCategory: 'Permanent Employee' },
                { employeeCategory: 'Permanent Employee' },
            ],
            columns: [
                {
                    name: 'Action',
                    cell: (row) => (
                        <div className="d-flex">
                            <button className="btn btn-outline-secondary btn-sm" onClick={() => handleEdit(row)}>
                                <i className="fas fa-edit"></i>
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(row)}>
                                <i className="fas fa-trash-alt text-white"></i>
                            </button>
                        </div>
                    ),
                    ignoreRowClick: true,
                    allowOverflow: true,
                    button: true,
                },
                { name: 'Employee Catgory', selector: (row) => row.employeeCategory },
            ]
        },

        'Leave Type': {
            data: [
                { leaveType: 'Casual Leave', daysPerYear: '15' },
                { leaveType: 'Casual Leave', daysPerYear: '2' },
                { leaveType: 'Casual Leave', daysPerYear: '6' },
                { leaveType: 'Casual Leave', daysPerYear: '13' },
            ],
            columns: [
                {
                    name: 'Action',
                    cell: (row) => (
                        <div className="d-flex">
                            <button className="btn btn-outline-secondary btn-sm" onClick={() => handleEdit(row)}>
                                <i className="fas fa-edit"></i>
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(row)}>
                                <i className="fas fa-trash-alt text-white"></i>
                            </button>
                        </div>
                    ),
                    ignoreRowClick: true,
                    allowOverflow: true,
                    button: true,
                },
                { name: 'Leave Type', selector: (row) => row.leaveType },
                { name: 'Days per Year', selector: (row) => row.daysPerYear },

            ]
        },

        'Warning Type': {
            data: [
                { warningType: 'Verbal Warning' },
                { warningType: 'First Written Warning' },
                { warningType: 'Second Written Warning' },
                { warningType: 'Final Written Warning' },
            ],
            columns: [
                {
                    name: 'Action',
                    cell: (row) => (
                        <div className="d-flex">
                            <button className="btn btn-outline-secondary btn-sm" onClick={() => handleEdit(row)}>
                                <i className="fas fa-edit"></i>
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(row)}>
                                <i className="fas fa-trash-alt text-white"></i>
                            </button>
                        </div>
                    ),
                    ignoreRowClick: true,
                    allowOverflow: true,
                    button: true,
                },
                { name: 'Warning Type', selector: (row) => row.warningType },
            ]
        },

        'Termination Type': {
            data: [
                { terminationType: 'Layoff' },
                { terminationType: 'Damaging Company Property' },
                { terminationType: 'Drug or Alcohol Possession at Work' },
                { terminationType: 'Falsifying Company Records' },
            ],
            columns: [
                {
                    name: 'Action',
                    cell: (row) => (
                        <div className="d-flex">
                            <button className="btn btn-outline-secondary btn-sm" onClick={() => handleEdit(row)}>
                                <i className="fas fa-edit"></i>
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(row)}>
                                <i className="fas fa-trash-alt text-white"></i>
                            </button>
                        </div>
                    ),
                    ignoreRowClick: true,
                    allowOverflow: true,
                    button: true,
                },
                { name: 'Termination Type', selector: (row) => row.terminationType },
            ]
        },

        'Edit Expense Type': {
            data: [
                { editExpenseType: 'Utilities' },
                { editExpenseType: 'Rent' },
                { editExpenseType: 'Insurance' },
                { editExpenseType: 'Supplies' },
            ],
            columns: [
                {
                    name: 'Action',
                    cell: (row) => (
                        <div className="d-flex">
                            <button className="btn btn-outline-secondary btn-sm" onClick={() => handleEdit(row)}>
                                <i className="fas fa-edit"></i>
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(row)}>
                                <i className="fas fa-trash-alt text-white"></i>
                            </button>
                        </div>
                    ),
                    ignoreRowClick: true,
                    allowOverflow: true,
                    button: true,
                },
                { name: 'Edit Expense Type', selector: (row) => row.editExpenseType },
            ]
        },

        'Job Type': {
            data: [
                { jobType: 'Intern' },
                { jobType: 'Freelancer' },
                { jobType: 'Full-Time' },
                { jobType: 'Contract' },
            ],
            columns: [
                {
                    name: 'Action',
                    cell: (row) => (
                        <div className="d-flex">
                            <button className="btn btn-outline-secondary btn-sm" onClick={() => handleEdit(row)}>
                                <i className="fas fa-edit"></i>
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(row)}>
                                <i className="fas fa-trash-alt text-white"></i>
                            </button>
                        </div>
                    ),
                    ignoreRowClick: true,
                    allowOverflow: true,
                    button: true,
                },
                { name: 'Job Type', selector: (row) => row.jobType },
            ]
        },

        'Employee Exit Type': {
            data: [
                { employeeExitType: 'Resignation' },
                { employeeExitType: 'Retirement' },
                { employeeExitType: 'End of Contract' },
                { employeeExitType: 'End of Project' },
            ],
            columns: [
                {
                    name: 'Action',
                    cell: (row) => (
                        <div className="d-flex">
                            <button className="btn btn-outline-secondary btn-sm" onClick={() => handleEdit(row)}>
                                <i className="fas fa-edit"></i>
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(row)}>
                                <i className="fas fa-trash-alt text-white"></i>
                            </button>
                        </div>
                    ),
                    ignoreRowClick: true,
                    allowOverflow: true,
                    button: true,
                },
                { name: 'Employee Exit Type', selector: (row) => row.employeeExitType },
            ]
        },

        'Employee Exit Checklist': {
            data: [
                { employeeExitChecklist: 'No dues' },
                { employeeExitChecklist: 'Final settlement' },
                { employeeExitChecklist: 'Experience certificate' }
            ],
            columns: [
                {
                    name: 'Action',
                    cell: (row) => (
                        <div className="d-flex">
                            <button className="btn btn-outline-secondary btn-sm" onClick={() => handleEdit(row)}>
                                <i className="fas fa-edit"></i>
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(row)}>
                                <i className="fas fa-trash-alt text-white"></i>
                            </button>
                        </div>
                    ),
                    ignoreRowClick: true,
                    allowOverflow: true,
                    button: true,
                },
                { name: 'Employee Exit Checklist', selector: (row) => row.employeeExitChecklist },
            ]
        },

        'Travel Arrangement Type': {
            data: [
                { travelArrangemntType: 'Personal Arrangment' },
                { travelArrangemntType: 'Hotel' },
                { travelArrangemntType: 'Guest House' },
                { travelArrangemntType: 'Motel' },
            ],
            columns: [
                {
                    name: 'Action',
                    cell: (row) => (
                        <div className="d-flex">
                            <button className="btn btn-outline-secondary btn-sm" onClick={() => handleEdit(row)}>
                                <i className="fas fa-edit"></i>
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(row)}>
                                <i className="fas fa-trash-alt text-white"></i>
                            </button>
                        </div>
                    ),
                    ignoreRowClick: true,
                    allowOverflow: true,
                    button: true,
                },
                { name: 'Travel Arrangement Type', selector: (row) => row.travelArrangemntType },
            ]
        },

        'Payment Methods': {
            data: [
                { paymentMethod: 'Cash' },
                { paymentMethod: 'Credit Card' },
                { paymentMethod: 'Bank' },
                { paymentMethod: 'Online' },
            ],
            columns: [
                {
                    name: 'Action',
                    cell: (row) => (
                        <div className="d-flex">
                            <button className="btn btn-outline-secondary btn-sm" onClick={() => handleEdit(row)}>
                                <i className="fas fa-edit"></i>
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(row)}>
                                <i className="fas fa-trash-alt text-white"></i>
                            </button>
                        </div>
                    ),
                    ignoreRowClick: true,
                    allowOverflow: true,
                    button: true,
                },
                { name: 'Payment Methods', selector: (row) => row.paymentMethod },
            ]
        },

        'Currency Type': {
            data: [
                { CurrencyName: 'Dollars', CurrencyCode: 'USD', CurrencySymbol: '$' },
                { CurrencyName: 'Dollars', CurrencyCode: 'AUD', CurrencySymbol: '$' },
                { CurrencyName: 'Euro', CurrencyCode: 'EUR', CurrencySymbol: '€' },
                { CurrencyName: 'Pounds', CurrencyCode: 'GBP', CurrencySymbol: '£' },
                { CurrencyName: 'Dollars', CurrencyCode: 'CAD', CurrencySymbol: '$' },

            ],
            columns: [
                {
                    name: 'Action',
                    cell: (row) => (
                        <div className="d-flex">
                            <button className="btn btn-outline-secondary btn-sm" onClick={() => handleEdit(row)}>
                                <i className="fas fa-edit"></i>
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(row)}>
                                <i className="fas fa-trash-alt text-white"></i>
                            </button>
                        </div>
                    ),
                    ignoreRowClick: true,
                    allowOverflow: true,
                    button: true,
                },
                { name: 'Name', selector: (row) => row.CurrencyName },
                { name: 'Code', selector: (row) => row.CurrencyCode },
                { name: 'Symbol', selector: (row) => row.CurrencySymbol },

            ]
        },

        'Assets Type': {
            data: [
                { assetsType: 'Mobile' },
                { assetsType: 'Laptop' },
                { assetsType: 'Mobile' },
                { assetsType: 'Laptop' },
            ],
            columns: [
                {
                    name: 'Action',
                    cell: (row) => (
                        <div className="d-flex">
                            <button className="btn btn-outline-secondary btn-sm" onClick={() => handleEdit(row)}>
                                <i className="fas fa-edit"></i>
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(row)}>
                                <i className="fas fa-trash-alt text-white"></i>
                            </button>
                        </div>
                    ),
                    ignoreRowClick: true,
                    allowOverflow: true,
                    button: true,
                },
                { name: 'Assets Type', selector: (row) => row.assetsType },
            ]
        },

        'Payroll Deduction': {
            data: [
                { deduction: 'PF' },
                { deduction: 'ESIC' },
                { deduction: 'Professional Tax' }
            ],
            columns: [
                {
                    name: 'Action',
                    cell: (row) => (
                        <div className="d-flex">
                            <button className="btn btn-outline-secondary btn-sm" onClick={() => handleEdit(row)}>
                                <i className="fas fa-edit"></i>
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(row)}>
                                <i className="fas fa-trash-alt text-white"></i>
                            </button>
                        </div>
                    ),
                    ignoreRowClick: true,
                    allowOverflow: true,
                    button: true,
                },
                { name: 'Deduction', selector: (row) => row.deduction },
            ]
        },

        'Payroll Deduction Slab': {
            data: [
                { payrollDeduction: 'PF', account: 'PF', calculation: 'Gross Salary', type: 'Percentage', fromValue: '', toValue: '', applyValue: '12' },
                { payrollDeduction: 'ESIC', account: 'ESIC', calculation: 'Gross Salary', type: 'Percentage', fromValue: '', toValue: '', applyValue: '0.75' },
                { payrollDeduction: 'PT', account: 'PT', calculation: 'Earned Salary', type: 'Fixed', fromValue: '', toValue: '', applyValue: '200' },

            ],
            columns: [
                {
                    name: 'Action',
                    cell: (row) => (
                        <div className="d-flex">
                            <button className="btn btn-outline-secondary btn-sm" onClick={() => handleEdit(row)}>
                                <i className="fas fa-edit"></i>
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(row)}>
                                <i className="fas fa-trash-alt text-white"></i>
                            </button>
                        </div>
                    ),
                    ignoreRowClick: true,
                    allowOverflow: true,
                    button: true,
                },
                { name: 'Payroll Deduction', selector: (row) => row.payrollDeduction },
                { name: 'Account', selector: (row) => row.account },
                { name: 'Calculation', selector: (row) => row.calculation },
                { name: 'Type', selector: (row) => row.type },
                { name: 'From Value', selector: (row) => row.fromValue },
                { name: 'To Value', selector: (row) => row.toValue },
                { name: 'Apply Value', selector: (row) => row.applyValue },


            ]
        },

        'Allowance': {
            data: [
                { allowance: 'Mobile Allowence', type: 'Fixed', value: '300' },
                { allowance: 'Driver Allowence', type: 'Fixed', value: '5000' },
            ],
            columns: [
                {
                    name: 'Action',
                    cell: (row) => (
                        <div className="d-flex">
                            <button className="btn btn-outline-secondary btn-sm" onClick={() => handleEdit(row)}>
                                <i className="fas fa-edit"></i>
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(row)}>
                                <i className="fas fa-trash-alt text-white"></i>
                            </button>
                        </div>
                    ),
                    ignoreRowClick: true,
                    allowOverflow: true,
                    button: true,
                },
                { name: 'Allowance', selector: (row) => row.allowance },
                { name: 'Type', selector: (row) => row.type },
                { name: 'Value', selector: (row) => row.value },

            ]
        },

        'Grade': {
            data: [
                { grade: 'I', noticePeriod: '60' },
                { grade: 'II', noticePeriod: '60' },
            ],
            columns: [
                {
                    name: 'Action',
                    cell: (row) => (
                        <div className="d-flex">
                            <button className="btn btn-outline-secondary btn-sm" onClick={() => handleEdit(row)}>
                                <i className="fas fa-edit"></i>
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(row)}>
                                <i className="fas fa-trash-alt text-white"></i>
                            </button>
                        </div>
                    ),
                    ignoreRowClick: true,
                    allowOverflow: true,
                    button: true,
                },
                { name: 'Grade', selector: (row) => row.grade },
                { name: 'Notice Period', selector: (row) => row.noticePeriod },

            ]
        },

        // Add more departments similarly...
    };


    const fetchData = async (department) => {
        if (!department) return;

        try {
            const res = await fetch(`http://localhost:3000/constants/${department}`);
            const resData = await res.json();

            setDepartmentData(prev => ({
                ...prev,
                [department]: Array.isArray(resData) ? resData : [],
            }));
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData(selectedDepartment);
    }, [selectedDepartment]);

    const handleAdd = async () => {
        if (!selectedDepartment) return;

        // Build value object from formValues, only include non-empty
        const value = {};
        (columnsByDepartment[selectedDepartment] || []).forEach(f => {
            if (f.key !== "action" && formValues[f.key] != null && formValues[f.key] !== "") {
                const fieldValue = typeof formValues[f.key] === "string"
                    ? formValues[f.key].trim()
                    : formValues[f.key]; // keep numbers as-is
                value[f.key] = fieldValue;
            }

        });

        if (Object.keys(value).length === 0) {
            toast.error("Please enter at least one value");
            return;
        }

        try {
            toast.success("Data saved successfully!");
            const res = await fetch(`http://localhost:3000/constants`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: selectedDepartment, value }),

            });

            const savedItem = await res.json();

            // Update frontend list
            setDepartmentData(prev => ({
                ...prev,
                [selectedDepartment]: [...(prev[selectedDepartment] || []), savedItem],
            }));

            setFormValues({}); // reset form
        } catch (err) {
            console.error("Save failed:", err);
            toast.error("Failed to save data!");
        }
    };

    const currentConfig = departmentConfigs[selectedDepartment] || { columns: [] };

    const filteredData = currentData.filter(item => {
        const fields = columnsByDepartment[selectedDepartment];
        if (!fields) return false;
        return fields.some(f =>
            item[f.key] && String(item[f.key]).trim() !== ""
        );
    });


    const [editValues, setEditValues] = useState({});

    const handleEdit = (row) => {
        setSelectedRow(row);
        setEditValues({ ...row.value });
        setShowEditModal(true);
    };

    const handleUpdate = async (id) => {
        try {
            toast.success("Data updated successfully!");

            const res = await fetch(`http://localhost:3000/constants/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ value: editValues }), // <-- wrap inside value
            });
            const updatedItem = await res.json();

            // Update frontend state
            setDepartmentData(prev => ({
                ...prev,
                [selectedDepartment]: prev[selectedDepartment].map(item =>
                    item._id === id ? updatedItem : item
                ),
            }));
            setShowEditModal(false);
            setEditValues({});
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (row) => {
        if (!window.confirm("Are you sure you want to delete this item?")) return;

        try {
            await fetch(`http://localhost:3000/constants/${row._id}`, {
                method: "DELETE",
            });

            // Remove the deleted item from frontend state
            setDepartmentData(prev => ({
                ...prev,
                [selectedDepartment]: prev[selectedDepartment].filter(item => item._id !== row._id),
            }));
        } catch (err) {
            console.error(err);
        }
    };



    //    useEffect(() => {
    //     fetchData(selectedDepartment);
    //   }, [selectedDepartment]);

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

    const currentColumns = [
        {
            name: "Action",
            cell: (row) => (
                <div className="d-flex gap-2">
                    <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => handleEdit(row)}
                    >
                        <i className="fas fa-edit"></i>
                    </button>
                    <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(row)}
                    >
                        <i className="fas fa-trash-alt text-white"></i>
                    </button>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
        // All other columns come from department fields
        ...(columnsByDepartment[selectedDepartment] || []).map(f => ({
            name: f.label,
            selector: row => row.value[f.key] || "", // <-- access the value object
            sortable: true,
        }))
    ];





    const renderContent = () => {
        const fields = columnsByDepartment[selectedDepartment];
        if (!fields) return <p>{selectedDepartment} Section Coming Soon...</p>;

        return (
            <div className="row">
                {fields
                    .filter(f => f.key !== "action")
                    .map(f => (
                        <div className="mb-3" key={f.key}>
                            <label>{f.label}</label>

                            {f.type === "select" ? (
                                <select
                                    className="form-control"
                                    value={formValues[f.key] || ""}
                                    onChange={(e) =>
                                        setFormValues(prev => ({ ...prev, [f.key]: e.target.value }))
                                    }
                                >
                                    <option value="">Select {f.label}</option>
                                    {f.options.map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type={f.type || "text"}
                                    className="form-control"
                                    placeholder={`Enter ${f.label}`}
                                    value={formValues[f.key] || ""}
                                    onChange={(e) =>
                                        setFormValues(prev => ({ ...prev, [f.key]: e.target.value }))
                                    }
                                />
                            )}
                        </div>
                    ))}
                <div className="text-start mb-2">
                    <button type="button" className="btn btn-sm add-btn" onClick={handleAdd}>
                        Save
                    </button>
                </div>
            </div>
        );
    };


    // const renderList = () => {
    //     const fields = columnsByDepartment[selectedDepartment];
    //     if (!fields) return <p>{selectedDepartment} Section Coming Soon...</p>;

    //     return (
    //         <div className="card no-radius mt-3">
    //             <div className="px-3 pt-4">
    //                 <DataTable
    //                     columns={currentColumns}
    //                     data={departmentData[selectedDepartment] || []}
    //                     fixedHeader
    //                     highlightOnHover
    //                     customStyles={customStyles}
    //                     conditionalRowStyles={conditionalRowStyles}
    //                     responsive
    //                     subHeader
    //                     subHeaderAlign="right"
    //                     subHeaderComponent={
    //                         <div className="d-flex flex-wrap justify-content-between align-items-center w-100 gap-2">
    //                             <div className="d-flex flex-wrap gap-2">
    //                                 <button className="btn btn-sm btn-outline-dark">Copy</button>
    //                                 <button className="btn btn-sm btn-outline-dark">CSV</button>
    //                                 <button className="btn btn-sm btn-outline-dark">PDF</button>
    //                                 <button className="btn btn-sm btn-outline-dark">Print</button>
    //                             </div>
    //                         </div>
    //                     }
    //                 />
    //             </div>
    //         </div>


    //     );
    // };

    const renderList = () => {
        const fields = columnsByDepartment[selectedDepartment];
        if (!fields) return <p>{selectedDepartment} Section Coming Soon...</p>;

        return (
            <>
                <div className="card no-radius">
                    <div className="px-3">
                        <DataTable
                            columns={currentColumns}
                            data={departmentData[selectedDepartment] || []}
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
                                </div>
                            }
                        />
                    </div>
                </div>

                {showEditModal && selectedRow && (
                    <>
                        <div className="custom-backdrop"></div>

                        <div className="modal show fade d-block" tabIndex="-1">
                            <div className="modal-dialog modal-dialog-centered edit-modal">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Edit {selectedDepartment}</h5>
                                        <button
                                            type="button"
                                            className="btn-close"
                                            onClick={() => setShowEditModal(false)}
                                        ></button>
                                    </div>

                                    <div className="modal-body">
                                        <form
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                handleUpdate(selectedRow._id);
                                            }}
                                        >
                                            <div className="row">
                                                {(columnsByDepartment[selectedDepartment] || []).map(f => (
                                                    <div className="col-md-12 mb-3" key={f.key}>
                                                        <label>{f.label}</label>

                                                        {f.options ? (
                                                            <select
                                                                className="form-control"
                                                                value={editValues[f.key] || ""}
                                                                onChange={(e) =>
                                                                    setEditValues(prev => ({ ...prev, [f.key]: e.target.value }))
                                                                }
                                                                required
                                                            >
                                                                <option value="">Select {f.label}</option>
                                                                {f.options.map(opt => (
                                                                    <option key={opt} value={opt}>{opt}</option>
                                                                ))}
                                                            </select>
                                                        ) : (
                                                            <input
                                                                type={f.type || "text"}
                                                                className="form-control"
                                                                value={editValues[f.key] || ""}
                                                                onChange={(e) =>
                                                                    setEditValues(prev => ({ ...prev, [f.key]: e.target.value }))
                                                                }
                                                                placeholder={`Enter ${f.label}`}
                                                                required
                                                            />
                                                        )}
                                                    </div>
                                                ))}




                                                <div className="text-end">
                                                    <button type="button" className="btn btn-sm btn-light me-2" onClick={() => { setShowEditModal(false) }}>Close</button>
                                                    <button type="submit" className="btn btn-sm add-btn">Update</button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </>
                )}

            </>
        );
    };


    return (
        <div className="custom-container">
            <h5>Constants</h5>
            <p style={{ fontSize: '15px', color: 'rgb(98, 98, 98)' }}>
                <span style={{ color: 'red' }}>Home</span> / Constants
            </p>

            <div className="row">

                <div className="col-md-3 mb-3">
                    <div className="card h-100">
                        <div className="card-body p-2">
                            <ul className="list-group list-group-flush">
                                {[
                                    'Contract Type', 'Education', 'Language', 'Skill', 'Document type', 'Award type',
                                    'Employee Category', 'Leave Type', 'Warning Type', 'Termination Type',
                                    'Edit Expense Type', 'Job Type', 'Employee Exit Type', 'Employee Exit Checklist',
                                    'Travel Arrangement Type', 'Payment Methods', 'Currency Type', 'Assets Type', 'Payroll Deduction',
                                    'Payroll Deduction Slab', 'Allowance', 'Grade'
                                ].map((dept, index) => {
                                    const icons = {
                                        'Contract Type': 'fas fa-file-contract',
                                        'Education': 'fas fa-graduation-cap ',
                                        'Language': 'fas fa-language',
                                        'Skill': 'fas fa-tools ',
                                        'Document type': 'fas fa-file-alt',
                                        'Award type': 'fas fa-award',
                                        'Employee Category': 'fas fa-users-cog',
                                        'Leave Type': 'fas fa-plane-departure',
                                        'Warning Type': 'fas fa-exclamation-triangle',
                                        'Termination Type': 'fas fa-user-slash',
                                        'Edit Expense Type': 'fas fa-file-invoice-dollar',
                                        'Job Type': 'fas fa-briefcase',
                                        'Employee Exit Type': 'fas fa-door-open',
                                        'Employee Exit Checklist': 'fas fa-clipboard-check',
                                        'Travel Arrangement Type': 'fas fa-suitcase-rolling',
                                        'Payment Methods': 'fas fa-credit-card',
                                        'Currency Type': 'fas fa-coins',
                                        'Assets Type': 'fas fa-boxes',
                                        'Payroll Deduction': 'fas fa-minus-circle',
                                        'Payroll Deduction Slab': 'fas fa-chart-line',
                                        'Allowance': 'fas fa-hand-holding-usd',
                                        'Grade': 'fas fa-signal'
                                    };

                                    return (
                                        <li
                                            key={index}
                                            className={`list-group-item department-item ${selectedDepartment === dept ? 'active' : ''}`}
                                            style={{
                                                cursor: 'pointer'
                                            }}
                                            onClick={() => setSelectedDepartment(dept)}
                                        >
                                            {icons[dept] && (
                                                <i className={`${icons[dept]} me-2 fs-6 text-secondary`}></i>
                                            )}
                                            {dept}
                                        </li>

                                    );
                                })}
                            </ul>


                        </div>
                    </div>
                </div>


                <div className="col-md-9">
                    <div className="row g-3">

                        <div className="col-12 col-md-5">
                            <div className="card no-radius">
                                <div className="card-header d-flex justify-content-between align-items-center text-white new-emp-bg">
                                    <span>Add New {selectedDepartment}</span>
                                </div>
                                <div className="card-body p-3">
                                    {renderContent()}
                                </div>
                            </div>
                        </div>

                        <div className="col-12 col-md-6">
                            <div className="card no-radius">
                                <div className="card-header d-flex justify-content-between align-items-center text-white new-emp-bg">
                                    <span>List All {selectedDepartment}</span>
                                </div>
                                <div className="card-body p-3">
                                    {renderList()}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>

        </div>
    );
};

export default Constants;
