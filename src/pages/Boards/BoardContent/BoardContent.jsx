import Box from '@mui/material/Box'
import * as React from 'react';
import ListColumns from './ListColumns/ListColumns';
import { mapOrder } from '../../../utils/sortarraybasearray';
import { DndContext, useSensor, useSensors, MouseSensor, TouchSensor, DragOverlay,  defaultDropAnimationSideEffects, closestCorners, pointerWithin, rectIntersection, getFirstCollision } from '@dnd-kit/core';
import { arrayMove} from '@dnd-kit/sortable';
import Column from './ListColumns/Column/Column';
import VCard from './ListColumns/Column/ListCards/VCard/VCard';
import {cloneDeep} from 'lodash'



const ACTIVE_DRAG_ITEM_TYPE ={
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}



function BoardContent({board}) {
  // Using mouse and touch sensor for drag and drop with good experience in mobile and desktop insted of use touch
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      // Require the mouse to move by 10 pixels before activating https://docs.dndkit.com/api-documentation/sensors
      distance: 10,
  }});

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      // Press with 250ms delay before activating and  500 pixels tolerance https://docs.dndkit.com/api-documentation/sensors
      delay: 100,
      tolerance: 500,
  }});

  const sensors = useSensors(mouseSensor, touchSensor);

  const [orderedColumnsState, setorderedColumnsState] = React.useState([]);
  
  // In the same time, only card or column can be drag
  const [activeDragItemId, setactiveDragItemId] = React.useState([null]);
  const [activeDragItemType, setactiveDragItemType] = React.useState([null]);
  const [activeDragItemData, setactiveDragItemData] = React.useState([null]);
  const [oldColumnDraggingCard, setoldColumnDraggingCard] = React.useState([null]);
  // Using ref for save last overId in algorithm drag and drop
  const lastOverId = React.useRef(null);

  //  Animation when drop item
  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5',
        },
      },
    }),
  };

  React.useEffect(() => {
    const orderedColumns = mapOrder(board?.columns, board?.columnOrderIds, '_id');
    setorderedColumnsState(orderedColumns)
  }, [board]);


  const findColumnsByCardId = (cardId) => {
    return orderedColumnsState.find(c => c?.cards?.map(card => card._id)?.includes(cardId));
  }
  // Update state when move card between different columns (General Function)
  const moveCardBetweenDifferentColumns =(overColumn, overCardId, active, over, activeColumn, activeDraggingCardData, activeDraggingCardId) =>{
    setorderedColumnsState( prevColumns => {
      // get index of card is dragging
      const overCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId);

      // Logic calculate new position of card is dragging

      let newCardIndex;
      const isBelowOverItem = active.rect.current.translated && 
        active.rect.current.translated.top > over.rect.top + over.rect.height;
      const modifier = isBelowOverItem ? 1 : 0;
      newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1;
      // Clone old OrderedColumnsState to new next Column
      const nextColumns =  cloneDeep(prevColumns)
      const nextActiveColumn = nextColumns.find(c => c._id === activeColumn._id)
      const nextOverColumn = nextColumns.find(c => c._id === overColumn._id)

      if(nextActiveColumn){
        // Delete card in active column by get new array without this card which need delete
          nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id !== activeDraggingCardId)
          // Update cardOrderIds to suitable data
          nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
      }

      if(nextOverColumn){
        // Checking card dragging has been survival in overColumn, if yes to delete this card.
        nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDraggingCardId)
        
        // Rebuild card dragging with new columnId
        const rebuildActiveDraggingCardData = {...activeDraggingCardData, columnId: overColumn._id}
        // Add card dragging to overColumn with new index
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0 , rebuildActiveDraggingCardData)
        // Update cardOrderIds to suitable data

        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)
      }
      console.log('nextColumns', nextColumns);
      return nextColumns
    })
  }


  // For trigger drag event in start
  const handleDragStart = (event) => {
    console.log('Drag Start');
    setactiveDragItemId(event?.active?.id);
    setactiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN);
    setactiveDragItemData(event?.active?.data?.current);

    // If drag card, save old column of card is dragging
    if(event?.active?.data?.current?.columnId){
      const column = findColumnsByCardId(event?.active?.id);
      setoldColumnDraggingCard(column);
    }
  }

  // For trigger draging event in over
  const handleDragOver = (event) => {
    console.log('Drag Over');
    // No do anything if drag column
    if(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      return;
    }
    // Handle more drag card each column

    const {active, over} = event;
    if(!active || !over) return;
    // activeDraggingCardId: cardId of card is dragging
    const {id: activeDraggingCardId, data: { current : activeDraggingCardData}} = active
    // overCardId: cardId of card is over
    const {id: overCardId} = over
    // find 2 columns of card is dragging base on cardId

    const activeColumn = findColumnsByCardId(activeDraggingCardId);
    const overColumn = findColumnsByCardId(overCardId);

    if(!activeColumn || !overColumn) return;

    // If drag card not in same column
    if(activeColumn._id !== overColumn._id){
      moveCardBetweenDifferentColumns(overColumn, overCardId, active, over, activeColumn, activeDraggingCardData, activeDraggingCardId)
    }

  }



  // For trigger drag event in end
  const handleDragEnd = (event) => {

    const {active, over} = event;
    // Check if have active and over (For drag out of box)
    if(!active || !over) return;

    // Handle drag and drop card
    if(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      const {id: activeDraggingCardId, data: { current : activeDraggingCardData}} = active
      // overCardId: cardId of card is over
      const {id: overCardId} = over
      // find 2 columns of card is dragging base on cardId
  
      const activeColumn = findColumnsByCardId(activeDraggingCardId);
      const overColumn = findColumnsByCardId(overCardId);
      if(!activeColumn || !overColumn) return;


      
      // Drag card in different column
      if(oldColumnDraggingCard._id !== overColumn._id){
        moveCardBetweenDifferentColumns(overColumn, overCardId, active, over, activeColumn, activeDraggingCardData, activeDraggingCardId)

      }
      // Drag card in same column
      else{
        // get position from oldColumnDraggingCard
        const oldCardPosition = oldColumnDraggingCard?.cards.findIndex(card => card._id === activeDragItemId);
        const newCardPosition = overColumn?.cards.findIndex(card => card._id === overCardId);
        // Like logic drag and drop card in same column
        const newCards = arrayMove(oldColumnDraggingCard?.cards, oldCardPosition, newCardPosition);
        setorderedColumnsState( prevColumns => {
        // Clone old OrderedColumnsState to new next Column
          const nextColumns =  cloneDeep(prevColumns)
          // Find column when dragging
          const targetColumn = nextColumns.find(c => c._id === overColumn._id)

          // Update card and carOrderIds in targetColumn
          if(targetColumn){
            targetColumn.cards = newCards
            targetColumn.cardOrderIds = newCards.map(card => card._id)
          }
          return nextColumns
        })
      }

    }
    // Handle drag and drop column
    if(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      if(active.id !== over.id) {
        // get position from active
        const oldColumnPosition = orderedColumnsState.findIndex(c => c._id === active.id);
        // get position from over
        const newColumnPosition = orderedColumnsState.findIndex(c => c._id === over.id);
        const newColumns = arrayMove(orderedColumnsState, oldColumnPosition, newColumnPosition);
        // For update new column order if have api
        // const newColumnIds = newColumns.map(c => c._id);
        setorderedColumnsState(newColumns);
        }
    }
    // Reset active drag item
    setactiveDragItemData(null);
    setactiveDragItemId(null);
    setactiveDragItemType(null);
    setoldColumnDraggingCard(null);
  }
  // Custom collisionDetectionStrategy
  const collisionDetectionStrategy = React.useCallback((args) => {

   
    if(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN){
      return closestCorners({ ...args });
    }
    // Finding the intersection between the active draggable and the droppable elements
    const pointerIntersections = pointerWithin(args);

     // If drag column outside column like above or below
    if(!pointerIntersections?.length){
      return
    }
    // Finding first overId in pointerIntersections
    let overId = getFirstCollision(pointerIntersections, 'id');

    if(overId){
      
      const intersecColumn = orderedColumnsState.find(c => c._id === overId);
      if(intersecColumn){
        overId = closestCorners({
          ...args,
          droppableContainers: args.droppableContainers.filter(container => { (container.id === overId) && (intersecColumn?.cardOrderIds?.includes(container.id))})
        })[0]?.id
      }
      lastOverId.current = overId;
      return [{ id: overId}]
    }
    // Return lastOverId if have overId is null or empty - Avoid bug
    return lastOverId.current ? [{ id: lastOverId.current}] : [];

  }, [activeDragItemType, orderedColumnsState]);
  return (
    //  if use closestCorners will have bug flickering + not smooth when drag and drop, so customer collisionDetectionStrategy
    <DndContext onDragEnd={handleDragEnd} sensors={sensors} collisionDetection={collisionDetectionStrategy} onDragStart={handleDragStart} onDragOver={handleDragOver}>
      <Box sx={{
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#778ca3' : '#aaa69d' ),
        width: '100%',
        height: (theme) => theme.controllCustomer.boardContentHeight,
        // alignItems: 'center',
        p: '10px 0'
    }}>
      <ListColumns columns={orderedColumnsState} />
      <DragOverlay dropAnimation={dropAnimation}>
        {(!activeDragItemId || !activeDragItemData || !activeDragItemType) && null}
        {(activeDragItemId && activeDragItemData && activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) && <Column column={activeDragItemData}/>}
        {(activeDragItemId && activeDragItemData && activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) && <VCard card={activeDragItemData}/>}

      </DragOverlay>
    </Box>
  </DndContext>
  );
}
export default BoardContent;