import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux'; // Import useSelector to access Redux store
import DropDown from '../DropDown';
import ResultTable from '../ResultTable';
import Modal from 'react-modal';
import { host } from '../../utils/hostingPort'; 
function ResultForm() {
    const results = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'E', 'F'];
    
    const [students, setStudents] = useState([]); // Initialize as an empty array
    const [newIndex, setNewIndex] = useState('');
    const [newResult, setNewResult] = useState(results[0]); // Default to the first result in the dropdown
    const [showModal, setShowModal] = useState(false);

    // Retrieve data from Redux store
    const details = useSelector((state) => state.lectureNavigationSlice);

    // Save access token, refresh token, and role to localStorage
    const token = localStorage.getItem('accessToken');
    const refresh = localStorage.getItem('refreshToken');
    const userRole = localStorage.getItem('role');
    const id = localStorage.getItem('userId');

    const handleAddResult = () => {
        // Check if the index already exists in the table
        const exists = students.some(student => student.index === newIndex.trim());
        if (exists) {
            // If it exists, show the modal
            setShowModal(true);
        } else {
            // Add the new result to the table if it doesn't exist
            if (newIndex.trim() !== '') {
                const newNo = students.length + 1; // Auto-increment 'no'
                setStudents([...students, { no: newNo, index: newIndex.trim(), grade: newResult }]);
                setNewIndex(''); // Reset the input fields
            }
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    useEffect(()=>{
        console.log(details.selectedDate)
        //console.log(students)
    })

    const handleSendResults = async () => {
        // Construct the payload to match LectureSubjectResultSheetDto structure
        const payload = {
            lectureID: id, // Assuming lectureID is available in detailsFormData
            university: "Sabaragamuwa unversity of Sri Lanka",
            faculty: details.facultyName,
            department: details.departmentName,
            degreeProgram: details.degreeName,
            semester: details.semesterName,
            batch: details.batchName,
            examinationHeldMonth: details.selectedDate,
            subject: details.subjectName,
            subjectCode: details.subjectCode,
            studentResults: students.map(student => ({
                no: student.no,
                index: student.index,
                grade: student.grade,
            })),
        };

        try {
            const response = await fetch(`${host}/api/results/create`, { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Success:', data);
            window.location.reload();
            // Handle successful response (e.g., show a success message or redirect)
        } catch (error) {
            console.error('Error sending results:', error);
            alert('Error sending results:', error)
            // Handle error (e.g., show an error message)
        }
    };

    return (
        <div>
            <div className='mx-8 mt-5 flex flex-col items-center'>
                <div className='w-full flex justify-start'>
                    <h3 className='text-xl text-primary-txt'>Enter Exam Results</h3>
                </div>
                <div className='w-9/12 mt-3'>
                    <div className='grid grid-cols-7 gap-3'>
                        <div className='col-span-3'>
                            <input
                                type='text'
                                placeholder='Enter Index Number'
                                value={newIndex}
                                onChange={(e) => setNewIndex(e.target.value)}
                                className='p-4 w-full h-12 border-[1px] border-black rounded-lg focus:border-secondary focus:border-2 focus:outline-none placeholder-table-txt placeholder-opacity-100'
                            />
                        </div>
                        <div className='col-span-3'>
                            <DropDown type="Result" options={results} value={newResult} onChange={(e) => setNewResult(e.target.value)} />
                        </div>
                        <div className='col-span-1 bg-primary'>
                            <button
                                onClick={handleAddResult}
                                className='w-full h-12 bg-secondary text-white border-btn-border text-[16px] border-[1px]'
                            >Add</button>
                        </div>
                    </div>
                </div>
                <div className='w-full mt-2'>
                    {/* Pass the updated students data to the ResultTable component */}
                    <ResultTable students={students} setStudents={setStudents} />
                </div>
                <div className='w-full mt-5 mr-16 flex justify-end'>
                    <button 
                        onClick={handleSendResults} // Call the handleSendResults function on click
                        className='py-2 px-10 bg-secondary text-white border-btn-border text-[16px] border-[1px]'
                    >
                        Send
                    </button>
                </div>
            </div>

            {/* Modal Popup for duplicate index */}
            {showModal && (
                <Modal isOpen={showModal} onRequestClose={handleCloseModal}>
                    <div className='p-4'>
                        <h2 className='text-lg font-semibold'>Duplicate Entry</h2>
                        <p>This index number already exists in the table. Please enter a unique index number.</p>
                        <button 
                            onClick={handleCloseModal}
                            className='mt-4 bg-secondary text-white py-2 px-4 rounded'
                        >
                            Close
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
}

export default ResultForm;
