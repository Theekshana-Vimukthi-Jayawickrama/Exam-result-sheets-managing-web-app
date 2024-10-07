import React, { useState, useEffect } from 'react';
import DropDown from '../DropDown';
import ResultTable from '../ResultTable';
import { useSelector, useDispatch } from 'react-redux';
import { setStudentResultsSheets } from '../../store/reducers/LectureNavigationSlice';
import axios from 'axios';
import { host } from '../../utils/hostingPort'; 

function ApprovePendingResult() {
    const results = ['A', 'B', 'C', 'D', 'E', 'F'];

    // Get the resultsSheets and pendingSheetId from Redux store
    const resultsSheets = useSelector((store) => store.lectureNavigationSlice?.resultsSheets || []);
    const pendingSheetId = useSelector((store) => store.lectureNavigationSlice?.pendingSheetId);
    const updatedStudents = useSelector((store) => store.lectureNavigationSlice?.studentResultsSheets || []);
    const [pendingSheet, setPendingSheet] = useState([]);
    const [students, setStudents] = useState([]);
    const [newIndex, setNewIndex] = useState('');
    const [newGrade, setNewGrade] = useState(''); // Will be updated by DropDown component
    const [errorMessage, setErrorMessage] = useState('');
    const [currentSheet, setCurrentSheet] = useState(null);
    const dispatch = useDispatch();
    const [error, setError] = useState('');

    // Save access token, refresh token, and role to localStorage
    const token = localStorage.getItem('accessToken');
    const refresh = localStorage.getItem('refreshToken');
    const userRole = localStorage.getItem('role');
    const personId = localStorage.getItem('userId');

    // Filter to get the pending result sheet that matches the pendingSheetId
    useEffect(() => {
        if (resultsSheets.length > 0 && pendingSheetId) {
            const pendingSheet = resultsSheets.find((sheet) => sheet.id === pendingSheetId);
            setPendingSheet(pendingSheet);
            if (pendingSheet) {
                // Extract student results from the pending sheet and set them in state
                const formattedStudents = pendingSheet.studentResults.map((student) => ({
                    no: student.no,
                    index: student.index,
                    grade: student.grade,
                }));
                setStudents(formattedStudents);
                setCurrentSheet(pendingSheet);
            }
        }
        dispatch(setStudentResultsSheets(students));
    }, [resultsSheets, pendingSheetId]);

    const addNewResults = () => {
        // Validate inputs
        if (!newIndex || !newGrade) {
            setErrorMessage('Please fill in both the Index Number and Grade.');
            return;
        }

        // Clear any previous error message
        setErrorMessage('');

        // Get the last 'no' from updatedStudents or start from 1 if empty
        const lastNo = updatedStudents.length > 0 ? updatedStudents[updatedStudents.length - 1].no : 0;

        // Create a new result entry
        const newResult = {
            no: lastNo + 1,
            index: newIndex,
            grade: newGrade,
        };

        // Update the students array with the new result
        setStudents((prevStudents) => [...prevStudents, newResult]);

        // Optionally: clear input fields after adding
        setNewIndex('');
        setNewGrade(''); // Reset the grade to default
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
            lectureID: personId
        };


        console.log(updatedSheet)

        try {
            const response = await axios.put(`${host}/api/results/lecApproved/${personId}/${pendingSheetId}`, updatedSheet, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log("Response: ", response.data);
            alert("Results updated successfully!");
            window.location.reload();
        } catch (err) {
            console.error(err);
            setError("An error occurred while updating the results.");
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        if (!currentSheet) {
            setError("No sheet selected.");
            return;
        }

        // Replace the studentResults field with the updated students state
        const updatedSheet = {
            ...currentSheet,
            studentResults: students,
        };


        console.log(updatedSheet)

        try {
            const response = await axios.put(`${host}/api/results/update/${pendingSheetId}/${personId}`, updatedSheet, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log("Response: ", response.data);
            alert("Results updated successfully!");
            window.location.reload();
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
                        <h3 className='text-xl text-primary-txt'>
                            {pendingSheet.subject || "No Pending Sheet"} - {students[0]?.subject || "Result Sheet"}
                        </h3>
                        <h3 className='text-xl text-primary-txt'>
                            {pendingSheet.batch || "No Pending Sheet"} - {pendingSheet.batch || "No Pending Sheet"}
                        </h3>
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
                                    dropDownType="resultList"
                                    options={results}
                                    type={newGrade || "Select Grade"} // Display default text or selected value
                                    setValue={setNewGrade} // Update newGrade state when value changes
                                />
                            </div>
                            <div className='col-span-1 bg-primary'>
                                <button
                                    onClick={addNewResults}
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
                    <ResultTable students={students} setStudents={setStudents} user="lecturer" />
                </div>
                <div className='mt-4 mr-10 flex gap-3 justify-end'>
                <button onClick={handleUpdate}
                        className='mt-3 py-2 px-10 bg-secondary text-white border-btn-border text-[16px] border-[1px]'
                    >
                        update
                    </button>
                    <button onClick={handleSubmit}
                        className='mt-3 py-2 px-10 bg-secondary text-white border-btn-border text-[16px] border-[1px]'
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ApprovePendingResult;
