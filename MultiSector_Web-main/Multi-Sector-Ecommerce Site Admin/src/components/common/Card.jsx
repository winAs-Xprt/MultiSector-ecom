export const Card = ({ children, className = '' }) => {
    return (
      <div className={`bg-white rounded-xl shadow-lg p-6 border border-pink-100 hover:shadow-xl transition-shadow duration-300 ${className}`}>
        {children}
      </div>
    );
  };
  
  export const CardHeader = ({ title, subtitle, action }) => {
    return (
      <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-pink-100">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-pink-700 bg-clip-text text-transparent">
            {title}
          </h2>
          {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
    );
  };
  
  export const CardBody = ({ children, className = '' }) => {
    return <div className={className}>{children}</div>;
  };
  