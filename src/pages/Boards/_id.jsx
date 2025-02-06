import Container from '@mui/material/Container'
import AppBar from '../../components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
// import { mockData } from '../../apis/mock-data'
import { useState, useEffect } from 'react'
import { fetchBoardDetailsAPI, createNewColumnAPI, createNewCardAPI, updateBoardDetailsAPI, updateColumnDetailsAPI, moveCardInDifferentColumnAPI } from '../../apis'
import { generatePlaceHolderCard } from '../../utils/generate'
import { isEmpty } from 'lodash'
import { mapOrder } from '../../utils/sortarraybasearray'
import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress';

function Board() {
  const [board, setBoard] = useState(null)
  useEffect(() => {
    const boardId = '67a2c279d5b37680a5d597b3'
    fetchBoardDetailsAPI(boardId).then(board => {
      board.columns = mapOrder(board.columns, board.columnOrderIds, '_id')
      board.columns.forEach(column => {
        // Handle empty column
        if(isEmpty(column.cards)){
          column.cards.push(generatePlaceHolderCard(column))
          column.cardOrderIds.push(generatePlaceHolderCard(column)._id)
        }
        else{
          column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
        }
      })
      setBoard(board)
    })
  }, [])
  //  CALL APU to create new column and refresh data State Board
  const createNewColumn = async (newColumn) => {
    const createdColumn = await createNewColumnAPI({
      ...newColumn,
      boardId: board._id
    })
    createdColumn.cards.push(generatePlaceHolderCard(createdColumn))
    createdColumn.cardOrderIds.push(generatePlaceHolderCard(createdColumn)._id)
    // Update board state
    const newBoard = {...board}
    //  console.log("newBoard" , newBoard)
    newBoard.columns.push(createdColumn)
    newBoard.columnOrderIds.push(createdColumn._id)
    setBoard(newBoard)
  }

  const createNewCard = async (newCard) => {
    const createdCard = await createNewCardAPI({
      ...newCard,
      boardId: board._id,
    })
    const newBoard = {...board}
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
    setBoard(newBoard)
  }
// CALL API to move column and refresh data State Board
  const moveColumn = async (dndOrderedColumns) =>{
    const dndOrderedColumnIds = dndOrderedColumns.map(column => column._id)

    const newBoard = {...board}
    //  console.log("newBoard" , newBoard)
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnIds
    setBoard(newBoard)

    await updateBoardDetailsAPI(newBoard._id, {
      // columns: dndOrderedColumns,
      columnOrderIds: dndOrderedColumnIds
    })
  }

  const moveCardInSameColumn = async (dndOrderedCards, dndOrderedCardIds, columnId) => {
    const newBoard = {...board}
    const columnToUpdate = newBoard.columns.find(column => column._id === columnId)
    if(columnToUpdate){
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardIds
    }
    setBoard(newBoard)
    updateColumnDetailsAPI(columnId, {
      cardOrderIds: dndOrderedCardIds
    })
  }
  const moveCardInDifferentColumn = async (currentCardId, sourceColumnId, targetColumnId, dndOrderedColumns) => {
    const dndOrderedColumnIds = dndOrderedColumns.map(column => column._id)

    const newBoard = {...board}
    //  console.log("newBoard" , newBoard)
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnIds
    setBoard(newBoard)
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
      <BoardContent board={board} createNewColumn={createNewColumn} createNewCard={createNewCard} moveColumn={moveColumn} moveCardInSameColumn={moveCardInSameColumn} moveCardInDifferentColumn={moveCardInDifferentColumn} />
    </Container>
  )
}

export default Board;