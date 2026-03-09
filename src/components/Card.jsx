import React from 'react';

const Card = ({ children, title, subtitle, icon: Icon, actions, className = "" }) => {
    return (
        <div className={`glass p-6 ${className}`}>
            {(title || Icon || actions) && (
                <div className="flex items-center justify-between mb-6">
                    <div>
                        {title && <h3 className="text-navy font-bold text-lg">{title}</h3>}
                        {subtitle && <p className="text-text-muted text-sm">{subtitle}</p>}
                    </div>
                    <div className="flex items-center gap-3">
                        {actions && <div>{actions}</div>}
                        {Icon && (
                            <div className="p-3 bg-navy/5 rounded-lg text-navy">
                                <Icon size={24} />
                            </div>
                        )}
                    </div>
                </div>
            )}
            {children}
        </div>
    );
};

export default Card;
