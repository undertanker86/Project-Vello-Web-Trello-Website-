import Box from '@mui/material/Box'
import Column from './Column/Column';
import Button from '@mui/material/Button';
import PostAddIcon from '@mui/icons-material/PostAdd';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify';
import { createNewColumnAPI } from '../../../../apis'
import { generatePlaceHolderCard } from '../../../../utils/generate'
import { updateCurrentActiveBoard, selectCurrentActiveBoard } from '../../../../redux/activeBoard/activeBoardSlice'
import {useDispatch, useSelector} from 'react-redux'
import { cloneDeep } from 'lodash'

function ListColumns({columns}) {
  const dispatch = useDispatch()
  const board = useSelector(selectCurrentActiveBoard)
  const [openNewColumnForm, setopenNewColumnForm] = useState(false)

  const handleOpenNewColumnForm = () => setopenNewColumnForm(!openNewColumnForm)
 
  const [newColumnTitle, setnewColumnTitle] = useState('')

  const handleAddNewColumn = async () => {
    if(!newColumnTitle){
      toast.error("Please Enter Your Column Title")
      return;}
    // Create data to send to server
    const newColumnData ={
      title: newColumnTitle,
    }
    //  CALL API to create new column and refresh data State Board
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id
    })
    createdColumn.cards.push(generatePlaceHolderCard(createdColumn))
    createdColumn.cardOrderIds.push(generatePlaceHolderCard(createdColumn)._id)
    // Update board state
    // const newBoard = {...board} // Shallow Copy/Clone
    const newBoard = cloneDeep(board) // Deep Clone insted Shallow Clone Because Rule of Immutability
    //  console.log("newBoard" , newBoard)
    newBoard.columns.push(createdColumn)
    newBoard.columnOrderIds.push(createdColumn._id)
    dispatch(updateCurrentActiveBoard(newBoard))
    // reset form
    handleOpenNewColumnForm()
    setnewColumnTitle('')
  }
  return (
    <SortableContext  items={columns?.map(c => c._id)}  strategy={horizontalListSortingStrategy}>
      <Box sx={{
        bgcolor: 'inherit',
        width: '100%',
        height: '100%',
        display: 'flex',
        overflowX: 'auto',
        overflowY: 'hidden',
        '*::-webkit-scrollbar-track': { m : 2 }

      }}>
        {/* react require key for each element in list */}
        {columns?.map((column) => {
            return (<Column key={column._id} column = {column}  />)
        })}
        
        {/* Add new column */}
        {!openNewColumnForm
          ?<Box onClick={handleOpenNewColumnForm} sx = {{
              minWidth: '250px',
              maxWidth: '250px',
              mx: '16px',
              borderRadius: '6px',
              height: 'fit-content',
              bgcolor: '#ffffff3d'
          }}>
              <Button 
              sx={{
                color: 'white',
                width: '100%',
                justifyContent: 'flex-start',
                pl: 2.5,
                py: 1
              }} 
              startIcon={<PostAddIcon/>}>Add new column</Button>
          </Box>
          :<Box sx={{
            minWidth: '250px',
            maxWidth: '250px',
            mx: '16px',
            p: 1,
            borderRadius: '6px',
            height: 'fit-content',
            bgcolor: '#ffffff3d',
            display: 'flex',
            flexDirection: 'column',
            gap: 1
          }}>
            <TextField  autoFocus label="Enter Column Title" type="text" size='small'  variant="outlined"
              value={newColumnTitle}
              onChange={(e) => setnewColumnTitle(e.target.value)}
              sx={{'& label': {color: 'white'}, '& input': {color: 'white'}, '& label.Mui-focused': { color: 'white' }, '& .MuiOutlinedInput-root': {
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
            <Box sx ={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}>
              <Button
                className="interceptor-loading"
                onClick={handleAddNewColumn}
                variant="contained"
                color= "success"
                size="small"
                sx = {{
                  boxShadow: 'none',
                  border: '1px solid',
                  borderColor: (theme) => theme.palette.success.main,
                  '&:hover': { bgcolor: (theme) => theme.palette.success.dark}
                }}
              >Add Column</Button>
              <CloseIcon fontSize='small' sx={{ color: 'white', cursor: 'pointer', '&:hover': {color : (theme) => theme.palette.warning.main}}} onClick = {handleOpenNewColumnForm} ></CloseIcon>

            </Box>
          </Box>
        }
      </Box>
    </SortableContext>
  )
}
export default ListColumns;