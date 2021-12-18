import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { EditText } from 'react-edit-text';
import 'react-edit-text/dist/index.css';
import {msToTime,
        msToPx, 
        pxToMs, 
        roundNearestTen, 
        genRandTaskId, 
        getRandColor, 
        getRandTaskName,
        millisecondsToStr,
        getZoomValue} from './Helpers'
import interact from 'interactjs'
import {selectTasks} from '../slices/TaskSlice'
import {selectTotalTime, selectUsedTime, selectAlarmPoints, selectZoomMs, setTotalTime, setUsedTime, setAlarmPoints, setZoomMs} from '../slices/TotalTimeSlice'
import {useSelector} from 'react-redux'
import {useDispatch} from 'react-redux'
import {setTasks, addTask, deleteTask, editTaskName, updateTaskcolor} from '../slices/TaskSlice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faTint, faSearchPlus, faSearchMinus, faPlay, faPause, faRedo, faPlus } from '@fortawesome/free-solid-svg-icons'
import * as workerTimers from 'worker-timers';
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';

function Timeline() {
    let tasks = useSelector(selectTasks)
    const totalTime = useSelector(selectTotalTime)
    const MsZoom = useSelector(selectZoomMs)
    const TimelineCoverWidth = msToPx(totalTime, MsZoom);
    
    const dispatch = useDispatch()
    
    let usedTime = useSelector(selectUsedTime);
    let startTaskTime;
    let alarmPoints = useSelector(selectAlarmPoints);

    const [open, setOpen] = useState(false);
    const [editingPopupTask, setEditingPopupTask] = useState("");
    const [editingPopupId, setEditingPopupId] = useState("");

    useEffect(() => {
        pauseTheTaskTimer()

        if((parseInt(alarmPoints[alarmPoints.length -1]) + 600) >= parseInt(totalTime) / 1000){
            let newtotaltime = (parseInt(alarmPoints[alarmPoints.length -1]) + 600) * 1000
            dispatch(setTotalTime(newtotaltime))
        }

    }, [tasks])

    let taskRef = tasks.slice()
            
    alarmPoints = taskRef.map((task, i) => {
        return Math.floor(parseInt(task.timeNeeded) / 1000)
    });

    alarmPoints.map((point, i, ap) => {
        return Math.floor(parseInt(ap[i] += ap[i-1] ? ap[i-1] : 0));
    });

    const pauseTheTaskTimer = () => {
        document.getElementById('pauseButton').style.visibility = 'hidden';
        document.getElementById('playButton').style.visibility = 'visible';
        if(startTaskTime){
            workerTimers.clearInterval(startTaskTime);

            dispatch(setUsedTime(usedTime))
            dispatch(setAlarmPoints(alarmPoints))
        }
    }

    function updateTasksWidth(){
        let x = document.querySelectorAll(".task");
        for(let i = 0; i < x.length; i++) {
            let theParent = x[i];
            theParent.style.width = theParent.getAttribute('width')+'px';

            console.log('width: ', theParent.getAttribute('width'))

            let taskNameElement = theParent.querySelector('.taskName');
            let taskNameElementWidth = window.getComputedStyle(taskNameElement).getPropertyValue('width');
            let taskNameOverflowElement = theParent.querySelector('.overflowName');

            if(parseInt(taskNameElementWidth) >= parseInt(theParent.offsetWidth)){
                taskNameElement.style.visibility = 'hidden';
                taskNameElement.style.position = "absolute";

                taskNameOverflowElement.style.visibility = 'visible';
            }

            if(parseInt(taskNameElementWidth) < parseInt(theParent.offsetWidth)){
                taskNameElement.style.visibility = 'visible';
                taskNameElement.style.position = "relative";

                taskNameOverflowElement.style.visibility = 'hidden';
            }

        }
    }

    const addTasktoRight = (e) => {
        let addTaskAfter = e.target.getAttribute('data-id') || null;

        let elementPos = tasks.map(function(x) {return x.id; }).indexOf(addTaskAfter) || 0;

        let newTask = {
            id: genRandTaskId(),
            name: getRandTaskName(),
            color: getRandColor(),
            timeNeeded: 900000,
            status: 'inProgress'
        }
        
        pauseTheTaskTimer()
        dispatch(addTask({pos: parseInt(elementPos)+1, newTask}))

        setTimeout(function() {updateTasksWidth()}, 100)

    }

    interact('.task').resizable({
        edges: { top: false, left: false, bottom: false, right: true },
        modifiers: [
			// keep the edges inside the parent
			interact.modifiers.restrictEdges({
				outer: 'parent'
			}),
			interact.modifiers.snap({
				targets: [
				  interact.snappers.grid({ x: 10, y: 10})
				],
				range: Infinity,
				relativePoints: [{ x: 0, y: 0 }]
			})
		],
        onend: function(event){
            event.stopImmediatePropagation();
        },
        listeners: {
            move: function (event) {
                let { x, y } = event.target.dataset
                let taskNameElement = event.target.querySelector('.taskName');
                let taskNameElementWidth = window.getComputedStyle(taskNameElement).getPropertyValue('width');
                let taskNameOverflowElement = event.target.querySelector('.overflowName');

                if(parseInt(taskNameElementWidth) >= parseInt(event.target.offsetWidth)){
                    taskNameElement.style.visibility = 'hidden';
                    taskNameElement.style.position = "absolute";

                    taskNameOverflowElement.style.visibility = 'visible';
                }

                if(parseInt(taskNameElementWidth) < parseInt(event.target.offsetWidth)){
                    taskNameElement.style.visibility = 'visible';
                    taskNameElement.style.position = "relative";

                    taskNameOverflowElement.style.visibility = 'hidden';
                }

                x = (parseFloat(x) || 0) + event.deltaRect.left
                y = (parseFloat(y) || 0) + event.deltaRect.top

                Object.assign(event.target.style, {
                    width: `${roundNearestTen(event.rect.width)}px`,
                    //height: `${event.rect.height}px`,
                    //transform: `translate(${x}px, ${y}px)`
                })

                Object.assign(event.target.dataset, { x, y })

                let updatedTime = pxToMs(event.target.offsetWidth, MsZoom);
                let taskId = event.target.getAttribute('data-id');
                
                //update the state
                pauseTheTaskTimer()
                dispatch(setTasks({taskId, updatedTime}))
            }
        }
    })

    const removeTask = (e) => {
        let taskId = e.target.closest('.task').getAttribute('data-id');

        pauseTheTaskTimer()
        dispatch(deleteTask(taskId))

        setTimeout(function() {updateTasksWidth()}, 100)
    }

    const changeTaskName = (text, taskId) => {
        pauseTheTaskTimer()
        dispatch(editTaskName({taskId, text}))
    }

    const changeTaskColor = (e, taskId) => {
        pauseTheTaskTimer()
        dispatch(updateTaskcolor({taskId, color: e.target.value}))
    }

    //timer management
    const playTimer = () => {
        document.getElementById('playButton').style.visibility = 'hidden';
        document.getElementById('pauseButton').style.visibility = 'visible';
        startTaskTime = workerTimers.setInterval(() => {
            usedTime += 1
            document.getElementById('usedTime').style.width = msToPx(usedTime*1000, MsZoom)+'px';
            document.getElementById('usedTime').setAttribute('data-before', millisecondsToStr(usedTime*1000));

            if(alarmPoints.includes(usedTime)){
                let a = new Audio('https://pomofocus.io/audios/alarms/alarm-kitchen.mp3');
                a.play();
                
                if(document.getElementById('pauseOnComplete').checked){
                    setTimeout(pauseTheTaskTimer(), 200)
                }
            }

        }, 1000);
    }

    const reStartTime = () => {
        pauseTheTaskTimer()
        dispatch(setUsedTime(0))
        document.getElementById('usedTime').style.width = 0;
        document.getElementById('usedTime').setAttribute('data-before', 'CLICK PLAY');
    }

    const zoomInTimeline = () => {
        pauseTheTaskTimer()
        dispatch(setZoomMs(getZoomValue(MsZoom, 'IN')))
        setTimeout(function() {updateTasksWidth()}, 100)
    }

    const zoomOutTimeline = () => {
        pauseTheTaskTimer()
        dispatch(setZoomMs(getZoomValue(MsZoom, 'OUT')))
        setTimeout(function() {updateTasksWidth()}, 100)
    }

    const onOpenModal = (oldName, taskId) => {
        setOpen(true)
        setTimeout(function(){
            setEditingPopupTask(oldName);
            setEditingPopupId(taskId);
        }, 100)
    }

    const onCloseModal = () => {
        setOpen(false)
    }

    const overflowEditTaskName = (e, oldName, taskId) => {
        pauseTheTaskTimer()
        onOpenModal(oldName, taskId)
    }

    return (
        <>
            <TimelineControlsCover>
                <Totaltimedisplay>Total time: {millisecondsToStr(totalTime)}</Totaltimedisplay>
                {/* <ETA>ETA: {new Date().toLocaleString(navigator.language, {hour: '2-digit', minute:'2-digit'}) + ""}</ETA> */}
                <TimelineButtonsCover>
                    <RestartbuttonCover>
                        <RestartButton className="push-button blue" onClick={() => reStartTime()}><FontAwesomeIcon icon={faRedo} /> Restart</RestartButton>
                    </RestartbuttonCover>
                    <PlayPauseButtons>
                        <PauseButton id="pauseButton" className="push-button red" onClick={() => pauseTheTaskTimer()}><FontAwesomeIcon icon={faPause} /> Pause</PauseButton>
                        <PlayButton id="playButton" className="push-button green" onClick={() => playTimer()}><FontAwesomeIcon icon={faPlay} /> Play</PlayButton>
                    </PlayPauseButtons>
                </TimelineButtonsCover>
                <ZoomButtons>
                    <ZoomInButton disabled={MsZoom <= 1000 ? 'disabled' : null} className="push-button green" onClick={() => zoomInTimeline()}><FontAwesomeIcon icon={faSearchPlus} /></ZoomInButton>
                    <ZoomOutButton disabled={MsZoom >= 120000 ? 'disabled' : null} className="push-button green" onClick={() => zoomOutTimeline()}><FontAwesomeIcon icon={faSearchMinus} /></ZoomOutButton>
                </ZoomButtons>
                <label style={{marginTop: '15px', marginRight: '15px'}}>
                <input type="checkbox" id="pauseOnComplete" name="pauseOnComplete"/> Pause On Alarm</label>
            </TimelineControlsCover>
            <TimelineCover id="timelineCover">
                <UsedTimeIndicator id="usedTime" data-before="CLICK PLAY"></UsedTimeIndicator>
                <TimelineTasksCover width={TimelineCoverWidth}>
                    {tasks.length > 0 ?
                        (tasks.map((task, index) => (
                            <Task className="task" key={index} data-id={task.id} width={msToPx(task.timeNeeded, MsZoom)} color={task.color}>
                                <InnerContent>
                                    <OverflowTask className="overflowName"><span onClick={(e) => overflowEditTaskName(e, task.name, task.id)} title={task.name}>...</span></OverflowTask>
                                    <EditText style={{textAlign: 'center', width: 'auto'}} onChange={(text) => changeTaskName(text, task.id)} className="taskName" value={task.name}/>
                                    <p>{millisecondsToStr(task.timeNeeded)}</p>
                                    <ColorInputCover>
                                        <FontAwesomeIcon icon={faTint} />
                                        <input type="color" value={task.color} className="inputColor" onChange={(e) => changeTaskColor(e, task.id)}/>
                                    </ColorInputCover>
                                    <RemoveIcon onClick={removeTask}><FontAwesomeIcon icon={faTimes} /></RemoveIcon>
                                </InnerContent>
                                <AddTask className="addTaskButton" data-id={task.id} onClick={addTasktoRight}>
                                    <span>+</span>
                                </AddTask>
                            </Task>
                        )))
                        :
                        <AddNewTaskButtonCover>
                            <AddTaskButton onClick={(e) => addTasktoRight(e)} className="push-button orange"><FontAwesomeIcon icon={faPlus} /> Add New Task</AddTaskButton>
                        </AddNewTaskButtonCover>
                    }
                </TimelineTasksCover>
            </TimelineCover>
            <Modal open={open} onClose={onCloseModal} center classNames={{overlay: 'customOverlay', modal: 'customModal'}}>
                <h2>Edit Task Name</h2>
                <input className="editTaskNamePopupInput" type="text" id="updateTaskNamePopupInput" name="updateTaskNamePopupInput" value={editingPopupTask} onChange={(e) => {
                  setEditingPopupTask(e.target.value)
                }}/>
                <button style={{marginTop: '10px'}} className="push-button red" onClick={() => {
                    setTimeout(function() {
                        changeTaskName(editingPopupTask, editingPopupId)
                    }, 100)
                    onCloseModal()
                }}>UPDATE</button>
            </Modal>
        </>
    )
}

export default Timeline

const TimelineControlsCover = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
`

const Totaltimedisplay = styled.div`
    padding: 10px 20px;
`

const TimelineCover = styled.div`
    width: 800px;
    // background: #1d2935;
    overflow: visible;
    height: 235px;
    position: relative;
    display:flex;
    overflow: auto;
    flex-direction: column-reverse;
`

const UsedTimeIndicator = styled.div`
    height: 87.5%;
    position: absolute;
    left: 0;
    background: rgba(0,0,0,0.6);
    border-right: 3px solid #e67e22;
    z-index: 3;

    &:before{
        content: attr(data-before);
        position: absolute;
        top: -26px;
        right: -100px;
        height: 26px;
        color: white;
        background: #e67e22;
        min-width: 100px;
        text-align: center;
    }
`

const TimelineTasksCover = styled.div`
    position: relative;
    width: ${props => `${props.width}px`};
    background: #34495e;
    display: flex;
    align-items:center;
`

const Task = styled.div`
    width: ${props => `${props.width}px`};
    background-color:  ${props => `${props.color}`};
    height: 200px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
        div.addTaskButton {
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
`

const AddTask = styled.div`
    position: absolute;
    right: -10px;
    width: 10px;
    background: white;
    color: black;
    z-index: 1;
    display: none;
    height: 100%;
    top: 0;
    cursor: pointer;

    span {
        pointer-events: none;
    }
`

const InnerContent = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    pointer-events: none;

    *{
        pointer-events: auto;
    }

    input.inputColor {
        position: absolute;
        width: 100%;
        height: 100%;
        padding: 0;
        border: none;
        background: none;
        cursor: pointer;
        opacity: 0;
        top: 0;
        left: 0;
    }
`

const ColorInputCover = styled.div`
    position: relative;
    width: 30px;
    height: 30px;
    top: 0;
    left: 0;
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
        pointer-events: none;
    }
`

const RemoveIcon = styled.div`
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;

    svg {
        pointer-events: none;
    }
`

const ETA = styled.div``

const TimelineButtonsCover = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
`
const RestartbuttonCover = styled.div`
    margin-right: 27px;
    width: 60px;
`

const RestartButton = styled.button`
    svg {
        transform: scale(-1, 1);
    }
`

const PlayPauseButtons = styled.div`
    display: flex;
    align-items:center;
    justify-content: center;
    position: relative;
    min-height: 50px;
    min-width: 60px;
    margin-top: 10px;
    margin-bottom: 10px;
    margin-right: 10px;
`

const PlayButton = styled.button`
position: absolute !important;
text-transform: uppercase;
`
const PauseButton = styled(PlayButton)`
`

const AddNewTaskButtonCover = styled.div`
    height: 200px;
    display: flex;
    align-items: center;
`

const AddTaskButton = styled.button`
    margin: 0 10px;
    color: white;
`

const ZoomButtons = styled.div``
const ZoomInButton = styled.button`
    margin-right: 10px;
`
const ZoomOutButton = styled.button``

const OverflowTask = styled.div`
    position: relative;
    height: 30px;
    width: 30px;

    span {
        font-weight: bold;
        background: rgba(255,255,255, 0.2);
        width: 24px;
        height: 24px;
        position: absolute;
        text-align: center;
        border-radius: 50%;
        line-height: 1;
        cursor: pointer;
    }
`