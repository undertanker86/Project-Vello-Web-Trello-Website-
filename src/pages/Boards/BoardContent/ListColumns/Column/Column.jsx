import Box from '@mui/material/Box'
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
import {useState} from 'react';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify';
import { useConfirm } from "material-ui-confirm";
import { createNewCardAPI, deleteColumnDetailsAPI, updateColumnDetailsAPI } from '../../../../../apis'
import { updateCurrentActiveBoard, selectCurrentActiveBoard } from '../../../../../redux/activeBoard/activeBoardSlice'
import {useDispatch, useSelector} from 'react-redux'
import { cloneDeep } from 'lodash'
import ToggleFocusInput from '../../../../../components/Form/ToggleFocusInput';

function Column({column}) {
    const dispatch = useDispatch()
    const board = useSelector(selectCurrentActiveBoard)
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


    const [openNewCardForm, setopenNewCardForm] = useState(false)
  
    const handleOpenNewCardForm = () => setopenNewCardForm(!openNewCardForm)
    
    const [newCardTitle, setnewCardTitle] = useState('')
  
    const handleAddNewCard = async () => {
      if(!newCardTitle){
        toast.error("Please Enter Your Card Title", {position: 'top-right'})
        return
      } ;

          // Create data to send to server
      const newCardData ={
      title: newCardTitle,
      columnId: column._id
    }
    // CALL API to create new card and refresh data State Board
    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id,
    })
    const newBoard = cloneDeep(board)
    const columnToUpdate = newBoard.columns.find(column => column._id === createdCard .columnId)
    if(columnToUpdate){
      // If empty column, remove placeholder card
      if(columnToUpdate.cards.some(card => card.fontEndPlaceholderCard)){
        columnToUpdate.cards = [createdCard]
        columnToUpdate.cardOrderIds = [createdCard._id]
      }
      else{
        columnToUpdate.cards.push(createdCard)
        columnToUpdate.cardOrderIds.push(createdCard._id)
      }
      
    }
    dispatch(updateCurrentActiveBoard(newBoard))
      // reset form
      // console.log(newCardTitle)
      handleOpenNewCardForm()
      setnewCardTitle('')
    }
    const confirm = useConfirm();
    const handleDeleteColumn = () => {
      confirm({ 
        description: `This will delete the column "${column?.title}" and all the cards in it. Are you sure?`,
      },
      ).then(()=>{
        // Call API to delete column
        // Update for suitable stable board
        const newBoard = cloneDeep(board)
        //  console.log("newBoard" , newBoard)
        newBoard.columns = newBoard.columns.filter(c => c._id !== column._id)
        newBoard.columnOrderIds = newBoard.columnOrderIds.filter(_id => _id !== column._id)
        dispatch(updateCurrentActiveBoard(newBoard))
        // CALL API
        deleteColumnDetailsAPI(column._id).then( res => {
          // console.log("Delete Column: ", res)
          toast.success(res?.deleteColumn)
        })
        }).catch(()=>{})
    }

    const onUpdateColumnTitle = (newTitle) =>{
      // Call API to update column title and handle data in redux
      updateColumnDetailsAPI(column._id, {title: newTitle}).then(() => {
        const newBoard = cloneDeep(board)
        const columnToUpdate = newBoard.columns.find(c => column._id === c._id)
        if(columnToUpdate){
          columnToUpdate.title = newTitle
        }
        dispatch(updateCurrentActiveBoard(newBoard))
      })
    }
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
              <ToggleFocusInput 
                value={column?.title}
                onChangedValue={onUpdateColumnTitle}
                data-no-dnd="true" // Prevent drag when click
                />
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
                  onClick={handleClose}
                  MenuListProps={{
                    'aria-labelledby': 'basic-button-column-dropdown',
                  }}
                >
                  <MenuItem
                    onClick={handleOpenNewCardForm}
                    sx={{
                      '&:hover': {color: 'success.main', '& .LibraryAddIcon': {color: 'success.main'}}
                    }}
                  >
                    <ListItemIcon>
                      <LibraryAddIcon className="LibraryAddIcon" fontSize="small" />
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
                  <MenuItem
                  onClick={handleDeleteColumn}
                  sx={{
                    '&:hover': {color: 'warning.main', '& .DeleteOutlineIcon': {color: 'warning.main'}}
                  }}
                  >
                    <ListItemIcon>
                      <DeleteOutlineIcon className ="DeleteOutlineIcon" fontSize="small" />
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
            }}> 
              {!openNewCardForm 
              ? <Box sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                  <Button startIcon= {<LibraryAddIcon/>} onClick={handleOpenNewCardForm}>Add new card</Button>
                  <Tooltip title="Drag to move">
                    <DragHandleIcon sx={{cursor: 'pointer'}}/>
                  </Tooltip>
                </Box>
              : <Box sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>             
                  <TextField  autoFocus label="Enter Card Title" type="text" size='small'  variant="outlined" data-no-dnd="true"
                    value={newCardTitle}
                    onChange={(e) => setnewCardTitle(e.target.value)}
                    sx={{ 
                      '& label': { color: 'text.primary' },
                      '& input': {
                        color: (theme) => theme.palette.primary.main,
                        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : 'white')
                      },
                      '& label.Mui-focused': { color: (theme) => theme.palette.primary.main },
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: (theme) => theme.palette.primary.main },
                        '&:hover fieldset': { borderColor: (theme) => theme.palette.primary.main },
                        '&.Mui-focused fieldset': { borderColor: (theme) => theme.palette.primary.main }
                      },
                      '& .MuiOutlinedInput-input': {
                        borderRadius: 1
                      }
                    }} />
                  <Box sx ={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}>
                    <Button
                      className="interceptor-loading"
                      onClick={handleAddNewCard}
                      variant="contained"
                      color= "success"
                      size="small"
                      sx = {{
                        boxShadow: 'none',
                        border: '1px solid',
                        borderColor: (theme) => theme.palette.success.main,
                        '&:hover': { bgcolor: (theme) => theme.palette.success.dark}
                      }}
                    >Add</Button>
                    <CloseIcon fontSize='small' sx={{ color: (theme) => theme.palette.warning.main, cursor: 'pointer'}} onClick = {handleOpenNewCardForm} ></CloseIcon>

                  </Box>
              </Box>
              }

            </Box>
              {/* End Footer */}
          </Box>
        </div>
  )
}
export default Column;