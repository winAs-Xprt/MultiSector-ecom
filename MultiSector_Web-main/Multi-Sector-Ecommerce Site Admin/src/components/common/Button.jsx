import { FaPlus, FaSave, FaTimes, FaEdit, FaTrash, FaEye, FaFilter, FaEraser } from 'react-icons/fa';

// Primary Button
export const PrimaryButton = ({ children, onClick, disabled, icon, className = '' }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${className}`}
    >
      {icon}
      {children}
    </button>
  );
};

// Secondary Button
export const SecondaryButton = ({ children, onClick, disabled, icon, className = '' }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`bg-white hover:bg-pink-50 text-pink-600 font-semibold py-2.5 px-6 rounded-lg border-2 border-pink-500 transition-all duration-300 hover:shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${className}`}
    >
      {icon}
      {children}
    </button>
  );
};

// Danger Button
export const DangerButton = ({ children, onClick, disabled, icon, className = '' }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${className}`}
    >
      {icon}
      {children}
    </button>
  );
};

// Icon Button (Small action buttons)
export const IconButton = ({ onClick, icon, variant = 'view', title, className = '' }) => {
  const variants = {
    view: 'bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200',
    edit: 'bg-green-50 text-green-600 hover:bg-green-100 border-green-200',
    delete: 'bg-red-50 text-red-600 hover:bg-red-100 border-red-200',
  };

  return (
    <button
      onClick={onClick}
      title={title}
      className={`p-2 rounded-lg border-2 transition-all duration-200 hover:shadow-md active:scale-95 ${variants[variant]} ${className}`}
    >
      {icon}
    </button>
  );
};

// Action Buttons Component (View, Edit, Delete together)
export const ActionButtons = ({ onView, onEdit, onDelete }) => {
  return (
    <div className="flex items-center gap-2">
      {onView && (
        <IconButton
          onClick={onView}
          icon={<FaEye className="text-lg" />}
          variant="view"
          title="View"
        />
      )}
      {onEdit && (
        <IconButton
          onClick={onEdit}
          icon={<FaEdit className="text-lg" />}
          variant="edit"
          title="Edit"
        />
      )}
      {onDelete && (
        <IconButton
          onClick={onDelete}
          icon={<FaTrash className="text-lg" />}
          variant="delete"
          title="Delete"
        />
      )}
    </div>
  );
};

// Export icons for use in other components
export const ButtonIcons = {
  Add: <FaPlus />,
  Save: <FaSave />,
  Cancel: <FaTimes />,
  Edit: <FaEdit />,
  Delete: <FaTrash />,
  View: <FaEye />,
  Filter: <FaFilter />,
  Clear: <FaEraser />,
};
