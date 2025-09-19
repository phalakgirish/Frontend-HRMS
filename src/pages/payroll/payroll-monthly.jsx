import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { getPayroll, createPayroll, updatePayroll, deletePayroll } from '../../api/payrollApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const PayrollMonthly = () => {
  const { empId } = useParams();
  const pdfRef = useRef();
  const [loading, setLoading] = useState(true);
  const [employee, setEmployee] = useState(null);
  const [data, setData] = useState([]);

  // const [form, setForm] = useState({
  //   tds: 0,
  //   advance: 0,
  //   arrierAdjustmentPlus: 0,
  //   arrierAdjustmentMinus: 0,
  //   bonus: 0,
  //   groupInsPremium: 0,
  //   incentive: 0,
  //   lwf: 0,
  //   paymentMethod: 0,
  //   comments: 0
  // });

  useEffect(() => {
    axios
      .get("http://localhost:3000/employee")
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching employee:", err);
        setLoading(false);
      });
  }, []);

  const [formData, setFormData] = useState({
    basiSalary: 0,
    hra: 0,
    lta: 0,
    allowance: 0,
    pfEmployer: 0,
    medical: 0,
    esc: 0,
    gratuity: 0,
    pt: 0,
    tds: 0,
    advance: 0,
    bonus: 0,
    incentive: 0,
    lwf: 0,
    arrierAdjustmentPlus: 0,
    arrierAdjustmentMinus: 0,
    lop: 0,
    monthlyCtc: 0
  });


  useEffect(() => {
    const fetchEmployeeAndLocation = async () => {
      try {
        setLoading(true);

        const empRes = await fetch(`http://localhost:3000/employee/code/${empId}`);
        if (!empRes.ok) throw new Error("Employee not found");
        const empData = await empRes.json();
        setEmployee(empData);

        const locRes = await fetch(`http://localhost:3000/location`);
        if (!locRes.ok) throw new Error("Locations not found");
        const locData = await locRes.json();

        const empLocation = locData.find(
          loc => empData.locationName.toLowerCase().includes(loc.locationName.toLowerCase())
        );

        if (empLocation) {
          setFormData({
            basiSalary: empLocation.basiSalary || 0,
            hra: empLocation.hra || 0,
            lta: empLocation.lta || 0,
            allowance: empLocation.allowance || 0,
            pfEmployer: empLocation.pfEmployer || 0,
            medical: empLocation.medical || 0,
            esc: empLocation.esc || 0,
            gratuity: empLocation.gratuity || 0,
            pt: 0,
            tds: 0,
            advance: 0,
            bonus: 0,
            incentive: 0,
            lwf: 0,
            arrierAdjustmentPlus: 0,
            arrierAdjustmentMinus: 0,
            lop: 0,
            paymentMethod: 0,
            comments: ''
          });
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchEmployeeAndLocation();
  }, [empId]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const payload = {
//         empId,
//         ...formData,
//         ...form
//       };

//       await createPayroll(payload);
//       toast.success("Payroll saved successfully!");

//       setForm({
//         tds: '',
//         advance: '',
//         arrierAdjustmentPlus: '',
//         arrierAdjustmentMinus: '',
//         bonus: '',
//         groupInsPremium: '',
//         incentive: '',
//         lwf: '',
//         paymentMethod: '',
//         comments: ''
//       });

//     } catch (err) {
//       console.error("Error saving Payroll:", err);
//       toast.error("Payroll failed to save!");
//     }
//   };

useEffect(() => {
  if (!employee?.monthlyCtc) return;

  const monthlyCTC = Number(employee.monthlyCtc || 0);

  // Basic = 40% of CTC
  const basic = monthlyCTC * 0.4;

  // HRA = 40% of Basic
  const hra = basic * 0.4;

  // LTA = 5% of CTC
  const lta = monthlyCTC * 0.05;

  // Conveyance + Medical + Executive = remaining
  const remaining = monthlyCTC - (basic + hra + lta);
  const conveyance = remaining * 0.4;
  const medical = remaining * 0.3;
  const executive = remaining * 0.3;

  // Employer contributions
  const pfEmployer = basic * 0.12;
  const gratuity = basic * 0.0481;

  // Employee contributions (deductions)
  const pfEmployee = basic * 0.12;
  const pt = 200; // example fixed
  const tds = 0;  // for now

  // Gross
  const grossSalary = basic + hra + lta + conveyance + medical + executive;

  // Total deductions
  const totalDeductions = pfEmployee + pt + tds;

  // Net
  const netSalary = grossSalary - totalDeductions;

  // Update state
  setFormData(prev => ({
    ...prev,
    basic,
    hra,
    lta,
    conveyance,
    medical,
    executive,
    pfEmployer,
    gratuity,
    pfEmployee,
    pt,
    grossSalary,
    totalDeductions,
    netSalary,
    totalCtc: monthlyCTC
  }));
}, [employee]);





  if (loading) return <div>Loading payroll details...</div>;
  if (!employee) return <div>Employee not found</div>;


  return (
    <div className="custom-container">
      <h5>Generate Salary Slip</h5>
      <p style={{ fontSize: "15px", color: "rgb(98, 98, 98)" }}>
        <span style={{ color: "red" }}>Home</span> / Generate Salary Slip
      </p>

      <div ref={pdfRef}>
        <div className="card no-radius">
          <div className="card-header text-white new-emp-bg d-flex justify-content-between align-items-center">
            Payment
          </div>

          <form className="p-3"
          //  onSubmit={handleSubmit}
          >
            <div className="row">

              <div className="col-md-6 mb-3">
                <label>Basic Salary</label>
                <input
                  type="text"
                  className="form-control"
                  // value={formData.basiSalary || ''}
                  // onChange={(e) => setFormData({ ...formData, basiSalary: e.target.value })}
                  placeholder="Basic Salary" disabled
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>PF</label>
                <input
                  type="text"
                  className="form-control"
                  // value={formData.pfEmployer || ''}
                  // onChange={(e) => setFormData({ ...formData, pfEmployer: e.target.value })}
                  placeholder="PF" disabled
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>HRA</label>
                <input
                  type="text"
                  className="form-control"
                  // value={formData.hra || ''}
                  // onChange={(e) => setFormData({ ...formData, hra: e.target.value })}
                  placeholder="HRA" disabled
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>ESI</label>
                <input
                  type="text"
                  className="form-control"
                  // value={formData.esc || ''}
                  // onChange={(e) => setFormData({ ...formData, esc: e.target.value })}
                  placeholder="ESI" disabled
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>LTA</label>
                <input
                  type="text"
                  className="form-control"
                  // value={formData.lta || ''}
                  // onChange={(e) => setFormData({ ...formData, lta: e.target.value })}
                  placeholder="LTA" disabled
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>PT</label>
                <input
                  type="text"
                  className="form-control"
                  // value={formData.pt || ''}
                  // onChange={(e) => setFormData({ ...formData, pt: e.target.value })}
                  placeholder="PT" disabled
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>Conveyence Allowance</label>
                <input
                  type="text"
                  className="form-control"
                  // value={formData.allowance || ''}
                  // onChange={(e) => setFormData({ ...formData, allowance: e.target.value })}
                  placeholder="Allowance" disabled
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>Graduity</label>
                <input
                  type="text"
                  className="form-control"
                  // value={formData.gratuity || ''}
                  // onChange={(e) => setFormData({ ...formData, gratuity: e.target.value })}
                  placeholder="Graduity" disabled
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>Medical Allowance</label>
                <input
                  type="text"
                  className="form-control"
                  // value={formData.medical || ''}
                  // onChange={(e) => setFormData({ ...formData, medical: e.target.value })}
                  placeholder="Medical Allowance" disabled
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>TDS</label>
                <input
                  type="text"
                  // value={form.tds}
                  // onChange={(e) => {
                  //   const { value } = e.target;
                  //   setForm({ ...form, tds: value });
                  // }}
                  className="form-control"
                  placeholder="TDS"
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>Excecutive Allowance</label>
                <input
                  type="text"
                  className="form-control"
                  // value={formData.excecutiveAllowance || ''}
                  // onChange={(e) => setFormData({ ...formData, excecutiveAllowance: e.target.value })}
                  placeholder="Executive Allowance" disabled
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>Advance</label>
                <input
                  type="text"
                  // value={form.advance}
                  // onChange={(e) => {
                  //   const { value } = e.target;
                  //   setForm({ ...form, advance: value });
                  // }}
                  className="form-control"
                  placeholder="Advance"
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>Arrier/Adjustment (+)</label>
                <input
                  type="text"
                  // value={form.arrierAdjustmentPlus}
                  // onChange={(e) => {
                  //   const { value } = e.target;
                  //   setForm({ ...form, arrierAdjustmentPlus: value });
                  // }}
                  className="form-control"
                  placeholder="Arrier/Adjustment (+)"
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>Arrier/Adjustment (-)</label>
                <input
                  type="text"
                  // value={form.arrierAdjustmentMinus}
                  // onChange={(e) => {
                  //   const { value } = e.target;
                  //   setForm({ ...form, arrierAdjustmentMinus: value });
                  // }}
                  className="form-control"
                  placeholder="Arrier/Adjustment (-)"
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>Bonus</label>
                <input
                  type="text"
                  // value={form.bonus}
                  // onChange={(e) => {
                  //   const { value } = e.target;
                  //   setForm({ ...form, bonus: value });
                  // }}
                  className="form-control"
                  placeholder="Bonus"
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>Group Ins Premium</label>
                <input
                  type="text"
                  // value={form.groupInsPremium}
                  // onChange={(e) => {
                  //   const { value } = e.target;
                  //   setForm({ ...form, groupInsPremium: value });
                  // }}
                  className="form-control"
                  placeholder="Group Ins Premium"
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>Incentive</label>
                <input
                  type="text"
                  // value={form.incentive}
                  // onChange={(e) => {
                  //   const { value } = e.target;
                  //   setForm({ ...form, incentive: value });
                  // }}
                  className="form-control"
                  placeholder="Incentive"
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>LWF</label>
                <input
                  type="text"
                  // value={form.lwf}
                  // onChange={(e) => {
                  //   const { value } = e.target;
                  //   setForm({ ...form, lwf: value });
                  // }}
                  className="form-control"
                  placeholder="LWF"
                />
              </div>

              <div className="col-md-6 mb-3">
                <label></label>
                {/* <input type="text" className='form-control' /> */}
              </div>

              <div className="col-md-6 mb-3">
                <label>LOP no of days</label>
                <input type="text" className='form-control' placeholder='LOP no of days' disabled />
              </div>

              <div className="col-md-6 mb-3">
                <label></label>
                {/* <input type="text" className='form-control' /> */}
              </div>

              <div className="col-md-6 mb-3">
                <label>LOP</label>
                <input type="text" className='form-control' placeholder='LOP' disabled />
              </div>

              <div className="col-md-6 mb-3">
                <label>Gross Earning</label>
                <input type="text" className='form-control' placeholder='Gross Earning' disabled />
              </div>

              <div className="col-md-6 mb-3">
                <label>Total Deduction</label>
                <input type="text" className='form-control' placeholder='Total Deduction' disabled />
              </div>

              <div className="col-md-6 mb-3">
                <label>Net Salary</label>
                <input
                  type="text"
                  className="form-control"
                  // value={formData.monthlyCtc ?? 0}
                  placeholder="Net Salary"
                  disabled
                />
              </div>


              <div className="col-md-6 mb-3">
                <label>Payment Amount</label>
                <input type="text" className='form-control' placeholder='Payment Amount' disabled />
              </div>

              <div className="col-md-12 mb-3">
                <label>Payment Method</label>
                <select
                  id="paymentMethod"
                  // value={form.paymentMethod}
                  // onChange={(e) => {
                  //   const { value } = e.target;
                  //   setForm({ ...form, paymentMethod: value, location: "" });
                  // }}
                  className="form-select"
                >
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
                <input
                  type="text"
                  // value={form.comments}
                  // onChange={(e) => {
                  //   const { value } = e.target;
                  //   setForm({ ...form, comments: value });
                  // }}
                  className="form-control"
                  placeholder="Comments"
                />
              </div>

            </div>

            <div className="text-start">
              <button type="submit" className="btn btn-sm add-btn">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PayrollMonthly;
