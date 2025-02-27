
import Alert from '@mui/material/Alert'

// Task of component: Display an error message if there is an error in the form field
function FieldErrorAlert({ errors, fieldName }) {
  if (!errors || !errors[fieldName]) return null
  return (
    <Alert severity="error" sx={{ mt: '0.7em', '.MuiAlert-message': { overflow: 'hidden' } }}>
      {errors[fieldName]?.message}
    </Alert>
  )
}

export default FieldErrorAlert
