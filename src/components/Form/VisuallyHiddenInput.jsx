import { styled } from '@mui/material/styles'

const HiddenInputStyles = styled('input')({
  display: 'none' // Only display input

  // clip: 'rect(0 0 0 0)',
  // clipPath: 'inset(50%)',
  // height: 1,
  // overflow: 'hidden',
  // position: 'absolute',
  // // bottom: 0, // If you use bottom: 0 like the docs, there will be an error in the ActiveCard Modal, every time you click, the scroll will jump to the bottom.
  // left: 0,
  // whiteSpace: 'nowrap',
  // width: 1
})

function VisuallyHiddenInput(props) {
  return <HiddenInputStyles {...props} />
}

export default VisuallyHiddenInput
