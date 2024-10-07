import React, { useEffect } from 'react';
import { MdEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useDispatch } from 'react-redux';
import { setStudentResultsSheets } from '../store/reducers/LectureNavigationSlice'; 



function  ResultTable({ students, setStudents, user,status }) {
    const [enableEditIndex, setEnableEditIndex] = React.useState(null); // Track which row is being edited
    const [editedIndex, setEditedIndex] = React.useState('');
    const [editedResult, setEditedResult] = React.useState('');
    const dispatch = useDispatch();
    

    const handleEditClick = (index) => {
        // Set the row index to be edited
        setEnableEditIndex(index);
        setEditedIndex(students[index].index);
        setEditedResult(students[index].grade);
    };

    useEffect(() => {
        dispatch(setStudentResultsSheets(students));
    }, [students]);
    

    const handleSave = (index) => {
        const updatedStudents = students.map((student, idx) =>
            idx === index ? { ...student, index: editedIndex, grade: editedResult } : student
        );  
        setStudents(updatedStudents);// Update students in the parent
        setEnableEditIndex(null); 
    };

    const handleDelete = (index) => {
        const updatedStudents = students.filter((_, idx) => idx !== index);
        setStudents(updatedStudents); // Update students in the parent
    };

    return (
        <div className={`${user !== 'hod' && user !== 'dean' ? "ml-0" : "ml-48"}`}>
            <div className='flex flex-col items-center'>
                <div className={`mt-3 ${user !== 'hod' && user !== 'dean' ? "w-11/12" : "w-10/12"}`}>
                    <div className='grid grid-cols-8 gap-[1px]'>
                        {/* {user !== 'hod' &&
                            <div className='p-2 col-span-1 flex items-center justify-center bg-primary'>
                                <input type='checkbox' className='w-5 h-5'></input>
                            </div>
                        } */}
                        <div className='p-2 col-span-2 flex items-center justify-center bg-primary'>
                            <h3 className='text-lg text-white'>No</h3>
                        </div>
                        <div className='col-span-2 flex items-center justify-center bg-primary'>
                            <h3 className='text-lg text-white'>Student Index</h3>
                        </div>
                        <div className='col-span-2 flex items-center justify-center bg-primary'>
                            <h3 className='text-lg text-white'>Result</h3>
                        </div>
                        {
                            user !== 'hod' && user !== 'dean' && user === 'dptSecretary' && user === 'registar'  ?
                                <div className='col-span-1 flex items-center justify-center bg-primary'></div>
                                : <></>
                        }
                    </div>
                </div>
                <div className={`${user !== 'hod' && user !== 'dean' ? "w-11/12" : "w-10/12"} max-h-72 overflow-y-scroll scrollbar-hide`}>
                    {students.map((student, index) => (
                        <div className='w-full mb-1' key={index}>
                            <div className='grid grid-cols-8 gap-[1px]'>
                                {/* {user !== 'hod' &&
                                    <div className='p-3 col-span-1 flex items-center justify-center bg-table-bg'>
                                        <input type='checkbox' className='w-5 h-5'></input>
                                    </div>
                                } */}
                                <div className='p-3 col-span-2 flex items-center justify-center bg-table-bg'>
                                    <p className='text-lg text-table-txt'>{index + 1}</p>
                                </div>
                                <div className='p-0 col-span-2 flex items-center justify-center bg-table-bg'>
                                    <input
                                        disabled={enableEditIndex !== index}
                                        type='text'
                                        value={enableEditIndex === index ? editedIndex : student.index}
                                        onChange={(e) => setEditedIndex(e.target.value)}
                                        className='p-3 w-full h-full text-lg text-center bg-transparent border-transparent focus:border-secondary focus:border-2 focus:outline-none placeholder-table-txt placeholder-opacity-100'
                                    />
                                </div>
                                <div className='p-0 col-span-2 flex items-center justify-center bg-table-bg border-none'>
                                    <input
                                        disabled={enableEditIndex !== index}
                                        type='text'
                                        value={enableEditIndex === index ? editedResult : student.grade} // Use 'result' instead of 'grade'
                                        onChange={(e) => setEditedResult(e.target.value)}
                                        className='p-3 w-full h-full text-lg text-center bg-transparent border border-transparent focus:border-secondary focus:border-2 focus:outline-none placeholder-table-txt placeholder-opacity-100'
                                    />
                                </div>
                                {
                                    user !== 'hod' && status !=='null' ? (
                                        <div className='p-3 col-span-1 flex items-center justify-center gap-1 bg-table-bg'>
                                        {enableEditIndex === index ? (
                                            <button onClick={() => handleSave(index)} className='text-save-icon-bg cursor-pointer'>
                                            Save
                                            </button>
                                        ) : (
                                            <MdEdit size={20} onClick={() => handleEditClick(index)} className='text-edit-icon-bg cursor-pointer' />
                                        )}
                                        <RiDeleteBin6Line size={20} onClick={() => handleDelete(index)} className='text-dlt-icon-bg cursor-pointer' />
                                        </div>
                                    ) : null
                                    }
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ResultTable;
