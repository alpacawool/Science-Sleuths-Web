// Validate new project form fields
export const projectFormValidator = (name, value) => {

  let errorMessage = ''

  switch(name) {
    case 'title':
      if (!isValidLength(value)) {
        errorMessage = 'Title is required'
      }
      break;
    case 'description':
      if (!isValidLength(value)) {
        errorMessage = 'Description is required'
      }
      break;
    case 'prompt':
      if (!isValidLength(value)) {
        errorMessage = 'Question Prompt is required'
      }
  }

  return errorMessage
}

// Validate that every field is valid
export const entireNewProjectValidator = (currentProject) => {
  var isValid = true
  var hasErrorMessages = false
  let error_message = currentProject.error_message

  if (error_message === {} ) {
    hasErrorMessages = true
  }
  if (error_message.title !== '' || error_message.description !== '') {
    hasErrorMessages = true
  }

  if (hasErrorMessages) {
    isValid = false
  }

  return isValid
}

const isValidLength = (value) => {

    if (value.length < 1) {
        return false;
    }
    return true
}