import React, { useState, useEffect } from 'react';
import ResultTable from '../ResultTable';
import DropDown from '../DropDown';
import { useSelector, useDispatch } from 'react-redux';
import { host } from '../../utils/hostingPort'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { setResultsSheets, setPendingSecSheetId } from '../../store/reducers/DptSecretaryNavigationSlice';

function DptResult() {
    const statusOptions = ['Medical', 'Absent'];
    const resultsSheets = useSelector((store) => store.dptSecretaryNavigationSlice?.resultsSheets || []);
    const currentSheetId = useSelector((store) => store.dptSecretaryNavigationSlice?.pendingSecSheetId || []); 
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [students, setStudents] = useState([]);
    const [newIndex, setNewIndex] = useState('');
    const [newStatus, setNewStatus] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [currentSheet, setCurrentSheet] = useState(null);
    const [error, setError] = useState('');

        // Save access token, refresh token, and role to localStorage
        const token = localStorage.getItem('accessToken');
        const refresh = localStorage.getItem('refreshToken');
        const userRole = localStorage.getItem('role');
        const personId = localStorage.getItem('userId');

    useEffect(() => {
        const sheet = resultsSheets.find(sheet => sheet.id === currentSheetId);
        if (sheet) {
            const formattedStudents = sheet.studentResults.map(student => ({
                no: student.no,
                index: student.index,
                grade: student.grade,
            }));
            setStudents(formattedStudents);
            setCurrentSheet(sheet);
        }
    }, [resultsSheets, currentSheetId]);

    const handleAddResult = () => {
        if (!newIndex || !newStatus) {
            setErrorMessage('Please fill in both the Index Number and Status.');
            return;
        }

        setErrorMessage('');

        const newResult = {
            no: students.length > 0 ? students[students.length - 1].no + 1 : 1,
            index: newIndex,
            grade: newStatus,
        };

        setStudents((prevStudents) => {
            const updatedStudents = [...prevStudents, newResult];
            return updatedStudents;
        });

        setNewIndex('');
        setNewStatus('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!currentSheet) {
            setError("No sheet selected.");
            return;
        }

        // Replace the studentResults field with the updated students state
        const updatedSheet = {
            ...currentSheet,
            studentResults: students,
            depSecretaryID: personId
        };


        console.log(updatedSheet)

        try {
            const response = await axios.post(`${host}/api/results/updateByDepSecretary/${currentSheetId}`, updatedSheet, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log("Response: ", response.data);
            alert("Results updated successfully!");
            window.location.reload();
            navigate('/dptSecretary');
        } catch (err) {
            console.error(err);
            setError("An error occurred while updating the results.");
        }
    };

    return (
        <div>
            <div className='mt-5 w-full flex flex-col'>
                <div className='w-full flex flex-col items-center'>
                    <div>
                        <h3 className='text-xl text-primary-txt'>Results Sheet</h3>
                    </div>
                    <div className='mt-3'>
                        <div className='grid grid-cols-7 gap-3'>
                            <div className='col-span-3'>
                                <input
                                    type='text'
                                    placeholder='Enter Index Number'
                                    className='p-4 w-full h-12 border-[1px] bg-transparent border-black rounded-lg focus:border-secondary focus:border-2 focus:outline-none placeholder-table-txt placeholder-opacity-100'
                                    value={newIndex}
                                    onChange={(e) => setNewIndex(e.target.value)}
                                />
                            </div>
                            <div className='col-span-3'>
                                <DropDown
                                    dropDownType="status"
                                    options={statusOptions}
                                    type={newStatus || "Select Status"}
                                    setValue={setNewStatus}
                                />
                            </div>
                            <div className='col-span-1 bg-primary'>
                                <button
                                    onClick={handleAddResult}
                                    className='w-full h-12 bg-secondary text-white border-btn-border text-[16px] border-[1px]'
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                        {errorMessage && <div className="text-red-500 mt-2">{errorMessage}</div>}
                    </div>
                </div>
                <div className='mt-2'>
                    <ResultTable students={students} setStudents={setStudents} user='dptSecretary' />
                </div>
                <div className='mt-4 mr-10 flex gap-3 justify-end'>
                    <button onClick={handleSubmit} className='mt-3 py-2 px-10 bg-secondary text-white border-btn-border text-[16px] border-[1px]'>
                        Send
                    </button>
                </div>
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
    );
}

export default DptResult;
