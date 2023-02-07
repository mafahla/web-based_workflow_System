import React from 'react'

export const IndividualData = ({individualExcelData}) => {
    return (
        <>
            <th>{individualExcelData.Month}</th>
            <th>{individualExcelData.Income}</th>
            <th>{individualExcelData.Expenses}</th>
  
        </>
    )
}