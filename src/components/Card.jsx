import React from 'react';

const Card = ({ children, title, subtitle, icon: Icon, className = "" }) => {
    return (
        <div className={`glass p-6 ${className}`}>
            {(title || Icon) && (
                <div className="flex items-center justify-between mb-6">
                    <div>
                        {title && <h3 className="text-navy font-bold text-lg">{title}</h3>}
                        {subtitle && <p className="text-text-muted text-sm">{subtitle}</p>}
                    </div>
                    {Icon && (
                        <div className="p-3 bg-navy/5 rounded-lg text-navy">
                            <Icon size={24} />
                        </div>
                    )}
                </div>
            )}
            {children}
        </div>
    );
};

export default Card;
