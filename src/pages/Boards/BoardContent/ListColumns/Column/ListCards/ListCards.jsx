import Box from '@mui/material/Box'
import * as React from 'react';
import VCard from './VCard/VCard';
// import { Card } from '@mui/material';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';




function ListCards({cards}) {
  return (
    <SortableContext  items={cards?.map(c => c._id)} strategy={verticalListSortingStrategy}>
    
      <Box sx={{
        p: '0 5px',
        m: '0, 5px',
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        overflowX: 'hidden',
        overflowY: 'auto',
        maxHeight: (theme) => `calc(${theme.controllCustomer.boardContentHeight} - ${theme.spacing(5)} - ${theme.controllCustomer.heightFooterColumn} - ${theme.controllCustomer.heightHeaderColumn})`,
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#ced0da',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          backgroundColor: '#bfc2cf',
        },
      }}>
        {cards?.map(card => <VCard key={card._id} card={card}/>)}
      </Box>
    </SortableContext>
  )
}

export default ListCards;
