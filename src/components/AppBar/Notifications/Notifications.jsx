import { useEffect, useState } from 'react'
import moment from 'moment'
import Badge from '@mui/material/Badge'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import DoneIcon from '@mui/icons-material/Done'
import NotInterestedIcon from '@mui/icons-material/NotInterested'
import { useSelector, useDispatch } from 'react-redux'
import { updateBoardInvitationAPI ,selectCurrentNotifications, fetchInvitationsAPI } from '../../../redux/notifications/notificationsSlice'
import { socketIoInstance } from '../../../socketClient'
import { selectCurrentUser } from '../../../redux/user/userSlice'
import { addNotification } from '../../../redux/notifications/notificationsSlice'
import { useNavigate } from 'react-router-dom'
const BOARD_INVITATION_STATUS = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED'
}

function Notifications() {
  const currentUser = useSelector(selectCurrentUser)
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClickNotificationIcon = (event) => {
    setAnchorEl(event.currentTarget)

    // Click on the notification icon, the new notification status will be updated to false.
    setnewNotification(false)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  // State to check new notification.
  const [newNotification, setnewNotification] = useState(false)

  // get notifications data fron redux
  const currentNotifications = useSelector(selectCurrentNotifications)
  // Fetch invitations data from the server
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchInvitationsAPI())

      // Function to handle real-time events:
    const onReceiveNewInvitation =(invitation) =>{
      // If current user logged and save in Redux which is invitee in inivation record
      if(invitation.inviteeId === currentUser._id){
          // 1. Add new invitation in Redux
          dispatch(addNotification(invitation))
          // 2.  Update status having new notification
          setnewNotification(true)
      }
    }
      // Listen event have name: BE_send_new_invitation
    socketIoInstance.on('BE_invite_user_to_board', onReceiveNewInvitation)
    
    // Clean up to prevent duplicate register event.
    return () =>{
      socketIoInstance.off('BE_invite_user_to_board', onReceiveNewInvitation)
    }

  }, [dispatch, currentUser])

  // Update status of board invitation
  const updateBoardInvitation = (status, invitationId) => {
    console.log('status: ', status)
    console.log('invitationId: ', invitationId)
    dispatch(updateBoardInvitationAPI({ status, invitationId })).then((res) =>{
        if(res.payload.boardInvitation.status === BOARD_INVITATION_STATUS.ACCEPTED){
          navigate(`/boards/${res.payload.boardInvitation.boardId}`)
        }
    })
  }

  return (
    <Box>
      <Tooltip title="Notifications">
        <Badge
          color="warning"
          variant={newNotification ? 'dot' : 'none'}
          sx={{ cursor: 'pointer' }}
          id="basic-button-open-notification"
          aria-controls={open ? 'basic-notification-drop-down' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClickNotificationIcon}
        >
          <NotificationsNoneIcon sx={{
            color: newNotification ? 'yellow' : 'white'
          }} />
        </Badge>
      </Tooltip>

      <Menu
        sx={{ mt: 2 }}
        id="basic-notification-drop-down"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{ 'aria-labelledby': 'basic-button-open-notification' }}
      >
        {(!currentNotifications || currentNotifications.length === 0) && <MenuItem sx={{ minWidth: 200 }}>You do not have any new notifications.</MenuItem>}
        {currentNotifications?.map((notification, index) =>
          <Box key={index}>
            <MenuItem sx={{
              minWidth: 200,
              maxWidth: 360,
              overflowY: 'auto'
            }}>
              <Box sx={{ maxWidth: '100%', wordBreak: 'break-word', whiteSpace: 'pre-wrap', display: 'flex', flexDirection: 'column', gap: 1 }}>
                {/* Contents of the notice */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box><GroupAddIcon fontSize="small" /></Box>
                  <Box><strong>{notification.inviter?.displayName}</strong> had invited you to join the board <strong>{notification.board?.title}</strong></Box>
                </Box>

                {/* When the Status of this notification is PENDING, 2 Buttons will appear. */}
                {notification.boardInvitation?.status === BOARD_INVITATION_STATUS.PENDING &&
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end' }}>
                <Button
                  className="interceptor-loading"
                  type="submit"
                  variant="contained"
                  color="success"
                  size="small"
                  onClick={() => updateBoardInvitation(BOARD_INVITATION_STATUS.ACCEPTED, notification._id)}
                >
                  Accept
                </Button>
                <Button
                  className="interceptor-loading"
                  type="submit"
                  variant="contained"
                  color="secondary"
                  size="small"
                  onClick={() => updateBoardInvitation(BOARD_INVITATION_STATUS.REJECTED, notification._id)}
                >
                  Reject
                </Button>
              </Box>
                }


                {/* When the Status of this notification is ACCEPTED or REJECTED, the information will be displayed. */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end' }}>
                {notification.boardInvitation?.status === BOARD_INVITATION_STATUS.ACCEPTED &&
                  <Chip icon={<DoneIcon />} label="Accepted" color="success" size="small" />
                }
                {notification.boardInvitation?.status === BOARD_INVITATION_STATUS.REJECTED &&
                  <Chip icon={<NotInterestedIcon />} label="Rejected" size="small" />
                }
                </Box>

                {/* Time of announcement */}
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="span" sx={{ fontSize: '13px' }}>
                    {moment(notification.createdAt).format('llll')}
                  </Typography>
                </Box>
              </Box>
            </MenuItem>
            {/* The Divider line will not be visible if it is the last element.*/}
            {index !== (currentNotifications?.length - 1) && <Divider />}
          </Box>
        )}
      </Menu>
    </Box>
  )
}

export default Notifications
