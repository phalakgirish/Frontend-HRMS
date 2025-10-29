import React, { useRef, useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import html2pdf from 'html2pdf.js';
import axios from 'axios';

const Payslip = () => {
    const { empId } = useParams();
    const pdfRef = useRef();

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [employee, setEmployee] = useState(null);



    useEffect(() => {
        const fetchData = async () => {
            try {
                const empRes = await axios.get(`http://localhost:3000/employee`);
                const payrollRes = await axios.get(`http://localhost:3000/payroll`);
                const bankRes = await axios.get(`http://localhost:3000/employee-bankaccount/employee/${empId}`);
      console.log("🏦 Bank API response:", bankRes.data);

                const emp = empRes.data.find(e => e._id === empId || e.id === empId);
                const payroll = payrollRes.data.find(p => p.empId === empId || p._id === empId);
               const bank = Array.isArray(bankRes.data) ? bankRes.data[0] : bankRes.data;


                if (emp) {
                    setEmployee({
                        ...emp,
                        basic: payroll?.basic,
                        hra: payroll?.hra,
                        executive: payroll?.executive,
                        conveyance: payroll?.conveyance,
                        medical: payroll?.medical,
                        pfEmployer: payroll?.pfEmployer,
                        pt: payroll?.pt,
                        grossSalary: payroll?.grossSalary,
                        netSalary: payroll?.netSalary,
                        totalDeductions: payroll?.totalDeductions,
                        account_title: bank?.account_title,
                        account_number: bank?.account_number,
                        account_bank_name: bank?.account_bank_name,
                        aacount_bank_code: bank?.aacount_bank_code,
                        account_bank_branch: bank?.account_bank_branch
                    });
                } else {
                    setEmployee(null);
                }
            } catch (err) {
                console.error(err);
                setEmployee(null);
            }
        };

        fetchData();
    }, [empId]);

useEffect(() => {
  if (!employee || !employee._id) return;

  const fetchLOP = async () => {
    try {
      const res = await axios.get("http://localhost:3000/leave");
      const leaves = res.data;
      const empLeaves = leaves.filter((item) => item.employeeId === employee._id);

      // Calculate total LOP days
      const totalLopDays = empLeaves.reduce((sum, leave) => sum + (leave.days || 0), 0);

      // Calculate LOP amount based on basic salary
      const dailyBasic = Number(employee.basic || 0) / 30;
      const lopAmount = Math.round(dailyBasic * totalLopDays);

      setEmployee((prev) => ({
        ...prev,
        lopDays: totalLopDays,
        lopAmount: lopAmount
      }));
    } catch (err) {
      console.error("Error fetching leaves:", err);
    }
  };

  fetchLOP();
}, [employee]);



    const handleDownloadPdf = () => {
        const element = pdfRef.current;

        const opt = {
            margin: 0.5,
            filename: 'payslip.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().from(element).set(opt).save();
    };

    return (
        <div className="custom-container">
            <h5>Employee Payslip</h5>
            <p style={{ fontSize: '15px', color: 'rgb(98, 98, 98)' }}>
                <span style={{ color: 'red' }}>Home</span> / Employee Payslip
            </p>

            <div ref={pdfRef}>
                <div className="card no-radius">
                    <div className="card-header text-white new-emp-bg d-flex justify-content-between align-items-center">
                        Payslip
                        <i
                            className="far fa-file-pdf text-white"
                            onClick={handleDownloadPdf}
                            style={{
                                fontSize: '20px',
                                padding: '5px',
                                cursor: 'pointer'
                            }}
                        ></i>
                    </div>

                    <div className="card-body d-flex justify-content-between">
                        <div className="w-50 pe-3">
                            {/* <ul className="list-group list-group-flush">
                                <li className="list-group-item"><strong>Salary Month:</strong> {employee.salaryMonth || '-'}</li>
                                <li className="list-group-item"><strong>Employee ID:</strong> {employee.id}</li>
                                <li className="list-group-item"><strong>Employee Name:</strong> {employee.firstName} {employee.lastName}</li>
                                <li className="list-group-item"><strong>Joining Date:</strong> {employee.joiningDate || '-'}</li>
                                <li className="list-group-item"><strong>Department:</strong> {employee.department || '-'}</li>
                                <li className="list-group-item"><strong>Designation:</strong> {employee.designation || '-'}</li>
                                <li className="list-group-item"><strong>Location:</strong> {employee.location || '-'}</li>
                                <li className="list-group-item"><strong>Grade:</strong> {employee.grade || '-'}</li>
                                <li className="list-group-item"><strong>LOP:</strong> {employee.lop || '-'}</li>
                            </ul> */}
                            <ul className="list-group list-group-flush">
                                {/* <li className="list-group-item"><strong>Salary Month:</strong> {employee.salaryMonth || '-'}</li> */}
                                <li className="list-group-item"><strong>Employee ID:</strong> {employee?.id}</li>
                                <li className="list-group-item"><strong>Employee Name:</strong> {employee?.firstName} {employee?.lastName}</li>
                                {/* <li className="list-group-item"><strong>Company:</strong> {employee?.company}</li> */}
                                <li className="list-group-item"><strong>Joining Date:</strong> {employee?.joiningDate}</li>
                                <li className="list-group-item"><strong>Department:</strong> {employee?.department}</li>
                                <li className="list-group-item"><strong>Designation:</strong> {employee?.designation}</li>
                                <li className="list-group-item"><strong>Location:</strong> {employee?.locationName}</li>
                                <li className="list-group-item"><strong>Grade:</strong> {employee?.grade}</li>
                                <li className="list-group-item"><strong>LOP:</strong> {employee?.lopDays }</li>
                            </ul>
                        </div>
                        <div className="w-50 ps-3">
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item"><strong>&nbsp;</strong> { }</li>
                                <li className="list-group-item"><strong>Bank Name:</strong> {employee?.account_bank_name}</li>
                                <li className="list-group-item"><strong>Account Number:</strong> {employee?.account_number || '-'}</li>
                                <li className="list-group-item"><strong>Bank Code:</strong> {employee?.aacount_bank_code || '-'}</li>
                                <li className="list-group-item"><strong>PAN No:</strong> { }</li>
                                <li className="list-group-item"><strong>ESIC No:</strong> { }</li>
                                <li className="list-group-item"><strong>PF No:</strong> { }</li>
                                <li className="list-group-item"><strong>UAN:</strong> { }</li>
                            </ul>
                        </div>
                    </div>
                </div>


                <div className="card-body d-flex justify-content-between gap-5">
                    <div className="card no-radius mt-5 w-50">
                        <div className="card-header text-dark">Earning</div>
                        <div className="card-body p-0">
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item"><strong>Payroll Template</strong></li>
                                <li className="list-group-item"><strong>Basic Salary: </strong> {employee?.basic}</li>
                                <li className="list-group-item"><strong>House Rent Allowance: </strong>{employee?.hra}</li>
                                <li className="list-group-item"><strong>Medical Allowance: </strong> {employee?.medical}</li>
                                <li className="list-group-item"><strong>Travelling Allowance: </strong> {employee?.tr}</li>
                                <li className="list-group-item"><strong>Conveyance Allowance: </strong> {employee?.conveyance}</li>
                                <li className="list-group-item"><strong>Executive Allowance: </strong> {employee?.executive}</li>
                            </ul>
                        </div>
                    </div>

                    <div className="card no-radius mt-5 w-50">
                        <div className="card-header text-dark">Deduction</div>
                        <div className="card-body p-0">
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item"><strong>PF:</strong> {employee?.pfEmployer}</li>
                                <li className="list-group-item"><strong>PT:</strong> {employee?.pt}</li>
                                <li className="list-group-item"><strong>LOP:</strong> {employee?.lopAmount || 0 }</li>
                            </ul>
                        </div>
                    </div>
                </div>


                <div className="card-body d-flex justify-content-between gap-5">
                    <div className="card no-radius m5-4 w-50">
                        <div className="card-header text-dark">Gross Earning</div>
                        <div className="card-body p-0">
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item"><strong>Rs.</strong> {employee?.grossSalary}</li>
                            </ul>
                        </div>
                    </div>

                    <div className="card no-radius m5-4 w-50">
                        <div className="card-header text-dark">Total Deduction</div>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item"><strong>Rs.</strong> {employee?.totalDeductions}</li>
                        </ul>
                    </div>
                </div>

                <div className="card no-radius mt-5 w-100">
                    <div className="card-header text-dark">Net Salary</div>
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item"><strong>Rs.</strong> {employee?.netSalary}</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Payslip;