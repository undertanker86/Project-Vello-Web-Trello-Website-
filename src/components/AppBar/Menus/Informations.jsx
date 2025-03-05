import Box from '@mui/material/Box';
import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';

import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';


import { useSelector, useDispatch } from 'react-redux'
import { selectCurrentUser } from '../../../redux/user/userSlice'
import { logoutUserAPI } from '../../../redux/user/userSlice'
import { useConfirm } from 'material-ui-confirm'

import { Link } from 'react-router-dom';
function Informations() {

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  
  const dispatch = useDispatch()
  const currentUser = useSelector(selectCurrentUser)

  const confirmLogout = useConfirm()
  const handleLogout = () => {
    confirmLogout({
      title: 'You want log out of your account?',
      confirmationText: 'Confirm',
      cancellationText: 'Cancel'
    }).then(() => {
      // Call API logout user
      dispatch(logoutUserAPI())
    }).catch(() => {})
  }

  return (
    <Box>
      {/* <Button
        id="basic-button-profiles"
        aria-controls={open ? 'basic-menu-profiles' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        sx = {{ padding: 0 }}
      >
      </Button> */}
      <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx= {{ padding: 0 }}
            aria-controls={open ? 'basic-menu-profiles' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar sx={{ width: 34, height: 34 }}
          alt= "User"
          src={currentUser?.avatar}
        />
          </IconButton>
        </Tooltip>
      <Menu
        id="basic-menu-profiles"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button-profiles',
        }}
      >
        <Link to="/settings/account" style={{ textDecoration: 'none' }}>
          <MenuItem sx={{
            '&:hover':{ color: 'success.light' }
          }} >
            <Avatar sx ={{width: 28, height: 28, mr: 2}} src={currentUser?.avatar} /> Profile
          </MenuItem>
        </Link>
        <Divider />
        <MenuItem>
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          Add another account
        </MenuItem>
        <MenuItem >
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={handleLogout} sx={{
          '&:hover':{ 
            color: 'warning.dark',
            '& .logout-icon': {
              color: 'warning.dark'
            }
           }
        }}>
          <ListItemIcon>
            <Logout className="logout-icon" fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>

  );
} 
export default Informations;