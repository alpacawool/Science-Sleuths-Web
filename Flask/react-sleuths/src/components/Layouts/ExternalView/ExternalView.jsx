/* Layout for public facing pages eg. signup, login, 404.. */
import React from 'react'
import {Outlet} from 'react-router-dom';

export const ExternalView = () => {
  return (
    <div>
      <Outlet />
    </div>
  )
}
