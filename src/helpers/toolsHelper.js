import Swal from "sweetalert2";

export function showSuccessDialog(message) {
  Swal.fire({
    title: "Success!",
    text: message,
    icon: "success",
  });
}

export function showErrorDialog(message) {
  Swal.fire({
    title: "Error!",
    text: message,
    icon: "error",
  });
}
