import { IoChevronBack } from "react-icons/io5";
import ResultSheetsCollection from '../ResultSheetsCollection'
import { registarClickApprovedCollectionView } from '../../store/reducers/RegistarNavigationSlice'
import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { host } from '../../utils/hostingPort';
import axios from 'axios';

function RegistarApprovedResultSheetsCollection() {
      // Select pendingSheetId and resultsSheets from Redux store
      const pendingSheetId = useSelector((store) => store.registarNavigationSlice.pendingCollectionRTSheetId);
      const resultsSheets = useSelector((store) => store.registarNavigationSlice.studentCollectionResultsSheetsRT || []);
      const personId = localStorage.getItem('userId');
    console.log(resultsSheets);
      // Find the specific collection that matches the pendingSheetId
      const selectedCollection = resultsSheets.find(sheet => sheet.id === pendingSheetId);
  
      const dispatch = useDispatch();

    const handleBack = () => {
        dispatch(registarClickApprovedCollectionView(false))
    }

    return (
        <div>
            <div className='flex flex-col items-center'>
                <div className='mt-5 w-11/12 flex items-center justify-start gap-3'>
                    <IoChevronBack 
                       onClick={handleBack}
                       size={20} 
                       className='cursor-pointer' 
                    />
                    <h3 className='text-xl text-primary-txt'>Collection</h3>
                </div>
                <div className='mt-2 py-2 px-5 w-11/12 flex flex-col items-start gap-0 bg-tertiary-bg'>
                    <p>University : {selectedCollection.university}</p>
                    <p>Faculty: {selectedCollection.faculty}</p>
                    <p>Department: {selectedCollection.department}</p>
                    <p>Batch: {selectedCollection.batch}</p>
                    <p>Semester: {selectedCollection.semester}</p>
                </div>
                <ResultSheetsCollection userType="registar" resultSheets={selectedCollection} />
            </div>
        </div>
    )
}

export default RegistarApprovedResultSheetsCollection
