import Container from '@mui/material/Container'
import AppBar from '../../components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { mockData } from '../../apis/mock-data'
function Board() {
  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh'}}>
      <AppBar />
      {/* Using Optional chaining operator to prevent error when board is null or undefined */}
      <BoardBar board={mockData?.board} /> 
      <BoardContent board={mockData?.board} />
    </Container>
  )
}

export default Board;