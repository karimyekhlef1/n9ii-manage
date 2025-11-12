import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

/**
 * Composable that provides toast notification functionality
 * with 4 different types: success, error, info, and warning
 * 
 * @returns {Object} Toast methods
 */
const useToast = () => {
  // Default toast configuration
  const defaultOptions = {
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    position: toast.POSITION.TOP_RIGHT,
  };

  /**
   * Display a success toast notification
   * @param {string} message - The message to display
   * @param {Object} options - Optional configuration to override defaults
   */
  const showSuccess = (message, options = {}) => {
    toast.success(message, { ...defaultOptions, ...options });
  };

  /**
   * Display an error toast notification
   * @param {string} message - The message to display
   * @param {Object} options - Optional configuration to override defaults
   */
  const showError = (message, options = {}) => {
    toast.error(message, { ...defaultOptions, ...options });
  };

  /**
   * Display an info toast notification
   * @param {string} message - The message to display
   * @param {Object} options - Optional configuration to override defaults
   */
  const showInfo = (message, options = {}) => {
    toast.info(message, { ...defaultOptions, ...options });
  };

  /**
   * Display a warning toast notification
   * @param {string} message - The message to display
   * @param {Object} options - Optional configuration to override defaults
   */
  const showWarning = (message, options = {}) => {
    toast.warning(message, { ...defaultOptions, ...options });
  };

  return {
    showSuccess,
    showError,
    showInfo,
    showWarning
  };
};

export default useToast;