import Container from '@mui/material/Container'
import AppBar from '../../components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
// import { mockData } from '../../apis/mock-data'
import { useState, useEffect } from 'react'
import { fetchBoardDetailsAPI, createNewColumnAPI, createNewCardAPI, updateBoardDetailsAPI } from '../../apis'
import { generatePlaceHolderCard } from '../../utils/generate'
import { isEmpty } from 'lodash'

function Board() {
  const [board, setBoard] = useState(null)
  useEffect(() => {
    const boardId = '67a0cb4f1864a8eb2f613a7f'
    fetchBoardDetailsAPI(boardId).then(board => {
      board.columns.forEach(column => {
        // Handle empty column
        if(isEmpty(column.cards)){
          column.cards.push(generatePlaceHolderCard(column))
          column.cardOrderIds.push(generatePlaceHolderCard(column)._id)
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
      columnToUpdate.cards.push(createdCard)
      columnToUpdate.cardOrderIds.push(createdCard._id)
      setBoard(newBoard)
    }
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

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh'}}>
      <AppBar />
      {/* Using Optional chaining operator to prevent error when board is null or undefined */}
      <BoardBar board={board} /> 
      <BoardContent board={board} createNewColumn={createNewColumn} createNewCard={createNewCard} moveColumn={moveColumn} />
    </Container>
  )
}

export default Board;