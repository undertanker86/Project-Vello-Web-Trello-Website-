import Container from '@mui/material/Container'
import AppBar from '../../components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { useEffect } from 'react'
import { updateBoardDetailsAPI, updateColumnDetailsAPI, moveCardInDifferentColumnAPI } from '../../apis'
import { cloneDeep } from 'lodash'
import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress';
import { fetchBoardDetailsAPI, updateCurrentActiveBoard, selectCurrentActiveBoard } from '../../redux/activeBoard/activeBoardSlice'
import {useDispatch, useSelector} from 'react-redux'
import { useParams } from 'react-router-dom'



function Board() {
  // Use State from Redux
  const dispatch = useDispatch()
  // const [board, setBoard] = useState(null)
  const board = useSelector(selectCurrentActiveBoard)
  // get boardId from URL
  const { boardId } = useParams()
  useEffect(() => {
    // const boardId = '67a2c279d5b37680a5d597b3'
    // Call API to get data
    dispatch(fetchBoardDetailsAPI(boardId))
  }, [dispatch, boardId])

// CALL API to move column and refresh data State Board
  const moveColumn = async (dndOrderedColumns) =>{
    const dndOrderedColumnIds = dndOrderedColumns.map(column => column._id)

    const newBoard = cloneDeep(board)
    //  console.log("newBoard" , newBoard)
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnIds
    dispatch(updateCurrentActiveBoard(newBoard))

    await updateBoardDetailsAPI(newBoard._id, {
      // columns: dndOrderedColumns,
      columnOrderIds: dndOrderedColumnIds
    })
  }

  const moveCardInSameColumn = async (dndOrderedCards, dndOrderedCardIds, columnId) => {
    const newBoard = cloneDeep(board)
    const columnToUpdate = newBoard.columns.find(column => column._id === columnId)
    if(columnToUpdate){
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardIds
    }
    dispatch(updateCurrentActiveBoard(newBoard))
    updateColumnDetailsAPI(columnId, {
      cardOrderIds: dndOrderedCardIds
    })
  }
  const moveCardInDifferentColumn = async (currentCardId, sourceColumnId, targetColumnId, dndOrderedColumns) => {
    const dndOrderedColumnIds = dndOrderedColumns.map(column => column._id)

    const newBoard = cloneDeep(board)
    //  console.log("newBoard" , newBoard)
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnIds
    dispatch(updateCurrentActiveBoard(newBoard))
    console.log("New Board: ", newBoard)
    // Call API to update card
    let sourceCardOrderIds = dndOrderedColumns.find(column => column._id === sourceColumnId).cardOrderIds || []
    if(sourceCardOrderIds[0].includes('placeholder-card')){
      sourceCardOrderIds = []
    }
    moveCardInDifferentColumnAPI({
      currentCardId,
      sourceColumnId,
      sourceCardOrderIds,
      targetColumnId,
      targetCardOrderIds: dndOrderedColumns.find(column => column._id === targetColumnId).cardOrderIds,
    })
  }


  if(!board){
    return <Box>
      <LinearProgress />
    </Box>
  }
  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh'}}>
      <AppBar />
      {/* Using Optional chaining operator to prevent error when board is null or undefined */}
      <BoardBar board={board} /> 
      {/* Move will be remain because only have 1 level is ok not need to move */}
      <BoardContent board={board} moveColumn={moveColumn} moveCardInSameColumn={moveCardInSameColumn} moveCardInDifferentColumn={moveCardInDifferentColumn} />
    </Container>
  )
}

export default Board;