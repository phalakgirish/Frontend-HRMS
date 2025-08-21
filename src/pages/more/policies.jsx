import React, { useState } from 'react';

function Policies() {
  const [openPolicies, setOpenPolicies] = useState([false, false, false, false]);

  const togglePolicy = (index) => {
    const updated = [...openPolicies];
    updated[index] = !updated[index];
    setOpenPolicies(updated);
  };

  const policies = [
    {
      title: '1. Smoke-Free Work Environment (All Companies)',
      detail: 'Smoke-Free Work Environment Policy.',
    },
    {
      title: '2. Dress Code Policy (UBI Services Ltd.)',
      detail: 'Please wear only defined clothes.',
    },
    {
      title: '3. Leave Policy (All Companies)',
      detail: '',
    },
    {
      title: '4. Smoke Policy HTML (UBI Services Ltd.)',
      detail: 'This is smoke policy.',
    },
  ];

  return (
    <div className="card no-radius">
      <div className="card-header text-white new-emp-bg">Company Policy</div>
      <div className="card-body d-flex align-items-start flex-column">
        {policies.map((policy, index) => (
          <div key={index} className="mb-3">
            <p
              className="fw-bold text-primary mb-1"
              style={{ cursor: 'pointer' }}
              onClick={() => togglePolicy(index)}
            >
              {policy.title}
            </p>
            {openPolicies[index] && (
              <p className="text-muted ms-3 mb-0">{policy.detail}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Policies;
