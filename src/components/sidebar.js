import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    FaHome, FaBuilding, FaUser, FaMoneyCheckAlt, FaChartLine, FaChartBar, FaCog, FaBars, FaSignOutAlt,
    FaRegClock, FaTasks, FaHeadset, FaNewspaper, FaFileAlt, FaUserPlus, FaEnvelope
} from 'react-icons/fa';
import { FaAngleDown, FaAngleRight, FaGraduationCap, FaDatabase } from 'react-icons/fa';
import './sidebar.css';


const Sidebar = ({ collapsed, expanded }) => {

    const [openMenu, setOpenMenu] = useState(null);

    const handleToggle = (menuName) => {
        setOpenMenu(prev => (prev === menuName ? null : menuName));
    };

    const handleMouseEnter = (event) => {
        const itemRect = event.currentTarget.getBoundingClientRect();
        document.documentElement.style.setProperty('--hover-top', `${itemRect.top}px`);
    };


    return (
        <div className={`sidebar ${collapsed ? "collapsed" : ""} ${expanded ? "expanded" : ""}`}>

            <ul className="list-unstyled mt-4">
                <li className="sidebar-item main-more">Main</li>

                <li className="sidebar-item">
                    <Link to="/dashboard">
                        <FaHome className="me-2 sideicon" /> {!collapsed && <span className="label">Dashboard</span>}
                    </Link>
                </li>


                <li
                    className="sidebar-item" onMouseEnter={handleMouseEnter}
                    onClick={() => {
                        if (!collapsed) handleToggle('organization');
                    }}
                >
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <FaBuilding className="me-2 sideicon" />
                            {!collapsed && <span className="label">Organization</span>}
                        </div>
                        {!collapsed && (openMenu === 'organization' ? <FaAngleDown /> : <FaAngleRight />)}
                    </div>

                    {/* Dropdown: changes based on collapsed or expanded */}
                    <ul
                        className={`dropdown ${collapsed ? 'flyout' : ''} ${(!collapsed && openMenu === 'organization') || collapsed ? 'open' : ''
                            }`}
                    >
                        <li><Link to="/location">Location</Link></li>
                        <li><Link to="/department">Department</Link></li>
                        <li><Link to="/designation">Designation</Link></li>
                        <li><Link to="/announcements">Announcements</Link></li>
                        <li><Link to="/orgpolicies">OrgPolicies</Link></li>
                        <li><Link to="/expense">Expense</Link></li>
                    </ul>
                </li>

                <li
                    className="sidebar-item" onMouseEnter={handleMouseEnter}
                    onClick={() => {
                        if (!collapsed) handleToggle('employees');
                    }}
                >
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <FaUser className="me-2 sideicon" />
                            {!collapsed && <span className="label">Employees</span>}
                        </div>
                        {!collapsed && (openMenu === 'employees' ? <FaAngleDown /> : <FaAngleRight />)}
                    </div>

                    <ul
                        className={`dropdown ${collapsed ? 'flyout' : ''} ${(!collapsed && openMenu === 'employees') || collapsed ? 'open' : ''
                            }`}
                    >
                        <li><Link to="/employees">Employees</Link></li>
                        <li><Link to="/awards">Awards</Link></li>
                        <li><Link to="/transfers">Transfer</Link></li>
                        <li><Link to="/resignations">Resignations</Link></li>
                        <li><Link to="/travels">Travels</Link></li>
                        <li><Link to="/promotions">Promotions</Link></li>
                        <li><Link to="/complaints">Complaints</Link></li>
                        <li><Link to="/warnings">Warnings</Link></li>
                        <li><Link to="/terminations">Terminations</Link></li>
                        <li><Link to="/lastLogin">Employees Last Login</Link></li>
                        <li><Link to="/employeeExit">Employees Exit</Link></li>
                    </ul>
                </li>


                <li
                    className="sidebar-item" onMouseEnter={handleMouseEnter}
                    onClick={() => {
                        if (!collapsed) handleToggle('performance');
                    }}
                >
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <FaChartLine className="me-2 sideicon" />
                            {!collapsed && <span className="label">Performance</span>}
                        </div>
                        {!collapsed && (openMenu === 'performance' ? <FaAngleDown /> : <FaAngleRight />)}
                    </div>

                    <ul
                        className={`dropdown ${collapsed ? 'flyout' : ''} ${(!collapsed && openMenu === 'performance') || collapsed ? 'open' : ''
                            }`}
                    >
                        <li>
                            <Link to="/performanceIndicator">Performance Indicator</Link>
                        </li>
                        <li>
                            <Link to="/performanceAppraisal">Performance Appraisal</Link>
                        </li>
                    </ul>
                </li>


                <li
                    className="sidebar-item" onMouseEnter={handleMouseEnter}
                    onClick={() => {
                        if (!collapsed) handleToggle('timesheet');
                    }}
                >
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <FaRegClock className="me-2 sideicon" />
                            {!collapsed && <span className="label">Timesheet</span>}
                        </div>
                        {!collapsed && (openMenu === 'timesheet' ? <FaAngleDown /> : <FaAngleRight />)}
                    </div>

                    <ul
                        className={`dropdown ${collapsed ? 'flyout' : ''} ${(!collapsed && openMenu === 'timesheet') || collapsed ? 'open' : ''
                            }`}
                    >
                        <li><Link to="/attendance">Attendance</Link></li>
                        <li><Link to="/datewiseattendance">Date wise Attendance</Link></li>
                        <li><Link to="/updateattendance">Update Attendance</Link></li>
                        <li><Link to="/importattendance">Import Attendance</Link></li>
                        <li><Link to="/leaves">Leaves</Link></li>
                        <li><Link to="/officeshifts">Office Shifts</Link></li>
                        <li><Link to="/holidays">Holidays</Link></li>
                    </ul>
                </li>


                <li
                    className="sidebar-item" onMouseEnter={handleMouseEnter}
                    onClick={() => {
                        if (!collapsed) handleToggle('payroll');
                    }}
                >
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <FaMoneyCheckAlt className="me-2 sideicon" />
                            {!collapsed && <span className="label">Payroll</span>}
                        </div>
                        {!collapsed && (openMenu === 'payroll' ? <FaAngleDown /> : <FaAngleRight />)}
                    </div>

                    <ul
                        className={`dropdown ${collapsed ? 'flyout' : ''} ${(!collapsed && openMenu === 'payroll') || collapsed ? 'open' : ''
                            }`}
                    >
                        <li><Link to="/managesalary">Manage Salary</Link></li>
                        <li><Link to="/generatepayslip">Generate Payslip</Link></li>
                        <li><Link to="/paymenthistory">Payment History</Link></li>
                    </ul>
                </li>



                <li className="sidebar-item">
                    <Link to="/projects">
                        <FaTasks className="me-2 sideicon" /> {!collapsed && <span className="label">Projects</span>}
                    </Link>
                </li>

                <li className="sidebar-item">
                    <Link to="/supportrequest">
                        <FaHeadset className="me-2 sideicon" /> {!collapsed && <span className="label">Support Request</span>}
                    </Link>
                </li>

                <li
                    className="sidebar-item" onMouseEnter={handleMouseEnter}
                    onClick={() => {
                        if (!collapsed) handleToggle('recruitment');
                    }}
                >
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <FaNewspaper className="me-2 sideicon" />
                            {!collapsed && <span className="label">Recruitment</span>}
                        </div>
                        {!collapsed && (openMenu === 'recruitment' ? <FaAngleDown /> : <FaAngleRight />)}
                    </div>

                    <ul
                        className={`dropdown ${collapsed ? 'flyout' : ''} ${(!collapsed && openMenu === 'recruitment') || collapsed ? 'open' : ''
                            }`}
                    >
                        <li>
                            <Link to="/jobcandidates">Job Candidates</Link>
                        </li>
                    </ul>
                </li>

                <li
                    className="sidebar-item" onMouseEnter={handleMouseEnter}
                    onClick={() => {
                        if (!collapsed) handleToggle('training');
                    }}
                >
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <FaGraduationCap className="me-2 sideicon" />
                            {!collapsed && <span className="label">Training</span>}
                        </div>
                        {!collapsed && (openMenu === 'training' ? <FaAngleDown /> : <FaAngleRight />)}
                    </div>

                    <ul
                        className={`dropdown ${collapsed ? 'flyout' : ''} ${(!collapsed && openMenu === 'training') || collapsed ? 'open' : ''
                            }`}
                    >
                        <li><Link to="/traininglist">Training List</Link></li>
                        <li><Link to="/trainingtype">Training Type</Link></li>
                        <li><Link to="/trainerslist">Trainers List</Link></li>
                    </ul>
                </li>


                <li className="sidebar-item">
                    <Link to="/filesmanager">
                        <FaFileAlt className="me-2 sideicon" /> {!collapsed && <span className="label">Files Manager</span>}
                    </Link>
                </li>

                <li className="sidebar-item">
                    <FaDatabase className="me-2 sideicon" /> {!collapsed && <span className="label">Employees Directory</span>}
                </li>

                <li
                    className="sidebar-item" onMouseEnter={handleMouseEnter}
                    onClick={() => {
                        if (!collapsed) handleToggle('reports');
                    }}
                >
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <FaChartBar className="me-2 sideicon" />
                            {!collapsed && <span className="label">Reports</span>}
                        </div>
                        {!collapsed && (openMenu === 'reports' ? <FaAngleDown /> : <FaAngleRight />)}
                    </div>

                    <ul
                        className={`dropdown ${collapsed ? 'flyout' : ''} ${(!collapsed && openMenu === 'reports') || collapsed ? 'open' : ''
                            }`}
                    >
                        <li><Link to="/accountstatements">Account Statements</Link></li>
                        <li><Link to="/expensereport">Expense Report</Link></li>
                        <li><Link to="/incomereport">Income Report</Link></li>
                        <li><Link to="/transferreport">Transfer Report</Link></li>
                    </ul>
                </li>


                <li style={{ marginTop: '25px' }} className="sidebar-item main-more">More</li>

                <li className="sidebar-item">
                    <Link to="/settingPage">
                        <FaCog className="me-2 sideicon" /> {!collapsed && <span className="label">Settings</span>}
                    </Link>
                </li>

                <li className="sidebar-item">
                    <Link to="/constants">
                    <FaBars className="me-2 sideicon" /> {!collapsed && <span className="label">Constants</span>}
                    </Link>
                </li>

                <li className="sidebar-item">
                    <Link to="/setroles">
                        <FaUserPlus className="me-2 sideicon" /> {!collapsed && <span className="label">Set Roles</span>}
                    </Link>
                </li>

                <li className="sidebar-item">
                    <Link to="/databasebackup">
                        <FaDatabase className="me-2 sideicon" /> {!collapsed && <span className="label">Database Backup</span>}
                    </Link>
                </li>

                <li className="sidebar-item">
                    <Link to="/emailtemplates">
                        <FaUserPlus className="me-2 sideicon" /> {!collapsed && <span className="label">Email Templates</span>}
                    </Link>
                </li>

                <li className="sidebar-item">
                    <Link to="/policies">
                        <FaEnvelope className="me-2 sideicon" /> {!collapsed && <span className="label">Policies</span>}
                    </Link>
                </li>



                <li className="sidebar-item">
                    <FaSignOutAlt className="me-2 sideicon" /> {!collapsed && <span className="label">Logout</span>}
                </li>

            </ul >
        </div >
    );
};

export default Sidebar;
