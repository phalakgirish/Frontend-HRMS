import React, { useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import html2pdf from 'html2pdf.js';

const PayrollMonthly = () => {
    const { empId } = useParams();
    const location = useLocation();
    const pdfRef = useRef();

    const { paymentMonth, empName, paidAmt, paymentDate, paymentType } = location.state || {};

    // if (!location.state) {
    //     return (
    //         <div className="custom-container">
    //             <h5>Error</h5>
    //             <p>Payslip details are missing. Please go back and try again.</p>
    //         </div>
    //     );
    // }

    // const handleDownloadPdf = () => {
    //     const element = pdfRef.current;

    //     const opt = {
    //         margin: 0.5,
    //         filename: 'payslip.pdf',
    //         image: { type: 'jpeg', quality: 0.98 },
    //         html2canvas: { scale: 2 },
    //         jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    //     };

    //     html2pdf().from(element).set(opt).save();
    // };

    return (
        <div className="custom-container">
            <h5>Generate Salary Slip</h5>
            <p style={{ fontSize: '15px', color: 'rgb(98, 98, 98)' }}>
                <span style={{ color: 'red' }}>Home</span> / Generate Salary Slip
            </p>

            <div ref={pdfRef}>
                <div className="card no-radius">
                    <div className="card-header text-white new-emp-bg d-flex justify-content-between align-items-center">
                        Payment
                        <i
                            className="far fa-file-pdf text-white"
                            // onClick={handleDownloadPdf}
                            style={{
                                fontSize: '20px',
                                padding: '5px',
                                cursor: 'pointer'
                            }}
                        ></i>
                    </div>

                    <form className="p-3"
                    //  onSubmit={handleSubmit}
                    >
                        <div className="row">

                            <div className="col-md-6 mb-3">
                                <label>Basic Salary</label>
                                <input type="text" className='form-control' placeholder='Basic Salary' />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label>PF</label>
                                <input type="text" className='form-control' placeholder='PF' />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label>HRA</label>
                                <input type="text" className='form-control' placeholder='HRA' />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label>ESI</label>
                                <input type="text" className='form-control' placeholder='ESI' />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label>LTA</label>
                                <input type="text" className='form-control' placeholder='LTA' />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label>PT</label>
                                <input type="text" className='form-control' placeholder='PT' />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label>Conveyence Allowance</label>
                                <input type="text" className='form-control' placeholder='Conveyence Allowance' />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label>Graduity</label>
                                <input type="text" className='form-control' placeholder='Graduity' />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label>Medical Allowance</label>
                                <input type="text" className='form-control' placeholder='Medical Allowance' />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label>TDS</label>
                                <input type="text" className='form-control' placeholder='TDS' />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label>Excecutive Allowance</label>
                                <input type="text" className='form-control' placeholder='Excecutive Allowance' />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label>Advance</label>
                                <input type="text" className='form-control' placeholder='Advance' />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label>Arrier/Adjustment (+)</label>
                                <input type="text" className='form-control' placeholder='Arrier/Adjustment (+)' />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label>Arrier/Adjustment (-)</label>
                                <input type="text" className='form-control' placeholder='Arrier/Adjustment (-)' />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label>Bonus</label>
                                <input type="text" className='form-control' placeholder='Bonus' />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label>Group Ins Premium</label>
                                <input type="text" className='form-control' placeholder='Group Ins Premium' />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label>Incentive</label>
                                <input type="text" className='form-control' placeholder='Incentive' />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label>LWF</label>
                                <input type="text" className='form-control' placeholder='LWF' />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label></label>
                                {/* <input type="text" className='form-control' /> */}
                            </div>

                            <div className="col-md-6 mb-3">
                                <label>LOP no of days</label>
                                <input type="text" className='form-control' placeholder='LOP no of days' />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label></label>
                                {/* <input type="text" className='form-control' /> */}
                            </div>

                            <div className="col-md-6 mb-3">
                                <label>LOP</label>
                                <input type="text" className='form-control' placeholder='LOP' />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label>Gross Earning</label>
                                <input type="text" className='form-control' placeholder='Gross Earning' />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label>Total Deduction</label>
                                <input type="text" className='form-control' placeholder='Total Deduction' />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label>Net Salary</label>
                                <input type="text" className='form-control' placeholder='Net Salary' />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label>Payment Amount</label>
                                <input type="text" className='form-control' placeholder='Payment Amount' />
                            </div>

                            <div className="col-md-12 mb-3">
                                <label>Payment Method</label>
                                <select name="" id="" className='form-select'>
                                    <option>Select Payment Method</option>
                                    <option value="Online">Online</option>
                                    <option value="Paypal">Paypal</option>
                                    <option value="Payoneer">Payoneer</option>
                                    <option value="Bank Transfer">Bank Transfer</option>
                                    <option value="Cheque">Cheque</option>
                                    <option value="Cash">Cash</option>
                                    </select>
                            </div>

                            <div className="col-md-12 mb-3">
                                <label>Comments</label>
                                <input type="text" className='form-control' placeholder='Comments' />
                            </div>

                        </div>


                        <div className="text-start">
                            <button type="submit" className="btn btn-sm add-btn">Save</button>
                        </div>
                    </form>

                    {/* <div className="card-body d-flex justify-content-between">
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
                    </div> */}
                </div>


                {/* <div className="card-body d-flex justify-content-between gap-5">
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
                </div> */}


                {/* <div className="card-body d-flex justify-content-between gap-5">
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
                </div> */}

                {/* <div className="card no-radius mt-5 w-100">
                    <div className="card-header text-dark">Net Salary</div>
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item"><strong>Rs.</strong> { }</li>
                    </ul>
                </div> */}
            </div>
        </div>
    );
};

export default PayrollMonthly;