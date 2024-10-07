import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deanClickApprovedCollectionView, deanClickCollectionView, deanClickViewResult,setStudentCollectionResultsSheets, setPendingCollectionDeanSheetId} from '../store/reducers/DeanNavigationSlice'
import { examDepartmentClickApprovedCollectionView, examDepartmentClickCollectionView,setPendingCollectionExSheetId,setStudentCollectionResultsSheetsEx} from '../store/reducers/ExamDptNavigationSlice'
import {  registarClickApprovedCollectionView, registarClickCollectionView, setStudentCollectionResultsSheetsRT,setPendingCollectionRTSheetId  } from '../store/reducers/RegistarNavigationSlice'
import { vcClickApprovedCollectionView, vcClickCollectionView, setStudentCollectionResultsSheetsVC,setPendingCollectionVCSheetId } from '../store/reducers/VCNavigationSlice'
import { FaFileDownload } from "react-icons/fa";
import axios from 'axios';
import { host } from '../utils/hostingPort';
import { clickCollectionView,setStudentCollectionResultsSheetsSD,setPendingCollectionSDSheetId } from '../store/reducers/PublishedResultNavigationSlice'

function ResultCollection({ userType, resultSheets }) {
    const [resultSheetList, setResultSheetList] = useState(resultSheets)

    const deanNavigation = useSelector((store) => store.deanNavigationSlice)
    const examDptNavigation = useSelector((store) => store.examDptNavigationSlice)
    const registrarNavigation = useSelector((store) => store.registarNavigationSlice)
    const vcNavigation = useSelector((store) => store.vcNavigationSlice)
    const publishedResultNavigation = useSelector((store) => store.publishedResultNavigationSlice)

    const dispatch = useDispatch()

    useEffect(() => {
        // Update the state when resultSheets prop changes
        setResultSheetList(resultSheets)
    }, [resultSheets])

    const handleViewResult = (sheetId) => {

        if (userType === 'dean') {
            dispatch(setStudentCollectionResultsSheets(resultSheets));
            dispatch(setPendingCollectionDeanSheetId(sheetId));
            if (!deanNavigation.isClickedViewResult) {
                dispatch(deanClickViewResult(true))
            }
            if (!deanNavigation.isClickedCollectionView) {
                dispatch(deanClickCollectionView(true))
            }
            if (!deanNavigation.isClickedApprovedCollectionView) {
                dispatch(deanClickApprovedCollectionView(true))
            }
        }
        if (userType === 'examDpt') {
            dispatch(setStudentCollectionResultsSheetsEx(resultSheets));
            dispatch(setPendingCollectionExSheetId(sheetId));
            if (!examDptNavigation.isClickedCollectionView) {
                dispatch(examDepartmentClickCollectionView(true))
            }
            if (!examDptNavigation.isClickedApprovedCollectionView) {
                dispatch(examDepartmentClickApprovedCollectionView(true))
            }
        }

        if(userType === 'registar') {
            dispatch(setStudentCollectionResultsSheetsRT(resultSheets));
            dispatch(setPendingCollectionRTSheetId(sheetId));
            if(!registrarNavigation.isClickedCollectionView) {
                dispatch(registarClickCollectionView(true))
            }
            if(!registrarNavigation.isClickedApprovedCollectionView) {
                dispatch(registarClickApprovedCollectionView(true))
            }
        }

        if (userType === 'vc') {
            dispatch(setStudentCollectionResultsSheetsVC(resultSheets));
            dispatch(setPendingCollectionVCSheetId(sheetId));
            if (!vcNavigation.isClickedCollectionView) {
                dispatch(vcClickCollectionView(true))
            }
            if (!vcNavigation.isClickedApprovedCollectionView) {
                dispatch(vcClickApprovedCollectionView(true))
            }
        }

        if (userType === 'student') {
            dispatch(setStudentCollectionResultsSheetsSD(resultSheets));
            dispatch(setPendingCollectionSDSheetId(sheetId));
            if(!publishedResultNavigation.isClickedCollectionView){
                dispatch(clickCollectionView(true))
            }
        }
        
    }

    const handleSubmit = async (id) => {
        try {
            const response = await axios.get(`${host}/api/results/downloadResultsPdf/${id}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log("Response: ", response.data);
            //window.location.reload();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className='w-11/12'>
        <div className='mt-8'>
            <div className='pb-2 w-full grid grid-cols-12 gap-1 border-black border-b-[1px]'>
                {
                    userType !== 'dean' ?
                        <div className='h-10 col-span-2 flex items-center justify-center'>
                            <p className='text-lg text-black'>Faculty</p>
                        </div> : <></>
                }
                <div className='h-10 col-span-3 flex items-center justify-center'>
                    <p className='text-lg text-black'>Department</p>
                </div>
                <div className='h-10 col-span-4 flex items-center justify-center'>
                    <p className='text-lg text-primary-txt'>Degree</p>
                </div>
                <div className='h-10 col-span-1 flex items-center justify-center'>
                    <p className='text-lg text-black'>Batch</p>
                </div>
                <div className={`h-10 ${userType!=='dean'?"col-spane-1":"col-span-2"} flex items-center justify-center`}>
                    <p className='text-lg text-black'>Semester</p>
                </div>
                <div className={`h-10 ${userType!=='dean'?"col-spane-1":"col-span-2"} flex items-center justify-center`}>
                    <p className='text-lg text-black'>Action</p>
                </div>
            </div>
        </div>
        <div className='mb-10 max-h-80 overflow-y-auto scrollbar-hide'>
            {resultSheetList.map((sheet, index) => (
                <div key={index} className='py-2 w-full grid grid-cols-12 gap-1 gradient-border-bottom border-b-[1px]'>
                    {
                        userType !== 'dean' ?
                            <div className='col-span-3 flex items-center justify-center'>
                                <p className='py-2 text-[16px] text-black'>{sheet.faculty}</p>
                            </div> : <></>
                    }
                    <div className='col-span-3 flex items-center justify-center'>
                        <p className='py-2 text-[16px] text-black'>{sheet.department}</p>
                    </div>
                    <div className={`${userType!==`dean`?"col-span-3":"col-span-4"} flex items-center justify-center`}>
                        <p className='py-2 text-[16px] text-primary-txt'>{sheet.degreeProgram}</p>
                    </div>
                    <div className={`${userType!==`dean`?"col-span-1":"col-span-2"} flex items-center justify-center`}>
                        <p className='py-2 text-[16px] text-black'>{sheet.batch}</p>
                    </div>
                    <div className={`${userType!==`dean`?"col-span-1":"col-span-2"} flex items-center justify-center`}>
                        <p className='text-[16px] text-black'>{sheet.semester}</p>
                    </div>
                    <div className={`py-2 ${userType!==`dean`?"col-span-1":"col-span-2"} flex items-center justify-center gap-3`}>
                        <button
                            onClick={() => handleViewResult(sheet.id)}
                            className='py-1 px-4 flex itmes-center justify-center bg-view-btn-bg text-black text-[14px] rounded-3xl'
                        >
                            View
                        </button>
                        {
                                sheet.vcApprovedStatus ==='APPROVED' && userType === 'examDpt'?
                                    <div className='cursor-pointer'>
                                        <button onClick={() => handleSubmit(sheet.id)}>
                                            <FaFileDownload color='#0052CC' size={25} />
                                        </button>
                                        
                                    </div>
                                    : <></>
                            }
                    </div>
                </div>
            ))}
        </div>
    </div>
    )
}

export default ResultCollection
