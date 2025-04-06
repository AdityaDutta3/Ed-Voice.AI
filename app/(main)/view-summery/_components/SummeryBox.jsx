import React from 'react'
import ReactMarkdown from 'react-markdown'

function SummeryBox({ summery }) {
    return (
        <div className='h-[60vh] overflow-auto'>
            <ReactMarkdown>{summery}</ReactMarkdown>
        </div>
    )
}

export default SummeryBox