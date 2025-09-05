import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './more.css';
const SettingPage = () => {
    // const { settingId } = useParams();
    const [selectedDepartment, setSelectedDepartment] = useState('General');
    const [enableJobs, setEnableJobs] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);

    const toggleAddForm = () => {
        setShowAddForm((prev) => !prev);
    };

    const [form, setForm] = useState({
        company_name: "",
        company_address: "",
        company_contact_person: "",
        company_contanct_no: "",
        company_email: "",
        company_city: "",
        company_state: "",
        company_country: "",
        company_pincode: "",
        application_name: "",
        default_currency: "",
        dafault_date_format: "",
        default_currency_appfix: "",
        default_currency_pos: "",
        footer_text: "",
        is_year_footer: false,
        enableCodeigniterFooter: false,
        emp_manage_contact: false,
        emp_manage_bank: false,
        emp_manage_qualification: false,
        emp_manage_work_exp: false,
        emp_manage_doc: false,
        emp_manage_profile_pic: false,
        emp_manage_profile_info: false,
        emp_manage_social_info: false,
        enable_clock_in_btn: false,
        enable_clock_in_out: false,
        payslip_pass_format: "",
        enable_payslip_password: false,
        payslip_logo: "",
        enable_employee_job: false,
        job_app_format: ['doc', 'docx', 'jpeg', 'jpg', 'pdf', 'txt', 'excel', 'gif', 'png',
            'mp3', 'mp4', 'flv', 'xls'],
        job_list_logo: "",
        enable_email_notifi: false,
        animation_top_menu: "",
        animation_modal_dialogs: "",
        notification_position: "",
        enable_close_btn: false,
        progress_bar: false,
        file_size: 0,
        // file_format: ['gif', 'png', 'pdf', 'txt', 'mp3', 'mp4', 'flv', 'doc', 'docx', 'xls', 'jpg', 'jpeg'],
        emp_download_dept_file: false
    });

    const [payslipLogo, setPayslipLogo] = useState(null);
    const [jobListLogo, setJobListLogo] = useState(null);
    const [settingId, setSettingId] = useState(null);
    const [savedId, setSavedId] = useState(null);
    const [input, setInput] = useState('');

    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    useEffect(() => {
        axios.get("http://localhost:3000/settings")
            .then(res => {
                if (res.data.length > 0) {
                    const lastSetting = res.data[res.data.length - 1];
                    setForm(lastSetting);
                    setSavedId(lastSetting._id);
                }
            })
            .catch(err => console.error(err));
    }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        Object.entries(form).forEach(([key, value]) => {
            if (Array.isArray(value)) formData.append(key, JSON.stringify(value));
            else formData.append(key, value);
        });

        if (payslipLogo) formData.append("payslip_logo", payslipLogo);
        if (jobListLogo) formData.append("job_list_logo", jobListLogo);

        try {
            let res;
            if (savedId) {

                res = await axios.put(`http://localhost:3000/settings/${savedId}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                toast.success("Saved successfully!");

            } else {

                res = await axios.post("http://localhost:3000/settings", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                setSavedId(res.data._id);
            }
            // toast.success("Saved successfully!");
        } catch (err) {
            console.error(err);
            toast.error("Error saving settings");
        }
    };

    const handleAddFormat = (e) => {
        if (e.key === "Enter" && input.trim() && !form.job_app_format.includes(input.trim())) {
            setForm((prev) => ({
                ...prev,
                job_app_format: [...prev.job_app_format, input.trim()]
            }));
            setInput("");
        }
    };

    const handleRemoveFormat = (format) => {
        setForm((prev) => ({
            ...prev,
            job_app_format: prev.job_app_format.filter((f) => f !== format)
        }));
    };

    useEffect(() => {
        //   getSettings().then(res => setForm(res.data));
    }, []);


    const renderContent = () => {
        switch (selectedDepartment) {
            case 'General':
                return (
                    <div>
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                {/* Left Column */}
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label>Company Name</label>
                                        <input
                                            type="text"
                                            name="company_name"
                                            placeholder="A TO Z EXIM"
                                            value={form.company_name}
                                            onChange={handleChange}
                                            className="form-control"
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label>Contact Person</label>
                                        <input
                                            type="text"
                                            name="company_contact_person"
                                            placeholder="John Doe"
                                            value={form.company_contact_person}
                                            onChange={handleChange}
                                            className="form-control"
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label>Email</label>
                                        <input
                                            type="email"
                                            name="company_email"
                                            placeholder="hr@bharatfreight.com"
                                            value={form.company_email}
                                            onChange={handleChange}
                                            className="form-control"
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label>Phone</label>
                                        <input
                                            type="text"
                                            name="company_contanct_no"
                                            placeholder="7972891147"
                                            value={form.company_contanct_no}
                                            onChange={handleChange}
                                            className="form-control"
                                        />
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="col-md-6">

                                    <div className="mb-3">
                                        <label>Address</label>
                                        <input
                                            type="text"
                                            name="company_address"
                                            className="form-control mb-3"
                                            placeholder="Address Line 1"
                                            value={form.company_address}
                                            onChange={handleChange}
                                        />
                                        <input
                                            type="text"
                                            name="company_address2"
                                            className="form-control"
                                            placeholder="Address Line 2"
                                            value={form.company_address2 || ""}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-md-4">
                                            <input
                                                type="text"
                                                name="company_city"
                                                className="form-control"
                                                placeholder="City"
                                                value={form.company_city}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <input
                                                type="text"
                                                name="company_state"
                                                className="form-control"
                                                placeholder="State"
                                                value={form.company_state}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <input
                                                type="text"
                                                name="company_pincode"
                                                className="form-control"
                                                placeholder="Pincode"
                                                value={form.company_pincode}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label>Country</label>
                                        <select
                                            className="form-select"
                                            name="company_country"
                                            value={form.company_country}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select a country</option>
                                            <option value="India">🇮🇳 India</option>
                                            <option value="United States">🇺🇸 United States</option>
                                            <option value="United Kingdom">🇬🇧 United Kingdom</option>
                                            <option value="Canada">🇨🇦 Canada</option>
                                            <option value="Australia">🇦🇺 Australia</option>
                                            <option value="Germany">🇩🇪 Germany</option>
                                            <option value="France">🇫🇷 France</option>
                                            <option value="Italy">🇮🇹 Italy</option>
                                            <option value="Spain">🇪🇸 Spain</option>
                                            <option value="Brazil">🇧🇷 Brazil</option>
                                            <option value="China">🇨🇳 China</option>
                                            <option value="Japan">🇯🇵 Japan</option>
                                            <option value="South Korea">🇰🇷 South Korea</option>
                                            <option value="Russia">🇷🇺 Russia</option>
                                            <option value="Mexico">🇲🇽 Mexico</option>
                                            <option value="South Africa">🇿🇦 South Africa</option>
                                            <option value="United Arab Emirates">🇦🇪 UAE</option>
                                            <option value="Singapore">🇸🇬 Singapore</option>
                                            <option value="Netherlands">🇳🇱 Netherlands</option>
                                        </select>
                                    </div>

                                </div>
                                <div className="text-end mb-2">
                                    <button type="submit" className="btn btn-sm add-btn">Save</button>
                                </div>
                            </div>
                        </form>
                    </div>
                );

            case 'System':
                return (
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            {/* Left Column */}
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label>Application Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="application_name"
                                        value={form.application_name || ""}
                                        onChange={handleChange}
                                        placeholder="A TO Z EXIM"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label>Default Currency</label>
                                    <select
                                        className="form-control"
                                        name="default_currency"
                                        value={form.default_currency || ""}
                                        onChange={handleChange}
                                    >
                                        <option value="INR">INR - Indian Rupee (₹)</option>
                                        <option value="USD">USD - US Dollar ($)</option>
                                        <option value="EUR">EUR - Euro (€)</option>
                                        <option value="GBP">GBP - British Pound (£)</option>
                                        <option value="JPY">JPY - Japanese Yen (¥)</option>
                                        <option value="CNY">CNY - Chinese Yuan (¥)</option>
                                        <option value="CAD">CAD - Canadian Dollar (CA$)</option>
                                        <option value="AUD">AUD - Australian Dollar (A$)</option>
                                        <option value="CHF">CHF - Swiss Franc (Fr)</option>
                                        <option value="SGD">SGD - Singapore Dollar (S$)</option>
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label>Default Currency (Symbol/Code)</label>
                                    <select
                                        className="form-control"
                                        name="default_currency_appfix"
                                        value={form.default_currency_appfix || ""}
                                        onChange={handleChange}
                                    >
                                        <option value="cc">Currency Code</option>
                                        <option value="cs">Currency Symbol</option>
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label>Currency Position</label>
                                    <select
                                        className="form-control"
                                        name="default_currency_pos"
                                        value={form.default_currency_pos || ""}
                                        onChange={handleChange}
                                    >
                                        <option value="prefix">Prefix</option>
                                        <option value="suffix">Suffix</option>
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label d-block mb-2">
                                        Enable CodeIgniter page rendered on footer
                                    </label>
                                    <label className="switch">
                                        <input
                                            type="checkbox"
                                            name="enableCodeigniterFooter"
                                            checked={form.enableCodeigniterFooter || false}
                                            onChange={(e) =>
                                                setForm({ ...form, enableCodeigniterFooter: e.target.checked })
                                            }
                                        />
                                        <span className="slider round"></span>
                                    </label>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="form-label">Date Format</label>

                                    {[
                                        { id: "format1", val: "dd-mm-yyyy", label: "29-07-2025 (dd-mm-YYYY)" },
                                        { id: "format2", val: "mm-dd-yyyy", label: "07-29-2025 (mm-dd-YYYY)" },
                                        { id: "format3", val: "dd-MMM-yyyy", label: "29-Jul-2025 (dd-MMM-YYYY)" },
                                        { id: "format4", val: "MMM-dd-yyyy", label: "Jul-29-2025 (MMM-dd-YYYY)" },
                                    ].map((opt) => (
                                        <div className="form-check" key={opt.id}>
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="dafault_date_format"
                                                id={opt.id}
                                                value={opt.val}
                                                checked={form.dafault_date_format === opt.val}
                                                onChange={handleChange}
                                                style={{
                                                    width: "1em",
                                                    height: "1em",
                                                    borderRadius: "50%",
                                                    marginTop: "6px",
                                                }}
                                            />
                                            <label className="form-check-label ms-2" htmlFor={opt.id}>
                                                {opt.label}
                                            </label>
                                        </div>
                                    ))}
                                </div>

                                <div className="mb-3">
                                    <label>Footer Text</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="footer_text"
                                        value={form.footer_text || ""}
                                        onChange={handleChange}
                                        placeholder="A TO Z EXIM"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label d-block mb-2">
                                        Enable current year on footer
                                    </label>
                                    <label className="switch">
                                        <input
                                            type="checkbox"
                                            name="is_year_footer"
                                            checked={form.is_year_footer || false}
                                            onChange={(e) =>
                                                setForm({ ...form, is_year_footer: e.target.checked })
                                            }
                                        />
                                        <span className="slider round"></span>
                                    </label>
                                </div>
                            </div>

                            <div className="text-end mb-2">
                                <button type="submit" className="btn btn-sm add-btn">
                                    Save
                                </button>
                            </div>
                        </div>
                    </form>
                );

            case 'Role':
                return (
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            {/* Left Column */}
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="form-label d-block mb-2">
                                        Employee can manage own contact information
                                    </label>
                                    <label className="switch">
                                        <input
                                            type="checkbox"
                                            name="emp_manage_contact"
                                            checked={form.emp_manage_contact || false}
                                            onChange={(e) =>
                                                setForm({ ...form, emp_manage_contact: e.target.checked })
                                            }
                                        />
                                        <span className="slider round"></span>
                                    </label>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label d-block mb-2">
                                        Employee can manage own bank account
                                    </label>
                                    <label className="switch">
                                        <input
                                            type="checkbox"
                                            name="emp_manage_bank"
                                            checked={form.emp_manage_bank || false}
                                            onChange={(e) =>
                                                setForm({ ...form, emp_manage_bank: e.target.checked })
                                            }
                                        />
                                        <span className="slider round"></span>
                                    </label>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label d-block mb-2">
                                        Employee can manage own qualification
                                    </label>
                                    <label className="switch">
                                        <input
                                            type="checkbox"
                                            name="emp_manage_qualification"
                                            checked={form.emp_manage_qualification || false}
                                            onChange={(e) =>
                                                setForm({ ...form, emp_manage_qualification: e.target.checked })
                                            }
                                        />
                                        <span className="slider round"></span>
                                    </label>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label d-block mb-2">
                                        Employee can manage own work experience
                                    </label>
                                    <label className="switch">
                                        <input
                                            type="checkbox"
                                            name="emp_manage_work_exp"
                                            checked={form.emp_manage_work_exp || false}
                                            onChange={(e) =>
                                                setForm({ ...form, emp_manage_work_exp: e.target.checked })
                                            }
                                        />
                                        <span className="slider round"></span>
                                    </label>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="form-label d-block mb-2">
                                        Employee can manage own documents
                                    </label>
                                    <label className="switch">
                                        <input
                                            type="checkbox"
                                            name="emp_manage_doc"
                                            checked={form.emp_manage_doc || false}
                                            onChange={(e) =>
                                                setForm({ ...form, emp_manage_doc: e.target.checked })
                                            }
                                        />
                                        <span className="slider round"></span>
                                    </label>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label d-block mb-2">
                                        Employee can manage own profile picture
                                    </label>
                                    <label className="switch">
                                        <input
                                            type="checkbox"
                                            name="emp_manage_profile_pic"
                                            checked={form.emp_manage_profile_pic || false}
                                            onChange={(e) =>
                                                setForm({ ...form, emp_manage_profile_pic: e.target.checked })
                                            }
                                        />
                                        <span className="slider round"></span>
                                    </label>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label d-block mb-2">
                                        Employee can manage own profile information
                                    </label>
                                    <label className="switch">
                                        <input
                                            type="checkbox"
                                            name="emp_manage_profile_info"
                                            checked={form.emp_manage_profile_info || false}
                                            onChange={(e) =>
                                                setForm({ ...form, emp_manage_profile_info: e.target.checked })
                                            }
                                        />
                                        <span className="slider round"></span>
                                    </label>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label d-block mb-2">
                                        Employee can manage own social information
                                    </label>
                                    <label className="switch">
                                        <input
                                            type="checkbox"
                                            name="emp_manage_social_info"
                                            checked={form.emp_manage_social_info || false}
                                            onChange={(e) =>
                                                setForm({ ...form, emp_manage_social_info: e.target.checked })
                                            }
                                        />
                                        <span className="slider round"></span>
                                    </label>
                                </div>
                            </div>

                            <div className="text-end mb-2">
                                <button type="submit" className="btn btn-sm add-btn">
                                    Save
                                </button>
                            </div>
                        </div>
                    </form>
                );


            case 'Attendance':
                return (
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            {/* Left Column */}
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="form-label d-block mb-2">
                                        Enable clock-in button on header{" "}
                                        <span style={{ fontSize: "10px" }}>
                                            (It will show everywhere on the system, but in employee panel only.)
                                        </span>
                                    </label>
                                    <label className="switch">
                                        <input
                                            type="checkbox"
                                            name="enable_clock_in_btn"
                                            checked={form.enable_clock_in_btn || false}
                                            onChange={(e) =>
                                                setForm({ ...form, enable_clock_in_btn: e.target.checked })
                                            }
                                        />
                                        <span className="slider round"></span>
                                    </label>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="form-label d-block mb-2">
                                        Enable clock in & clock out
                                    </label>
                                    <label className="switch">
                                        <input
                                            type="checkbox"
                                            name="enable_clock_in_out"
                                            checked={form.enable_clock_in_out || false}
                                            onChange={(e) =>
                                                setForm({ ...form, enable_clock_in_out: e.target.checked })
                                            }
                                        />
                                        <span className="slider round"></span>
                                    </label>
                                </div>
                            </div>

                            <div className="text-end mb-2">
                                <button type="submit" className="btn btn-sm add-btn">
                                    Save
                                </button>
                            </div>
                        </div>
                    </form>
                );


            case 'Payroll':
                return (
                    <form onSubmit={handleSubmit}>
                        <div className="col-md-12">
                            <div className="row">
                                {/* Left Column */}
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label>Payslip password format</label>
                                        <select
                                            className="form-control"
                                            name="payslip_pass_format"
                                            value={form.payslip_pass_format || ""}
                                            onChange={handleChange}
                                        >
                                            <option value="dob">Employee Date of Birth (29072025)</option>
                                            <option value="contact">Employee Contact Number (123456789)</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label className="form-label d-block mb-2">
                                            Enable Password generate for payslip
                                        </label>
                                        <label className="switch">
                                            <input
                                                type="checkbox"
                                                name="enable_payslip_password"
                                                checked={form.enable_payslip_password || false}
                                                onChange={(e) =>
                                                    setForm({ ...form, enable_payslip_password: e.target.checked })
                                                }
                                            />
                                            <span className="slider round"></span>
                                        </label>
                                    </div>
                                </div>

                                <div className="text-end mb-2">
                                    <button type="submit" className="btn btn-sm add-btn">
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-12">
                            <div className="row mt-3">
                                <div className="card no-radius">
                                    <div className="card-header d-flex justify-content-between align-items-center text-white new-emp-bg">
                                        <span>Payroll Configuration (for payroll pdf)</span>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label mt-2">Logo</label>

                                    <div className="text-start">
                                        <input
                                            type="file"
                                            name="payslip_logo"
                                            className="form-control"
                                            accept=".gif,.png,.jpg,.jpeg"
                                            onChange={(e) => {
                                                if (e.target.files[0]) {
                                                    setForm({ ...form, payslip_logo: e.target.files[0] });
                                                }
                                            }}
                                        />

                                        {form.payslip_logo && (
                                            <div className="mt-2">
                                                <img
                                                    src={
                                                        typeof form.payslip_logo === "string"
                                                            ? `http://localhost:3000/uploads/${form.payslip_logo}`
                                                            : URL.createObjectURL(form.payslip_logo)
                                                    }
                                                    alt="Payslip Logo"
                                                    style={{ maxWidth: "150px", maxHeight: "150px" }}
                                                />
                                                <div className="mt-1">
                                                    <button
                                                        type="button"
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => setForm({ ...form, payslip_logo: null })}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div
                                        className="mt-2 text-muted"
                                        style={{ fontSize: "12px", lineHeight: "1.5" }}
                                    >
                                        <p className="mb-1">
                                            - Upload file types only: <strong>gif, png, jpg, jpeg</strong>
                                        </p>
                                        <p className="mb-1">
                                            - Recommended Size: <strong>160 x 40</strong>
                                        </p>
                                        <p className="mb-0">
                                            - <strong>White background</strong> with <strong>black text</strong> for best clarity
                                        </p>
                                    </div>

                                    <div className="text-end">
                                        <button type="submit" className="btn btn-sm add-btn">
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                );


            case 'Recruitment':
                return (
                    <>
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-12">

                                    {/* Enable Jobs */}
                                    <div className="mb-3">
                                        <label className="form-label d-block mb-2">Enable Jobs for employees</label>
                                        <label className="switch">
                                            <input
                                                type="checkbox"
                                                name="enable_employee_job"
                                                checked={form.enable_employee_job || false}
                                                onChange={(e) =>
                                                    setForm({ ...form, enable_employee_job: e.target.checked })
                                                }
                                            />
                                            <span className="slider round"></span>
                                        </label>
                                    </div>


                                    <div className="mb-3">
                                        <label className="form-label d-block mb-2">Job Application file format</label>
                                        <div
                                            className="form-control d-flex align-items-center fileFormat"
                                            style={{
                                                minHeight: '42px',
                                                gap: '6px',
                                                padding: '4px 6px',
                                                borderRadius: '4px',
                                                overflowX: 'auto',
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            {form.job_app_format.map((format, index) => (
                                                <span
                                                    key={index}
                                                    style={{
                                                        background: '#00c4cc',
                                                        color: '#fff',
                                                        padding: '4px 10px',
                                                        borderRadius: '4px',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        fontSize: '14px',
                                                        marginRight: '6px'
                                                    }}
                                                >
                                                    {format}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveFormat(format)}
                                                        style={{
                                                            marginLeft: '6px',
                                                            background: 'transparent',
                                                            border: 'none',
                                                            color: '#fff',
                                                            fontSize: '16px',
                                                            lineHeight: '1',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            ))}

                                            <input
                                                type="text"
                                                value={input}
                                                onChange={(e) => setInput(e.target.value)}
                                                onKeyDown={handleAddFormat}
                                                style={{
                                                    border: 'none',
                                                    outline: 'none',
                                                    flex: 1,
                                                    minWidth: '100px',
                                                    fontSize: '14px'
                                                }}
                                            />
                                        </div>


                                    </div>


                                </div>

                                {/* Save Button */}
                                <div className="text-end mb-2">
                                    <button type="submit" className="btn btn-sm add-btn">Save</button>
                                </div>
                            </div>

                            {/* Logo Upload Section */}
                            <div className="col-md-12">
                                <div className="row mt-3">
                                    <div className="card no-radius">
                                        <div className="card-header d-flex justify-content-between align-items-center text-white new-emp-bg">
                                            <span>Job Listing Logo</span>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label mt-2">Logo</label>
                                        {/* <div className="text-start">
                                            <button type="button" className="btn btn-sm add-btn">Browse</button>
                                        </div> */}

                                        <div className="text-start">
                                            <input
                                                type="file"
                                                name="job_list_logo"
                                                className="form-control"
                                                accept=".gif,.png,.jpg,.jpeg"
                                                onChange={(e) => {
                                                    if (e.target.files[0]) {
                                                        setForm({ ...form, job_list_logo: e.target.files[0] });
                                                    }
                                                }}
                                            />

                                            {form.job_list_logo && (
                                                <div className="mt-2">
                                                    <img
                                                        src={
                                                            typeof form.job_list_logo === "string"
                                                                ? `http://localhost:3000/uploads/${form.job_list_logo}`
                                                                : URL.createObjectURL(form.job_list_logo)
                                                        }
                                                        alt="Payslip Logo"
                                                        style={{ maxWidth: "150px", maxHeight: "150px" }}
                                                    />
                                                    <div className="mt-1">
                                                        <button
                                                            type="button"
                                                            className="btn btn-danger btn-sm"
                                                            onClick={() => setForm({ ...form, job_list_logo: null })}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-2 text-muted" style={{ fontSize: '12px', lineHeight: '1.5' }}>
                                            <p className="mb-1">- Upload file types only: <strong>gif, png, jpg, jpeg</strong></p>
                                            <p className="mb-1">- Recommended Size: <strong>160 x 40</strong></p>
                                            <p className="mb-0">- <strong>White background</strong> with <strong>black text</strong> for best clarity</p>
                                        </div>

                                        <div className="text-end">
                                            <button type="submit" className="btn btn-sm add-btn">Save</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </>
                );


            case 'Email Noifications':
                return (
                    <div>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label d-block mb-2">Enable email notificationsp</label>
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        name="enable_email_notifi"
                                        checked={form.enable_email_notifi || false}
                                        onChange={(e) =>
                                            setForm({ ...form, enable_email_notifi: e.target.checked })
                                        }
                                    />
                                    <span className="slider round"></span>
                                </label>
                            </div>

                            <div className="text-end mb-2">
                                <button type="submit" className="btn btn-sm add-btn">Save</button>
                            </div>
                        </form>
                    </div>
                );

            case 'Animation Effects':
                return (
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            {/* Left Column */}
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label>Animation Effects</label>
                                    <select
                                        className="form-control"
                                        name="animation_top_menu"
                                        value={form.animation_top_menu}
                                        onChange={handleChange}
                                    >
                                        <option value="rollin">rollin</option>
                                        <option value="swing">swing</option>
                                        <option value="tada">tada</option>
                                        <option value="pulse">pulse</option>
                                        <option value="flipInX">flipInX</option>
                                        <option value="flipInY">flipInY</option>
                                    </select>
                                    <label style={{ color: "grey" }}>
                                        <span style={{ color: "grey", marginRight: "6px" }}>↑</span>
                                        Set animation effect for top menu.
                                    </label>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label>Animation Effects</label>
                                    <select
                                        className="form-control"
                                        name="animation_modal_dialogs"
                                        value={form.animation_modal_dialogs}
                                        onChange={handleChange}
                                    >
                                        <option value="rollin">rollin</option>
                                        <option value="swing">swing</option>
                                        <option value="tada">tada</option>
                                        <option value="pulse">pulse</option>
                                        <option value="flipInX">flipInX</option>
                                        <option value="flipInY">flipInY</option>
                                    </select>
                                    <label style={{ color: "grey" }}>
                                        <span style={{ color: "grey", marginRight: "6px" }}>↑</span>
                                        Set animation effect for modal dialogs.
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className="text-end mb-2">
                            <button type="submit" className="btn btn-sm add-btn">
                                Save
                            </button>
                        </div>
                    </form>
                );


            case "Notification Position":
                return (
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            {/* Position Select */}
                            <div className="col-md-4 mb-3">
                                <label>Position</label>
                                <select
                                    className="form-control"
                                    name="notification_position"
                                    value={form.notification_position || "tr"}
                                    onChange={handleChange}
                                >
                                    <option value="tr">Top Right</option>
                                    <option value="br">Bottom Right</option>
                                    <option value="bl">Bottom Left</option>
                                    <option value="tl">Top Left</option>
                                    <option value="tc">Top Center</option>
                                </select>
                                <label style={{ color: "grey", fontSize: "10px" }}>
                                    Set position for notifications.
                                </label>
                            </div>

                            {/* Enable Close Button */}
                            <div className="col-md-4 mb-3">
                                <label className="form-label d-block mb-2">
                                    Enable Close Button
                                </label>
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        name="enable_close_btn"
                                        checked={form.enable_close_btn || false}
                                        onChange={handleChange}
                                    />
                                    <span className="slider round"></span>
                                </label>
                            </div>

                            {/* Progress Bar */}
                            <div className="col-md-4 mb-3">
                                <label className="form-label d-block mb-2">Progress Bar</label>
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        name="progress_bar"
                                        checked={form.progress_bar || false}
                                        onChange={handleChange}
                                    />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className="text-end mb-2">
                            <button type="submit" className="btn btn-sm add-btn">
                                Save
                            </button>
                        </div>
                    </form>
                );


            case "Files Manager":

                return (
                    <form onSubmit={handleSubmit}>
                        <div className="col-md-12">
                            <div className="row">
                                <div className="col-md-3">
                                    <div className="mb-3">
                                        <label className="form-label">Max. File Size</label>
                                        <div className="input-group">
                                            <input
                                                type="number"
                                                name="file_size"
                                                className="form-control"
                                                placeholder="10"
                                                min="0"
                                                style={{ height: "38px" }}
                                                value={form.file_size || ""}
                                                onChange={handleChange}
                                            />
                                            <span
                                                className="input-group-text"
                                                style={{ height: "38px", backgroundColor: "#f1f1f1" }}
                                            >
                                                MB
                                            </span>
                                        </div>
                                    </div>
                                </div>



                                <div className="mb-3 col-md-9">
                                    <label className="form-label d-block mb-2">Job Application file format</label>
                                   <div
                                            className="form-control d-flex align-items-center fileFormat"
                                            style={{
                                                minHeight: '42px',
                                                gap: '6px',
                                                padding: '4px 6px',
                                                borderRadius: '4px',
                                                overflowX: 'auto',
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            {form.job_app_format.map((format, index) => (
                                                <span
                                                    key={index}
                                                    style={{
                                                        background: '#00c4cc',
                                                        color: '#fff',
                                                        padding: '4px 10px',
                                                        borderRadius: '4px',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        fontSize: '14px',
                                                        marginRight: '6px'
                                                    }}
                                                >
                                                    {format}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveFormat(format)}
                                                        style={{
                                                            marginLeft: '6px',
                                                            background: 'transparent',
                                                            border: 'none',
                                                            color: '#fff',
                                                            fontSize: '16px',
                                                            lineHeight: '1',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            ))}

                                            <input
                                                type="text"
                                                value={input}
                                                onChange={(e) => setInput(e.target.value)}
                                                onKeyDown={handleAddFormat}
                                                style={{
                                                    border: 'none',
                                                    outline: 'none',
                                                    flex: 1,
                                                    minWidth: '100px',
                                                    fontSize: '14px'
                                                }}
                                            />
                                        </div>

                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label d-block mb-2">
                                    Employee can view/download all department files
                                </label>
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        name="emp_download_dept_file"
                                        checked={form.emp_download_dept_file || false}
                                        onChange={handleChange}
                                    />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className="text-end mb-2">
                            <button type="submit" className="btn btn-sm add-btn">
                                Save
                            </button>
                        </div>
                    </form>
                );


            default:
            // return <p>{selectedDepartment} Section Coming Soon...</p>;
        }
    };

    return (
        <div className="custom-container">
            <h5>Settings</h5>
            <p style={{ fontSize: '15px', color: 'rgb(98, 98, 98)' }}>
                <span style={{ color: 'red' }}>Home</span> / Settings
            </p>

            <div className="row">

                <div className="col-md-3 mb-3">
                    <div className="card h-100">
                        <div className="card-body p-2">
                            <ul className="list-group list-group-flush">
                                {[
                                    'SYSTEM SETTINGS', 'General', 'System', 'Role', 'Attendance',
                                    'Payroll', 'Recruitment', 'Email Noifications', 'Animation Effects',
                                    'Notification Position', 'Files Manager'
                                ].map((dept, index) => {
                                    const icons = {
                                        'SYSTEM SETTINGS': 'fas fa-cogs',
                                        'General': 'fas fa-sliders-h',
                                        'System': 'fas fa-desktop',
                                        'Role': 'fas fa-user-shield',
                                        'Attendance': 'fas fa-calendar-check',
                                        'Payroll': 'fas fa-file-invoice-dollar',
                                        'Recruitment': 'fas fa-user-plus',
                                        'Email Noifications': 'fas fa-envelope-open-text',
                                        'Animation Effects': 'fas fa-magic',
                                        'Notification Position': 'fas fa-bell',
                                        'Files Manager': 'fas fa-folder-open'
                                    };

                                    const isHeading = dept === 'SYSTEM SETTINGS';

                                    return (
                                        <li
                                            key={index}
                                            className={`list-group-item department-item ${selectedDepartment === dept && !isHeading ? 'active' : ''}`}
                                            style={{
                                                cursor: isHeading ? 'default' : 'pointer',
                                                fontWeight: isHeading ? 'bold' : 'normal',
                                                backgroundColor: isHeading ? '#f8f9fa' : '',
                                                color: isHeading ? '#333' : ''
                                            }}
                                            onClick={() => {
                                                if (!isHeading) {
                                                    setSelectedDepartment(dept);
                                                }
                                            }}
                                        >
                                            {icons[dept] && <i className={`${icons[dept]} me-2 fs-6 text-secondary`}></i>}
                                            {dept}
                                        </li>
                                    );
                                })}
                            </ul>


                        </div>
                    </div>
                </div>

                <div className="col-md-9">
                    <div className="card no-radius">
                        <div className="card-header d-flex justify-content-between align-items-center text-white new-emp-bg">
                            <span>{selectedDepartment} Configuration</span>
                        </div>
                        <div className="card-body p-3">
                            {renderContent()}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default SettingPage;
