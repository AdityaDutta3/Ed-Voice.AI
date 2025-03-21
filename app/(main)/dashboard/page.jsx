import React from 'react'
import Features from './components/Features'
import FeedBack from './components/FeedBack'
import History from './components/History'

function Workspace() {
  return (
    <div>
      <Features/>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 mt-14'>
        <History/>
        <FeedBack/>
      </div>
    </div>
  )
}

export default Workspace