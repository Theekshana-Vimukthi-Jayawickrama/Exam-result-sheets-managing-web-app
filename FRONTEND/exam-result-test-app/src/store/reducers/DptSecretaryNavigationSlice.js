import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    isClickedViewResult:false,
    resultsSheets: [],
    pendingSecSheetId:'',
    isClickedHistory:false,
    isClickedApprovedResultView:false,
    isClickedAllResults:true,
    studentHistoryResultsSheets: [],
}

const dptSecretaryNavigationSlice = createSlice({
    name:"dptSecretaryNavigations",
    initialState,
    reducers:{
        dptClickViewResult:(state,action)=>{
            state.isClickedViewResult = action.payload
        },
        setResultsSheets: (state, action) => {
            state.resultsSheets = action.payload; 
        },
        setPendingSecSheetId: (state, action) => {
            state.pendingSecSheetId = action.payload; 
        },        
        dptClickHistory: (state,action)=>{
            state.isClickedHistory = action.payload
        },
        dptClickApprovedResultView: (state,action)=>{
            state.isClickedApprovedResultView = action.payload
        },
        dptClickAllResult:(state,action)=>{
            state.isClickedAllResults = action.payload
        },
        setStudentHistoryResultsSheets: (state,action) =>{
            state.studentHistoryResultsSheets = action.payload;
        }
    }
})

export const {
    dptClickAllResult,
    dptClickHistory,
    dptClickApprovedResultView,
    dptClickViewResult, setResultsSheets,setPendingSecSheetId,setStudentHistoryResultsSheets} = dptSecretaryNavigationSlice.actions

export default dptSecretaryNavigationSlice.reducer