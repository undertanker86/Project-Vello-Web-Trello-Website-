export const generatePlaceHolderCard = (column) => {
  return {
    _id: `${column._id}-placeholder-card`,
    boardId: column.boardId,
    columnId: column._id,
    fontEndPlaceholderCard: true
  }
}