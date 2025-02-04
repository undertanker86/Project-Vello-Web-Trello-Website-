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
import Badge from '@mui/material/Badge';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import Tooltip from '@mui/material/Tooltip';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Informations from './Menus/Informations.jsx';
import CreateIcon from '@mui/icons-material/Create';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import CloseIcon from '@mui/icons-material/Close';

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
        <MenuIcon sx={{color: 'white'}} />
        <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5}}>
        {/* inheritViewBox get scale of file .svg */}
          <SvgIcon component={velloLogo} inheritViewBox sx={{ color: 'white' }} />
          <Typography variant='span' sx= {{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white'}}>Vello</Typography>
        </Box>

        <Box sx={{ display: { xs:'none', md: 'flex' }, gap: 2}}>
          <Workspaces />
          <Recent />
          <Starred />
          <Templates />

          <Button sx={{ color: 'white', border: 'none', '&:hover': {border: 'none'} }} variant="outlined" startIcon={<CreateIcon/>}>Create</Button>
        </Box>
      </Box>
      <Box  sx={{ display: 'flex', alignItems: 'center', gap: 2} }>
      <TextField value={searchValue} id="outlined-search" label="Search..." type="text" size='small' onChange={(e) => setSearchValue(e.target.value)} variant="outlined"
       InputProps={{
        startAdornment: (
          <InputAdornment position="start">
          <SearchIcon sx={{color: 'white'}} />
        </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            <CloseIcon fontSize='small' sx={{ color: searchValue ? 'white' : 'transparent', cursor: 'pointer'}} onClick = {() => setSearchValue('')} ></CloseIcon>
          </InputAdornment>
        ),
      }}
      sx={{ minWidth: '120px', maxWidth: '170px', '& label': {color: 'white'}, '& input': {color: 'white'}, '& label.Mui-focused': { color: 'white' }, '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: 'white',
        },
        '&:hover fieldset': {
          borderColor: 'white',
        },
        '&.Mui-focused fieldset': {
          borderColor: 'white',
        },
      } }} />
      <ModeChoose />
      <Tooltip title="Notifications">
        <Badge color="error" variant="dot" sx={{ cursor: 'pointer'}} >
          <NotificationsNoneIcon sx ={{color: 'white'}} />
        </Badge>
      </Tooltip>
      <Tooltip title="Help">
        <HelpOutlineIcon sx={{ cursor: 'pointer', color: 'white'}} />
      </Tooltip>
      <Informations />
      </Box>
      
    </Box>
  );
}
export default AppBar;