import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { useLocation, useParams } from 'react-router-dom';


const SettingPage = () => {
    const location = useLocation();
    const { state } = useLocation();
    const { id } = useParams();
    const [selectedDepartment, setSelectedDepartment] = useState('General');


    const [showModal, setShowModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [description, setDescription] = useState('');

    const [showAddForm, setShowAddForm] = useState(false);

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

    const handleRemove = (format) => {
        setFormats(formats.filter(f => f !== format));
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddFormat();
        }
    };


    const renderContent = () => {
        switch (selectedDepartment) {
            case 'General':
                return (
                    <div>
                        <div className="row">
                            {/* Left Column */}
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label>Company Name</label>
                                    <input type="text" className="form-control" placeholder="A TO Z EXIM" />
                                </div>

                                <div className="mb-3">
                                    <label>Contact Person</label>
                                    <input type="text" className="form-control" placeholder="7972891147" />
                                </div>

                                <div className="mb-3">
                                    <label>Email</label>
                                    <input type="text" className="form-control" placeholder="hr@bharatfreight.com" />
                                </div>

                                <div className="mb-3">
                                    <label>Phone</label>
                                    <input type="text" className="form-control" placeholder="7972891147" />
                                </div>

                            </div>

                            {/* Right Column */}
                            <div className="col-md-6">

                                <div className="mb-3">
                                    <label>Address</label>
                                    <input type="text" className="form-control mb-3" placeholder="5th Floor, Hubtown Solaris, 505, NS Phadke Marg, opp. Telli Galli, Vijay Nagar, Andheri East, Mumbai, Maharashtra 400069" />
                                    <input type="text" className="form-control" placeholder="5th Floor, Hubtown Solaris, 505, NS Phadke Marg, opp. Telli Galli, Vijay Nagar, Andheri East, Mumbai, Maharashtra 400069" />
                                </div>
                                <div className="row mb-3">
                                    <div className="col-md-4">
                                        <input type="text" className="form-control" placeholder="Test" />
                                    </div>
                                    <div className="col-md-4">
                                        <input type="text" className="form-control" placeholder="Federal" />
                                    </div>
                                    <div className="col-md-4">
                                        <input type="text" className="form-control" placeholder="44000" />
                                    </div>
                                </div>


                                <div className="mb-3">
                                    <label>Country</label>
                                    <select className="form-select">
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
                    </div>
                );

            case 'System':
                return (
                    <div>
                        <div className="row">
                            {/* Left Column */}
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label>Application Name</label>
                                    <input type="text" className="form-control" placeholder="A TO Z EXIM" />
                                </div>

                                <div className="mb-3">
                                    <label>Default Currency</label>
                                    <select className="form-control">
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
                                    <label>Default Currency (Symbol/Code) </label>
                                    <select className="form-control">
                                        <option value="cc">Currency Code</option>
                                        <option value="cs">Currency Symbol</option>
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label>Currency Position</label>
                                    <select className="form-control">
                                        <option value="cc">Prefix</option>
                                        <option value="cs">Suffix</option>
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label d-block mb-2">Enable CodeIgniter page rendered on footer</label>

                                    <label className="switch">
                                        <input type="checkbox" />
                                        <span className="slider round"></span>
                                    </label>
                                </div>

                            </div>

                            {/* Right Column */}
                            <div className="col-md-6">

                                <div className="mb-3">
                                    <label className="form-label">Date Format</label>
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="dateFormat"
                                            id="format1"
                                            value="dd-mm-yyyy"
                                            style={{ width: '1em', height: '1em', borderRadius: '50%', marginTop: '6px' }}
                                        />
                                        <label className="form-check-label ms-2" htmlFor="format1">
                                            29-07-2025 (dd-mm-YYYY)
                                        </label>
                                    </div>

                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="dateFormat"
                                            id="format2"
                                            value="mm-dd-yyyy"
                                            style={{ width: '1em', height: '1em', borderRadius: '50%', marginTop: '6px' }}
                                        />
                                        <label className="form-check-label ms-2" htmlFor="format2">
                                            07-29-2025 (mm-dd-YYYY)
                                        </label>
                                    </div>

                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="dateFormat"
                                            id="format3"
                                            value="dd-MMM-yyyy"
                                            style={{ width: '1em', height: '1em', borderRadius: '50%', marginTop: '6px' }}
                                        />
                                        <label className="form-check-label ms-2" htmlFor="format3">
                                            29-Jul-2025 (dd-MMM-YYYY)
                                        </label>
                                    </div>

                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="dateFormat"
                                            id="format4"
                                            value="MMM-dd-yyyy"
                                            style={{ width: '1em', height: '1em', borderRadius: '50%', marginTop: '6px' }}
                                        />
                                        <label className="form-check-label ms-2" htmlFor="format4">
                                            Jul-29-2025 (MMM-dd-YYYY)
                                        </label>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label>Footer Text</label>
                                    <input type="text" className="form-control" placeholder="A TO Z EXIM" />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label d-block mb-2">Enable current year on footer</label>

                                    <label className="switch">
                                        <input type="checkbox" />
                                        <span className="slider round"></span>
                                    </label>
                                </div>

                            </div>
                            <div className="text-end mb-2">
                                <button type="submit" className="btn btn-sm add-btn">Save</button>
                            </div>

                        </div>
                    </div>
                );

            case 'Role':
                return (
                    <div>
                        <div className="row">
                            {/* Left Column */}
                            <div className="col-md-6">

                                <div className="mb-3">
                                    <label className="form-label d-block mb-2">Employee can manage own contact information</label>
                                    <label className="switch">
                                        <input type="checkbox" />
                                        <span className="slider round"></span>
                                    </label>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label d-block mb-2">Employee can manage own bank account</label>
                                    <label className="switch">
                                        <input type="checkbox" />
                                        <span className="slider round"></span>
                                    </label>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label d-block mb-2">Employee can manage own qualification</label>
                                    <label className="switch">
                                        <input type="checkbox" />
                                        <span className="slider round"></span>
                                    </label>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label d-block mb-2">Employee can manage own work experience</label>
                                    <label className="switch">
                                        <input type="checkbox" />
                                        <span className="slider round"></span>
                                    </label>
                                </div>

                            </div>

                            {/* Right Column */}
                            <div className="col-md-6">

                                <div className="mb-3">
                                    <label className="form-label d-block mb-2">Employee can manage own documents</label>
                                    <label className="switch">
                                        <input type="checkbox" />
                                        <span className="slider round"></span>
                                    </label>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label d-block mb-2">Employee can manage own profile picture</label>
                                    <label className="switch">
                                        <input type="checkbox" />
                                        <span className="slider round"></span>
                                    </label>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label d-block mb-2">Employee can manage own profile information</label>
                                    <label className="switch">
                                        <input type="checkbox" />
                                        <span className="slider round"></span>
                                    </label>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label d-block mb-2">Employee can manage own social information</label>
                                    <label className="switch">
                                        <input type="checkbox" />
                                        <span className="slider round"></span>
                                    </label>
                                </div>

                            </div>

                            <div className="text-end mb-2">
                                <button type="submit" className="btn btn-sm add-btn">Save</button>
                            </div>

                        </div>
                    </div>
                );

            case 'Attendance':
                return (
                    <div>
                        <div className="row">
                            {/* Left Column */}
                            <div className="col-md-6">

                                <div className="mb-3">
                                    <label className="form-label d-block mb-2">Enable clock-in button on header <span style={{ fontSize: '10px' }}> (It will show everywhere on the system, but in employee panel only.)</span></label>
                                    <label className="switch">
                                        <input type="checkbox" />
                                        <span className="slider round"></span>
                                    </label>
                                </div>

                            </div>

                            {/* Right Column */}
                            <div className="col-md-6">

                                <div className="mb-3">
                                    <label className="form-label d-block mb-2">Enable clock in & clock out</label>
                                    <label className="switch">
                                        <input type="checkbox" />
                                        <span className="slider round"></span>
                                    </label>
                                </div>
                            </div>

                            <div className="text-end mb-2">
                                <button type="submit" className="btn btn-sm add-btn">Save</button>
                            </div>

                        </div>
                    </div>
                );

            case 'Payroll':
                return (
                    <>
                        <div className='col-md-12'>
                            <div className="row">
                                {/* Left Column */}
                                <div className="col-md-6">

                                    <div className="mb-3">
                                        <label>Payslip password format</label>
                                        <select className="form-control">
                                            <option value="1">Employee Date of Birth (29072025)</option>
                                            <option value="2">Employee Contact Number (123456789)</option>
                                        </select>
                                    </div>

                                </div>

                                {/* Right Column */}
                                <div className="col-md-6">

                                    <div className="mb-3">
                                        <label className="form-label d-block mb-2">Enable Password generate for payslip</label>
                                        <label className="switch">
                                            <input type="checkbox" />
                                            <span className="slider round"></span>
                                        </label>
                                    </div>
                                </div>

                                <div className="text-end mb-2">
                                    <button type="submit" className="btn btn-sm add-btn">Save</button>
                                </div>

                            </div>
                        </div>

                        <div className='col-md-12'>
                            <div className="row mt-3">
                                <div className="card no-radius">
                                    <div className="card-header d-flex justify-content-between align-items-center text-white new-emp-bg">
                                        <span>Payroll Configuration (for payroll pdf)</span>
                                    </div>
                                </div>


                                <div className="mb-4">
                                    <label className="form-label mt-2">Logo</label>


                                    <div className="text-start">
                                        <button type="button" className="btn btn-sm add-btn">Browse</button>
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
                    </>
                );

            case 'Recruitment':
                return (
                    <>
                        <div className="row">
                            <div className="col-md-12">

                                <div className="mb-3">
                                    <label className="form-label d-block mb-2">Enable Jobs for employees</label>
                                    <label className="switch">
                                        <input type="checkbox" />
                                        <span className="slider round"></span>
                                    </label>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label d-block mb-2">Job Application file format</label>

                                    <div
                                        className="form-control d-flex flex-wrap align-items-center"
                                        style={{
                                            minHeight: '42px',
                                            gap: '6px',
                                            padding: '4px 6px',
                                            borderRadius: '4px',
                                        }}
                                    >
                                        {formats.map((format, index) => (
                                            <span
                                                key={index}
                                                style={{
                                                    background: '#00c4cc',
                                                    color: '#fff',
                                                    padding: '4px 10px',
                                                    borderRadius: '4px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    fontSize: '14px',
                                                }}
                                            >
                                                {format}
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemove(format)}
                                                    style={{
                                                        marginLeft: '6px',
                                                        background: 'transparent',
                                                        border: 'none',
                                                        color: '#fff',
                                                        fontSize: '16px',
                                                        lineHeight: '1',
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}

                                        <input
                                            type="text"
                                            style={{
                                                border: 'none',
                                                outline: 'none',
                                                flex: 1,
                                                minWidth: '100px',
                                                fontSize: '14px'
                                            }}
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                        />
                                    </div>
                                </div>

                            </div>

                            <div className="text-end mb-2">
                                <button type="submit" className="btn btn-sm add-btn">Save</button>
                            </div>

                        </div>

                        <div className='col-md-12'>
                            <div className="row mt-3">
                                <div className="card no-radius">
                                    <div className="card-header d-flex justify-content-between align-items-center text-white new-emp-bg">
                                        <span>Job Listing Logo</span>
                                    </div>
                                </div>


                                <div className="mb-4">
                                    <label className="form-label mt-2">Logo</label>


                                    <div className="text-start">
                                        <button type="button" className="btn btn-sm add-btn">Browse</button>
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
                    </>
                );

            case 'Email Noifications':
                return (
                    <div>
                        <div className="mb-3">
                            <label className="form-label d-block mb-2">Enable email notificationsp</label>
                            <label className="switch">
                                <input type="checkbox" />
                                <span className="slider round"></span>
                            </label>
                        </div>

                        <div className="text-end mb-2">
                            <button type="submit" className="btn btn-sm add-btn">Save</button>
                        </div>

                    </div>
                );

            case 'Animation Effects':
                return (
                    <div>
                        <div className="row">
                            {/* Left Column */}
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label>Animation Effects</label>
                                    <select className="form-control">
                                        <option value="1">rollin</option>
                                        <option value="2">swing</option>
                                        <option value="3">tada</option>
                                        <option value="4">pulse</option>
                                        <option value="5">flipInX</option>
                                        <option value="6">flipInY</option>
                                    </select>
                                    <label style={{ color: 'grey' }}>
                                        <span style={{ color: 'grey', marginRight: '6px' }}>↑</span>
                                        Set animation effect for top menu.
                                    </label>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label>Animation Effects</label>
                                    <select className="form-control">
                                        <option value="1">rollin</option>
                                        <option value="2">swing</option>
                                        <option value="3">tada</option>
                                        <option value="4">pulse</option>
                                        <option value="5">flipInX</option>
                                        <option value="6">flipInY</option>
                                    </select>
                                    <label style={{ color: 'grey' }}>
                                        <span style={{ color: 'grey', marginRight: '6px' }}>↑</span>
                                        Set animation effect for modal dialogs.
                                    </label>
                                </div>
                            </div>
                            <div className="text-end mb-2">
                                <button type="submit" className="btn btn-sm add-btn">Save</button>
                            </div>

                        </div>
                    </div>
                );

            case 'Notification Position':
                return (
                    <div>
                        <div className="row">
                            {/* Left Column */}
                            {/* <div className="col-md-12"> */}
                            <div className="col-md-4 mb-3">
                                <label>Position</label>
                                <select className="form-control">
                                    <option value="tr">Top Right</option>
                                    <option value="br">Bottom Right</option>
                                    <option value="bl">Bottom Left</option>
                                    <option value="tl">Top Left</option>
                                    <option value="tc">Top Center</option>
                                </select>
                                <label style={{ color: 'grey', fontSize: '10px' }}>
                                    Set position for notifications.
                                </label>
                            </div>

                            <div className="col-md-4 mb-3">
                                <label className="form-label d-block mb-2">Enable Close Button</label>
                                <label className="switch">
                                    <input type="checkbox" />
                                    <span className="slider round"></span>
                                </label>
                            </div>

                            <div className="col-md-4 mb-3">
                                <label className="form-label d-block mb-2">Progress Bar</label>
                                <label className="switch">
                                    <input type="checkbox" />
                                    <span className="slider round"></span>
                                </label>
                            </div>

                            {/* </div> */}
                        </div>

                        <div className="text-end mb-2">
                            <button type="submit" className="btn btn-sm add-btn">Save</button>
                        </div>
                    </div>
                );

            case 'Files Manager':
                return (
                    <div>
                        <div className="col-md-12">

                            <div className='row'>
                                <div className='col-md-3'>
                                    <div className="mb-3">
                                        <label className="form-label">Max. File Size</label>
                                        <div className="input-group">
                                            <input
                                                type="number"
                                                className="form-control"
                                                placeholder="10"
                                                min="0"
                                                style={{ height: '38px' }}
                                            />
                                            <span
                                                className="input-group-text"
                                                style={{ height: '38px', backgroundColor: '#f1f1f1' }}
                                            >
                                                MB
                                            </span>
                                        </div>
                                    </div>
                                </div>


                                <div className='col-md-9'>

                                    <div className="mb-3">
                                        <label className="form-label d-block mb-2">Allowed extensions</label>

                                        <div
                                            className="form-control d-flex flex-wrap align-items-center"
                                            style={{
                                                minHeight: '42px',
                                                gap: '6px',
                                                padding: '4px 6px',
                                                borderRadius: '4px',
                                            }}
                                        >
                                            {formats1.map((format, index) => (
                                                <span
                                                    key={index}
                                                    style={{
                                                        background: '#00c4cc',
                                                        color: '#fff',
                                                        padding: '2px 6px',
                                                        borderRadius: '4px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        fontSize: '10px',
                                                    }}
                                                >
                                                    {format}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemove(format)}
                                                        style={{
                                                            marginLeft: '6px',
                                                            background: 'transparent',
                                                            border: 'none',
                                                            color: '#fff',
                                                            fontSize: '16px',
                                                            lineHeight: '1',
                                                            cursor: 'pointer',
                                                        }}
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            ))}

                                            <input
                                                type="text"
                                                style={{
                                                    border: 'none',
                                                    outline: 'none',
                                                    flex: 1,
                                                    minWidth: '100px',
                                                    fontSize: '14px'
                                                }}
                                                value={input}
                                                onChange={(e) => setInput(e.target.value)}
                                                onKeyDown={handleKeyDown}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label d-block mb-2">Employee can view/download all department files</label>
                                <label className="switch">
                                    <input type="checkbox" />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                        </div>

                        <div className="text-end mb-2">
                            <button type="submit" className="btn btn-sm add-btn">Save</button>
                        </div>
                    </div>
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
