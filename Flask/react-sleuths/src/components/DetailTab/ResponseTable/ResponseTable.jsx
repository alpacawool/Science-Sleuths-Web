import React from 'react'

export const ResponseTable = (props) => {
  return (
    <div>ResponseTable
      <p>{props.questions[0].prompt}</p>
      <p>{props.observations[0].first_name}</p>

    </div>
  )
}
