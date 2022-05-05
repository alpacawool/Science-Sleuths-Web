// Validate new project form fields
export const projectFormValidator = (name, value) => {
  // console.log(`${name}, ${value}`)
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

  // Check overall project error messages
  // Empty object implies blank fields
  if (error_message === {} ) {
    hasErrorMessages = true
  }
  if (error_message.title !== '' || error_message.description !== '') {
    hasErrorMessages = true
  }

  // Check individual question error messages
  let currentQuestions = currentProject.questions
  
  for (var i = 0; i < currentQuestions.length; i++) {
    let currentError = currentQuestions[i].error_message

    if (currentError === {}) {
      hasErrorMessages = true
    }

    if (currentError.prompt !== '' ) {
      hasErrorMessages = true
    }
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