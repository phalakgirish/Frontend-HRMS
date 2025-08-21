import React, { useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import html2pdf from 'html2pdf.js';

const Payslip = () => {
    const { empId } = useParams();
    const location = useLocation();
    const pdfRef = useRef();

    const { paymentMonth, empName, paidAmt, paymentDate, paymentType } = location.state || {};

    if (!location.state) {
        return (
            <div className="custom-container">
                <h5>Error</h5>
                <p>Payslip details are missing. Please go back and try again.</p>
            </div>
        );
    }

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
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item"><strong>Salary Month:</strong> {paymentMonth}</li>
                                <li className="list-group-item"><strong>Employee ID:</strong> {empId}</li>
                                <li className="list-group-item"><strong>Employee Name:</strong> {empName}</li>
                                <li className="list-group-item"><strong>Joining Date:</strong> { }</li>
                                <li className="list-group-item"><strong>Department:</strong> { }</li>
                                <li className="list-group-item"><strong>Designation:</strong> { }</li>
                                <li className="list-group-item"><strong>Location:</strong> { }</li>
                                <li className="list-group-item"><strong>Grade:</strong> { }</li>
                                <li className="list-group-item"><strong>LOP:</strong> { }</li>
                            </ul>
                        </div>
                        <div className="w-50 ps-3">
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item"><strong>&nbsp;</strong> { }</li>
                                <li className="list-group-item"><strong>Bank Name:</strong> { }</li>
                                <li className="list-group-item"><strong>Account Number:</strong> { }</li>
                                <li className="list-group-item"><strong>Bank Code:</strong> { }</li>
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
                                <li className="list-group-item"><strong>Payroll Template</strong> { }</li>
                                <li className="list-group-item"><strong>Basic Salary:</strong> { }</li>
                                <li className="list-group-item"><strong>House Rent Allowance:</strong> { }</li>
                                <li className="list-group-item"><strong>Medical Allowance:</strong> { }</li>
                                <li className="list-group-item"><strong>Travelling Allowance:</strong> { }</li>
                                <li className="list-group-item"><strong>Conveyance Allowance:</strong> { }</li>
                                <li className="list-group-item"><strong>Executive Allowance:</strong> { }</li>
                            </ul>
                        </div>
                    </div>

                    <div className="card no-radius mt-5 w-50">
                        <div className="card-header text-dark">Deduction</div>
                        <div className="card-body p-0">
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item"><strong>PF:</strong> { }</li>
                                <li className="list-group-item"><strong>PT:</strong> { }</li>
                                <li className="list-group-item"><strong>LOP:</strong> { }</li>
                            </ul>
                        </div>
                    </div>
                </div>


                <div className="card-body d-flex justify-content-between gap-5">
                    <div className="card no-radius m5-4 w-50">
                        <div className="card-header text-dark">Gross Earning</div>
                        <div className="card-body p-0">
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item"><strong>Rs.</strong> { }</li>
                            </ul>
                        </div>
                    </div>

                    <div className="card no-radius m5-4 w-50">
                        <div className="card-header text-dark">Total Deduction</div>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item"><strong>Rs.</strong> { }</li>
                        </ul>
                    </div>
                </div>

                <div className="card no-radius mt-5 w-100">
                    <div className="card-header text-dark">Net Salary</div>
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item"><strong>Rs.</strong> { }</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Payslip;