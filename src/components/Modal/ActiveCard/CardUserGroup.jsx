import { useState } from 'react'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'
import Popover from '@mui/material/Popover'
import AddIcon from '@mui/icons-material/Add'
import Badge from '@mui/material/Badge'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useSelector } from 'react-redux'
import { selectCurrentActiveBoard } from '../../../redux/activeBoard/activeBoardSlice'
import { CARD_MEMBER_ACTIONS } from '../../../utils/constants'


function CardUserGroup({ cardMemberIds = [], onUpdateCardMembers }) {
  /**
   * Handle Popover to hide or show all users on a popup, similar docs for reference here::
   * https://mui.com/material-ui/react-popover/
   */
  const [anchorPopoverElement, setAnchorPopoverElement] = useState(null)
  const isOpenPopover = Boolean(anchorPopoverElement)
  const popoverId = isOpenPopover ? 'card-all-users-popover' : undefined
  const handleTogglePopover = (event) => {
    if (!anchorPopoverElement) setAnchorPopoverElement(event.currentTarget)
    else setAnchorPopoverElement(null)
  }
  // Get activeBoard from Redux to get all members information of board.
  const board = useSelector(selectCurrentActiveBoard)
  // Members of the card is the intersection of the members of the board.
  // So that base board.FE_allUsers and card.memberIds to create new array to have information of User to display
 
  const FE_CardMembers = board?.FE_allUsers?.filter(user => cardMemberIds.includes(user._id))

  const handleUpdateCardMembers = (user) => {
    // incomingMemberInfor to send BE, with 2 infor is userId and action (remove or add user to card)
    const incomingMemberInfor = {
      userId: user._id,
      action: cardMemberIds.includes(user._id) ? CARD_MEMBER_ACTIONS.REMOVE : CARD_MEMBER_ACTIONS.ADD
    }

    onUpdateCardMembers(incomingMemberInfor)
  }
  
  // Note here  do not use MUI's AvatarGroup Component because it does not support well when we need to customize & trigger to process the final calculation element, simply use Box and CSS - Style the Avatar group to standardize the calculation a bit..
  return (
    <Box sx={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
      {/* Show users who are members of the card*/}
      {FE_CardMembers.map((user, index) =>
        <Tooltip title={user.displayName} key={index}>
          <Avatar
            sx={{ width: 34, height: 34, cursor: 'pointer' }}
            alt={user.displayName}
            src={user.avatar}
          />
        </Tooltip>
      )}

      {/* This button opens the add member popover */}
      <Tooltip title="Add new member">
        <Box
          aria-describedby={popoverId}
          onClick={handleTogglePopover}
          sx={{
            width: 36,
            height: 36,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: '600',
            borderRadius: '50%',
            color: (theme) => theme.palette.mode === 'dark' ? '#90caf9' : '#172b4d',
            bgcolor: (theme) => theme.palette.mode === 'dark' ? '#2f3542' : theme.palette.grey[200],
            '&:hover': {
              color: (theme) => theme.palette.mode === 'dark' ? '#000000de' : '#0c66e4',
              bgcolor: (theme) => theme.palette.mode === 'dark' ? '#90caf9' : '#e9f2ff'
            }
          }}
        >
          <AddIcon fontSize="small" />
        </Box>
      </Tooltip>

      {/* When clicking on + above, a popover will open showing all users in the board for users to click and add to the card. */}
      <Popover
        id={popoverId}
        open={isOpenPopover}
        anchorEl={anchorPopoverElement}
        onClose={handleTogglePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Box sx={{ p: 2, maxWidth: '260px', display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
          {board?.FE_allUsers.map((user, index) =>
            <Tooltip title={user.displayName} key={index}>
              {/* How to make Avatar with badge icon: https://mui.com/material-ui/react-avatar/#with-badge */}
              <Badge
                sx={{ cursor: 'pointer' }}
                onClick={() => handleUpdateCardMembers(user)}
                overlap="rectangular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  cardMemberIds.includes(user._id) ?
                <CheckCircleIcon fontSize="small" sx={{ color: '#27ae60' }} /> 
                : null
              }
              >
                <Avatar
                  sx={{ width: 34, height: 34 }}
                  alt={user.displayName}
                  src={user.avatar}
                />
              </Badge>
            </Tooltip>
          )}
        </Box>
      </Popover>
    </Box>
  )
}

export default CardUserGroup
