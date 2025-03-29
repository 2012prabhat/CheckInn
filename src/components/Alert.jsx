import Swal from "sweetalert2";
import './alert.css'

// Function to show success toaster
export const alertSuccess = (message) => {
  Swal.fire({
    icon: "success",
    // title: "Success",
    text: message || "Operation was successful!",
    toast: true, // Enables toaster mode
    showClass: {
      popup: 'toastShow'
    },
    hideClass: {
      popup: 'toastHide'
    },
    position: "top-end", // Positions the toaster at the top-right corner
    showConfirmButton: false, // Hides the OK button
    timer: 3000,
    timerProgressBar: true, // Enables the progress bar
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer); // Pause timer on hover
      toast.addEventListener("mouseleave", Swal.resumeTimer); // Resume timer on mouse leave
    },
  });
};

// Function to show error toaster
export const alertError = (message) => {
  Swal.fire({
    icon: "error",
    // title: "Error",
    text: message || "Something went wrong. Please try again.",
    toast: true, // Enables toaster mode
    showClass: {
      popup: 'toastShow'
    },
    hideClass: {
      popup: 'toastHide'
    },
    position: "top-end", // Positions the toaster at the top-right corner
    showConfirmButton: false, // Hides the OK button
    timer: 6000, // Adjust the timer as needed
    timerProgressBar: true, // Enables the progress bar
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer); // Pause timer on hover
      toast.addEventListener("mouseleave", Swal.resumeTimer); // Resume timer on mouse leave
    },
  });
};

// Function to show confirmation toaster
export const alertConfirm = async (message) => {
  return await Swal.fire({
    title: message || "Are you sure?",
    // toast: true, // Enables toaster mode
    // position: "top-end", // Positions the toaster at the top-right corner
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "No",
    icon: "warning",
    showConfirmButton: true, // Show confirm button for confirmation
    showCancelButton: true, // Show cancel button for confirmation
  });
};