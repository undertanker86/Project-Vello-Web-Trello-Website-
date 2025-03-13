
import { useState, useEffect } from 'react'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import CircularProgress from '@mui/material/CircularProgress'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { fetchBoardsAPI } from '../../../apis'
import { useDebounceFn } from '../../../customHooks/useDebounceFn'


/**
 * https://mui.com/material-ui/react-autocomplete/#asynchronous-requests
 */
function AutoCompleteSearchBoard() {
  const navigate = useNavigate()

  // State handles displaying fetched results from API
  const [open, setOpen] = useState(false)
  // State stores the list of fetched boards
  const [boards, setBoards] = useState(null)
  // Will show loading when starting to call api fetch boards
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // When closing the result list, clear the boards to null at the same time.
    if (!open) { setBoards(null) }
  }, [open])

  // Process the data received from the input and then call the API to get the result (need to add useDebounceFn as below)
  const handleInputSearchChange = (event) => {
    const searchValue = event.target?.value
    if (!searchValue) return
    console.log(searchValue)

    // Use react-router-dom's createSearchParams to create a standard searchPath with q[title] to call the API
    const searchPath = `?${createSearchParams({ 'q[title]': searchValue })}`
    // console.log(searchPath)
    setLoading(true) // Show loading when calling API
    // Call API...
    fetchBoardsAPI(searchPath)
      .then((response) => {
        setBoards(response.boards || [])
      })
      // setLoading to false after fetching API or error
      .finally(() => {
        setLoading(false) // Hide loading after fetching API
      })
  }

  // Do useDebounceFn... - Wrap handleInputSearchChange above useDebounceFn to avoid spamming API calls
  const debounceSearchBoard = useDebounceFn(handleInputSearchChange, 2000)


  // When we select a specific board, we will navigate to that board.
  const handleSelectedBoard = (event, selectedBoard) => {
    // Must check if a specific board is selected before calling navigate
    console.log(selectedBoard)
    if(selectedBoard) {
      navigate(`/boards/${selectedBoard._id}`)
    }
  }

  return (
    <Autocomplete
      sx={{ width: 220 }}
      id="asynchronous-search-board"
      //This text appears when boards is null or after fetching boards but it is empty - no results
      noOptionsText={!boards ? 'Type to search board...' : 'No board found!'}

      // This block handles opening and closing the search results section.
      open={open}
      onOpen={() => { setOpen(true) }}
      onClose={() => { setOpen(false) }}

      // getOptionLabel: let Autocomplete get the board title and display it
      getOptionLabel={(board) => board.title}

      // Autocomplete's Options needs an Array as input, and our boards initially need null to make the noOptionsText above, so this section needs to add || []
      options={boards || []}

      // Fix a warning of MUI, because Autocomplete defaults when we select a value it will compare the object below, and although there are 2 json objects that look the same in JavaScript but when comparing it will return false. So we need to compare correctly with Primitive value, for example here is using String _id instead of comparing the entire json object board.
      // Link: https://stackoverflow.com/a/65347275/8324172
      isOptionEqualToValue={(option, value) => option._id === value._id}

      // Loading
      loading={loading}

      // onInputChange will run when typing content into the input tag, need to debounce to avoid spam API calls
      onInputChange={debounceSearchBoard}

      // The onChange of the entire Autocomplete will run when we select a result (in this case the board)
      onChange={handleSelectedBoard}

      // Render the input tag to enter search content
      renderInput={(params) => (
        <TextField
          {...params}
          label="Type to search..."
          size="small"
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'white' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <>
                {loading ? <CircularProgress sx={{ color: 'white' }} size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            )
          }}
          sx={{
            '& label': { color: 'white' },
            '& input': { color: 'white' },
            '& label.Mui-focused': { color: 'white' },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: 'white' },
              '&:hover fieldset': { borderColor: 'white' },
              '&.Mui-focused fieldset': { borderColor: 'white' }
            },
            '.MuiSvgIcon-root': { color: 'white' }
          }}
        />
      )}
    />
  )
}

export default AutoCompleteSearchBoard
