import { Link, useSearchParams } from 'react-router-dom'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import LockIcon from '@mui/icons-material/Lock'
import Typography from '@mui/material/Typography'
import { Card as MuiCard } from '@mui/material'
import { ReactComponent as TrelloIcon } from '../../assets/vello_preview_rev_1.svg'
import CardActions from '@mui/material/CardActions'
import TextField from '@mui/material/TextField'
import Zoom from '@mui/material/Zoom'
import Alert from '@mui/material/Alert'
import { useForm } from 'react-hook-form'
import FieldErrorAlert from '../../components/Form/FieldErrorAlert'
import { EMAIL_RULE, EMAIL_RULE_MESSAGE, PASSWORD_RULE, PASSWORD_RULE_MESSAGE, FIELD_REQUIRED_MESSAGE } from '../../utils/validators'
import { useDispatch } from 'react-redux'
import { loginUserAPI } from '../../redux/user/userSlice'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'


function LoginForm() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm()
  let [searchParams] = useSearchParams()

  const registeredEmail = searchParams.get('registedEmail')
  const verifiedEmail = searchParams.get('verifiedEmail')

  const submitLogIn = (data) => {
      const { email, password } = data
      toast.promise(dispatch(loginUserAPI({ email, password })), {
        pending: 'Logging in...'
      }).then((res) => {
        console.log(res)
        // Check if there is no error (login successful) then redirect to route /
        if (!res.error) navigate('/')
      })
  }
  return (
    <form onSubmit={handleSubmit(submitLogIn)}>
      <Zoom in={true} style={{ transitionDelay: '200ms' }}>
        <MuiCard sx={{ minWidth: 380, maxWidth: 380, marginTop: '6em' }}>
          <Box sx={{
            margin: '1em',
            display: 'flex',
            justifyContent: 'center',
            gap: 1
          }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}><LockIcon /></Avatar>
            <Avatar sx={{ bgcolor: 'primary.main' }}><TrelloIcon /></Avatar>
          </Box>
          <Box sx={{ marginTop: '1em', display: 'flex', justifyContent: 'center', color: theme => theme.palette.grey[500] }}>
            Author: Vello Company
          </Box>
          <Box sx={{ marginTop: '1em', display: 'flex', justifyContent: 'center', flexDirection: 'column', padding: '0 1em' }}>
            {verifiedEmail &&
                <Alert severity="success" sx={{ '.MuiAlert-message': { overflow: 'hidden' } }}>
                Your email&nbsp;
                <Typography variant="span" sx={{ fontWeight: 'bold', '&:hover': { color: '#fdba26' } }}>{registeredEmail}</Typography>
                &nbsp;has been verified.<br />Now you can login to enjoy our services! Have a good day!
              </Alert>
            }
            {registeredEmail &&
              <Alert severity="info" sx={{ '.MuiAlert-message': { overflow: 'hidden' } }}>
                An email has been sent to&nbsp;
                <Typography variant="span" sx={{ fontWeight: 'bold', '&:hover': { color: '#fdba26' } }}>{verifiedEmail}</Typography>
                <br />Please check and verify your account before logging in!
              </Alert>
            }
          </Box>
          <Box sx={{ padding: '0 1em 1em 1em' }}>
            <Box sx={{ marginTop: '1em' }}>
              <TextField
                // autoComplete="nope"
                autoFocus
                fullWidth
                label="Enter Email..."
                type="text"
                variant="outlined"
                error = {!!errors['email']}
                {...register('email', { 
                  required: FIELD_REQUIRED_MESSAGE,
                  pattern: { value: EMAIL_RULE, message: EMAIL_RULE_MESSAGE }
                })}
              />
              <FieldErrorAlert errors={errors} fieldName={'email'}/>
            </Box>
            <Box sx={{ marginTop: '1em' }}>
              <TextField
                fullWidth
                label="Enter Password..."
                type="password"
                variant="outlined"
                error = {!!errors['password']}
                {...register('password', { 
                  required: FIELD_REQUIRED_MESSAGE,
                  pattern: { value: PASSWORD_RULE, message: PASSWORD_RULE_MESSAGE }
                })}
              />
              <FieldErrorAlert errors={errors} fieldName={'password'}/>

            </Box>
          </Box>
          <CardActions sx={{ padding: '0 1em 1em 1em' }}>
            <Button
              className = "interceptor-loading"
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
            >
              Login
            </Button>
          </CardActions>
          <Box sx={{ padding: '0 1em 1em 1em', textAlign: 'center' }}>
            <Typography>You don't have an account before?</Typography>
            <Link to="/register" style={{ textDecoration: 'none' }}>
              <Typography sx={{ color: 'primary.main', '&:hover': { color: '#ffbb39' } }}>Create account now!</Typography>
            </Link>
          </Box>
        </MuiCard>
      </Zoom>
    </form>
  )
}

export default LoginForm
