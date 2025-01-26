import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ContentCut from '@mui/icons-material/ContentCut';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Tooltip from '@mui/material/Tooltip';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import Button from '@mui/material/Button';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import ListCards from './ListCards/ListCards';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';

function Column({column}) {
    // Drag and Sort
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({id: column._id, data: {...column}});
    
    const dndColumnstyle = {
      transform: CSS.Translate.toString(transform), // column not transform like smaller
      transition,
      height : '100%', // Fix Flickering when drag
      opacity: isDragging ? 0.5 : 1,
    };



    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
  return (
        // {/* Box Column */}
        <div  // Fix Flickering when drag
          ref={setNodeRef}
          style={dndColumnstyle}
          {...attributes}
        >
          <Box 
            {...listeners} // Listen drag event when in only box insted other space
            sx={{
              minWidth: '300px',
              maxWidth: '300px',
              bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : '#ebecf0' ),
              ml: '16px',
              borderRadius: '6px',
              height: 'fit-content',
              maxHeight: (theme) => `calc(${theme.controllCustomer.boardContentHeight} - ${theme.spacing(5)})`
          }}>
            {/* Header */}
            <Box sx={{
              height: (theme) => theme.controllCustomer.heightHeaderColumn,
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
    
            }}> 
              <Typography sx={{
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '1.2rem'
              }}>{column?.title}</Typography>
              <Box>
                <Tooltip title="More Options">
                  <KeyboardArrowDownIcon
                    sx={{
                      color: 'text.primary',
                      cursor: 'pointer',
                    }}
                    id="basic-button-column-dropdown"
                    aria-controls={open ? 'basic-menu-column-dropdown' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                  />
                </Tooltip>
                <Menu
                  id="basic-menu-column-dropdown"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    'aria-labelledby': 'basic-button-column-dropdown',
                  }}
                >
                  <MenuItem>
                    <ListItemIcon>
                      <LibraryAddIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Add New Card</ListItemText>
                  </MenuItem>
                  <MenuItem>
                    <ListItemIcon>
                      <ContentCut fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Cut</ListItemText>
                  </MenuItem>
                  <MenuItem>
                    <ListItemIcon>
                      <ContentCopyIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Copy</ListItemText>
                  </MenuItem>
                  <MenuItem>
                    <ListItemIcon>
                      <ContentPasteIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Paste</ListItemText>
                  </MenuItem>
                  <Divider />
                  <MenuItem>
                    <ListItemIcon>
                      <BookmarkBorderIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Save this column</ListItemText>
                  </MenuItem>
                  <MenuItem>
                    <ListItemIcon>
                      <DeleteOutlineIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Remove this column</ListItemText>
                  </MenuItem>
                </Menu>
              </Box>
            </Box>
    
            {/* End Header */}
    
            {/* Cards */}
            <ListCards cards={column?.cards}/>
            {/* End Cards */}
    
            {/* Footer */}
            <Box sx={{
              height: (theme) => theme.controllCustomer.heightFooterColumn,
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>  
              <Button startIcon= {<LibraryAddIcon/>}>Add new card</Button>
              <Tooltip title="Drag to move">
                <DragHandleIcon sx={{cursor: 'pointer'}}/>
              </Tooltip>
            </Box>
              {/* End Footer */}
          </Box>
        </div>
  )
}
export default Column;