import React, { useEffect, useState } from 'react'
import DropDown from '../DropDown'
import { useDispatch, useSelector } from 'react-redux'
//import { clickDetailsProceed } from '../../store/reducers/LectureNavigationSlice'
import { clickDetailsProceed, setDetails } from '../../store/reducers/LectureNavigationSlice';
import data from '../../utils/data'

function DetailsForm({ setIsSetupDetails, isSetupDetails }) {

    const lectureNavigation = useSelector((store) => store.lectureNavigationSlice)
    const dispatch = useDispatch()

    var faculties = data.map((faculty) => faculty.faculty)
    const [facultyName, setFacultyName] = useState('')

    var departments = [];
    const [departmentName, setDepartmentName] = useState('')

    if (facultyName !== '') {
        const faculty = data.filter((faculty) => faculty.faculty === facultyName)
        departments = faculty[0].departments.map((dpt) => dpt.dptName)
    }

    var degrees = [];
    const [degreeName, setDegreeName] = useState('')

    if (departmentName !== '') {
        const faculty = data.filter((faculty) => faculty.faculty === facultyName)
        const department = faculty[0].departments.filter((dpt) => dpt.dptName === departmentName)
        degrees = department[0].degrees.map((degree) => degree.degreeName)
    }

    var batches = [];
    const [batchName, setBatchName] = useState('')

    if (degreeName !== '') {
        const faculty = data.filter((faculty) => faculty.faculty === facultyName)
        const department = faculty[0].departments.filter((dpt) => dpt.dptName === departmentName)
        const degree = department[0].degrees.filter((degree) => degree.degreeName === degreeName)
        batches = degree[0].batches.map((batch) => batch.batchName)
    }

    var semesters = []
    const [semesterName, setSemesterName] = useState('')

    if (batchName !== '') {
        const faculty = data.filter((faculty) => faculty.faculty === facultyName)
        const department = faculty[0].departments.filter((dpt) => dpt.dptName === departmentName)
        const degree = department[0].degrees.filter((degree) => degree.degreeName === degreeName)
        const batch = degree[0].batches.filter((batch) => batch.batchName === batchName)
        semesters = batch[0].semesters.map((semester) => semester.semesterName)
    }

    var subjects = []
    const [subjectName, setSubjectName] = useState('')
    var subjectCodes = []
    const [subjectCode, setSubjectCode] = useState('')
    const [selectedDate, setSelectedDate] = useState('');

    if (semesterName !== '') {
        const faculty = data.filter((faculty) => faculty.faculty === facultyName)
        const department = faculty[0].departments.filter((dpt) => dpt.dptName === departmentName)
        const degree = department[0].degrees.filter((degree) => degree.degreeName === degreeName)
        const batch = degree[0].batches.filter((batch) => batch.batchName === batchName)
        const semester = batch[0].semesters.filter((semester) => semester.semesterName === semesterName)
        subjects = semester[0].subjects.map((subject) => subject.subjectName)
        subjectCodes = semester[0].subjects.map((subject) => subject.subjectCode)
    }


    // const handleProceed = () => {
    //     dispatch(clickDetailsProceed(true))
    // }

    const handleProceed = () => {
        if (!facultyName || !departmentName || !degreeName || !batchName || !semesterName || !subjectName || !subjectCode || !selectedDate) {
            alert("Please fill in all fields before proceeding."); // Alert user
            return; // Exit the function if any field is empty
        }
        // Dispatch the action to save the details in the Redux store
        dispatch(setDetails({
            facultyName,
            departmentName,
            degreeName,
            batchName,
            semesterName,
            subjectName,
            subjectCode,
            selectedDate
        }));
    
        // Optionally dispatch the clickDetailsProceed action if needed
        dispatch(clickDetailsProceed(true));
        
        // Proceed with your logic (e.g., navigate to another page)
    };
    
    

    useEffect(() => {
        // console.log(facultyName)
        // console.log(departmentName)
        // console.log(degreeName)
        // console.log(batchName)
        // console.log(semesterName)
        // console.log(subjectName)
        // console.log(subjectCode)
    }, [facultyName, departmentName, degreeName, batchName, semesterName, subjectName, subjectCode])

    return (
        <div>
            <div className='mx-7 mt-10 flex flex-col'>
                <div>
                    <h3 className='text-xl text-txt-primary'>Enter Details</h3>
                </div>
                <div className='m-10 grid grid-cols-2 gap-5'>
                    <DropDown type="Faculty Name" options={faculties} setValue={setFacultyName} />
                    <DropDown type="Department Name" options={departments} setValue={setDepartmentName} />
                    <DropDown type="Degree Name" options={degrees} setValue={setDegreeName} />
                    <DropDown type="Batch Name" options={batches} setValue={setBatchName} />
                    <DropDown type="Semester Name" options={semesters} setValue={setSemesterName} />
                    <div>
                        <input 
                            type='date' 
                            placeholder='Month' 
                            className='p-4 w-full h-12 border-[1px] border-black rounded-lg focus:border-secondary focus:border-2 active:border-white duration-300'
                            value={selectedDate} 
                            onChange={(e) => setSelectedDate(e.target.value)} // Update state on change
                        />
                    </div>
                    <DropDown type="Subject Name" options={subjects} setValue={setSubjectName} />
                    <DropDown type="Subject Code" options={subjectCodes} setValue={setSubjectCode} />
                </div>
                <div className='mx-10 mt-5 flex justify-end gap-10'>
                    <button className='min-w-36 h-12 hover:bg-secondary text-black hover:text-white text-[16px] border-black hover:border-btn-border border-[1px]'>Cancel</button>
                    <button
                        onClick={handleProceed}
                        className='min-w-36 h-12 bg-secondary text-white border-btn-border text-[16px] border-[1px]'
                    >
                        Proceed
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DetailsForm
