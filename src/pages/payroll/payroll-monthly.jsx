import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { getPayroll, createPayroll, updatePayroll, deletePayroll, getPayrollByEmpId } from '../../api/payrollApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const PayrollMonthly = () => {
  const { empId } = useParams();
  const pdfRef = useRef();
  const [loading, setLoading] = useState(true);
  const [employee, setEmployee] = useState(null);
  const [data, setData] = useState([]);

  const [form, setForm] = useState({});

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
    basic: 0,
    hra: 0,
    lta: 0,
    allowance: 0,
    medical: 1250,
    executive: 0,

    pfEmployer: 0,
    gratuity: 0,
    esi: 0,

    // pfEmployee: 0,
    pt: 200,
    tds: 0,
    advance: 0,
    arrierAdjustmentPlus: 0,
    arrierAdjustmentMinus: 0,
    bonus: 0,
    incentive: 0,
    lwf: 0,
    lop: 0,

    grossSalary: 0,
    totalDeductions: 0,
    netSalary: 0,
    totalCtc: 0,
    // paymentMethod: ''
  });


  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setLoading(true);

        const empRes = await fetch(`http://localhost:3000/employee/code/${empId}`);
        if (!empRes.ok) throw new Error("Employee not found");

        const empData = await empRes.json();
        setEmployee(empData);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching employee:", err);
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [empId]);



  useEffect(() => {
    const loadPayroll = async () => {
      try {
        const payroll = await getPayrollByEmpId(empId); // already res.data
        if (payroll) {
          setForm(payroll);
          setFormData(prev => ({ ...prev, ...payroll })); // merge safely
        }
      } catch (err) {
        console.error("❌ Failed to load payroll:", err);
      }
    };

    loadPayroll();
  }, [empId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const merged = { ...form, ...formData };
      const cleanForm = Object.fromEntries(
        Object.entries(merged).map(([key, value]) =>
          [key, typeof value === "string" && isNaN(Number(value)) ? value : (value == null || value === '' ? 0 : Number(value))]
        )
      );

      const payload = { empId, ...cleanForm };

      // 1️⃣ Save payroll
      await createPayroll(payload);
      toast.success("Payroll saved successfully!");

      // 2️⃣ Update paymentStatus in backend
      await axios.patch(`http://localhost:3000/payroll/${empId}/status`, {
        paymentStatus: 'Paid'
      });
      // toast.success("Employee status updated to Paid!");

      // ✅ No need to call getAllPayrolls or setPayrolls here
      // GeneratePayslip page will fetch updated data when loaded or refreshed

    } catch (err) {
      console.error("❌ Error saving/updating Payroll:", err.response?.data || err.message);
      toast.error("Payroll save/update failed!");
    }
  };


  useEffect(() => {
    if (!employee?.employeeCode) return;

    // 📅 get current YYYY-MM
    const monthStr = new Date().toISOString().slice(0, 7);

    fetch(`/leave/employee/${employee.employeeCode}/${monthStr}`)
      .then(res => res.json())
      .then(data => {
        const lopDays = data?.lopDays || 0;

        setFormData(prev => {
          // calculate lopDeduction here also
          const workingDays = 30; // 👈 make this dynamic if you want
          const lopDeduction = Math.round(
            ((prev.grossSalary || 0) / workingDays) * lopDays
          );

          return {
            ...prev,
            lopDays,
            lopDeduction,
            netSalaryAfterLOP: (prev.netSalary || 0) - lopDeduction,
          };
        });
      })
      .catch(err => console.error("❌ Error fetching LOP:", err));
  }, [employee]);



  useEffect(() => {
    if (!employee?.employeeCtc) return;

    const totalCtc = Number(employee.employeeCtc);
    const monthlyCTC = totalCtc / 12;

    const basic = Math.round(totalCtc / 12 * 0.5);
    const hra = Math.round(basic * 0.5);
    const lta = Math.round(basic * 0.0833);

    const total = Math.round(basic + hra + lta)
    // console.log("total is ",total);

    // let conveyance = monthlyCTC <= 15000 ? 500 : 1600;
    let conveyance = 1600;
    // let medical = monthlyCTC <= 15000 ? 250 : 1250;
    let medical = 1250;

    let executive = Math.ceil(basic * 0.1826);
    let warning = "";
    if (executive < 0) {
      executive = 0;
      warning = "Low CTC – deductions adjusted, executive allowance set to 0.";
    }

    const totalAllow = Math.round(conveyance + medical + executive);
    // console.log("total allowance is ",totalAllow);



    const gratuity = Math.round(basic * 0.0481);




    const grossSalary = Math.round(total + totalAllow);

    let pfEmployer = grossSalary > 15000
      ? 1800
      : Math.round(grossSalary * 0.12);



    let esi = grossSalary < 21000 ? Math.round(grossSalary * 0.0325) : 0;

    const pt = 200;
    const tds = 0;
    const totalDeductions = Math.round(pfEmployer + pt + tds);
    const netSalary = Math.round(grossSalary - totalDeductions);

    // const workingDays = 30;
    // const lopDeduction = Math.round((grossSalary / workingDays) * (formData.lopDays || 0));
    // const netSalaryAfterLOP = netSalary - lopDeduction;

    const totalExtra = Math.round(pfEmployer + gratuity + esi);
    // console.log("total allowance is ",totalExtra);


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
      esi,
      // pfEmployee,
      pt,
      grossSalary,
      totalDeductions,
      netSalary,
      totalCtc: Math.round(monthlyCTC),
      warning,
      // lopDays: prev.lopDays || 0,
      // lopDeduction,
      // netSalaryAfterLOP
    }));
  }, [employee, formData.lopDays]);



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
            {`Payment - ${new Date().toLocaleString("default", {
              month: "long",
              year: "numeric",
            })} - ${employee?.firstName || ""} ${employee?.lastName || ""}`}
          </div>


          <form className="p-3"
            onSubmit={handleSubmit}
          >
            <div className="row">

              <div className="col-md-6 mb-3">
                <label>Basic Salary</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.basic || ''}
                  placeholder="Basic Salary" disabled
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>PF</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.pfEmployer || ''}
                  placeholder="PF" disabled
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>HRA</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.hra || ''}
                  placeholder="HRA" disabled
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>ESI</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.esi || ''}
                  placeholder="ESI" disabled
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>LTA</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.lta || ''}
                  placeholder="LTA" disabled
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>PT</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.pt || ''}
                  placeholder="PT" disabled
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>Conveyence Allowance</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.conveyance || ''}
                  placeholder="Allowance" disabled
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>Graduity</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.gratuity || ''}
                  placeholder="Graduity" disabled
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>Medical Allowance</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.medical || ''}
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
                  value={formData.executive || ''}
                  placeholder="Executive Allowance" disabled
                />
                {formData.warning && (
                  <p className="text-warning mb-1 mt-0" style={{ fontSize: '13px' }}>
                    {formData.warning}
                  </p>
                )}
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
                <input
                  type="text"
                  value={formData.lopDays || 0}
                  className='form-control'
                  placeholder='LOP no of days'
                  disabled
                />
              </div>


              <div className="col-md-6 mb-3">
                <label></label>
                {/* <input type="text" className='form-control' /> */}
              </div>

              <div className="col-md-6 mb-3">
                <label>LOP</label>
                <input type="text" value={formData.lopDeduction || 0} className='form-control' placeholder='LOP' disabled />
              </div>

              <div className="col-md-6 mb-3">
                <label>Gross Earning</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.grossSalary || ''}
                  placeholder="Gross Earning" disabled
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>Total Deduction</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.totalDeductions || ''}
                  placeholder="Gross Earning" disabled
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>Net Salary</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.netSalary ?? 0}
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
                  value={form.paymentMethod}
                  onChange={(e) => {
                    const { value } = e.target;
                    setForm({ ...form, paymentMethod: value, location: "" });
                  }}
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
                  value={form.comments}
                  // onChange={(e) => {
                  //   const { value } = e.target;
                  //   setForm({ ...form, comments: value });
                  // }}
                  onChange={(e) => setForm({ ...form, comments: e.target.value })}

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
