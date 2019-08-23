/**
 * createStore
 */
import Relite from './index'

const attr: string = typeof console !== 'undefined' && 'info' in console ? 'info' : 'log'
const pad: Relite.Pad = num => ('0' + num).slice(-2)
const identity: Relite.Identity = obj => obj

const createLogger: Relite.CreateLogger = ({ name, filter }) => {
    filter = typeof filter === 'function' ? filter : identity
    let logInfo: Relite.LogInfo = data => {
        data = filter(data)
        const {
            actionType,
            actionPayload,
            previousState,
            currentState,
            start = new Date(),
            end = new Date(),
            isAsync
        } = data
        const formattedTime: string = `${ start.getHours() }:${ pad(start.getMinutes()) }:${ pad(start.getSeconds()) }`
        const takeTime: number = end.getTime() - start.getTime()
        const message: string = `${ name || 'ROOT' }: action-type [${ actionType }] @ ${ formattedTime } in ${ takeTime }ms, ${isAsync ? 'async' : 'sync'}`

        try {
            console.groupCollapsed(message)
        } catch (e) {
            try {
                console.group(message)
            } catch (e) {
                console.log(message)
            }
        }

        if (attr === 'log') {
            console[attr](actionPayload)
            console[attr](previousState)
            console[attr](currentState)
        } else {
            console[attr](`%c action-payload`, `color: #03A9F4; font-weight: bold`, actionPayload)
            console[attr](`%c prev-state`, `color: #9E9E9E; font-weight: bold`, previousState)
            console[attr](`%c next-state`, `color: #4CAF50; font-weight: bold`, currentState)
        }

        try {
            console.groupEnd()
        } catch (e) {
            console.log('-- log end --')
        }

    }

    return logInfo
}

export default createLogger