/**
 * Science Sleuths Site name and Logo (Using MUI logo from)
 * Logo (as well as other material assets from) from:
 * https://mui.com/material-ui/material-icons/?query=science&selected=Science
 * 2022 Material UI SAS, 128 Rue La Boétie 75008 Paris, France.
 * Under Standard License for free, non-commercial use
 */
import React from 'react'
import ScienceIcon from '@mui/icons-material/Science';

import "./ScienceLogo.scss";

export const ScienceLogo = () => {
  return (
    <div className="science-logo-overall">
        <ScienceIcon className="science-icon"/>
        <span className="science-text">Science Sleuths</span>
    </div>
  )
}
