import React from 'react';
import { useParams } from 'react-router-dom';

const AppointmentLetter = () => {
  const { id } = useParams(); // if you pass an ID for dynamic routing

  return (
    <div style={{ padding: '2rem', fontFamily: 'serif', lineHeight: 1.6 }}>
      <p><strong>Ref:</strong> UBISL/HO/HR/APT/2/2021-22</p>
      <p><strong>Date:</strong> ____________</p>

      <p><strong>To,</strong><br />
        Admin Admin<br />
        Mumbai asdf
      </p>

      <h3 style={{ textAlign: 'center' }}>APPOINTMENT LETTER</h3>

      <p>
        We are pleased to offer you the position of <strong>[designation]</strong> at the level of <strong>[ ]</strong> in <strong>[Department]</strong> subject to the following terms and conditions,
      </p>

      <p>
        This offer remains subject to the terms of the appointment letter to be executed on the day of joining and to the procedures, policies, benefits and other terms of UBISL, which will be provided to you at the time of your joining or communicated to you from time to time.
      </p>

      <p>
        You will be based at <strong>[Location]</strong> and will be reporting to <strong>[Reporting Manager]</strong>.
      </p>

      <p>
        The compensation in terms of CTC fixed for you is Rs. <strong>[CTC]</strong> LPA and detailed break-up of your compensation will be intimated to you shortly. The compensation of any kind shall be subject to tax deducted at source as per applicable tax laws.
      </p>

      <p>
        At the time of joining, or within 3 days of receipt of this offer, you are requested to submit the documents listed in Appendix A.
      </p>

      <p>
        This document is privileged and confidential. You will maintain confidentiality and secrecy and will not disclose any of the contents of this offer to any third party.
      </p>

      <p>
        Your expected Date of Joining will be <strong>[Date]</strong>, failing which this offer may, at our discretion, be treated as withdrawn and no more valid.
      </p>

      <p>
        You are advised to sign the copy of this letter and return it to us as a token of your acceptance of the offer.
      </p>

      <p>
        A detailed appointment letter containing the terms and conditions of your employment with the Company will be handed over to you on the date you join our organization.
      </p>

      <p>
        We look forward to long-lasting and mutually beneficial relationship and are confident that your abilities will play a key role in our company.
      </p>

      <p><strong>Yours sincerely,</strong><br />UBI Services Ltd.<br />Authorized Signatory</p>

      <br />
      <h4>ACCEPTANCE</h4>
      <p>I accept this offer of employment with the Company under the terms set forth in this offer letter.</p>
    </div>
  );
};

export default AppointmentLetter;
