import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import VpnLockIcon from '@mui/icons-material/VpnLock';
import AddToDriveIcon from '@mui/icons-material/AddToDrive';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import FilterListIcon from '@mui/icons-material/FilterList';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import { capitalizeFirstLetter } from '../../../utils/formatcharacters';


const CHIP_STYLE = {
  color: 'white',
  backgroundColor: 'transparent',
  border: 'none',
  paddingX: '5px',
  borderRadius: '4px',
  fontWeight  : 'bold',
  '& .MuiSvgIcon-root':{
    color: 'white'
  },
}

function BoardBar(props) {
  // Using Object Destructuring 
  const { board } = props;
  return (
    <Box px ={2} sx={{
      // backgroundColor: 'primary.dark',
      width: '100%',
      height: (theme) => theme.controllCustomer.boardBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      overflowX: 'auto',
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#778ca3' : '#aaa69d' ),
      borderBottom: '1px solid #e0e0e0',

      borderButton: '1px solid #e0e0e0',
    }}>
      <Box  sx={{ display: 'flex', alignItems: 'center', gap: 2} }>
        <Tooltip title={board?.description}>
          <Chip 
          icon={<SpaceDashboardIcon />} label=  {capitalizeFirstLetter(board?.title)}
          clickable
          sx={CHIP_STYLE}
          />
        </Tooltip>

        <Chip 
        icon={<VpnLockIcon />} label= {capitalizeFirstLetter(board?.type)}
        clickable
        sx={CHIP_STYLE}
        />

        <Chip 
        icon={<AddToDriveIcon />} label="Add to Drive" 
        clickable
        sx={CHIP_STYLE}
        />

        <Chip 
        icon={<AutoAwesomeIcon />} label="Automation" 
        clickable
        sx={CHIP_STYLE}
        />

        
        <Chip 
        icon={<FilterListIcon />} label="Filters" 
        clickable
        sx={CHIP_STYLE}
        />
      </Box>
      <Box  sx={{ display: 'flex', alignItems: 'center', gap: 2} }>
          <Button 
          variant="outlined" 
          startIcon={<PersonAddAlt1Icon/>}
          sx={{
            color: 'white',
            borderColor: 'white',
            '&:hover': {borderColor: 'white'}
          }}
          >Invite</Button>
          <AvatarGroup max={4} sx={{'& .MuiAvatar-root': {width: 34, height: 34, fontSize: '16px', gap: '10px', border: 'none', color: 'white', cursor: 'pointer', '&:first-of-type': {bgcolor: '#a4b0de'}}}}>
            <Tooltip title="Remy Sharp">
              <Avatar alt="Remy Sharp" src="https://mui.com/static/images/avatar/1.jpg" />
            </Tooltip>
            <Tooltip title="Remy Sharp">
              <Avatar alt="Remy Sharp" src="https://mui.com/static/images/avatar/1.jpg" />
            </Tooltip>
            <Tooltip title="Remy Sharp">
              <Avatar alt="Remy Sharp" src="https://mui.com/static/images/avatar/1.jpg" />
            </Tooltip>
            <Tooltip title="Remy Sharp">
              <Avatar alt="Remy Sharp" src="https://mui.com/static/images/avatar/1.jpg" />
            </Tooltip>
            <Tooltip title="Remy Sharp">
              <Avatar alt="Remy Sharp" src="https://mui.com/static/images/avatar/1.jpg" />
            </Tooltip>
          </AvatarGroup>
      </Box>
    </Box>
  );
}
export default BoardBar;