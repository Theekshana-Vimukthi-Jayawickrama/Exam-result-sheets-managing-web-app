import React, { useState } from 'react'
import ResultSheetsCollection from '../ResultSheetsCollection'
import { IoChevronBack } from "react-icons/io5";
import { registarClickCollectionView } from '../../store/reducers/RegistarNavigationSlice';
import { useSelector, useDispatch } from 'react-redux';
import { host } from '../../utils/hostingPort';
import axios from 'axios'; 

function RegistarResultSheetsCollection() {
      // Select pendingSheetId and resultsSheets from Redux store
      const pendingSheetId = useSelector((store) => store.registarNavigationSlice.pendingCollectionRTSheetId);
      const resultsSheets = useSelector((store) => store.registarNavigationSlice.studentCollectionResultsSheetsRT || []);
      const personId = localStorage.getItem('userId');
    console.log(resultsSheets);
      // Find the specific collection that matches the pendingSheetId
      const selectedCollection = resultsSheets.find(sheet => sheet.id === pendingSheetId);
  
      const dispatch = useDispatch();
      const handleSubmit = async (e) => {
          e.preventDefault();
          if (!selectedCollection) {
              alert("No sheet selected."); // Improved error handling
               return;
          }
          const updatedSheet = {
              ...selectedCollection,
              registrarId: personId
          };
          try {
              const response = await axios.put(`${host}/api/results/registrar/collection/${personId}/${pendingSheetId}`, updatedSheet, {
                  headers: {
                      'Content-Type': 'application/json'
                  }
              });
              console.log("Response: ", response.data);
              alert("Results updated successfully!");
              window.location.reload();
          } catch (err) {
              console.error(err);
              alert("An error occurred while updating the results.");
          }
      };

    const handleBack = () => {
        dispatch(registarClickCollectionView(false))
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
                <div className='w-11/12 flex justify-end'>
                    <button 
                       onClick={handleSubmit}
                       className='mt-0 py-2 px-10 bg-secondary text-white border-btn-border text-[16px] border-[1px]'
                    >
                        Approve
                    </button>
                </div>
            </div>
        </div>
    )
}

export default RegistarResultSheetsCollection
