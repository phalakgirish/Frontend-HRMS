import React from 'react';

const StatCard = ({ value, label, icon, valueColor, labelColor, iconColor, index }) => {
   let backgroundClass = '';

  if (index !== undefined) {
    backgroundClass = index === 0 || index === 2 ? 'bg-blue-gradient' : 'bg-red-gradient';
  } else {
    backgroundClass = 'bg-white';
  }
    return (
        <div className="col-12 col-sm-6 col-md-3">
            <div className={`card custom-bg ${backgroundClass} h-100 position-relative`}>
                <div className="card-body d-flex align-items-center justify-content-between">
                    <div>
                        <h3 className="card-text" style={{ color: valueColor }}>{value}</h3>
                        <h5 className="card-title" style={{ color: labelColor }}>{label}</h5>
                    </div>
                    <div>
                        <i className={`fas fa-${icon} fa-2x`} style={{ color: iconColor }}></i>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatCard;
