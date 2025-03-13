import {useState} from 'react';
import Box from '@mui/material/Box';
import ModeChoose from '../ModeChoose/ModeChoose.jsx';
import MenuIcon from '@mui/icons-material/Menu';
import { ReactComponent as velloLogo } from '../../assets/vello_preview_rev_1.svg';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import Workspaces from './Menus/Workspaces.jsx';
import Recent from './Menus/Recent.jsx';
import Starred from './Menus/Starred.jsx';
import Templates from './Menus/Templates.jsx';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Informations from './Menus/Informations.jsx';
import CreateIcon from '@mui/icons-material/Create';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import CloseIcon from '@mui/icons-material/Close';
import { Link } from 'react-router-dom';
import Notifications from './Notifications/Notifications.jsx';
import AutoCompleteSearchBoard from './SearchBoards/AutoCompleteSearchBoard.jsx';

function AppBar() {
  const [searchValue, setSearchValue] = useState('');
  return (
    <Box px={2} sx ={{
      width: '100%',
      height: (theme) => theme.controllCustomer.topBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      overflowX: 'auto',
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#4b6584' : '#84817a' )
    }}>
      <Box  sx={{ display: 'flex', alignItems: 'center', gap: 2} }>
        <Link to= "/">
          <Tooltip title="Boards List">
            <MenuIcon sx={{color: 'white', verticalAlign:'middle' }} />
          </Tooltip>
        </Link>
        <Link to ="/">
          <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5}}>
          {/* inheritViewBox get scale of file .svg */}
            <SvgIcon component={velloLogo} inheritViewBox sx={{ color: 'white' }} />
            <Typography variant='span' sx= {{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white'}}>Vello</Typography>
          </Box>
        </Link>

        <Box sx={{ display: { xs:'none', md: 'flex' }, gap: 2}}>
          <Workspaces />
          <Recent />
          <Starred />
          <Templates />

          <Button sx={{ color: 'white', border: 'none', '&:hover': {border: 'none'} }} variant="outlined" startIcon={<CreateIcon/>}>Create</Button>
        </Box>
      </Box>
      <Box  sx={{ display: 'flex', alignItems: 'center', gap: 2} }>
      {/* Quick Find Boards  */}
      <AutoCompleteSearchBoard />
       {/* Dark mode, light mode */}
      <ModeChoose />
      {/* Handle notifications */}
      <Notifications />
      <Tooltip title="Help">
        <HelpOutlineIcon sx={{ cursor: 'pointer', color: 'white'}} />
      </Tooltip>
      <Informations />
      </Box>
      
    </Box>
  );
}
export default AppBar;