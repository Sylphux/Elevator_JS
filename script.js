const floorHeights = {0: "0px", 1: "120px", 2: "250px", 3: "390px", 4: "510px"};
myConsole = document.getElementById('console')
elevator = document.getElementById('elevator')
let elevatorState = {nextFloors: [], movingDown: undefined, lastFloor: 0, lastCalled: 0}
elevator.style.bottom = '0px'
p = document.getElementById('vars')
const delay = ms => new Promise(res => setTimeout(res, ms));
const pauseTime = 300
const refreshSpeed = 5

function clearConsole(){
    myConsole.innerHTML = "Console cleared. <br>"
}

function resetPos(){
    elevator.style.bottom = "0px"
    gConsole('Position reset.')
}

function tools(deploy){
    if (deploy === true){
        document.getElementById("notools").style.display = "none";
        document.getElementById("toolbox").style.display = "block";
    } else {
        document.getElementById("notools").style.display = "block";
        document.getElementById("toolbox").style.display = "none";
    }
}

function gConsole(s){
    let myString = `${s}`
    let consoleContent = myConsole.innerHTML;
    let newContent = consoleContent + "<br>" + '$ ' + myString
    myConsole.innerHTML = newContent
}

function teleportElevator(floor){
    elevator.style.bottom = floorHeights[floor]
    gConsole(`Elevator teleported to ${floor}`)
}

// converts "13px" to 13
function unPx(s){
    return Number(s.split("px")[0])
}

function test(){
    gConsole('Nothing to test')
}

// actualises the developer tools to see the variables in real time
async function showVars(){
    while (true){
        await delay(50)
        p.innerHTML = `<small>movingDown : ${elevatorState.movingDown}<br>nextFloors : ${elevatorState.nextFloors}<br>lastCalled : ${elevatorState.lastCalled}<br>lastFloor : ${elevatorState.lastFloor}</small>`
    }
}

function incrementHeight(up){
    if (up === true) {
        elevator.style.bottom = String(unPx(elevator.style.bottom) + 1) + "px"
    } else {
        elevator.style.bottom = String(unPx(elevator.style.bottom) - 1) + "px"
    }
}

async function lightDeposit(floor){
    button = document.getElementById("f" + floor)
    button.style.backgroundColor = "#ece7f0";
    await delay(pauseTime)
    button.style.backgroundColor = "var(--nice-grey)";
}

async function moveElevator(){
    if (elevatorState.movingDown != undefined){
        gConsole('Skipping new instance of moveElevator()')
        return
    }
    while (elevatorState.nextFloors.length > 0){
        await delay(refreshSpeed);
        let nextHeight = unPx(floorHeights[elevatorState.nextFloors[0]])
        if (nextHeight > unPx(elevator.style.bottom)){
            elevatorState.movingDown = false
            incrementHeight(true)
        } else if (nextHeight < unPx(elevator.style.bottom)) {
            elevatorState.movingDown = true
            incrementHeight(false)
        } else {
            lightDeposit(elevatorState.nextFloors[0])
            await delay(pauseTime)
            elevatorState.movingDown = undefined
            gConsole(`Arrived at floor ${elevatorState.nextFloors[0]}.`)
            elevatorState.lastFloor = elevatorState.nextFloors[0]
            while (elevatorState.nextFloors[0] === elevatorState.nextFloors[1]){
                elevatorState.nextFloors.shift()
            }
            elevatorState.nextFloors.shift()
        }
    }
    gConsole("No more calls.")
    elevatorState.movingDown = undefined
}

function callElevator(floor){
    gConsole(`Elevator called at floor ${floor}`)
    elevatorState.nextFloors.push(floor)
    gConsole(`Pushed ${floor} to the list.`)
    elevatorState.lastCalled = floor
    elevatorState.nextFloors.sort((x, y) => y - x); //basic sorter
    gConsole(`In queue : ${elevatorState.nextFloors}`)
    moveElevator()
}

showVars()